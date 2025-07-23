import { useState, useEffect } from "react";
import ProfileText from "./ProfileText";
import { useApiClient } from "../assets/hooks/useApiClient";
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    
  const { get, isAuthenticated } = useApiClient();

  // 로그인 상태 확인 및 프로필 정보 가져오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated()) {
        try {
          const profileData = await get("/api/user/profile");
          setUserProfile(profileData);
        } catch (err) {
          console.error("프로필 정보를 가져오는데 실패했습니다:", err);
          // 토큰이 유효하지 않은 경우 로그아웃 처리
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

  const gender = {0: "남자", 1: "여자"};

  return (
    <div className='relative border border-gray-300 rounded-lg w-[380px] p-7 mr-5'>
      <div className="flex flex-col items-center text-2xl pb-5 border-b border-gray-300">
        <div className="w-24 h-24 bg-no-repeat bg-contain bg-[url('./assets/imgs/default.png')] rounded-full"></div>
        {userProfile && <p className="pt-3 font-bold">{userProfile.nickname}</p>}
      </div>
      {userProfile && 
        <>
          <ProfileText title="이메일" content={userProfile.email} change={false} />
          <ProfileText title="나이" content={userProfile.age} change={true} />
          <ProfileText title="성별" content={gender[userProfile.gender]} change={true} />
          <ProfileText title="선호테마" content="써넣을말이없음" change={true} />
          <ProfileText title="비밀번호" content="password" change={false} />
        </>
      }
      <button onClick={() => setIsDeleteOpen(true)} className="underline text-red-500 text-sm absolute bottom-7">탈퇴하기</button>
      {isDeleteOpen ? <DeleteModal setIsDeleteOpen={setIsDeleteOpen} /> : <></>}
    </div>
  );
}

const DeleteModal = ({setIsDeleteOpen}) => {
  const { del, isAuthenticated, logout } = useApiClient();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (isAuthenticated()) {
      try {
        await del("/api/user/account");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate('/');
        setIsDeleteOpen(false);
      } catch (err) {
        console.error("탈퇴 과정에서 오류가 발생했습니다:", err);
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold">탈퇴하기</h2>
        <ul className="my-4 list-disc ml-5">
          <li>확인 버튼을 누를 시 탈퇴 처리됩니다.</li>
          <li>탈퇴 처리는 <span className="text-red-500 underline">절대 되돌릴 수 없습니다.</span></li>
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
  )
}