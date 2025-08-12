import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faTrash,
  faPen,
  faCalendarAlt,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import TitleIcon from "../assets/imgs/title.svg?react";
import { useNavigate } from "react-router-dom";
import { useApiClient } from "../assets/hooks/useApiClient";
import { useState, useEffect, useRef } from "react";

export default function PlanListList({
  lst,
  onPlanDeleted,
  isOwner = true,
  onResignEditorSuccess,
}) {
  const { del } = useApiClient();
  const navigate = useNavigate();
  const [isTitleOpen, setIsTitleOpen] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [title, setTitle] = useState(lst.planName);
  const modalRef = useRef(null);
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        toggleModal &&
        modalRef.current &&
        !modalRef.current.contains(e.target)
      ) {
        setToggleModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
            <p className="text-sm text-gray-500">클릭하여 상세보기</p>
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
          ref={modalRef}
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
            <FontAwesomeIcon icon={faPen} className="w-4 h-4 text-black" />
            <span className="text-sm font-medium text-gray-700">수정하기</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
          >
            <FontAwesomeIcon icon={faTrash} className="w-4 h-4 text-red-500" />
            <span
              className="text-sm font-medium text-red-600"
              onClick={deletePlan}
            >
              삭제하기
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsShareOpen(true);
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
      {isTitleOpen && (
        <TitleModal
          setIsTitleOpen={setIsTitleOpen}
          id={lst.planId}
          title={title}
          setTitle={setTitle}
        />
      )}
      {isShareOpen &&
        (isOwner ? (
          <ShareModal
            setIsShareOpen={setIsShareOpen}
            id={lst.planId}
            isShareOpen={isShareOpen}
          />
        ) : (
          <EditorShareModal
            setIsShareOpen={setIsShareOpen}
            id={lst.planId}
            isShareOpen={isShareOpen}
            onResignEditorSuccess={onResignEditorSuccess}
          />
        ))}
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
          console.warn("이미 존재하는 제목입니다");
          alert("이미 존재하는 제목입니다");
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
const ShareModal = ({ isShareOpen, setIsShareOpen, id }) => {
  const { patch, post, get, del } = useApiClient();
  const [editors, setEditors] = useState([]);
  const [receiverNickname, setreceiverNickname] = useState("");
  const [shareURL, setShareURL] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getShareLink();
    getEditors();
  }, [isShareOpen]);

  const removeEditorAccessByOwner = async (targetUserId) => {
    try {
      const response = await del(
        `${BASE_URL}/api/plan/${id}/editors/${targetUserId}`
      );
      console.log(response);
      getEditors();
    } catch (err) {
      console.error("에디터 제거에 실패했습니다:", err);
    }
  };

  const getEditors = async () => {
    try {
      const response = await get(`${BASE_URL}/api/plan/${id}/editors`);
      console.log(response);
      setEditors(response.simpleEditorVOs || []);
    } catch (error) {
      console.error("에디터 조회에 실패했습니다:", error);
    }
  };

  const inviteUserToPlan = async () => {
    try {
      const response = await post(`${BASE_URL}/api/plan/${id}/invite`, {
        receiverNickname: receiverNickname,
      });
      console.log(response);
      setreceiverNickname("");
      alert("초대를 보냈습니다!");
    } catch (err) {
      console.error("초대에 실패했습니다:", err);

      const errorMessage = err.response?.data?.message || err.message;

      if (errorMessage.includes("해당 닉네임의 유저가 존재하지 않습니다")) {
        alert("존재하지 않는 닉네임입니다. 다시 확인해주세요.");
      } else if (errorMessage.includes("이미 편집 권한이 있는 유저입니다")) {
        alert("이미 편집 권한이 있는 유저입니다.");
      } else if (errorMessage.includes("이미 초대한 유저입니다")) {
        alert("이미 초대를 보낸 유저입니다.");
      } else if (errorMessage.includes("자신에게는 초대를 보낼 수 없습니다")) {
        alert("자신에게는 초대를 보낼 수 없습니다.");
      } else if (errorMessage.includes("보낸 유저가 존재하지 않습니다")) {
        alert("사용자 인증에 실패했습니다. 다시 로그인해주세요.");
      } else if (err.response?.status === 403) {
        alert("해당 플랜에 대한 권한이 없습니다.");
      } else if (err.response?.status === 404) {
        alert("존재하지 않는 플랜입니다.");
      } else if (err.response?.status === 500) {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("초대에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const getShareLink = async () => {
    try {
      const completeURL = `${window.location.origin}/complete?id=${id}`;
      setShareURL(completeURL);
    } catch (error) {
      console.error("공유 링크 생성 실패", error);
    }
  };
  //get share 함수 api버전
  /**  const getShareLink = async () => {
    try {
      const response = await get(`${BASE_URL}/api/plan/${id}/share`);
      console.log(response);
      setShareURL(response.sharedPlanUrl || "");
    } catch (error) {
      console.error("공유 링크 조회 실패", error);
    }
  };*/

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareURL);
    alert("링크가 복사되었습니다!");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-96 border border-gray-100 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">공유 및 초대</h2>
        <button
          onClick={() => setIsShareOpen(false)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            완성본 공유 URL
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
              value={shareURL}
              readOnly
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
            >
              복사
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            편집 권한이 있는 사용자
          </label>
          <div className="space-y-2">
            {editors.length > 0 ? (
              editors.map((editor) => (
                <div
                  key={editor.userId}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
                >
                  <span className="text-gray-700">{editor.nickName}</span>
                  <button
                    onClick={() => removeEditorAccessByOwner(editor.userId)}
                    className="w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-red-500 text-sm">×</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm text-center py-2">
                편집 권한을 가진 사용자가 없습니다
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            일정 편집 초대
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
              value={receiverNickname}
              onChange={(e) => setreceiverNickname(e.target.value)}
              placeholder="닉네임"
            />
            <button
              onClick={inviteUserToPlan}
              className="px-4 py-3 bg-main hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm"
              disabled={!receiverNickname.trim()}
            >
              초대
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditorShareModal = ({ setIsShareOpen, id, onResignEditorSuccess }) => {
  const { del, post } = useApiClient();
  const [shareURL, setShareURL] = useState("");
  const [receiverNickname, setreceiverNickname] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const getShareLink = async () => {
      try {
        const completeURL = `${window.location.origin}/complete?id=${id}`;
        setShareURL(completeURL);
      } catch (error) {
        console.error("공유 링크 생성 실패", error);
      }
    };
    getShareLink();
  }, [id]);

  const inviteUserToPlan = async () => {
    try {
      const response = await post(`${BASE_URL}/api/plan/${id}/invite`, {
        receiverNickname: receiverNickname,
      });
      console.log(response);
      setreceiverNickname("");
      alert("초대를 보냈습니다!");
    } catch (err) {
      console.error("초대에 실패했습니다:", err);

      const errorMessage = err.response?.data?.message || err.message;

      if (errorMessage.includes("해당 닉네임의 유저가 존재하지 않습니다")) {
        alert("존재하지 않는 닉네임입니다. 다시 확인해주세요.");
      } else if (errorMessage.includes("이미 편집 권한이 있는 유저입니다")) {
        alert("이미 편집 권한이 있는 유저입니다.");
      } else if (errorMessage.includes("이미 초대한 유저입니다")) {
        alert("이미 초대를 보낸 유저입니다.");
      } else if (errorMessage.includes("자신에게는 초대를 보낼 수 없습니다")) {
        alert("자신에게는 초대를 보낼 수 없습니다.");
      } else if (errorMessage.includes("보낸 유저가 존재하지 않습니다")) {
        alert("사용자 인증에 실패했습니다. 다시 로그인해주세요.");
      } else if (err.response?.status === 403) {
        alert("해당 플랜에 대한 권한이 없습니다.");
      } else if (err.response?.status === 404) {
        alert("존재하지 않는 플랜입니다.");
      } else if (err.response?.status === 500) {
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert("초대에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareURL);
    alert("링크가 복사되었습니다!");
  };
  const resignEditorAccess = async () => {
    if (confirm("편집 권한을 포기하시겠습니까?")) {
      try {
        const response = await del(
          `${import.meta.env.VITE_API_URL}/api/plan/${id}/editor/me`
        );
        console.log(response);
        alert("편집 권한을 포기했습니다.");
        setIsShareOpen(false);

        window.location.reload();
      } catch (err) {
        console.error("편집 권한 포기에 실패했습니다:", err);
        alert("편집 권한 포기에 실패했습니다.");
      }
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-96 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">공유 및 초대</h2>
        <button
          onClick={() => setIsShareOpen(false)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>

        {/* 완성본 공유 URL */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            완성본 공유 URL
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
              value={shareURL}
              readOnly
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
            >
              복사
            </button>
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            일정 편집 초대
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
              value={receiverNickname}
              onChange={(e) => setreceiverNickname(e.target.value)}
              placeholder="닉네임"
            />
            <button
              onClick={inviteUserToPlan}
              className="px-4 py-3 bg-main hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm"
              disabled={!receiverNickname.trim()}
            >
              초대
            </button>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={resignEditorAccess}
            className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-medium transition-all duration-200 border border-red-200"
          >
            편집 권한 포기하기
          </button>
        </div>
      </div>
    </div>
  );
};
