import Logo from "../assets/imgs/logo.svg?react";
import { Link } from "react-router-dom";
import Login from "../components/Login";
import PasswordFind from "../components/PasswordFind";
import Signup from "../components/Signup";
import Theme from "../components/Theme";
import React, { useState } from "react";

export default function Navbar({ isLogin }) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPasswordFindOpen, setIsPasswordFindOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [selectedThemeKeywords, setSelectedThemeKeywords] = useState({
    tourist: [],
    accommodation: [],
    restaurant: [],
  });

  const handleLoginOpen = () => {
    setIsLoginOpen(true);
  };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
  };

  const handlePasswordFindOpen = () => {
    setIsLoginOpen(false); // 로그인 모달 닫기
    setIsPasswordFindOpen(true); // 비밀번호 찾기 모달 열기
  };

  const handlePasswordFindClose = () => {
    setIsPasswordFindOpen(false);
  };

  const handleSignupOpen = () => {
    setIsLoginOpen(false); // 로그인 모달 닫기
    setIsSignupOpen(true); // 회원가입 모달 열기
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

  return (
    <div className="border-b border-gray-200">
      <div className="mx-auto w-[1400px] flex justify-between py-4 items-center">
        <div>
          <Link to="/">
            <Logo />
          </Link>
        </div>
        {isLogin ? (
          <Link to="/mypage">
            <div className="flex items-center h-[42px]">
              <div className="w-8 h-8 bg-no-repeat bg-contain bg-[url('./assets/imgs/default.png')] rounded-full mr-3"></div>
              닉네임 님
            </div>
          </Link>
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
