// pages/OAuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApiClient } from "../hooks/useApiClient";
import useNicknameStore from "../store/Nickname";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokens } = useApiClient();
  const { setNickname, setGravatar } = useNicknameStore();
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const status = searchParams.get("status");
        const success = searchParams.get("success");
        const message = searchParams.get("message");

        // 기존 사용자 로그인 (loginCode 방식)
        if (success === "false") {
          setError(
            message
              ? decodeURIComponent(message)
              : "OAuth 로그인에 실패했습니다.",
          );
          setIsProcessing(false);
          return;
        }

        if (status === "SUCCESS") {
          const code = searchParams.get("code");

          if (!code) {
            setError("로그인 코드가 없습니다.");
            setIsProcessing(false);
            return;
          }

          // loginCode를 JWT로 교환
          const response = await fetch(
            `${API_BASE_URL}/api/oauth/exchange?code=${code}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (!response.ok) {
            throw new Error("토큰 교환에 실패했습니다.");
          }

          const data = await response.json();
          const { accessToken, refreshToken, nickname, email } = data;

          // 토큰 저장
          setTokens(accessToken, refreshToken);
          setNickname(nickname);
          setGravatar(email);

          // userId는 JWT에서 파싱하거나 별도 API 호출
          try {
            const userResponse = await fetch(
              `${API_BASE_URL}/api/user/mypage`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            if (userResponse.ok) {
              const userData = await userResponse.json();
              localStorage.setItem("userId", userData.userId.toString());
            }
          } catch (err) {
            console.error("사용자 정보 조회 실패:", err);
          }

          // 메인 페이지로 이동
          navigate("/", { replace: true });
        }
        // 신규 사용자 - 추가 정보 입력 필요
        else if (status === "NEED_ADDITIONAL_INFO") {
          const provider = searchParams.get("provider");
          const providerId = searchParams.get("providerId");
          const email = searchParams.get("email");
          const nickname = searchParams.get("nickname");

          if (!provider || !providerId) {
            setError("필수 정보가 누락되었습니다.");
            setIsProcessing(false);
            return;
          }

          navigate("/oauth/additional-info", {
            replace: true,
            state: {
              provider,
              providerId,
              email: email || "",
              nickname,
            },
          });
        }
        // 알 수 없는 상태
        else {
          setError("OAuth 로그인 중 오류가 발생했습니다.");
          setIsProcessing(false);
        }
      } catch (err) {
        console.error("OAuth 콜백 처리 실패:", err);
        setError(err.message || "로그인 처리 중 오류가 발생했습니다.");
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setTokens, setNickname, API_BASE_URL]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-pretendard">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인 실패</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/logintest")}
            className="w-full py-3 bg-main text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-pretendard">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          로그인 처리 중...
        </h2>
        <p className="text-gray-600">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
