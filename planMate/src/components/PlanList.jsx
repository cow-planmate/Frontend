// PlanList.jsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faTrash,
  faPen,
  faCalendarPlus,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from "react";
import TitleIcon from "../assets/imgs/title.svg?react";
import { useNavigate } from "react-router-dom";
import { useApiClient } from "../assets/hooks/useApiClient";

export default function PlanList() {
  const [plan, setPlan] = useState(null);
  const [isTitleOpen, setIsTitleOpen] = useState(false);
  const [id, setId] = useState(null);
  const { get, isAuthenticated } = useApiClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated()) {
        try {
          const profileData = await get("/api/user/profile");
          setPlan(profileData.planVOs);
        } catch (err) {
          console.error("프로필 정보를 가져오는데 실패했습니다:", err);
        }
      } else {
        setPlan(null);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, get]);

  const [openId, setOpenId] = useState(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const toggleModal = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white w-[60rem] rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col font-pretendard">
      {/* 헤더 */}
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
            {plan.map((lst) => {
              const isOpen = openId === lst.planId;
              return (
                <div
                  key={lst.planId}
                  className="group relative bg-gray-50 hover:bg-blue-50 rounded-xl p-4 transition-all duration-200 cursor-pointer border border-gray hover:border-blue-200"
                  onClick={() => navigate(`/complete?id=${lst.planId}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="w-5 h-5 text-blue-600"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
                          {lst.planName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          클릭하여 상세보기
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleModal(lst.planId);
                      }}
                      className="w-8 h-8 rounded-lg hover:bg-white/80 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <FontAwesomeIcon
                        className="text-gray-500 hover:text-gray-700"
                        icon={faEllipsisVertical}
                      />
                    </button>
                  </div>

                  {isOpen && (
                    <div
                      ref={modalRef}
                      className="absolute right-4 top-16 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <TitleIcon className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          제목 바꾸기
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/create?id=${lst.planId}`);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <FontAwesomeIcon
                          icon={faPen}
                          className="w-4 h-4 text-black"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          수정하기
                        </span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="w-4 h-4 text-red-500"
                        />
                        <span className="text-sm font-medium text-red-600">
                          삭제하기
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
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

      {isTitleOpen && <TitleModal setIsTitleOpen={setIsTitleOpen} id={id} />}
    </div>
  );
}
