// Profile.jsx
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faCalendar,
  faVenus,
  faMars,
  faHeart,
  faLock,
  faSignOutAlt,
  faUtensils,
  faBed,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import ProfileText from "./ProfileText";
import { useApiClient } from "../assets/hooks/useApiClient";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { get, isAuthenticated } = useApiClient();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated()) {
        try {
          const profileData = await get("/api/user/profile");
          setUserProfile(profileData);
        } catch (err) {
          console.error("프로필 정보를 가져오는데 실패했습니다:", err);
          if (err.message.includes("인증이 만료")) {
            handleLogout();
          }
        }
      } else {
        setUserProfile(null);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, get]);

  const gender = { 0: "남자", 1: "여자" };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-[30rem] flex flex-col h-[62rem]">
      {/* 프로필 헤더 */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 px-6 py-4 border-b border-gray-100">
        <div className="flex flex-col items-center text-black">
          <div className="w-20 h-20  bg-contain bg-[url('./assets/imgs/default.png')] rounded-full shadow-md ring-4 ring-white"></div>

          {userProfile && (
            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {userProfile.nickname}
              </h2>
              <div className="w-12 h-0.5 bg-main- mx-auto mt-2 rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4 bg-gray-50/30">
        {userProfile && (
          <>
            <ProfileText
              icon={faEnvelope}
              title="이메일"
              content={userProfile.email}
              change={false}
              iconColor="text-gray-700"
            />
            <ProfileText
              icon={faCalendar}
              title="나이"
              content={userProfile.age}
              change={true}
              iconColor="text-gray-700"
            />
            <ProfileText
              icon={userProfile.gender === 0 ? faMars : faVenus}
              title="성별"
              content={gender[userProfile.gender]}
              change={true}
              iconColor="text-gray-700"
            />
            <ProfileText
              icon={faHeart}
              title="선호테마"
              content={userProfile.preferredThemes}
              change={true}
              iconColor="text-red-700"
            />
            <ProfileText
              icon={faLock}
              title="비밀번호"
              content="password"
              change={false}
              iconColor="text-gray-500"
            />
          </>
        )}
      </div>

      {/* 탈퇴 버튼 */}
      <div className="px-6 pb-6 pt-1 bg-white">
        <button
          onClick={() => setIsDeleteOpen(true)}
          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          탈퇴하기
        </button>
        {isDeleteOpen ? (
          <DeleteModal setIsDeleteOpen={setIsDeleteOpen} />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

const DeleteModal = ({ setIsDeleteOpen }) => {
  const { del, isAuthenticated } = useApiClient();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (isAuthenticated()) {
      try {
        await del("/api/user/account");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/");
        setIsDeleteOpen(false);
      } catch (err) {
        console.error("탈퇴 과정에서 오류가 발생했습니다:", err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold">탈퇴하기</h2>
        <ul className="my-4 list-disc ml-5">
          <li>확인 버튼을 누를 시 탈퇴 처리됩니다.</li>
          <li>
            탈퇴 처리는{" "}
            <span className="text-red-500 underline">
              절대 되돌릴 수 없습니다.
            </span>
          </li>
          <li className="font-semibold">정말로 탈퇴하시겠습니까?</li>
        </ul>
        <div className="flex justify-between gap-2">
          <button
            onClick={() => setIsDeleteOpen(false)}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 w-full"
          >
            취소
          </button>
          <button
            onClick={() => handleDelete()}
            className="px-3 py-1 bg-red-500 text-white rounded w-full hover:bg-red-700"
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
};
