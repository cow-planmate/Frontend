import React, { useState, useEffect } from "react";

export default function Signup({
  isOpen,
  onClose,
  onThemeOpen,
  selectedThemeKeywords,
}) {
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    age: "",
    gender: "male",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 인증 완료 상태
  const [showVerification, setShowVerification] = useState(false); // 인증번호 입력 영역 표시
  useEffect(() => {
    if (isOpen) {
      setFormData({
        email: "",
        verificationCode: "",
        password: "",
        confirmPassword: "",
        nickname: "",
        age: "",
        gender: "male",
      });
      setShowVerification(false);
    }
  }, [isOpen]);
  useEffect(() => {
    let timer;

    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
    }

    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning]);

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getThemeSelectionText = () => {
    if (!selectedThemeKeywords) return "선호테마 선택하기";
    const totalSelected =
      selectedThemeKeywords.tourist.length +
      selectedThemeKeywords.accommodation.length +
      selectedThemeKeywords.restaurant.length;

    if (totalSelected === 0) {
      return "선호테마 선택하기";
    }
    return `선호테마 선택완료 (${totalSelected}개)`;
  };

  const sendEmail = async () => {
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/auth/register/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error("이메일 전송 실패");
      }

      const data = await response.json();
      console.log("서버 응답:", data);
      alert("인증번호가 이메일로 전송되었습니다!");
      setTimeLeft(300);
      setIsTimerRunning(true);
      setShowVerification(true); // 인증번호 입력 영역 표시
    } catch (error) {
      console.error("에러 발생:", error);
      alert("이메일 전송에 실패했습니다.");
    }
  };

  const verifyEmail = async () => {
    try {
      const response = await fetch("/api/auth/register/email/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          verificationCode: formData.verificationCode,
        }),
      });
      const data = await response.json();
      console.log("서버 응답:", data);

      if (data.emailVerified) {
        alert("인증 성공!");
        setIsEmailVerified(true); // 인증 완료 상태로 변경
        setIsTimerRunning(false); // 타이머 중지
      } else {
        alert("인증 실패. 코드를 다시 확인하세요.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("오류. 나중에 다시 시도해주세요.");
    }
  };
  const verifyNickname = async () => {
    try {
      const response = await fetch("/api/auth/register/nickname/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: formData.nickname,
        }),
      });
      const data = await response.json();
      console.log("서버 응답:", data);

      if (data.nicknameAvailable) {
        alert("사용 가능한 닉네임입니다");
      } else {
        alert("이미 존재하는 닉네임입니다");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("오류. 나중에 다시 시도해주세요.");
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          회원가입
        </h1>

        <div className="space-y-4">
          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              이메일
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="honggildong@planmate.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isEmailVerified ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={isEmailVerified}
              />
              <button
                type="button"
                className={`w-24 py-2 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap ${
                  isEmailVerified
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-main hover:bg-blue-700"
                }`}
                onClick={sendEmail}
                disabled={isEmailVerified}
              >
                {isEmailVerified ? "인증완료" : "인증번호발송"}
              </button>
            </div>
          </div>

          {/* 인증번호 입력 - showVerification이 true이고 인증이 완료되지 않았을 때만 표시 */}
          {showVerification && !isEmailVerified && (
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="인증번호 입력"
                  value={formData.verificationCode}
                  onChange={(e) =>
                    handleInputChange("verificationCode", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  className="w-24 py-2 bg-main hover:bg-blue-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={verifyEmail}
                >
                  입력
                </button>
              </div>
              <p className="text-sm text-start text-gray-500 mt-1">
                남은 시간: {formatTime(timeLeft)}
              </p>
            </div>
          )}

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              비밀번호
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="inline-flex items-center mt-2 text-sm text-gray-600 cursor-pointer text-left">
              <input
                type="checkbox"
                className="mr-2"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              비밀번호 보기
            </label>
          </div>

          {/* 비밀번호 재입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              비밀번호 재입력
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="inline-flex items-center mt-2 text-sm text-gray-600 cursor-pointer text-left">
              <input
                type="checkbox"
                className="mr-2"
                checked={showConfirmPassword}
                onChange={() => setShowConfirmPassword(!showConfirmPassword)}
              />
              비밀번호 보기
            </label>
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              닉네임
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="홍길동"
                value={formData.nickname}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="w-24 py-2 bg-main text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
                onClick={verifyNickname}
              >
                중복확인
              </button>
            </div>
          </div>

          {/* 나이와 성별 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                나이
              </label>
              <input
                type="number"
                placeholder="20"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                성별
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange("gender", "male")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                    formData.gender === "male"
                      ? "bg-main text-white border-main"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  남
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("gender", "female")}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                    formData.gender === "female"
                      ? "bg-main text-white border-main"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  녀
                </button>
              </div>
            </div>
          </div>

          {/* 선호테마 선택 버튼 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 text-left">
                선호테마
              </label>
              <div
                className="relative"
                onMouseEnter={() => setShowThemes(true)}
                onMouseLeave={() => setShowThemes(false)}
              >
                <button
                  type="button"
                  className="text-xs border border-gray-300 px-2 py-0.5 rounded-md text-gray-600 hover:bg-gray-100"
                >
                  보기
                </button>
                {showThemes &&
                  selectedThemeKeywords &&
                  (selectedThemeKeywords.tourist.length > 0 ||
                    selectedThemeKeywords.accommodation.length > 0 ||
                    selectedThemeKeywords.restaurant.length > 0) && (
                    <div className="absolute bottom-full right-0 mb-1 w-max max-w-xs bg-white p-3 border border-gray-200 rounded-lg shadow-xl z-10">
                      <div className="text-xs text-gray-700 text-left space-y-1">
                        {selectedThemeKeywords.tourist.length > 0 && (
                          <p>
                            <strong>관광지:</strong>{" "}
                            {selectedThemeKeywords.tourist.join(", ")}
                          </p>
                        )}
                        {selectedThemeKeywords.accommodation.length > 0 && (
                          <p>
                            <strong>숙소:</strong>{" "}
                            {selectedThemeKeywords.accommodation.join(", ")}
                          </p>
                        )}
                        {selectedThemeKeywords.restaurant.length > 0 && (
                          <p>
                            <strong>식당:</strong>{" "}
                            {selectedThemeKeywords.restaurant.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
            <button
              type="button"
              onClick={onThemeOpen}
              className={`w-full py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                selectedThemeKeywords &&
                (selectedThemeKeywords.tourist.length > 0 ||
                  selectedThemeKeywords.accommodation.length > 0 ||
                  selectedThemeKeywords.restaurant.length > 0)
                  ? "bg-main text-white border-main"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {getThemeSelectionText()}
            </button>
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="button"
            className="w-full py-3 bg-main text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
