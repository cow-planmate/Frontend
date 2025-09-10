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
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

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

  const handlePlanSelect = (planId, isSelected) => {
    if (isSelected) {
      setSelectedPlans((prev) => [...prev, planId]);
    } else {
      setSelectedPlans((prev) => prev.filter((id) => id !== planId));
    }
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedPlans.length === myPlans.length) {
      setSelectedPlans([]);
    } else {
      setSelectedPlans(myPlans.map((plan) => plan.planId));
    }
  };

  // 일괄삭제 함수
  const handleMultipleDelete = async () => {
    if (selectedPlans.length === 0) return;

    if (
      confirm(`선택한 ${selectedPlans.length}개의 일정을 삭제하시겠습니까?`)
    ) {
      try {
        const response = await fetch(`${BASE_URL}/api/plan`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            // 인증 헤더 필요시 추가
          },
          body: JSON.stringify({
            planIds: selectedPlans,
          }),
        });

        if (response.ok) {
          // 삭제된 플랜들을 상태에서 제거
          selectedPlans.forEach((planId) => {
            removePlanFromState(planId);
          });
          setSelectedPlans([]);
          setIsMultiSelectMode(false);
          alert("선택한 일정들이 삭제되었습니다.");
        }
      } catch (err) {
        console.error("일괄삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };
  return (
    <div className="flex flex-col gap-6 font-pretendard">
      <div className="bg-white w-[53rem] rounded-2xl shadow-sm border border-gray-200 flex flex-col">
        <div className="border-b border-gray-200 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">나의 일정</h2>
            <p className="text-gray-600 mt-1">직접 생성한 일정을 관리하세요</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
              <span>{myPlans.length}개의 계획</span>
            </div>
            {myPlans.length > 0 && (
              <button
                onClick={() => {
                  setIsMultiSelectMode(!isMultiSelectMode);
                  setSelectedPlans([]);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isMultiSelectMode
                    ? "bg-gray-200 text-gray-700"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                {isMultiSelectMode ? "취소" : "일괄삭제"}
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {isMultiSelectMode && myPlans.length > 0 && (
            <div className="mb-4 flex items-center justify-between bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedPlans.length === myPlans.length &&
                      myPlans.length > 0
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    전체 선택
                  </span>
                </label>
                <span className="text-sm text-gray-600">
                  {selectedPlans.length}개 선택됨
                </span>
              </div>
              <button
                onClick={handleMultipleDelete}
                disabled={selectedPlans.length === 0}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                선택 삭제 ({selectedPlans.length})
              </button>
            </div>
          )}
          {myPlans.length > 0 ? (
            <div className="space-y-4">
              {myPlans.map((lst) => (
                <PlanListList
                  key={lst.planId}
                  lst={lst}
                  onPlanDeleted={removePlanFromState}
                  isOwner={true}
                  onResignEditorSuccess={removeEditablePlanFromState}
                  isMultiSelectMode={isMultiSelectMode}
                  isSelected={selectedPlans.includes(lst.planId)}
                  onPlanSelect={handlePlanSelect}
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
