import { useState, useEffect } from "react";
import ProfileText from "./ProfileText";
import { useApiClient } from "../assets/hooks/useApiClient";

export default function Profile() {
  const [userProfile, setUserProfile] = useState(null);
    
  const { get, isAuthenticated } = useApiClient();

  // 로그인 상태 확인 및 프로필 정보 가져오기
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated()) {
        try {
          const profileData = await get("/api/user/profile");
          setUserProfile(profileData);
          console.log(userProfile )
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
      <div className="underline text-red-500 text-sm absolute bottom-7">탈퇴하기</div>
    </div>
  );
}