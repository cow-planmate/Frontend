import React, { useState } from "react";

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
  const [showThemes, setShowThemes] = useState(false); // 툴팁 표시를 위한 상태

  if (!isOpen) return null;

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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto"
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
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                className="w-24 py-2 bg-main text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
              >
                인증번호발송
              </button>
            </div>
          </div>

          {/* 인증번호 입력 */}
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
                className="w-24 py-2 bg-main text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                입력
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-left">
              인증번호 재발송
            </p>
          </div>

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
