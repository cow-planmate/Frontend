import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faTrash,
  faPen,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import TitleIcon from "../assets/imgs/title.svg?react";
import { useNavigate } from "react-router-dom";
import { useApiClient } from "../assets/hooks/useApiClient";
import { useState } from "react";

export default function PlanListList({lst}) {
  const navigate = useNavigate();
  const [isTitleOpen, setIsTitleOpen] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [title, setTitle] = useState(lst.planName);

  return (
    <div
      className="relative bg-gray-50 hover:bg-blue-50 rounded-xl p-4 transition-all duration-200 cursor-pointer border border-gray hover:border-blue-200"
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
              {title}
            </h3>
            <p className="text-sm text-gray-500">
              클릭하여 상세보기
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setToggleModal((prev) => !prev);
          }}
          className="w-8 h-8 rounded-lg hover:bg-white/80 flex items-center justify-center transition-colors"
        >
          <FontAwesomeIcon
            className="text-gray-500 hover:text-gray-700"
            icon={faEllipsisVertical}
          />
        </button>
      </div>

      {toggleModal && (
        <div
          className="absolute right-4 top-16 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsTitleOpen(true);
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
      {isTitleOpen && <TitleModal setIsTitleOpen={setIsTitleOpen} id={lst.planId} title={title} setTitle={setTitle} />}
    </div>
  );
}

const TitleModal = ({ setIsTitleOpen, id, title, setTitle }) => {
  const { patch, isAuthenticated } = useApiClient();
  const [newTitle, setNewTitle] = useState(title);

  const patchApi = async () => {
    if (isAuthenticated()) {
      try {
        await patch(`/api/plan/${id}/name`, {
          planName: newTitle
        });
        setTitle(newTitle);
        setIsTitleOpen(false);
      } catch (err) {
        console.error("패치에 실패해버렸습니다:", err);
      }
    }
  };
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-default" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2">제목 변경</h2>
        <div className="my-6">
          <input
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsTitleOpen(false)}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
          >
            취소
          </button>
          <button
            onClick={patchApi}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};