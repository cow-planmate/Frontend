// PlanList.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import { useApiClient } from "../assets/hooks/useApiClient";
import PlanListList from "./PlanListList";
import { useNavigate } from "react-router-dom";

export default function PlanList({ refreshTrigger }) {
  const navigate = useNavigate();
  const [myPlans, setMyPlans] = useState([]);
  const [editablePlans, setEditablePlans] = useState([]);

  const { get, isAuthenticated } = useApiClient();
  const removePlanFromState = (planId) => {
    setMyPlans((prevPlans) => prevPlans.filter((p) => p.planId !== planId));
    setEditablePlans((prevPlans) =>
      prevPlans.filter((p) => p.planId !== planId)
    );
  };
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated()) {
        try {
          const profileData = await get(`${BASE_URL}/api/user/profile`);
          setMyPlans(profileData.myPlanVOs || []);
          setEditablePlans(profileData.editablePlanVOs || []);
        } catch (err) {
          console.error("프로필 정보를 가져오는데 실패했습니다:", err);
          setMyPlans([]);
          setEditablePlans([]);
        }
      } else {
        setMyPlans([]);
        setEditablePlans([]);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, get, refreshTrigger]);
  const removeEditablePlanFromState = (planId) => {
    setEditablePlans((prev) => prev.filter((p) => p.planId !== planId));
  };

  return (
    <div className="flex flex-col gap-6 font-pretendard">
      <div className="bg-white w-[53rem] rounded-2xl shadow-sm border border-gray-200 flex flex-col">
        <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">나의 일정</h2>
            <p className="text-gray-600 mt-1">직접 생성한 일정을 관리하세요</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
            <span>{myPlans.length}개의 계획</span>
          </div>
        </div>

        <div className="p-6">
          {myPlans.length > 0 ? (
            <div className="space-y-4">
              {myPlans.map((lst) => (
                <PlanListList
                  key={lst.planId}
                  lst={lst}
                  onPlanDeleted={removePlanFromState}
                  isOwner={true}
                  onResignEditorSuccess={removeEditablePlanFromState}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon
                  icon={faCalendarPlus}
                  className="w-6 h-6 text-gray-400"
                />
              </div>
              <p className="text-gray-500 mb-4">생성한 일정이 없습니다</p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-main hover:bg-blue-900 text-white font-medium rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faCalendarPlus} className="w-4 h-4" />
                여행 계획 만들기
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white w-[53rem] rounded-2xl shadow-sm border border-gray-200 flex flex-col">
        <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">우리들의 일정</h2>
            <p className="text-gray-600 mt-1">
              초대받은 일정에서 다른 멤버와 함께 편집하세요
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
            <span>{editablePlans.length}개의 계획</span>
          </div>
        </div>

        <div className="p-6">
          {editablePlans.length > 0 ? (
            <div className="space-y-4">
              {editablePlans.map((lst) => (
                <PlanListList
                  key={lst.planId}
                  lst={lst}
                  onPlanDeleted={removePlanFromState}
                  isOwner={false}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">편집 권한을 받은 일정이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
