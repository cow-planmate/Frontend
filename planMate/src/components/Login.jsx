import React, { useState, useEffect } from "react";

export default function Login({
  isOpen,
  onClose,
  onPasswordFindOpen,
  onSignupOpen,
  onLoginSuccess, // 로그인 성공시 호출될 콜백 함수 추가
}) {
  // 1. 상태 관리 - 입력값과 로딩, 에러 상태
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. 모달이 열릴 때마다 폼 데이터 초기화
  useEffect(() => {
    if (isOpen) {
      setFormData({ email: "", password: "" });
      setError("");
    }
  }, [isOpen]);

  // 3. 입력값 변경 핸들러 - 실시간으로 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 입력시 에러 메시지 제거
    if (error) setError("");
  };

  // 4. 입력값 유효성 검증
  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("이메일을 입력해주세요.");
      return false;
    }
    if (!formData.password.trim()) {
      setError("비밀번호를 입력해주세요.");
      return false;
    }
    // 간단한 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return false;
    }
    return true;
  };

  // 5. 로그인 API 호출 함수
  const handleLogin = async () => {
    // 유효성 검증
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      // API 명세서에 따른 POST 요청
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.loginSuccess) {
        // 6. 로그인 성공시 토큰 저장
        // 백엔드에서 토큰을 response에 포함해서 보낸다면:
        if (data.token) {
          localStorage.setItem("accessToken", data.token);
        }

        // 사용자 ID도 저장 (필요한 경우)
        if (data.userId) {
          localStorage.setItem("userId", data.userId.toString());
        }

        // 로그인 성공 콜백 호출
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }

        // 모달 닫기
        onClose();
      } else {
        // 로그인 실패
        setError(data.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 7. Enter 키로 로그인 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          disabled={isLoading}
        >
          ×
        </button>

        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
          로그인
        </h1>

        <div className="space-y-6">
          {/* 8. 에러 메시지 표시 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              placeholder="이메일을 입력하세요"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              placeholder="비밀번호를 입력하세요"
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-[6rem] py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {/* 9. 로딩 상태 표시 */}
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "로그인"
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-between mt-8 text-sm text-gray-500">
          <button
            className="hover:text-gray-700 disabled:cursor-not-allowed"
            onClick={onPasswordFindOpen}
            disabled={isLoading}
          >
            비밀번호 찾기
          </button>
          <button
            className="hover:text-gray-700 disabled:cursor-not-allowed"
            onClick={onSignupOpen}
            disabled={isLoading}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
