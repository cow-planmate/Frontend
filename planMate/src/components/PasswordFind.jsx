import { useState, useEffect } from "react";
export default function PasswordFind({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
  });
  const [timeLeft, setTimeLeft] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  //킬때마다 초기화
  useEffect(() => {
    if (isOpen) {
      // 폼 데이터 초기화
      setFormData({
        email: "",
        verificationCode: "",
      });
      // 타이머 관련 초기화
      setTimeLeft(0);

      // 이메일 인증 관련 초기화
      setIsEmailVerified(false);
      setShowVerification(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer;

    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft]);

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

  const sendEmail = async () => {
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/auth/password/email", {
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
      setShowVerification(true); // 인증번호 입력 영역 표시
    } catch (error) {
      console.error("에러 발생:", error);
      alert("이메일 전송에 실패했습니다.");
    }
  };

  const verifyEmail = async () => {
    try {
      const response = await fetch("//api/auth/password/email/verify", {
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
        alert("인증 성공! 이메일로 비밀번호가 전송되었습니다!");
        setIsEmailVerified(true); // 인증 완료 상태로 변경
      } else {
        alert(data.message || "인증 실패. 코드를 다시 확인하세요.");
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert("서버 오류. 나중에 다시 시도해주세요.");
    }
  };

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
        >
          ×
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">비밀번호 찾기</h1>

        <div className="space-y-6">
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

          {/* 인증번호 입력 */}
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
        </div>
      </div>
    </div>
  );
}
