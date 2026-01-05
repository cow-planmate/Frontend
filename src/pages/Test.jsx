import React, { useState, useRef, useEffect } from 'react';
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDndMonitor,
} from '@dnd-kit/core';
import { Resizable } from 'react-resizable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApiClient } from "../hooks/useApiClient";
import { initStompClient } from "../websocket/client";
import { formatTime, checkOverlap, findEmptySlot } from "../utils/createUtils";

import usePlanStore from "../store/Plan";
import useTimetableStore from "../store/Timetables";
import useUserStore from "../store/UserDayIndexes";
import usePlacesStore from "../store/Places";

import Loading from "../components/common/Loading";
import Navbar from "../components/common/Navbar";
import PlanInfo from "../components/Create2/PlanInfo/PlanInfo";
import DaySelector from "../components/Create2/DaySelector/DaySelector";
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LoadingRing from "../assets/imgs/ring-resize.svg?react";
import MapIcon from "../assets/imgs/googlemaps.svg?react"

// --- [스타일] 리사이즈 핸들 CSS ---
// 핸들 크기를 키우고, 터치/클릭이 잘 먹히도록 설정
export const resizeStyles = `
  .react-resizable-handle {
    position: absolute;
    left: 0;
    right: 0;
    height: 14px; /* 클릭 영역 확보 */
    z-index: 50;
    cursor: row-resize;
    display: flex;
    justify-content: center;
    touch-action: none; /* 브라우저 기본 터치 액션 방지 */
  }
  .react-resizable-handle::after {
    content: "";
    width: 24px;
    height: 4px;
    background-color: rgba(0,0,0,0.15);
    border-radius: 2px;
    transition: background-color 0.2s;
  }
  .react-resizable-handle:hover::after {
    background-color: #3b82f6;
  }
  /* 위/아래 위치 잡기 */
  .react-resizable-handle-s { bottom: 0; align-items: flex-end; padding-bottom: 3px; }
  .react-resizable-handle-n { top: 0; align-items: flex-start; padding-top: 3px; }
`;

// --- [컴포넌트 1] ResizeHandle (문제 해결의 핵심) ---
const ResizeHandle = React.forwardRef((props, ref) => {
  const { handleAxis, ...restProps } = props;
  return (
    <div
      ref={ref}
      className={`react-resizable-handle react-resizable-handle-${handleAxis}`}
      {...restProps}
      // [중요] 모든 마우스/터치 이벤트의 전파를 막아 dnd-kit이 감지하지 못하게 함
      onPointerDown={(e) => { e.stopPropagation(); restProps.onPointerDown && restProps.onPointerDown(e); }}
      onMouseDown={(e) => { e.stopPropagation(); restProps.onMouseDown && restProps.onMouseDown(e); }}
      onTouchStart={(e) => { e.stopPropagation(); restProps.onTouchStart && restProps.onTouchStart(e); }}
      onClick={(e) => e.stopPropagation()}
    />
  );
});

// --- [컴포넌트 2] SidebarItem ---
export const SidebarItem = ({ place, duration, isMobile, onMobileAdd }) => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${place.placeId}`,
    data: { type: 'sidebar', place, duration, originalId: place.placeId },
    disabled: isMobile,
  });

  const imageUrl = place.placeId ? `${BASE_URL}/image/place/${encodeURIComponent(place.placeId)}` : place.iconUrl;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-5 bg-white hover:shadow-md flex items-center cursor-grab active:cursor-grabbing select-none
        ${isDragging ? 'opacity-40 ring-2 ring-blue-400' : ''}`}
    >
      <div className="w-12 h-12 bg-gray-300 rounded-lg mr-4 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={place.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = place.iconUrl;
          }}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex-1 space-y-1 min-w-0">
        <p className="font-bold text-xl">{place.name}</p>
        <div className="flex items-center space-x-2 whitespace-nowrap">
          <p>
            <span className="text-yellow-400">★</span> {place.rating}
          </p>
          <span className="text-gray-500 truncate block">{place.formatted_address}</span>
        </div>
      </div>
      <div className='space-x-2 flex'>
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(place.url);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-lg border border-gray-300"
        >
          <MapIcon className="h-6 block"/>
        </button>
        {isMobile && (
          <button
            onClick={(e) => { e.stopPropagation(); onMobileAdd(); }}
            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold"
          >
            추가
          </button>
        )}
      </div>
    </div>
  );
};

// --- [컴포넌트 3] ResizableScheduledItem (버그 수정됨) ---
export const ResizableScheduledItem = ({ item, onResizeEnd }) => {
  const { SLOT_HEIGHT, TOTAL_SLOTS } = useTimetableStore();
  const [isResizing, setIsResizing] = useState(false);
  const place = item?.place;
  
  const { attributes, listeners, setNodeRef, isDragging, transform } = useDraggable({
    id: item.id,
    data: { type: 'schedule', ...item },
    disabled: isResizing, // 리사이징 중 드래그 차단
  });

  const [localState, setLocalState] = useState({
    height: item.duration * SLOT_HEIGHT,
    top: 20 + item.start * SLOT_HEIGHT,
  });

  // 데이터 변경 시 동기화 (리사이징 중 아닐 때만)
  useEffect(() => {
    if (!isResizing) {
      setLocalState({
        height: item.duration * SLOT_HEIGHT,
        top: 20 + item.start * SLOT_HEIGHT,
      });
    }
  }, [item.duration, item.start, isResizing]);

  const onResizeStart = (e) => {
    setIsResizing(true);
  };

  const onResize = (e, { size, handle }) => {
    if (handle === 'n') {
      // 위로 늘릴 때: 늘어난 높이만큼 top을 위로 이동
      const heightDelta = size.height - localState.height;
      setLocalState({
        height: size.height,
        top: localState.top - heightDelta,
      });
    } else {
      // 아래로 늘릴 때: 높이만 변경
      setLocalState(prev => ({ ...prev, height: size.height }));
    }
  };

  const onResizeStop = (e, { size, handle }) => {
    setIsResizing(false); // 리사이징 종료

    const slotsChanged = Math.round((size.height - item.duration * SLOT_HEIGHT) / SLOT_HEIGHT);
    
    // 변화 없으면 복구
    if (slotsChanged === 0) {
      setLocalState({
        height: item.duration * SLOT_HEIGHT,
        top: item.start * SLOT_HEIGHT,
      });
      return;
    }

    let newStart = item.start;
    let newDuration = item.duration;

    if (handle === 's') {
      newDuration = item.duration + slotsChanged;
    } else if (handle === 'n') {
      // 위쪽 핸들: 높이가 커진 만큼 시작 시간은 빨라짐
      const finalDuration = Math.round(size.height / SLOT_HEIGHT);
      const durationDiff = finalDuration - item.duration;
      newStart = item.start - durationDiff;
      newDuration = finalDuration;
    }

    onResizeEnd(item.id, newStart, newDuration);
  };

  const dragStyle = transform && !isResizing ? {
    transform: CSS.Translate.toString(transform),
    zIndex: 999,
    opacity: 0.8,
  } : {
    zIndex: 10,
  };

  const tripCategory = { 0: "관광지", 1: "숙소", 2: "식당", 4: "검색" };

  return (
    <div
      ref={setNodeRef}
      style={{
        top: localState.top,
        height: localState.height,
        position: 'absolute',
        left: '4rem',
        right: '8px',
        ...dragStyle,
      }}
      className="absolute touch-none"
      {...attributes}
    >
      <Resizable
        height={localState.height}
        width={200}
        axis="y"
        resizeHandles={['s', 'n']}
        onResizeStart={onResizeStart}
        onResize={onResize}
        onResizeStop={onResizeStop}
        minConstraints={[100, SLOT_HEIGHT]}
        maxConstraints={[100, SLOT_HEIGHT * TOTAL_SLOTS]}
        handle={(h, ref) => <ResizeHandle ref={ref} handleAxis={h} />}
      >
        <div
          {...listeners} // 드래그 리스너는 내용물에만!
          className={`w-full h-full bg-blue-50 border-l-4 border-blue-500 rounded shadow-sm overflow-hidden select-none hover:bg-blue-100 transition-colors cursor-move
            ${isDragging ? 'shadow-xl ring-2 ring-blue-300' : ''}
            ${localState.height <= 80 ? 'flex flex-col items-start justify-center px-5' : "p-5"}`}
        >
          <div className="font-bold text-lg text-blue-900 truncate pointer-events-none">{place.name}</div>
          <div className="text-xs text-blue-600 font-medium pointer-events-none">
            <p>{tripCategory[place.categoryId]} | {formatTime(item.start)} - {formatTime(item.start + Math.round(localState.height / SLOT_HEIGHT))}</p>
          </div>
        </div>
      </Resizable>
    </div>
  );
};

