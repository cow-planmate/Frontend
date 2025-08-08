import { useState, useEffect, useReducer, useRef } from "react";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

import Navbar from "../components/navbar";
import PlanInfo from "../components/NewPlanInfo";
import DaySelector from "../components/Create/DaySelector";
import TimeTable from "../components/Create/TimeTable";
import PlaceRecommendations from "../components/Create/PlaceRecommendations";

import { useSearchParams } from "react-router-dom";
import { useApiClient } from "../assets/hooks/useApiClient";
import { transformApiResponse, addMinutes } from "../utils/scheduleUtils";

const initialPlanState = {
  planName: '',
  travelName: '',
  travelId: null,
  departure: '',
  transportationCategoryId: 0,
  adultCount: 0,
  childCount: 0,
};

function planReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
      };
    case 'SET_ALL':
      return { ...action.payload };
    case 'RESET':
      return initialPlanState;
    default:
      return state;
  }
}
      
function App() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const stompClientRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  const [plan, planDispatch] = useReducer(planReducer, initialPlanState);
  const planRef = useRef(plan);

  useEffect(() => {
    const SERVER_URL = "https://pmserver.salmakis.online/ws-plan";
    
    const connectWebSocket = () => {
      console.log("🔄 WebSocket 연결 시도 중...", SERVER_URL);
      
      // 실제 연결을 위한 코드 (라이브러리 설치 후 주석 해제)
      const socket = new SockJS(SERVER_URL);
      const client = new Client({
        webSocketFactory: () => socket,
        onConnect: (frame) => {
          console.log("✅ WebSocket 연결 완료:", frame);
          setIsConnected(true);
          stompClientRef.current = client;
          
          // 실제 구독 코드
          client.subscribe(`/topic/plan/${id}/update/plan`, (message) => {
            const received = JSON.parse(message.body);
            if (JSON.stringify(planRef.current) !== JSON.stringify(received)) {
              console.log(`플랜 업데이트 수신: ${message.body}`);
              alert(`플랜 업데이트 수신: ${message.body}`);
              planDispatch({ type: 'SET_ALL', payload: received });
            }
          });
          
          client.subscribe(`/topic/plan/${id}/create/timetable`, (message) => {
            console.log("📩 수신된 메시지:", message.body);
            alert(`수신된 메시지: ${message.body}`);
          });
          
          client.subscribe(`/topic/plan/${id}/update/timetable`, (message) => {
            console.log("📩 수신된 메시지:", message.body);
            //addMessage(`시간표 업데이트 수신: ${message.body}`);
          });
          
          client.subscribe(`/topic/plan/${id}/delete/timetable`, (message) => {
            console.log("📩 수신된 메시지:", message.body);
            //addMessage(`시간표 삭제 수신: ${message.body}`);
          });
          
          client.subscribe(`/topic/plan/${id}/create/timetableplaceblock`, (message) => {
            console.log("📩 수신된 메시지:", message.body);
            //addMessage(`시간표 블록 생성 수신: ${message.body}`);
          });
          
          client.subscribe(`/topic/plan/${id}/update/timetableplaceblock`, (message) => {
            console.log("📩 수신된 메시지:", message.body);
            addMessage(`시간표 블록 업데이트 수신: ${message.body}`);
          });
          
          client.subscribe(`/topic/plan/${id}/delete/timetableplaceblock`, (message) => {
            console.log("📩 수신된 메시지:", message.body);
            //addMessage(`시간표 블록 삭제 수신: ${message.body}`);
          });
        },
        onStompError: (frame) => {
          console.error("❌ STOMP 에러:", frame.headers['message']);
          setIsConnected(false);
          client.deactivate();
        },
        onWebSocketClose: () => {
          console.log("🔌 WebSocket 연결 종료");
          setIsConnected(false);
          client.deactivate();
        }
      });
      
      client.activate();
      
      /*
      // 시뮬레이션 코드 (실제 서버 연결 전 테스트용)
      setTimeout(() => {
        setIsConnected(true);
        console.log("✅ WebSocket 연결 완료 (시뮬레이션)");
        
        const subscriptions = [
          `/topic/plan/${id}/update/plan`,
          `/topic/plan/${id}/create/timetable`,
          `/topic/plan/${id}/update/timetable`,
          `/topic/plan/${id}/delete/timetable`,
          `/topic/plan/${id}/create/timetableplaceblock`,
          `/topic/plan/${id}/update/timetableplaceblock`,
          `/topic/plan/${id}/delete/timetableplaceblock`
        ];
        
        subscriptions.forEach(topic => {
          console.log(`📡 구독 완료: ${topic}`);
        });
      }, 1000);*/
    };

    connectWebSocket();

    // 정리 함수
    return () => {
      if (stompClientRef.current) {
        console.log("🔌 WebSocket 연결 해제");
        setIsConnected(false);
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  const { get, post, patch, isAuthenticated } = useApiClient();
  
  // State
  const [data, setData] = useState(null);
  const [timetables, setTimetables] = useState([]);
  const [transformedData, setTransformedData] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [places, setPlaces] = useState({
    관광지: [],
    숙소: [],
    식당: [],
  });

  // 초기 데이터 로딩
  useEffect(() => {
    const fetchPlanData = async () => {
      if (id && isAuthenticated()) {
        try {
          const planData = await get(`/api/plan/${id}`);
          const planFrame = planData.planFrame
          
          setData(planData);
          console.log("똥", planData);
          
          // plan 정보 등록 (* /api/plan/${id}와 웹소켓으로 보내야 하는거랑 묘하게 달라서 이렇게 씀)
          planDispatch({ type: 'SET_ALL', payload: planFrame });
          
          if (planData.timetables) {
            setTimetables(planData.timetables);
            if (planData.timetables.length > 0) {
              setSelectedDay(planData.timetables[0].timetableId);
            }
          }

          const result = transformApiResponse(planData);
          setTransformedData(result);
        } catch (err) {
          console.error("일정 정보를 가져오는데 실패했습니다:", err);
        }
      }
    };

    fetchPlanData();
  }, []);

  // 추천 장소 데이터 로딩
  useEffect(() => {
    const fetchPlaces = async () => {
      if (id && isAuthenticated()) {
        try {
          const [tour, lodging, restaurant] = await Promise.all([
            post(`/api/plan/${id}/tour`),
            post(`/api/plan/${id}/lodging`),
            post(`/api/plan/${id}/restaurant`)
          ]);

          setPlaces({
            관광지: tour.places,
            숙소: lodging.places,
            식당: restaurant.places,
          });
        } catch (err) {
          console.error("추천 장소를 가져오는데 실패했습니다:", err);
        }
      }
    };

    fetchPlaces();
  }, [id]);

  useEffect(() => {
    planRef.current = plan;
  }, [plan]);

  // 스케줄 초기화
  useEffect(() => {
    if (transformedData) {
      setSchedule(transformedData);
    } else if (timetables.length > 0) {
      const initialSchedule = {};
      timetables.forEach((timetable) => {
        initialSchedule[timetable.timetableId] = [];
      });
      setSchedule(initialSchedule);
    }
  }, [timetables, transformedData]);

  // 스케줄 업데이트 함수
  const updateSchedule = (newSchedule) => {
    setSchedule(newSchedule);
  };

  // 장소 업데이트 함수
  const updatePlaces = (newPlaces) => {
    setPlaces(newPlaces);
  };

  // 날짜별 일정 내보내기
  const exportSchedule = () => {
    const grouped = {};

    Object.entries(schedule).forEach(([timetableIdStr, day]) => {
      if (!Array.isArray(day) || day.length === 0) return;

      const timetableId = parseInt(timetableIdStr, 10);
      const date = getDateById(timetableId);

      for (const place of day) {
        const startTime = place.timeSlot;
        const endTime = addMinutes(startTime, place.duration * 15);
        
        const block = {
          placeCategory: place.categoryId,
          placeName: place.name,
          placeAddress: place.formatted_address,
          placeRating: place.rating,
          startTime: `${startTime}:00`,
          endTime: `${endTime}:00`,
          date: date,
          xLocation: place.xlocation,
          yLocation: place.ylocation,
          placeLink: place.url,
          placeTheme: "역사",
        };

        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(block);
      }
    });

    return Object.values(grouped);
  };

  // 일정 저장
  const savePlan = async (info) => {
    const scheduleToExport = exportSchedule();
    
    if (isAuthenticated()) {
      try {
        await patch(`/api/plan/${id}/save`, {
          departure: data.planFrame.departure,
          travel: data.planFrame.travel,
          transportationCategoryId: info.transportation,
          adultCount: info.adultCount,
          childCount: info.childCount,
          timetables: data.timetables,
          timetablePlaceBlocks: scheduleToExport,
        });
      } catch (err) {
        console.error("저장에 실패해버렸습니다:", err);
      }
    }
  };

  const getDateById = (id) => {
    const matched = data.timetables.find((t) => t.timetableId === id);
    return matched?.date ?? null;
  };
  
  useEffect(() => {
    if (plan) {  
      const client = stompClientRef.current;
      if (client && client.connected) {
        const planData = plan;
        client.publish({
          destination: `/app/plan/${id}/update/plan`,
          body: JSON.stringify(planData),
        });
        console.log("🚀 메시지 전송:", planData);
      }
    }
  }, [plan])

  // 로딩 상태
  if (!selectedDay || !timetables.length) {
    return (
      <div className="min-h-screen font-pretendard">
        <Navbar />
        {data && <PlanInfo info={data.planFrame} id={id} />}
        <div className="w-[1400px] mx-auto py-6 flex items-center justify-center">
          <div>일정 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-pretendard">
      <Navbar />
      {plan && <PlanInfo info={plan} planDispatch={planDispatch} id={id} savePlan={savePlan} />}
      
      <div className="w-[1400px] mx-auto py-6">
        <div className="flex space-x-6 flex-1">
          <DaySelector
            timetables={timetables}
            selectedDay={selectedDay}
            onDaySelect={setSelectedDay}
            stompClientRef={stompClientRef}
            id={id}
          />
          
          <TimeTable
            selectedDay={selectedDay}
            timetables={timetables}
            schedule={schedule}
            places={places}
            onScheduleUpdate={updateSchedule}
            onPlacesUpdate={updatePlaces}
          />
          
          <PlaceRecommendations
            places={places}
            onPlacesUpdate={updatePlaces}
          />
        </div>
      </div>
    </div>
  );
};

export default App;