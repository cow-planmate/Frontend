import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import PlanInfo from "../components/PlanInfo";
import { useSearchParams } from 'react-router-dom';
import { useApiClient } from "../assets/hooks/useApiClient";

const TravelPlannerApp = () => {
  const { get, post, isAuthenticated } = useApiClient();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (id && isAuthenticated()) {
        try {
          const planData = await get(`/api/plan/${id}`);
          setData(planData);
        } catch (err) {
          console.error("일정 정보를 가져오는데 실패했습니다:", err);
        }
      } else {
        setData(null);
      }
    };

    fetchUserProfile();
  }, [id]);

  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedTab, setSelectedTab] = useState('관광지'); // -
  const [schedule, setSchedule] = useState({
    1: [],
    2: [],
    3: [],
  });
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedFromSchedule, setDraggedFromSchedule] = useState(null);

  // place 받아오기
  const [places, setPlaces] = useState({
    관광지: [],
    숙소: [],
    식당: [],
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (id && isAuthenticated()) {
        try {
          const tour = await post(`/api/plan/${id}/tour`);
          const lodging = await post(`/api/plan/${id}/lodging`);
          const restaurant = await post(`/api/plan/${id}/restaurant`);

          setPlaces({
            관광지: tour.places,
            숙소: lodging.places,
            식당: restaurant.places
          });
        } catch (err) {
          console.error("추천 장소를 가져오는데 실패했습니다:", err);
        }
      }
    };

    fetchUserProfile();
  }, [id]);

  {places ? console.log(places) : null}
  const startTime = 8;
  const endTime = 22;
  const timeSlots = [];
  for (let hour = startTime; hour < endTime; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      timeSlots.push(
        `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`
      );
    }
  }

  // 시간 겹침 체크 함수
  const checkTimeOverlap = (newItem, excludeId = null) => {
    const daySchedule = schedule[selectedDay];
    const newStartIndex = getTimeSlotIndex(newItem.timeSlot);
    const newEndIndex = newStartIndex + newItem.duration - 1;

    return daySchedule.some((item) => {
      if (excludeId && item.placeId === excludeId) return false;

      const existingStartIndex = getTimeSlotIndex(item.timeSlot);
      const existingEndIndex = existingStartIndex + item.duration - 1;

      return !(
        newEndIndex < existingStartIndex || newStartIndex > existingEndIndex
      );
    });
  };

  // 가장 가까운 빈 시간대 찾기
  const findNearestAvailableTime = (preferredTimeSlot, duration) => {
    const preferredIndex = getTimeSlotIndex(preferredTimeSlot);

    // 선호 시간부터 시작해서 아래로 검색
    for (let i = preferredIndex; i <= timeSlots.length - duration; i++) {
      const testItem = { timeSlot: timeSlots[i], duration };
      if (!checkTimeOverlap(testItem)) {
        return timeSlots[i];
      }
    }

    // 위로 검색
    for (let i = preferredIndex - 1; i >= 0; i--) {
      if (i + duration > timeSlots.length) continue;
      const testItem = { timeSlot: timeSlots[i], duration };
      if (!checkTimeOverlap(testItem)) {
        return timeSlots[i];
      }
    }

    return null;
  };

   // 삭제 함수
  const handleDeleteItem = (item) => {
    const newSchedule = { ...schedule };
    newSchedule[selectedDay] = newSchedule[selectedDay].filter(
      (scheduleItem) => scheduleItem.placeId !== item.placeId
    );
    setSchedule(newSchedule);

    // 추천 탭에 다시 추가
    const newPlaces = { ...places };
    const originalItem = { ...item };
    delete originalItem.timeSlot;
    delete originalItem.duration;

    // 원래 카테고리가 있으면 그것을 사용, 없으면 iconUrl로 판단
    let category = originalItem.originalCategory;
    
    if (!category) {
      // iconUrl을 기반으로 카테고리 결정
      const getCategory = (iconUrl) => {
        if (iconUrl.includes('park') || iconUrl.includes('tourist') || iconUrl.includes('museum') || iconUrl.includes('church')) {
          return '관광지';
        } else if (iconUrl.includes('lodging')) {
          return '숙소';
        } else if (iconUrl.includes('restaurant') || iconUrl.includes('food')) {
          return '식당';
        }
        return '관광지'; // 기본값
      };
      category = getCategory(originalItem.iconUrl);
    }

    delete originalItem.originalCategory; // 원래 카테고리 정보 제거
    newPlaces[category].push(originalItem);

    setPlaces(newPlaces);
  };

  const handleDragStart = (e, item, fromSchedule = false) => {
    setDraggedItem(item);
    setDraggedFromSchedule(fromSchedule);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, timeSlot) => {
    e.preventDefault();
    if (!draggedItem) return;

    const newSchedule = { ...schedule };

    if (draggedFromSchedule) {
      // 스케줄 내에서 이동
      const originalItem = newSchedule[selectedDay].find(
        (item) => item.placeId === draggedItem.placeId
      );
      if (!originalItem) return;

      const testItem = { ...originalItem, timeSlot };

      // 겹침 체크 (자기 자신은 제외)
      if (checkTimeOverlap(testItem, draggedItem.placeId)) {
        // 겹치면 가장 가까운 빈 시간대로 이동
        const availableTime = findNearestAvailableTime(
          timeSlot,
          originalItem.duration
        );
        if (availableTime) {
          testItem.timeSlot = availableTime;
        } else {
          // 빈 시간대가 없으면 원래 위치 유지
          setDraggedItem(null);
          setDraggedFromSchedule(null);
          return;
        }
      }

      newSchedule[selectedDay] = newSchedule[selectedDay].filter(
        (item) => item.placeId !== draggedItem.placeId
      );
      newSchedule[selectedDay].push(testItem);
    } else {
      // 추천 탭에서 스케줄로 이동
      const newPlaces = { ...places };
      const category = Object.keys(newPlaces).find((key) =>
        newPlaces[key].some((place) => place.placeId === draggedItem.placeId)
      );

      if (category) {
        const newItem = {
          ...draggedItem,
          timeSlot,
          duration: 4, // 기본 1시간 (15분 * 4)
        };

        // 겹침 체크
        if (checkTimeOverlap(newItem)) {
          // 겹치면 가장 가까운 빈 시간대로 이동
          const availableTime = findNearestAvailableTime(
            timeSlot,
            newItem.duration
          );
          if (availableTime) {
            newItem.timeSlot = availableTime;
          } else {
            // 빈 시간대가 없으면 추가하지 않음
            setDraggedItem(null);
            setDraggedFromSchedule(null);
            return;
          }
        }

        newPlaces[category] = newPlaces[category].filter(
          (place) => place.placeId !== draggedItem.placeId
        );
        setPlaces(newPlaces);
        newSchedule[selectedDay].push(newItem);
      }
    }

    setSchedule(newSchedule);
    setDraggedItem(null);
    setDraggedFromSchedule(null);
  };

  const handleResizeStart = (e, item, direction) => {
    e.stopPropagation();
    e.preventDefault();

    const startY = e.clientY;
    const originalItem = { ...item };
    const originalTimeIndex = getTimeSlotIndex(originalItem.timeSlot);

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const deltaSlots = Math.round(deltaY / 30);

      const newSchedule = { ...schedule };
      const itemIndex = newSchedule[selectedDay].findIndex(
        (scheduleItem) => scheduleItem.placeId === item.placeId
      );

      if (itemIndex !== -1) {
        let testItem = { ...originalItem };

        if (direction === "top") {
          // 위쪽 리사이징: 시작 시간 변경, 길이 조절
          const newStartIndex = Math.max(
            0,
            Math.min(
              originalTimeIndex + deltaSlots,
              originalTimeIndex + originalItem.duration - 1
            )
          );
          const newDuration =
            originalItem.duration - (newStartIndex - originalTimeIndex);

          if (newDuration >= 1 && newStartIndex < timeSlots.length) {
            testItem = {
              ...originalItem,
              timeSlot: timeSlots[newStartIndex],
              duration: newDuration,
            };
          }
        } else {
          // 아래쪽 리사이징: 길이만 변경
          const newDuration = Math.max(1, originalItem.duration + deltaSlots);
          const endIndex = originalTimeIndex + newDuration - 1;

          if (endIndex < timeSlots.length) {
            testItem = {
              ...originalItem,
              duration: newDuration,
            };
          }
        }

        // 겹침 체크 (자기 자신은 제외)
        if (!checkTimeOverlap(testItem, item.placeId)) {
          newSchedule[selectedDay][itemIndex] = testItem;
          setSchedule(newSchedule);
        }
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const getTimeSlotIndex = (timeSlot) => {
    return timeSlots.indexOf(timeSlot);
  };

  const renderScheduleItem = (item) => {
    const startIndex = getTimeSlotIndex(item.timeSlot);
    const height = item.duration * 30; // 15분당 15px

    return (
      <div
        key={item.placeId}
        className="absolute left-16 bg-sub rounded-md z-10 group"
        style={{
          top: `${startIndex * 30}px`,
          height: `${height}px`,
          width: "329px",
        }}
      >
        {/* 위쪽 리사이즈 핸들 */}
        <div
          className="absolute top-0 left-0 right-0 h-3 cursor-ns-resize bg-[#718FFF] opacity-0 group-hover:opacity-70 transition-opacity rounded-t-md flex items-center justify-center"
          onMouseDown={(e) => handleResizeStart(e, item, "top")}
          draggable={false}
        >
          <div className="w-8 h-0.5 bg-main rounded"></div>
        </div>

        {/* 컨텐츠 */}
        <div
          className="p-3 h-full flex items-center justify-between cursor-move"
          style={{ paddingTop: "12px", paddingBottom: "12px" }}
          draggable
          onDragStart={(e) => handleDragStart(e, item, true)}
        >
          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg truncate">{item.name}</div>
          </div>
          <button
            className="ml-2 text-red-500 hover:text-red-700 text-lg font-bold leading-none flex-shrink-0 w-6 h-6 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleDeleteItem(item);
            }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            ×
          </button>
        </div>

        {/* 아래쪽 리사이즈 핸들 */}
        <div
          className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize bg-[#718FFF] opacity-0 group-hover:opacity-70 transition-opacity rounded-b-md flex items-center justify-center"
          onMouseDown={(e) => handleResizeStart(e, item, "bottom")}
          draggable={false}
        >
          <div className="w-8 h-0.5 bg-main rounded"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-pretendard">
      <Navbar isLogin={true} />

      {data ? <PlanInfo info={data.planFrame} id={id} /> : <></>}
      <div className="w-[1400px] mx-auto py-6">
        <div className="flex space-x-6 flex-1">
          {/* 일차 선택 */}
          <div className="flex flex-col space-y-4">
            {[1, 2, 3].map((day) => (
              <button
                key={day}
                className={`px-4 py-4 rounded-lg ${
                  selectedDay === day
                    ? "bg-main text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
                onClick={() => setSelectedDay(day)}
              >
                <div className="text-xl font-semibold">{day}일차</div>
                <div className="text-sm">07.0{3 + day}.</div>
              </button>
            ))}
            
          </div>
          {/* 시간표 */}
          <div className="w-[450px] h-full">
            <div 
              className="border border-gray-300 bg-white rounded-lg px-5 py-7 relative h-[calc(100vh-189px)]" 
              style={{ overflowY: 'auto' }}
            >
              <div className="relative border-t border-gray-200">
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className="flex items-center relative border-b border-gray-200"
                    style={{ height: "30px" }}
                    onDrop={(e) => handleDrop(e, time)}
                    onDragOver={handleDragOver}
                  >
                    <div className="w-10 text-xs text-gray-500 absolute top-[-25%] bg-white">
                      {time}
                    </div>
                    {index + 1 === timeSlots.length ? (
                      <div className="w-10 text-xs text-gray-500 absolute bottom-[-30%] bg-white">
                        {endTime}:00
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="flex-1 h-full"></div>
                  </div>
                ))}

                {/* 스케줄 아이템들 */}
                {schedule[selectedDay].map((item) => renderScheduleItem(item))}
              </div>
            </div>
          </div>
          {/* 장소 추천 탭 */} {/* 삭제 후 CreateSetting.jsx로 이동 예정 */}
          <div className="flex-1">
            <div className="flex space-x-1">
              {["관광지", "숙소", "식당"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-t-lg ${
                    selectedTab === tab
                      ? "bg-main text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="border border-gray-300 rounded-lg rounded-tl-none h-[calc(100vh-229px)] overflow-y-auto">
              {places[selectedTab].map(place => (
                <div
                  key={place.placeId}
                  className="flex items-center p-5 cursor-move border-b border-gray-300 hover:bg-gray-100"
                  draggable
                  onDragStart={(e) => handleDragStart(e, place)}
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-lg mr-4 flex items-center justify-center">
                    <img
                      src={place.iconUrl}
                      alt={place.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-bold text-xl">{place.name}</div>
                    <div className="flex items-center space-x-2">
                      <p>
                        <span className="text-yellow-400">★</span>{" "}
                        {place.rating}
                      </p>
                      <span className="text-gray-500">{place.formatted_address}</span>
                    </div>
                  </div>
                  <button onClick={() => window.open(place.url)} className="px-2 py-1 hover:bg-gray-200 rounded-lg border border-gray-300">
                    구글 맵스
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPlannerApp;
