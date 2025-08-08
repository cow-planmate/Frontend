import Logo from "../assets/imgs/logo.svg?react";
import { Link } from "react-router-dom";
import Login from "../components/Login";
import PasswordFind from "../components/PasswordFind";
import Signup from "../components/Signup";
import Theme from "../components/Theme";
import Themestart from "../components/Themestart"; // 추가된 import
import { useState, useEffect, useRef } from "react";
import { useApiClient } from "../assets/hooks/useApiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faHouseUser,
} from "@fortawesome/free-solid-svg-icons";
import { faBell as faBellRegular } from "@fortawesome/free-regular-svg-icons";

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPasswordFindOpen, setIsPasswordFindOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isThemestartOpen, setIsThemestartOpen] = useState(false); // 추가된 state
  const [selectedThemeKeywords, setSelectedThemeKeywords] = useState({
    tourist: [],
    accommodation: [],
    restaurant: [],
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInvitationOpen, setisInvitationOpen] = useState(false);

  // 사용자 프로필 상태 추가
  const [userProfile, setUserProfile] = useState(null);

  const { get, isLoading, error, isAuthenticated, logout } = useApiClient();
  const BASE_URL = import.meta.env.VITE_API_URL;

  // 기존 코드 그대로...
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated()) {
        try {
          const profileData = await get(`${BASE_URL}/api/user/profile`);
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

  // 추가된 함수들
  const handleThemestartOpen = () => {
    setIsThemestartOpen(true);
  };

  const handleThemestartClose = () => {
    setIsThemestartOpen(false);
  };

  // 로그인 성공 후 프로필 정보 새로고침을 위한 함수
  const refreshUserProfile = async () => {
    if (isAuthenticated()) {
      try {
        const profileData = await get(`${BASE_URL}/api/user/profile`);
        setUserProfile(profileData);
      } catch (err) {
        console.error("프로필 정보 새로고침 실패:", err);
      }
    }
  };

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="border-b border-gray-200 ">
      <div className="mx-auto w-[1400px] bg-white flex justify-between py-4 items-center">
        <div>
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated() && userProfile ? (
            <div className="relative" ref={wrapperRef}>
              <div className="flex items-center gap-5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen((prev) => !prev);
                  }}
                >
                  <div className="flex items-center h-[42px]">
                    <div className="w-8 h-8 bg-no-repeat bg-contain bg-[url('./assets/imgs/default.png')] rounded-full mr-3"></div>
                    <span>
                      {userProfile.nickname || userProfile.name || "사용자"}님
                    </span>
                  </div>
                </button>

                <button className="flex items-center">
                  <FontAwesomeIcon
                    icon={faBellRegular}
                    className="text-gray-500 text-[20px] align-middle hover:text-gray-400"
                    onClick={() => setisInvitationOpen(true)}
                  />
                </button>
              </div>
              {isProfileOpen && (
                <div className="absolute right-8 top-full w-36 p-2 bg-white border rounded-lg shadow-md z-50">
                  <Link to="/mypage">
                    <div className="w-full flex items-center p-3 hover:bg-gray-100 cursor-pointer">
                      <FontAwesomeIcon
                        className="mr-3 w-4"
                        icon={faHouseUser}
                      />
                      마이페이지
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    <FontAwesomeIcon
                      className="mr-3 w-4"
                      icon={faRightFromBracket}
                    />
                    로그아웃
                  </button>
                </div>
              )}

              {isInvitationOpen && (
                <div className="absolute right-0 top-full w-80 bg-white border rounded-lg shadow-lg z-50">
                  <div className="p-4">
                    <div
                      className="flex justify-between items-center mb-4"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      <h3 className="text-lg font-semibold">초대 알림</h3>
                      <button
                        onClick={() => setisInvitationOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      <div className="border border-gray-200 rounded-lg p-3 ">
                        <div className="text-sm text-gray-600 mb-2 ">
                          '<span className="font-medium">홍길동</span>' 님께서
                          'plan1' 협업 초대를 보냈습니다
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-main text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600">
                            수락
                          </button>
                          <button className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-400">
                            거절
                          </button>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="text-sm text-gray-600 mb-2">
                          '<span className="font-medium">김철수</span>' 님께서
                          'plan1' 협업 초대를 보냈습니다
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-main text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600">
                            수락
                          </button>
                          <button className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-400">
                            거절
                          </button>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="text-sm text-gray-600 mb-2">
                          '<span className="font-medium">이영희</span>' 님께서
                          'plan2' 협업 초대를 보냈습니다
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-main text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600">
                            수락
                          </button>
                          <button className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-400">
                            거절
                          </button>
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="text-sm text-gray-600 mb-2">
                          '<span className="font-medium">박민수</span>' 님께서
                          'plan3' 협업 초대를 보냈습니다
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-main text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600">
                            수락
                          </button>
                          <button className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-400">
                            거절
                          </button>
                        </div>
                      </div>

                      {/* <div className="text-center py-8 text-gray-500">
          받은 초대가 없습니다
        </div> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[44px]">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                onClick={handleLoginOpen}
              >
                로그인/회원가입
              </button>
            </div>
          )}
        </div>
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
        onThemeOpen={handleThemestartOpen} // 추가된 prop
        selectedThemeKeywords={selectedThemeKeywords}
        onLoginSuccess={refreshUserProfile}
      />
      <Theme
        isOpen={isThemeOpen}
        onClose={handleThemeClose}
        onComplete={handleThemeComplete}
      />
      <Themestart
        isOpen={isThemestartOpen}
        onClose={handleThemestartClose}
        onThemeOpen={handleThemeOpen}
        selectedThemeKeywords={selectedThemeKeywords}
      />
    </div>
  );
}
