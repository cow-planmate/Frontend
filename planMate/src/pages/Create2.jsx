// 목표: 최대한 간결하고 작동 잘 되게
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApiClient } from "../assets/hooks/useApiClient";
import { initStompClient } from "../websocket/client";

import usePlanStore from "../store/Plan";
import useTimetableStore from "../store/Timetables";
import useUserStore from "../store/UserDayIndexes";

import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import PlanInfo from "../components/Create2/PlanInfo/PlanInfo";
import DaySelector from "../components/Create2/DaySelector/DaySelector";

function App() {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const navigate = useNavigate();
  const { get, post, patch, isAuthenticated } = useApiClient();

  const { planId, setPlanAll } = usePlanStore();
  const { setTimetableAll } = useTimetableStore();
  const { setUserAll } = useUserStore();
  const [noACL, setNoACL] = useState(false);

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
            post(`${BASE_URL}/api/plan/tour`, {
            }),
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
  }, [])

  if (!planId) {
    return (
      <Loading />
    )
  }

  return (
    <div className="font-pretendard">
      {/* <Navbar /> */}
      <PlanInfo id={id}/>
      {noACL 
      ?
        <div className="w-[1400px] h-[calc(100vh-125px)] mx-auto py-6 space-y-3 flex items-center justify-center flex-col">
          <div className="text-3xl"><span className="text-main font-bold">편집 권한</span>이 없습니다.</div>
          <div className="space-x-3">
            <button onClick={() => navigate("/mypage")} className="font-semibold border border-gray-500 text-gray-700 hover:bg-gray-200 py-2 px-4 rounded-lg">
              마이페이지로 가기
            </button>
            <button onClick={requestEdit} className="font-semibold text-white bg-main py-2 px-4 rounded-lg">
              편집 권한 요청하기
            </button>
          </div>
        </div>
      :
        <div className="min-[1464px]:w-[1400px] min-[1464px]:px-0 md:px-8 md:py-6 px-6 py-3 mx-auto">
          <div className="flex md:space-x-6 md:space-y-0 space-y-4 flex-1 md:flex-row flex-col">
            <DaySelector />
            <div>안녕하세요</div>
          </div>
        </div>
      }
    </div>
  )
}

export default App;