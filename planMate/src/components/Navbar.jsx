import Logo from "../assets/imgs/logo.svg?react";
import { Link } from "react-router-dom";
import Login from "../components/Login";
import PasswordFind from "../components/PasswordFind";
import Signup from "../components/Signup";
import Theme from "../components/Theme";
import { useState, useEffect, useRef } from "react";
import { useApiClient } from "../assets/hooks/useApiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faHouseUser } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPasswordFindOpen, setIsPasswordFindOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [selectedThemeKeywords, setSelectedThemeKeywords] = useState({
    tourist: [],
    accommodation: [],
    restaurant: [],
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // 사용자 프로필 상태 추가
  const [userProfile, setUserProfile] = useState(null);

  const { get, isLoading, error, isAuthenticated, logout } = useApiClient();

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

  // 로그아웃 처리 함수
  const handleLogout = () => {
    logout();
    setUserProfile(null);
    // 필요한 경우 홈페이지로 리다이렉트
    // window.location.href = '/';
  };

  const handleLoginOpen = () => {
    setIsLoginOpen(true);
  };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
  };

  const handlePasswordFindOpen = () => {
    setIsLoginOpen(false);
    setIsPasswordFindOpen(true);
  };

  const handlePasswordFindClose = () => {
    setIsPasswordFindOpen(false);
  };

  const handleSignupOpen = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleSignupClose = () => {
    setIsSignupOpen(false);
  };

  const handleThemeOpen = () => {
    setIsThemeOpen(true);
  };

  const handleThemeClose = () => {
    setIsThemeOpen(false);
  };

  const handleThemeComplete = (keywords) => {
    setSelectedThemeKeywords(keywords);
    setIsThemeOpen(false);
  };

  // 로그인 성공 후 프로필 정보 새로고침을 위한 함수
  const refreshUserProfile = async () => {
    if (isAuthenticated()) {
      try {
        const profileData = await get("/api/user/profile");
        setUserProfile(profileData);
      } catch (err) {
        console.error("프로필 정보 새로고침 실패:", err);
      }
    }
  };

  return (
    <div className="border-b border-gray-200">
      <div className="mx-auto w-[1400px] flex justify-between py-4 items-center">
        <div>
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {isAuthenticated() && userProfile ? (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsProfileOpen((prev) => (!prev));
              }}
            >
              <div className="flex items-center h-[42px]">
                <div className="w-8 h-8 bg-no-repeat bg-contain bg-[url('./assets/imgs/default.png')] rounded-full mr-3"></div>
                <span>
                  {userProfile.nickname || userProfile.name || "사용자"}님
                </span>
              </div>
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 top-full w-36 p-2 bg-white border rounded-lg shadow-md z-50">
                <Link to="/mypage">
                  <div className="w-full flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                    <FontAwesomeIcon className="mr-3 w-4" icon={faHouseUser} />
                    마이페이지
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                >
                  <FontAwesomeIcon className="mr-3 w-4" icon={faRightFromBracket} />
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              onClick={handleLoginOpen}
            >
              로그인/회원가입
            </button>
          </div>
        )}
      </div>

      {/* 모든 모달들을 Navbar에서 관리 */}
      <Login
        isOpen={isLoginOpen}
        onClose={handleLoginClose}
        onPasswordFindOpen={handlePasswordFindOpen}
        onSignupOpen={handleSignupOpen}
        onLoginSuccess={refreshUserProfile} // 로그인 성공 후 프로필 새로고침
      />
      <PasswordFind
        isOpen={isPasswordFindOpen}
        onClose={handlePasswordFindClose}
      />
      <Signup
        isOpen={isSignupOpen}
        onClose={handleSignupClose}
        onThemeOpen={handleThemeOpen}
        selectedThemeKeywords={selectedThemeKeywords}
      />
      <Theme
        isOpen={isThemeOpen}
        onClose={handleThemeClose}
        onComplete={handleThemeComplete}
      />
    </div>
  );
}