// --- [Main Board] ---
function PlannerBoard() {
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('timetable');
  const [preview, setPreview] = useState(null); 
  const [activeId, setActiveId] = useState(null);
  const gridRef = useRef(null);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { get } = useApiClient();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const { TOTAL_SLOTS, SLOT_HEIGHT } = useTimetableStore();
  const { search, setAddSearch, setAddNext } = usePlacesStore();
  const store = usePlacesStore();

  const buttonColor = { 
    tour: "lime-700", 
    lodging: "orange-700", 
    restaurant: "blue-700", 
    search: "gray-700" 
  };

  const koreanName = {
    tour: "관광지",
    lodging: "숙소", 
    restaurant: "식당", 
    search: "검색" 
  }

  const [selectedTab, setSelectedTab] = useState("tour");
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- DnD Monitor ---
  useDndMonitor({
    onDragStart(event) {
      setActiveId(event.active.id);
    },
    onDragMove(event) {
      const { active, over } = event;
      // [수정] 오버레이가 필요 없는 경우 (리사이징 중) 에는 계산하지 않음
      // ResizeHandle에서 stopPropagation을 했으므로 여기는 드래그일 때만 들어옴
      if (over && over.id === 'timetable-area' && gridRef.current) {
        const gridRect = gridRef.current.getBoundingClientRect();
        const currentY = active.rect.current?.translated 
          ? active.rect.current.translated.top 
          : event.activatorEvent.clientY; 

        const relativeY = currentY - gridRect.top + gridRef.current.scrollTop;
        let targetSlot = Math.round(relativeY / SLOT_HEIGHT);
        
        const duration = active.data.current.duration || 4;

        if (targetSlot < 0) targetSlot = 0;
        if (targetSlot + duration > TOTAL_SLOTS) targetSlot = TOTAL_SLOTS - duration;

        const isOverlap = checkOverlap(targetSlot, duration, items, active.data.current.type === 'schedule' ? active.id : null);

        setPreview({
          y: targetSlot * SLOT_HEIGHT,
          height: duration * SLOT_HEIGHT,
          isValid: !isOverlap,
          timeText: formatTime(targetSlot)
        });
      } else {
        setPreview(null);
      }
    },
    onDragEnd(event) {
      setPreview(null); // 오버레이 즉시 제거
      setActiveId(null);
      
      const { active, over } = event;
      if (!over || over.id !== 'timetable-area') return;

      const gridRect = gridRef.current.getBoundingClientRect();
      const currentY = active.rect.current?.translated?.top ?? event.activatorEvent.clientY;
      const relativeY = currentY - gridRect.top + gridRef.current.scrollTop;
      let newStart = Math.round(relativeY / SLOT_HEIGHT);

      const type = active.data.current.type;
      const duration = active.data.current.duration || 4;

      if (newStart < 0) newStart = 0;
      if (newStart + duration > TOTAL_SLOTS) newStart = TOTAL_SLOTS - duration;

      const itemId = type === 'schedule' ? active.id : null;
      if (checkOverlap(newStart, duration, items, itemId)) return; 

      if (type === 'sidebar') {
        setItems(prev => [...prev, {
          id: `item-${Date.now()}`,
          place: active.data.current.place,
          start: newStart,
          duration: duration,
        }]);
      } else if (type === 'schedule') {
        setItems(prev => prev.map(item => 
          item.id === active.id ? { ...item, start: newStart } : item
        ));
      }
    }
  });

  const handleResizeEnd = (id, newStart, newDuration) => {
    setItems(prev => {
      const target = prev.find(i => i.id === id);
      if (!target) return prev;
      
      let safeStart = newStart;
      let safeDuration = newDuration;

      if (safeDuration < 1) safeDuration = 1;
      if (safeStart < 0) { 
         safeDuration += safeStart; 
         safeStart = 0;
      }
      if (safeStart + safeDuration > TOTAL_SLOTS) {
        safeDuration = TOTAL_SLOTS - safeStart;
      }

      if (checkOverlap(safeStart, safeDuration, prev, id)) {
        return [...prev]; // 충돌 시 원복
      }

      return prev.map(i => i.id === id ? { ...i, start: safeStart, duration: safeDuration } : i);
    });
  };

  const handleMobileAdd = (place) => {
    const emptySlot = findEmptySlot(4, items);
    if (emptySlot === -1) {
      alert('빈 시간이 없습니다!');
      return;
    }
    setItems(prev => [...prev, {
      id: `item-${Date.now()}`,
      place: place,
      start: emptySlot,
      duration: 4
    }]);
    setActiveTab('timetable');
  };

  const currentPlaces =
    selectedTab === "weather"
      ? []
      : store[selectedTab] ?? [];

  const doSearch = async () => {
    const q = searchText.trim();
    if (!q || !id) return;
    try {
      setSearchLoading(true);
      const res = await get(`${BASE_URL}/api/plan/${id}/place/${encodeURIComponent(q)}`);
      const newSearchList = Array.isArray(res?.places) ? res.places : [];
      const nextPageTokens = res.nextPageTokens;
      console.log(nextPageTokens);
      setAddSearch({
        search: newSearchList,
        searchNext: nextPageTokens,
      })
    } catch (err) {
      console.error("검색 실패:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleNext = async () => {
    const currentTab = selectedTab;
    const nextPageTokens = store[`${currentTab}Next`];

    try {
      setNextLoading(true);
      const res = await get(`${BASE_URL}/api/plan/nextplace/${nextPageTokens}`)
      setAddNext(currentTab, res.places, res.nextPageTokens);
    } catch (err) {
      console.error("실패!", err);
    } finally {
      setNextLoading(false);
    }
  }

  const { setNodeRef: setDroppableNode } = useDroppable({ id: 'timetable-area' });
  const showTimetable = !isMobile || activeTab === 'timetable';
  const showSidebar = !isMobile || activeTab === 'recommend';

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden select-none">
      <style>{resizeStyles}</style>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden relative md:space-x-6">
        {/* Timetable */}
        <div className={`flex-1 md:w-[36%] md:flex-initial flex flex-col border border-gray-300 rounded-lg transition-all duration-300 ${showTimetable ? 'opacity-100 z-10' : 'opacity-0 absolute inset-0 -z-10'}`}>
          <div className="h-full flex flex-col overflow-hidden relative py-4 px-5 scroll-smooth overflow-y-auto overflow-x-hidden">
            
            <div 
              ref={(node) => { gridRef.current = node; setDroppableNode(node); }}
              className="flex-1 relative"
            >
              {/* Grid Lines */}
              {Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
                return (
                  <div key={i} className="flex items-center box-border" style={{ height: SLOT_HEIGHT }}>
                    <div className={`w-12 text-center pr-3 text-xs text-gray-500`}>
                      {formatTime(i)}
                    </div>
                    <div className={`flex-1 h-px bg-gray-200`}></div>
                  </div>
                );
              })}
              <div className="h-10">
                <div className="flex items-center box-border" style={{ height: SLOT_HEIGHT }}>
                  <div className={`w-12 text-center pr-3 text-xs text-gray-500`}>
                    {formatTime(TOTAL_SLOTS)}
                  </div>
                  <div className={`flex-1 h-px bg-gray-200`}></div>
                </div>
              </div>

              {/* Ghost Block (Preview) */}
              {preview && (
                <div 
                  className={`absolute left-16 right-2 rounded-lg border-2 border-dashed z-20 pointer-events-none transition-all duration-75 flex items-center justify-center
                    ${preview.isValid ? 'bg-blue-50 border-blue-400 text-blue-500' : 'bg-red-50 border-red-400 text-red-500'}`}
                  style={{ top: 20 + preview.y, height: preview.height - 4 }}
                >
                  <span className="font-bold text-sm bg-white/80 px-2 py-1 rounded shadow-sm">
                    {preview.isValid ? `${preview.timeText} 배치` : '공간 부족'}
                  </span>
                </div>
              )}

              {/* Items */}
              {items.map(item => (
                <ResizableScheduledItem key={item.id} item={item} onResizeEnd={handleResizeEnd} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className={`flex-1 w-full overflow-y-auto transition-transform duration-300 absolute inset-0 md:relative md:transform-none z-20 
          ${showSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
          <div className="flex space-x-1 overflow-x-auto">
            {["tour", "lodging", "restaurant", "search"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-t-lg text-nowrap ${
                  selectedTab === tab
                    ? `bg-${buttonColor[tab]} text-white`
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {koreanName[tab]}
              </button>
            ))}
          </div>
          <div className="md:h-[calc(100vh-228px)] border border-gray-300 rounded-lg rounded-tl-none divide-y divide-gray-300">
            {selectedTab === "search" && (
              <div className="px-3 py-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="장소를 입력하세요"
                    className="flex-1 border rounded-md px-3 py-2"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") doSearch();
                    }}
                  />
                  <button
                    className="px-4 py-2 rounded-md bg-main text-white font-semibold disabled:opacity-60 hover:bg-mainDark"
                    onClick={doSearch}
                    disabled={searchLoading}
                  >
                    {searchLoading ? "검색 중..." : "검색"}
                  </button>
                </div>
              </div>
            )}
            <div className={`overflow-y-auto divide-y divide-gray-300 ${selectedTab === "search" ? "h-[calc(100vh-288px)]" : "h-full"}`}>
              {selectedTab === "weather" ? (
                <>안녕하세요</>
              ) : (
                <>
                  {currentPlaces?.map((place) => (
                    <SidebarItem
                      key={place.placeId}
                      place={place}
                      isMobile={isMobile} 
                      onMobileAdd={() => handleMobileAdd(place)}
                    />
                  ))}
                  {(selectedTab !== "search" || search.length !== 0) && (
                    <div className="text-center py-3">
                      <button 
                        className="text-3xl text-main hover:text-mainDark"
                        onClick={handleNext}
                      >
                        {nextLoading ? <LoadingRing className="w-[30px]"/>
                        : <FontAwesomeIcon icon={faCirclePlus} />}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab */}
      {isMobile && (
        <nav className="mt-4 bg-white border-t h-16 flex shadow-lg">
          <button onClick={() => setActiveTab('timetable')} className={`flex-1 flex flex-col items-center justify-center ${activeTab === 'timetable' ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="text-xl">📅</span><span className="text-xs font-medium">시간표</span>
          </button>
          <button onClick={() => setActiveTab('recommend')} className={`flex-1 flex flex-col items-center justify-center ${activeTab === 'recommend' ? 'text-blue-600' : 'text-gray-400'}`}>
            <span className="text-xl">📍</span><span className="text-xs font-medium">추천 장소</span>
          </button>
        </nav>
      )}

      {/* Drag Overlay (잔상) */}
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <div className="p-3 bg-blue-600 text-white rounded-lg shadow-2xl w-48 opacity-90 scale-105 cursor-grabbing font-bold flex items-center justify-center">
             이동 중...
          </div>
        ) : null}
      </DragOverlay>
    </div>
  );
}

