// 목표: 최대한 간결하고 작동 잘 되게
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useBlocker, useLocation } from "react-router-dom";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { useApiClient } from "../hooks/useApiClient";
import { disconnectStompClient, initStompClient, sendRedo, sendUndo } from "../websocket/client";
import { saveTempPlan, getTempPlan, clearTempPlan } from "../utils/tempPlanStorage"; // Import util
import { getClient } from "../websocket/client";

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
  const client = getClient();

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const navigate = useNavigate();
  const { get, post, isAuthenticated } = useApiClient();

  const {
    planId, setPlanAll, setEventId,
    travelCategoryName, travelName, travelId,
    planName, departure, transportationCategoryId, adultCount, childCount
  } = usePlanStore();
  const { setTimetableAll, setSelectedDay, timetables } = useTimetableStore(); // Add timetables
  const location = useLocation(); // Add useLocation
  const { addItemFromWebsocket, resetItems, items } = useItemsStore(); // Add items
  const { setPlacesAll, tour, lodging, restaurant } = usePlacesStore();
  const { lastSelectedDay } = useNicknameStore();
  const { setUserAll } = useUserStore();
  const [noACL, setNoACL] = useState(false);
  const [showTempPlanPrompt, setShowTempPlanPrompt] = useState(false); // Alert state
  const [isTempLoaded, setIsTempLoaded] = useState(false); // Prevent auto-save until loaded

  useEffect(() => {
    return () => {
      resetAllStores();
      resetItems();
    }
  }, []);

  useEffect(() => {
    if (planId !== -1) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ""; // 이거 필수 (크롬 기준)
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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
        } catch (err) {
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
      // 비로그인 유저의 경우 임시 저장 로드 여부 확인
      if (!isAuthenticated() && !isTempLoaded) return;

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
        } catch (err) {
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
  }, [travelCategoryName, travelName, travelId, isTempLoaded, isAuthenticated])

  useEffect(() => {
    if (id && isAuthenticated() && planId && planId !== -1) {
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

  // 임시 저장 - Load Prompt & Initial Check
  useEffect(() => {
    // Check if we came from Global Modal with intent to load
    if (location.state?.loadTemp) {
      loadTempPlan();
      // Clear state so it doesn't re-trigger on refresh if state persists (though navigation usually clears it unless replaced)
      // Actually navigate replaces state, but let's just handle it.
      // We don't need to clear state explicitly if we just run loadTempPlan which sets isTempLoaded to true.
      return;
    }

    const temp = getTempPlan();
    if (temp && (!isAuthenticated() || temp.plan.planId === -1)) {
      // 현재 페이지가 create 페이지이고, 임시 데이터가 있는 경우
      if (!id) {
        setShowTempPlanPrompt(true);
        return; // Wait for user action
      }
    }
    // If no temp plan or not applicable, allow auto-save immediately
    setIsTempLoaded(true);
  }, [id, isAuthenticated, location.state]);

  // 임시 저장 - Auto Save
  useEffect(() => {
    if (!isTempLoaded) return; // Wait until loaded

    if ((!isAuthenticated() || planId === -1)) {
      const planState = usePlanStore.getState();
      // 저장할 데이터 선별
      const planData = {
        planName: planState.planName,
        travelCategoryName: planState.travelCategoryName,
        travelName: planState.travelName,
        travelId: planState.travelId,
        departure: planState.departure,
        transportationCategoryId: planState.transportationCategoryId,
        adultCount: planState.adultCount,
        childCount: planState.childCount,
        planId: planState.planId,
        eventId: planState.eventId,
      };

      const dataToSave = {
        plan: planData,
        timetables: timetables,
        items: items,
        timestamp: Date.now()
      };

      // 디바운스 대신 간단하게 1초 딜레이 (Timer 사용)
      const timer = setTimeout(() => {
        saveTempPlan(dataToSave);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timetables, items, planId, isAuthenticated, planName, departure, transportationCategoryId, adultCount, childCount, isTempLoaded]); // 주시할 의존성

  const loadTempPlan = () => {
    const temp = getTempPlan();
    if (temp) {
      setPlanAll(temp.plan);
      setTimetableAll(temp.timetables);
      useItemsStore.setState({ items: temp.items }); // Store update directly to ensure sync

      if (lastSelectedDay[planId] && temp.timetables.length >= lastSelectedDay[planId]) {
        setSelectedDay(lastSelectedDay[planId]);
      } else {
        setSelectedDay(0);
      }

      setShowTempPlanPrompt(false);
      setIsTempLoaded(true); // Enable auto-save
    }
  };

  const discardTempPlan = () => {
    clearTempPlan();
    console.log(planId, timetables.length, planId !== 0 && timetables.length > 0);
    if (planId !== 0 && timetables.length > 0) {
      setShowTempPlanPrompt(false);
      setIsTempLoaded(true); // Enable auto-save (fresh start)
    } else {
      setShowTempPlanPrompt(false);
      navigate('/');
    }
  };

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

  if (!planId || tour.length === 0 || lodging.length === 0 || restaurant.length === 0 || (planId !== -1 && isAuthenticated() && (!client || !client.connected))) {
    return (
      <div className="font-pretendard h-screen">
        <Navbar />
        {showTempPlanPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-bold mb-4">임시 저장된 일정</h3>
              <p className="text-gray-600 mb-6">
                이전에 작성하던 일정이 있습니다.<br />
                불러오시겠습니까?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={discardTempPlan}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  버리기
                </button>
                <button
                  onClick={loadTempPlan}
                  className="flex-1 px-4 py-2 bg-main text-white rounded hover:bg-mainDark"
                >
                  불러오기
                </button>
              </div>
            </div>
          </div>
        )}
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