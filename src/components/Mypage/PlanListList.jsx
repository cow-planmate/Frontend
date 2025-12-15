import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faTrash,
  faPen,
  faCalendarAlt,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import TitleIcon from "../../assets/imgs/title.svg?react";
import { useNavigate } from "react-router-dom";
import { useApiClient } from "../../hooks/useApiClient";
import { useState, useEffect, useRef } from "react";
import ShareModal from "../common/ShareModal";

export default function PlanListList({
  lst,
  onPlanDeleted,
  isOwner = true,
  onResignEditorSuccess,
  isMultiSelectMode = false,
  isSelected = false,
  onPlanSelect,
}) {
  const { del } = useApiClient();
  const navigate = useNavigate();
  const [isTitleOpen, setIsTitleOpen] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [title, setTitle] = useState(lst.planName);
  const modalRef = useRef(null);
  const buttonRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        toggleModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setToggleModal(false);
      }
    };

    const handleScroll = () => {
      if (toggleModal) {
        setToggleModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [toggleModal]);

  // 모달 위치 계산
  useEffect(() => {
    if (toggleModal && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const modalWidth = 176;

      setModalPosition({
        top: buttonRect.bottom + 8,
        left: buttonRect.right - modalWidth,
      });
    }
  }, [toggleModal]);

  const deletePlan = async () => {
    try {
      const res = await del(`${BASE_URL}/api/plan/${lst.planId}`);
      console.log("API응답", res);
      if (res.message !== "일정을 삭제할 권한이 없습니다.") {
        onPlanDeleted(lst.planId);
      } else {
        alert("일정을 삭제할 권한이 없습니다.");
      }
    } catch (err) {
      console.log("오류발생", err);
    }
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    onPlanSelect?.(lst.planId, e.target.checked);
  };

  return (
    <div
      className={`relative bg-gray-50 hover:bg-blue-50 rounded-xl p-4 transition-all duration-200 cursor-pointer border ${
        isSelected
          ? "border-blue-400 bg-blue-50"
          : "border-gray hover:border-blue-200"
      }`}
      onClick={() =>
        !isMultiSelectMode && navigate(`/complete?id=${lst.planId}`)
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMultiSelectMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-blue-600 rounded"
            />
          )}
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
            <p className="text-sm text-gray-500">클릭하여 상세보기</p>
          </div>
        </div>
        <div className="relative">
          <button
            ref={buttonRef}
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
            className="fixed w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50"
            ref={modalRef}
            style={{
              top: `${modalPosition.top}px`,
              left: `${modalPosition.left}px`,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsTitleOpen(true);
                setToggleModal(false);
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
              <FontAwesomeIcon icon={faPen} className="w-4 h-4 text-black" />
              <span className="text-sm font-medium text-gray-700">
                수정하기
              </span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deletePlan();
                setToggleModal(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="w-4 h-4 text-red-500"
              />
              <span className="text-sm font-medium text-red-600">삭제하기</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen(true);
                setToggleModal(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <FontAwesomeIcon icon={faShare} className="w-4 h-4 text-black" />
              <span className="text-sm font-medium text-gray-700">
                공유 및 초대
              </span>
            </button>
          </div>
        )}
      </div>
      {isTitleOpen && (
        <TitleModal
          setIsTitleOpen={setIsTitleOpen}
          id={lst.planId}
          title={title}
          setTitle={setTitle}
        />
      )}
      {isShareOpen && (
        <ShareModal
          setIsShareOpen={setIsShareOpen}
          id={lst.planId}
          isOwner={isOwner}
        />
      )}
    </div>
  );
}

const TitleModal = ({ setIsTitleOpen, id, title, setTitle }) => {
  const { patch, isAuthenticated } = useApiClient();
  const [newTitle, setNewTitle] = useState(title);
  const BASE_URL = import.meta.env.VITE_API_URL;

  const patchApi = async () => {
    if (isAuthenticated()) {
      try {
        const response = await patch(`${BASE_URL}/api/plan/${id}/name`, {
          planName: newTitle,
        });
        console.log(response);

        if (response.edited === true) {
          setTitle(newTitle);
          setIsTitleOpen(false);
        } else {
          const errorMessage =
            response.message || "패치에 실패했습니다. 다시 시도해주세요.";
          console.log(`${response.message}`);
          alert(errorMessage);
        }
      } catch (err) {
        console.error("패치에 실패했습니다:", err);
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