// --- [Provider] ---
export default function TravelPlanner() {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const navigate = useNavigate();
  const { get, post, isAuthenticated } = useApiClient();

  const { planId, setPlanAll } = usePlanStore();
  const { setTimetableAll, setSelectedDay } = useTimetableStore();
  const { setUserAll } = useUserStore();
  const { setPlacesAll } = usePlacesStore();
  const [noACL, setNoACL] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  // 초기 데이터 로딩
  useEffect(() => {
    const fetchPlanData = async () => {
      if (id && isAuthenticated()) {
        try {
          const [planData, tour, lodging, restaurant] = await Promise.all([
            get(`${BASE_URL}/api/plan/${id}`),
            get(`${BASE_URL}/api/plan/${id}/tour`),
            get(`${BASE_URL}/api/plan/${id}/lodging`),
            get(`${BASE_URL}/api/plan/${id}/restaurant`),
          ]);

          console.log(planData)
          
          setPlanAll(planData.planFrame);
          setTimetableAll(planData.timetables.slice().sort((a, b) => new Date(a.date) - new Date(b.date)));
          setUserAll(planData.userDayIndexes);
          setPlacesAll({
            tour: tour.places,
            tourNext: tour.nextPageTokens,
            lodging: lodging.places,
            lodgingNext: lodging.nextPageTokens,
            restaurant: restaurant.places,
            restaurantNext: restaurant.nextPageTokens
          });
          setSelectedDay(0);

        } catch(err) {
          const errorMessage = err.response?.data?.message || err.message;
          console.error("일정 정보를 가져오는데 실패했습니다:", err);

          if (errorMessage.includes("요청 권한이 없습니다")) {
            setNoACL(true);
          }
        }
      } else { // 비로그인 걸러내기
        try {
          const [tour, lodging, restaurant] = await Promise.all([
            post(`${BASE_URL}/api/plan/tour`, {}),
            post(`${BASE_URL}/api/plan/lodging`),
            post(`${BASE_URL}/api/plan/restaurant`),
          ]);
        } catch {
          console.log("dd")
        }
      }
    }
    fetchPlanData();
  }, []);

  useEffect(() => {
    if (id && isAuthenticated()) {
      initStompClient(id);
    }
  }, []);

  if (!planId) {
    return (
      <div className="font-pretendard h-screen">
        <Navbar />
        <Loading />
      </div>
    )
  }

  return (
    <div className="font-pretendard h-screen">
      {/* <Navbar /> */}
      <div className="h-[74px] bg-slate-400"></div>
      <PlanInfo id={id} />
        <div
          className="
            min-[1464px]:w-[1400px] min-[1464px]:px-0
            md:px-8 md:py-6 px-6 py-3
            mx-auto
            h-[calc(100vh-140px)]
          "
        >
          <div className="flex md:flex-row flex-col md:space-x-6 space-y-4 md:space-y-0 h-full">
            <DaySelector />
            <DndContext sensors={sensors} autoScroll={{ layoutShiftCompensation: false }}>
              <PlannerBoard />
            </DndContext>
          </div>
        </div>
    </div>
  );
}