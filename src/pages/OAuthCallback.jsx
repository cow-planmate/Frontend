// pages/OAuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApiClient } from "../hooks/useApiClient";
import useNicknameStore from "../store/Nickname";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setTokens } = useApiClient();
  const { setNickname } = useNicknameStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const status = searchParams.get("status");

    
      if (status === "SUCCESS") {
        const accessToken = searchParams.get("access");
        const refreshToken = searchParams.get("refresh");

        if (accessToken && refreshToken) {
      
          setTokens(accessToken, refreshToken);

          // userId와 nickname 가져오기 (JWT에서 파싱하거나 별도 API 호출)
          try {
            // 토큰으로 사용자 정보 가져오기
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/api/user/mypage`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            if (response.ok) {
              const userData = await response.json();
              localStorage.setItem("userId", userData.userId.toString());
              localStorage.setItem("nickname", userData.nickname);
              setNickname(userData.nickname);
            }
          } catch (err) {
            console.error("사용자 정보 조회 실패:", err);
          }

         
          navigate("/", { replace: true });
        } else {
          setError("토큰 정보가 올바르지 않습니다.");
        }
      }
   
      else if (status === "NEED_ADDITIONAL_INFO") {
        const provider = searchParams.get("provider");
        const providerId = searchParams.get("providerId");
        const email = searchParams.get("email");
        const nickname = searchParams.get("nickname");

        
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
    
      else {
        setError("OAuth 로그인 중 오류가 발생했습니다.");
      }
    };

    handleCallback();
  }, [searchParams, navigate, setTokens, setNickname]);

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>로그인 실패</h2>
        <p style={{ color: "red", marginTop: "20px" }}>{error}</p>
        <button
          onClick={() => navigate("/logintest")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>로그인 처리 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
};

export default OAuthCallback;