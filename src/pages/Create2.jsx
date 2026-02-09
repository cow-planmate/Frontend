// 목표: 최대한 간결하고 작동 잘 되게
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { useApiClient } from "../hooks/useApiClient";
import { disconnectStompClient, initStompClient, sendRedo, sendUndo } from "../websocket/client";

import usePlanStore from "../store/Plan";
import useTimetableStore from "../store/Timetables";
import usePlacesStore from "../store/Places";
import useUserStore from "../store/Users";

import Loading from "../components/common/Loading";
import Navbar from "../components/common/Navbar";
import PlanInfo from "../components/Create2/PlanInfo/PlanInfo";
import DaySelector from "../components/Create2/DaySelector/DaySelector";
import Main from "../components/Create2/Main/Main";
import useItemsStore from "../store/Schedules";
import { convertBlock, resetAllStores } from "../utils/createUtils";
import useNicknameStore from "../store/Nickname";

function App() {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const navigate = useNavigate();
  const { get, post, isAuthenticated } = useApiClient();

  const { 
    planId, setPlanAll, setEventId,
    travelCategoryName, travelName, travelId
  } = usePlanStore();
  const { setTimetableAll, setSelectedDay } = useTimetableStore();
  const { addItemFromWebsocket } = useItemsStore();
  const { setPlacesAll, tour, lodging, restaurant } = usePlacesStore();
  const { lastSelectedDay } = useNicknameStore();
  const { setUserAll } = useUserStore();
  const [noACL, setNoACL] = useState(false);

  useEffect(() => {
    return () => {
      resetAllStores();
    }
  }, []);

  // 초기 데이터 로딩
  useEffect(() => {
    const fetchPlanData = async () => {
      if (id && isAuthenticated()) {
        try {
          const planData = await get(`${BASE_URL}/api/plan/${id}`);

          console.log(planData)
          
          setPlanAll(planData.planFrame);
          setTimetableAll(planData.timetables.slice().sort((a, b) => new Date(a.date) - new Date(b.date)));
          
          if (lastSelectedDay[id] && planData.timetables.length >= lastSelectedDay[id]) {
            setSelectedDay(lastSelectedDay[id]);
          } else {
            setSelectedDay(0);
          }
          setEventId();
          planData.placeBlocks.map((item) => {
            const convert = convertBlock(item);
            addItemFromWebsocket(convert);
          });
        } catch(err) {
          console.error("일정 정보를 가져오는데 실패했습니다:", err);
          if (err.message == '요청 권한이 없습니다') {
            setNoACL(true);
          }
        }
      } else { // 비로그인 걸러내기
        setSelectedDay(0);
      }
    }
    fetchPlanData();
  }, []);

  useEffect(() => {
    const updatePlace = async () => {
      if (id && isAuthenticated()) {
        try {
          const [tourData, lodgingData, restaurantData] = await Promise.all([
            get(`${BASE_URL}/api/plan/${id}/tour`),
            get(`${BASE_URL}/api/plan/${id}/lodging`),
            get(`${BASE_URL}/api/plan/${id}/restaurant`),
          ]);

          setPlacesAll({
            tour: tourData.places,
            tourNext: tourData.nextPageTokens,
            lodging: lodgingData.places,
            lodgingNext: lodgingData.nextPageTokens,
            restaurant: restaurantData.places,
            restaurantNext: restaurantData.nextPageTokens
          });
        } catch(err) {
          console.error("추천 장소를 가져오는데 실패했습니다:", err);
        }
      } else {
        try {
          const [tourData, lodgingData, restaurantData] = await Promise.all([
            get(`${BASE_URL}/api/plan/tour/${travelCategoryName}/${travelName}`),
            get(`${BASE_URL}/api/plan/lodging/${travelCategoryName}/${travelName}`),
            get(`${BASE_URL}/api/plan/restaurant/${travelCategoryName}/${travelName}`),
          ]);
  
          setPlacesAll({
            tour: tourData.places,
            tourNext: tourData.nextPageTokens,
            lodging: lodgingData.places,
            lodgingNext: lodgingData.nextPageTokens,
            restaurant: restaurantData.places,
            restaurantNext: restaurantData.nextPageTokens
          });
        } catch (err) {
          console.error("추천 장소를 가져오는데 실패했습니다:", err);
        }
      }
    }

    if (travelCategoryName && travelName && travelId) updatePlace();
  }, [travelCategoryName, travelName, travelId])

  useEffect(() => {
    if (id && isAuthenticated() && planId) {
      initStompClient(id);

      return () => {
        disconnectStompClient();
      }
    }
  }, [id, planId, isAuthenticated]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Input이나 Textarea에서는 동작하지 않도록 처리
      if (!isAuthenticated() || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === 'z') {
          e.preventDefault();
          if (e.shiftKey) {
            console.log("🚀 Redo 요청");
            sendRedo(id);
          } else {
            console.log("🚀 Undo 요청");
            sendUndo(id);
          }
        } else if (key === 'y') {
          e.preventDefault();
          console.log("🚀 Redo 요청");
          sendRedo(id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [id, isAuthenticated]);

  // useEffect(() => {
  //   console.log(planId, tour, lodging, restaurant);
  //   console.log(!planId || tour.length === 0 || lodging.length === 0 || restaurant.length === 0);
  // }, [planId, tour, lodging, restaurant])

  // useEffect(() => {
  //   console.log(travelCategoryName, travelName, travelId)
  // }, [travelCategoryName, travelName, travelId])

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const requestEdit = async () => {
    try {
      await post(`${BASE_URL}/api/plan/${id}/request-access`)
      alert("편집 권한을 요청했습니다.");
    } catch (err) {
      console.error("요청에 실패했습니다.", err);
    }
  };

  if (!planId || tour.length === 0 || lodging.length === 0 || restaurant.length === 0) {
    return (
      <div className="font-pretendard h-screen">
        <Navbar />
        {noACL ? (
          <div className="space-y-3 h-[calc(100vh-75px)] flex items-center justify-center flex-col">
            <div className="text-3xl">
              <span className="text-main font-bold">편집 권한</span>이 없습니다.
            </div>
            <div className="space-x-3">
              <button
                onClick={() => navigate("/mypage")}
                className="font-semibold border border-gray-500 text-gray-700 hover:bg-gray-200 py-2 px-4 rounded-lg"
              >
                마이페이지로 가기
              </button>
              <button
                onClick={requestEdit}
                className="font-semibold text-white bg-main hover:bg-mainDark py-2 px-4 rounded-lg"
              >
                편집 권한 요청하기
              </button>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    )
  }

  return (
    <div className="font-pretendard h-screen">
      <Navbar />
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
            <Main />
          </DndContext>
        </div>
      </div>
    </div>
  );
}

export default App;