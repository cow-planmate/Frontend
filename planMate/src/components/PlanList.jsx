// PlanList.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import { useApiClient } from "../assets/hooks/useApiClient";
import PlanListList from "./PlanListList";
import { useNavigate } from "react-router-dom";

export default function PlanList() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const { get, isAuthenticated } = useApiClient();
  const removePlanFromState = (planId) => {
    setPlan((prevPlans) => prevPlans.filter((p) => p.planId !== planId));
  };
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated()) {
        try {
          const profileData = await get(`${BASE_URL}/api/user/profile`);

          const userInfo = profileData.userInfo;
          if (userInfo) {
            // myPlanVOs와 editablePlanVOs를 합쳐서 전체 계획 목록 생성
            const myPlans = userInfo.myPlanVOs || [];
            const editablePlans = userInfo.editablePlanVOs || [];
            const allPlans = [...myPlans, ...editablePlans];
            setPlan(allPlans);
          } else {
            setPlan([]);
          }
        } catch (err) {
          console.error("프로필 정보를 가져오는데 실패했습니다:", err);
          setPlan([]);
        }
      } else {
        setPlan(null);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, get]);

  return (
    <div className="bg-white w-[60rem] rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col font-pretendard">
      <div className="border-b border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">나의 일정</h2>
            <p className="text-gray-600 mt-1">
              생성된 여행 계획을 확인하고 관리하세요
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FontAwesomeIcon icon={faCalendarPlus} className="w-4 h-4" />
            <span>{plan ? plan.length : 0}개의 계획</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {plan && plan.length > 0 ? (
          <div className="space-y-4">
            {plan.map((lst) =>
              lst ? (
                <PlanListList
                  key={lst.planId}
                  lst={lst}
                  onPlanDeleted={removePlanFromState}
                />
              ) : null
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon
                icon={faCalendarPlus}
                className="w-8 h-8 text-gray-400"
              />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 여행 계획이 없습니다
            </h3>
            <p className="text-gray-500 mb-6">
              새로운 여행 계획을 만들어보세요!
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-main hover:bg-blue-900 text-white font-medium rounded-xl transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faCalendarPlus} className="w-4 h-4" />
              여행 계획 만들기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
