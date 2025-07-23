import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from 'react';
import TitleIcon from '../assets/imgs/title.svg?react';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from "../assets/hooks/useApiClient";

export default function PlanList() {
  const [plan, setPlan] = useState(null);
  const [isTitleOpen, setIsTitleOpen] = useState(false);
  const [id, setId] = useState(null);
  const { get, isAuthenticated } = useApiClient();
  
  // 로그인 상태 확인 및 프로필 정보 가져오기
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
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className='border border-gray-300 rounded-lg w-[1000px] overflow-y-auto h-[calc(100vh-201px)]'>
      <div className="font-bold text-2xl p-7 pb-5">나의 일정</div>
      <div className="px-4">
        <div className="text-gray-500 font-normal text-sm pl-3 pb-1">제목</div>
        {plan && plan.map((lst) => {
          const isOpen = openId === lst.planId;
          return (
            <div 
              key={lst.planId}
              onClick={() => navigate(`/complete?id=${lst.planId}`)} 
              className="relative cursor-pointer flex justify-between items-center py-3 px-3 hover:bg-sub"
            >
              <div className="font-semibold text-xl">{lst.planName}</div>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // 다른 클릭 이벤트 방지
                  toggleModal(lst.planId);
                }}
                className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-300"
              >
                <FontAwesomeIcon className="text-gray-500" icon={faEllipsisVertical} />
              </button>

              {isOpen && (
                <div ref={modalRef} className="absolute right-0 top-full w-36 p-2 bg-white border rounded-lg shadow-md z-50">
                  <button onClick={(e) => {e.stopPropagation();}} className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                    <TitleIcon className="mr-3 w-4" />
                    제목 바꾸기
                  </button>
                  <button 
                    onClick={
                      (e) => {
                        e.stopPropagation();
                        navigate(`/create?id=${lst.planId}`);
                    }} 
                    className="w-full flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faPen} className="mr-3 w-4" />
                    수정
                  </button>
                  <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                    <FontAwesomeIcon icon={faTrash} className="mr-3 w-4" />
                    삭제
                  </div>
                </div>
              )}
            </div>
          )
        }
        )}
      </div>

      {isTitleOpen ? <DeleteModal setIsTitleOpen={setIsTitleOpen} /> : <></>}
    </div>
  )
}

const TitleModal = ({setIsTitleOpen, id}) => {
  const { patch, isAuthenticated } = useApiClient();

  const handleTitle = async () => {
    if (isAuthenticated()) {
      try {
        await patch(`/api/plan/${id}/name`);
        setIsDeleteOpen(false);
      } catch (err) {
        console.error("탈퇴 과정에서 오류가 발생했습니다:", err);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold">제목 변경하기</h2>
        <div className="flex justify-between gap-2">
          <button
            onClick={() => setIsTitleOpen(false)}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 w-full"
          >
            취소
          </button>
          <button
            onClick={() => handleTitle()}
            className="px-3 py-1 bg-red-500 text-white rounded w-full hover:bg-red-700"
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  )
}