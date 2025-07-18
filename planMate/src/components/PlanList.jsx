import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { useState, useRef, useEffect } from 'react';
import TitleIcon from '../assets/imgs/title.svg?react';
import { useNavigate } from 'react-router-dom';

export default function PlanList() {
  const test = [
    {"id": 1, "title": "제목없는 여행1"},
    {"id": 2, "title": "2025 대전여행"},
    {"id": 3, "title": "제주도 관광 일정"},
  ];

  const [openId, setOpenId] = useState(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const toggleModal = (id) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setOpenId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='border border-gray-300 rounded-lg w-[1000px]'>
      <div className="font-bold text-2xl p-7 pb-5">나의 일정</div>
      <div className="px-4">
        <div className="text-gray-500 font-normal text-sm pl-3 pb-1">제목</div>
        {test.map((lst) => {
          const isOpen = openId === lst.id;
          return (
            <div 
              key={lst.id}
              onClick={() => navigate(`/detail/${lst.id}`)} 
              className="relative cursor-pointer flex justify-between items-center py-3 px-3 hover:bg-sub"
            >
              <div className="font-semibold text-xl">{lst.title}</div>
              <button 
                onClick={(e) => {
                  e.stopPropagation(); // 다른 클릭 이벤트 방지
                  toggleModal(lst.id);
                }}
                className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-300"
              >
                <FontAwesomeIcon className="text-gray-500" icon={faEllipsisVertical} />
              </button>

              {isOpen && (
                <div ref={modalRef} className="absolute right-0 top-full w-40 p-2 bg-white border rounded-lg shadow-md z-50">
                  <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                    <TitleIcon className="mr-3 w-4" />
                    제목 바꾸기
                  </div>
                  <div className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                    <FontAwesomeIcon icon={faPen} className="mr-3 w-4" />
                    수정
                  </div>
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
    </div>
  )
}