import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/navbar';
import PlanInfo from '../components/PlanInfo';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

const TravelPlannerApp = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedTab, setSelectedTab] = useState('관광지');
  const [schedule, setSchedule] = useState({
    1: [],
    2: [],
    3: []
  });
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedFromSchedule, setDraggedFromSchedule] = useState(null);
  const [places, setPlaces] = useState({
    관광지: [
      { id: 1, name: '동궁과 월지', type: '유적지', rating: 4.5, location: '경북 경주시 원화로 102', image: '/api/placeholder/60/60' },
      { id: 2, name: '불국사', type: '문화재', rating: 4.7, location: '경북 경주시 불국로 385', image: '/api/placeholder/60/60' },
      { id: 3, name: '석굴암', type: '문화재', rating: 4.6, location: '경북 경주시 석굴로 238', image: '/api/placeholder/60/60' },
      { id: 4, name: '첨성대', type: '유적지', rating: 4.3, location: '경북 경주시 첨성로 169-5', image: '/api/placeholder/60/60' },
      { id: 5, name: '대릉원', type: '유적지', rating: 4.4, location: '경북 경주시 황리단길 20-1', image: '/api/placeholder/60/60' }
    ],
    숙소: [
      { id: 6, name: '경주 힐튼 호텔', type: '호텔', rating: 4.8, location: '경북 경주시 마동 370', image: '/api/placeholder/60/60' },
      { id: 7, name: '경주 펜션 하우스', type: '펜션', rating: 4.2, location: '경북 경주시 양북면 장항리', image: '/api/placeholder/60/60' },
      { id: 8, name: '한옥 게스트하우스', type: '한옥', rating: 4.5, location: '경북 경주시 황남동 123', image: '/api/placeholder/60/60' }
    ],
    식당: [
      { id: 9, name: '경주 쌈밥집', type: '한식', rating: 4.6, location: '경북 경주시 황남동 456', image: '/api/placeholder/60/60' },
      { id: 10, name: '보문 해물탕', type: '해물요리', rating: 4.4, location: '경북 경주시 보문로 789', image: '/api/placeholder/60/60' },
      { id: 11, name: '전통 불고기 맛집', type: '고기요리', rating: 4.7, location: '경북 경주시 중앙로 321', image: '/api/placeholder/60/60' }
    ]
  });

  const startTime = 8;
  const endTime = 22;
  const timeSlots = [];
  for (let hour = startTime; hour < endTime; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }

  // 시간 겹침 체크 함수
  const checkTimeOverlap = (newItem, excludeId = null) => {
    const daySchedule = schedule[selectedDay];
    const newStartIndex = getTimeSlotIndex(newItem.timeSlot);
    const newEndIndex = newStartIndex + newItem.duration - 1;

    return daySchedule.some(item => {
      if (excludeId && item.id === excludeId) return false;
      
      const existingStartIndex = getTimeSlotIndex(item.timeSlot);
      const existingEndIndex = existingStartIndex + item.duration - 1;
      
      return !(newEndIndex < existingStartIndex || newStartIndex > existingEndIndex);
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
    newSchedule[selectedDay] = newSchedule[selectedDay].filter(scheduleItem => scheduleItem.id !== item.id);
    setSchedule(newSchedule);

    // 추천 탭에 다시 추가
    const newPlaces = { ...places };
    const originalItem = { ...item };
    delete originalItem.timeSlot;
    delete originalItem.duration;
    
    if (originalItem.type === '유적지' || originalItem.type === '문화재') {
      newPlaces['관광지'].push(originalItem);
    } else if (originalItem.type === '호텔' || originalItem.type === '펜션' || originalItem.type === '한옥') {
      newPlaces['숙소'].push(originalItem);
    } else {
      newPlaces['식당'].push(originalItem);
    }
    
    setPlaces(newPlaces);
  };

  const handleDragStart = (e, item, fromSchedule = false) => {
    setDraggedItem(item);
    setDraggedFromSchedule(fromSchedule);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, timeSlot) => {
    e.preventDefault();
    if (!draggedItem) return;

    const newSchedule = { ...schedule };
    
    if (draggedFromSchedule) {
      // 스케줄 내에서 이동
      const originalItem = newSchedule[selectedDay].find(item => item.id === draggedItem.id);
      if (!originalItem) return;
      
      const testItem = { ...originalItem, timeSlot };
      
      // 겹침 체크 (자기 자신은 제외)
      if (checkTimeOverlap(testItem, draggedItem.id)) {
        // 겹치면 가장 가까운 빈 시간대로 이동
        const availableTime = findNearestAvailableTime(timeSlot, originalItem.duration);
        if (availableTime) {
          testItem.timeSlot = availableTime;
        } else {
          // 빈 시간대가 없으면 원래 위치 유지
          setDraggedItem(null);
          setDraggedFromSchedule(null);
          return;
        }
      }
      
      newSchedule[selectedDay] = newSchedule[selectedDay].filter(item => item.id !== draggedItem.id);
      newSchedule[selectedDay].push(testItem);
    } else {
      // 추천 탭에서 스케줄로 이동
      const newPlaces = { ...places };
      const category = Object.keys(newPlaces).find(key => 
        newPlaces[key].some(place => place.id === draggedItem.id)
      );
      
      if (category) {
        const newItem = {
          ...draggedItem,
          timeSlot,
          duration: 4 // 기본 1시간 (15분 * 4)
        };
        
        // 겹침 체크
        if (checkTimeOverlap(newItem)) {
          // 겹치면 가장 가까운 빈 시간대로 이동
          const availableTime = findNearestAvailableTime(timeSlot, newItem.duration);
          if (availableTime) {
            newItem.timeSlot = availableTime;
          } else {
            // 빈 시간대가 없으면 추가하지 않음
            setDraggedItem(null);
            setDraggedFromSchedule(null);
            return;
          }
        }
        
        newPlaces[category] = newPlaces[category].filter(place => place.id !== draggedItem.id);
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
      const itemIndex = newSchedule[selectedDay].findIndex(scheduleItem => scheduleItem.id === item.id);
      
      if (itemIndex !== -1) {
        let testItem = { ...originalItem };
        
        if (direction === 'top') {
          // 위쪽 리사이징: 시작 시간 변경, 길이 조절
          const newStartIndex = Math.max(0, Math.min(originalTimeIndex + deltaSlots, originalTimeIndex + originalItem.duration - 1));
          const newDuration = originalItem.duration - (newStartIndex - originalTimeIndex);
          
          if (newDuration >= 1 && newStartIndex < timeSlots.length) {
            testItem = {
              ...originalItem,
              timeSlot: timeSlots[newStartIndex],
              duration: newDuration
            };
          }
        } else {
          // 아래쪽 리사이징: 길이만 변경
          const newDuration = Math.max(1, originalItem.duration + deltaSlots);
          const endIndex = originalTimeIndex + newDuration - 1;
          
          if (endIndex < timeSlots.length) {
            testItem = {
              ...originalItem,
              duration: newDuration
            };
          }
        }
        
        // 겹침 체크 (자기 자신은 제외)
        if (!checkTimeOverlap(testItem, item.id)) {
          newSchedule[selectedDay][itemIndex] = testItem;
          setSchedule(newSchedule);
        }
      }
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getTimeSlotIndex = (timeSlot) => {
    return timeSlots.indexOf(timeSlot);
  };

  const renderScheduleItem = (item) => {
    const startIndex = getTimeSlotIndex(item.timeSlot);
    const height = item.duration * 30; // 15분당 15px
    
    return (
      <div
        key={item.id}
        className="absolute left-16 bg-sub rounded-md z-10 group"
        style={{
          top: `${startIndex * 30}px`,
          height: `${height}px`,
          width: '329px'
        }}
      >
        {/* 위쪽 리사이즈 핸들 */}
        <div
          className="absolute top-0 left-0 right-0 h-3 cursor-ns-resize bg-[#718FFF] opacity-0 group-hover:opacity-70 transition-opacity rounded-t-md flex items-center justify-center"
          onMouseDown={(e) => handleResizeStart(e, item, 'top')}
          draggable={false}
        >
          <div className="w-8 h-0.5 bg-main rounded"></div>
        </div>
        
        {/* 컨텐츠 */}
        <div 
          className="p-3 h-full flex items-center justify-between cursor-move" 
          style={{ paddingTop: '12px', paddingBottom: '12px' }}
          draggable
          onDragStart={(e) => handleDragStart(e, item, true)}
        >
          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg truncate">{item.name}</div>
            <div className="text-xs text-gray-500 truncate">{item.type}</div>
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
          onMouseDown={(e) => handleResizeStart(e, item, 'bottom')}
          draggable={false}
        >
          <div className="w-8 h-0.5 bg-main rounded"></div>
        </div>
      </div>
    );
  };

  const info = {
    "title": "제목없는 여행1",
    "person": {
      "adult": 2,
      "children": 1,
    },
    "departure": "명지대학교 인문캠퍼스 방목학술정보관",
    "travel": "부산",
    "trans": "대중교통"
  }

  return (
    <div className="min-h-screen font-pretendard">
      <Navbar isLogin={true} />

      <div className="w-[1400px] mx-auto py-6">
        <PlanInfo info={info}/>

        <div className="flex space-x-6 flex-1">
          {/* 일차 선택 */}
          <div className="flex flex-col space-y-4">
            {[1, 2, 3].map(day => (
              <button
                key={day}
                className={`px-4 py-4 rounded-lg ${
                  selectedDay === day
                    ? 'bg-main text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
                onClick={() => setSelectedDay(day)}
              >
                <div className="text-xl font-semibold">{day}일차</div>
                <div className="text-sm">07.0{3 + day}.</div>
              </button>
            ))}
            <button className="text-gray-500 text-xl hover:text-gray-700" title="설정"><FontAwesomeIcon icon={faGear}/></button>
          </div>

          {/* 시간표 */}
          <div className="w-[450px] h-full">
            <div 
              className="border border-gray-300 bg-white rounded-lg px-5 py-7 relative h-[calc(100vh-203px)]" 
              style={{ overflowY: 'auto' }}
            >
              <div className="relative border-t border-gray-200">
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className="flex items-center relative border-b border-gray-200"
                    style={{ height: '30px' }}
                    onDrop={(e) => handleDrop(e, time)}
                    onDragOver={handleDragOver}
                  >
                    <div className="w-10 text-xs text-gray-500 absolute top-[-25%] bg-white">{time}</div>
                    {index + 1 === timeSlots.length ? 
                      <div className="w-10 text-xs text-gray-500 absolute bottom-[-30%] bg-white">{endTime}:00</div>
                    :<></>}
                    <div className="flex-1 h-full"></div>
                  </div>
                ))}
                
                {/* 스케줄 아이템들 */}
                {schedule[selectedDay].map(item => renderScheduleItem(item))}
              </div>
            </div>
          </div>

          {/* 장소 추천 탭 */}
          <div className="flex-1">
            <div className="flex space-x-1">
              {['관광지', '숙소', '식당'].map(tab => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-t-lg ${
                    selectedTab === tab
                      ? 'bg-main text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="border border-gray-300 rounded-lg rounded-tl-none h-[calc(100vh-243px)] overflow-y-auto">
              {places[selectedTab].map(place => (
                <div
                  key={place.id}
                  className="flex items-center p-5 cursor-move border-b border-gray-300 hover:bg-gray-100"
                  draggable
                  onDragStart={(e) => handleDragStart(e, place)}
                >
                  <div className="w-12 h-12 bg-gray-300 rounded-lg mr-4 flex items-center justify-center">
                    <img src={place.image} alt={place.name} className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-bold text-xl">{place.name}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-main">{place.type}</span>
                      <p><span className="text-yellow-400">★</span> {place.rating}</p>
                      <span className="text-gray-500">{place.location}</span>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    자세히 보기
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