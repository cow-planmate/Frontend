import React, { useState, useRef, useEffect } from 'react';

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
  const [resizing, setResizing] = useState(null);
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

  const timeSlots = [];
  for (let hour = 8; hour < 22; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }

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
      newSchedule[selectedDay] = newSchedule[selectedDay].filter(item => item.id !== draggedItem.id);
      const newItem = {
        ...draggedItem,
        timeSlot
      };
      newSchedule[selectedDay].push(newItem);
    } else {
      // 추천 탭에서 스케줄로 이동
      const newPlaces = { ...places };
      const category = Object.keys(newPlaces).find(key => 
        newPlaces[key].some(place => place.id === draggedItem.id)
      );
      if (category) {
        newPlaces[category] = newPlaces[category].filter(place => place.id !== draggedItem.id);
        setPlaces(newPlaces);
      }
      
      const newItem = {
        ...draggedItem,
        timeSlot,
        duration: 4 // 기본 1시간 (15분 * 4)
      };
      newSchedule[selectedDay].push(newItem);
    }

    setSchedule(newSchedule);
    setDraggedItem(null);
    setDraggedFromSchedule(null);
  };

  const handleDropOutside = (e) => {
    e.preventDefault();
    if (!draggedItem || !draggedFromSchedule) return;

    // 스케줄에서 제거하고 추천 탭으로 복귀
    const newSchedule = { ...schedule };
    newSchedule[selectedDay] = newSchedule[selectedDay].filter(item => item.id !== draggedItem.id);
    setSchedule(newSchedule);

    // 추천 탭에 다시 추가
    const newPlaces = { ...places };
    const originalItem = { ...draggedItem };
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
      const deltaSlots = Math.round(deltaY / 15);
      
      const newSchedule = { ...schedule };
      const itemIndex = newSchedule[selectedDay].findIndex(scheduleItem => scheduleItem.id === item.id);
      
      if (itemIndex !== -1) {
        if (direction === 'top') {
          // 위쪽 리사이징: 시작 시간 변경, 길이 조절
          const newStartIndex = Math.max(0, Math.min(originalTimeIndex + deltaSlots, originalTimeIndex + originalItem.duration - 1));
          const newDuration = originalItem.duration - (newStartIndex - originalTimeIndex);
          
          if (newDuration >= 1 && newStartIndex < timeSlots.length) {
            newSchedule[selectedDay][itemIndex] = {
              ...originalItem,
              timeSlot: timeSlots[newStartIndex],
              duration: newDuration
            };
            setSchedule(newSchedule);
          }
        } else {
          // 아래쪽 리사이징: 길이만 변경
          const newDuration = Math.max(1, originalItem.duration + deltaSlots);
          const endIndex = originalTimeIndex + newDuration - 1;
          
          if (endIndex < timeSlots.length) {
            newSchedule[selectedDay][itemIndex] = {
              ...originalItem,
              duration: newDuration
            };
            setSchedule(newSchedule);
          }
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
    const height = item.duration * 15; // 15분당 15px
    
    return (
      <div
        key={item.id}
        className="absolute left-16 bg-blue-100 border border-blue-300 rounded-md z-10 group"
        style={{
          top: `${startIndex * 15}px`,
          height: `${height}px`,
          width: '200px'
        }}
      >
        {/* 위쪽 리사이즈 핸들 */}
        <div
          className="absolute top-0 left-0 right-0 h-3 cursor-ns-resize bg-blue-400 opacity-0 group-hover:opacity-70 transition-opacity rounded-t-md flex items-center justify-center"
          onMouseDown={(e) => handleResizeStart(e, item, 'top')}
          draggable={false}
        >
          <div className="w-8 h-0.5 bg-blue-600 rounded"></div>
        </div>
        
        {/* 컨텐츠 */}
        <div 
          className="p-2 h-full flex items-center justify-between cursor-move" 
          style={{ paddingTop: '12px', paddingBottom: '12px' }}
          draggable
          onDragStart={(e) => handleDragStart(e, item, true)}
        >
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{item.name}</div>
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
          className="absolute bottom-0 left-0 right-0 h-3 cursor-ns-resize bg-blue-400 opacity-0 group-hover:opacity-70 transition-opacity rounded-b-md flex items-center justify-center"
          onMouseDown={(e) => handleResizeStart(e, item, 'bottom')}
          draggable={false}
        >
          <div className="w-8 h-0.5 bg-blue-600 rounded"></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600">planMate</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                
                <input
                  type="text"
                  placeholder="닉네임 님"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm text-gray-600">제목없는 여행1</span>
            <span className="text-sm text-gray-600">인원 수 2명</span>
            <span className="text-sm text-gray-600">여행지 부산</span>
            <span className="text-sm text-gray-600">출발지 명지대학교 인문캠퍼스</span>
            <span className="text-sm text-gray-600">이동수단 대중교통</span>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-gray-200 rounded-lg">지도로 보기</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg">저장</button>
            <button className="px-4 py-2 bg-gray-200 rounded-lg">완료</button>
          </div>
        </div>

        <div className="flex space-x-6">
          {/* 일차 선택 */}
          <div className="flex flex-col space-y-2">
            {[1, 2, 3].map(day => (
              <button
                key={day}
                className={`px-4 py-6 rounded-lg text-center ${
                  selectedDay === day
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
                onClick={() => setSelectedDay(day)}
              >
                <div className="text-lg font-medium">{day}일차</div>
                <div className="text-sm">07.0{3 + day}.</div>
              </button>
            ))}
          </div>

          {/* 시간표 */}
          <div className="flex-1">
            <div className="bg-white rounded-lg p-4 relative" style={{ height: '600px', overflowY: 'auto' }}>
              <div className="relative">
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className="flex items-center border-b border-gray-100 relative"
                    style={{ height: '15px' }}
                    onDrop={(e) => handleDrop(e, time)}
                    onDragOver={handleDragOver}
                  >
                    <div className="w-12 text-xs text-gray-500 pr-2">{time}</div>
                    <div className="flex-1 h-full"></div>
                  </div>
                ))}
                
                {/* 스케줄 아이템들 */}
                {schedule[selectedDay].map(item => renderScheduleItem(item))}
              </div>
            </div>
          </div>

          {/* 장소 추천 탭 */}
          <div className="w-80">
            <div className="bg-white rounded-lg p-4">
              <div className="flex space-x-2 mb-4">
                {['관광지', '숙소', '식당'].map(tab => (
                  <button
                    key={tab}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      selectedTab === tab
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setSelectedTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="space-y-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {places[selectedTab].map(place => (
                  <div
                    key={place.id}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-move hover:bg-gray-50"
                    draggable
                    onDragStart={(e) => handleDragStart(e, place)}
                  >
                    <div className="w-12 h-12 bg-gray-300 rounded-lg mr-3 flex items-center justify-center">
                      <img src={place.image} alt={place.name} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{place.name}</div>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2">{place.type}</span>
                        
                        <span className="mr-2">{place.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">{place.location}</div>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      ㅇㅇ
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPlannerApp;