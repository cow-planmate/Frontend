// hooks/useApiClient.js
import { useState, useCallback } from "react";

/**
 * API 클라이언트 훅
 * 토큰 인증이 포함된 fetch 요청을 쉽게 사용할 수 있도록 도와주는 커스텀 훅
 */
export const useApiClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  // 1. 토큰 관련 유틸리티 함수들
  const getAccessToken = useCallback(() => {
    return localStorage.getItem("accessToken");
  }, []);

  const getRefreshToken = useCallback(() => {
    return localStorage.getItem("refreshToken");
  }, []);

  const setTokens = useCallback((accessToken, refreshToken) => {
    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  }, []);

  // 2. 토큰 갱신 함수
  const refreshTokens = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw new Error("리프레시 토큰이 없습니다.");
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("토큰 갱신 실패");
      }

      const data = await response.json();
      setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch (error) {
      console.error("토큰 갱신 실패:", error.message); // 이 줄 추가
      clearAuth();
      throw error;
    }
  }, [getRefreshToken, setTokens, clearAuth, BASE_URL]);

  // 3. 인증 헤더 생성 함수
  const getAuthHeaders = useCallback(() => {
    const token = getAccessToken();
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      Accept: "application/json; charset=utf-8",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }, [getAccessToken]);

  // 4. API 요청 함수 (토큰 자동 포함)
  const apiRequest = useCallback(
    async (url, options = {}) => {
      setIsLoading(true);
      setError(null);

      try {
        const config = {
          ...options,
          headers: {
            ...getAuthHeaders(),
            ...options.headers,
          },
        };

        const response = await fetch(url, config);

        // 인증 에러 처리
        if (response.status === 401) {
          try {
            // 토큰 갱신 시도
            await refreshTokens();

            // 갱신된 토큰으로 원래 요청 재시도
            const retryConfig = {
              ...options,
              headers: {
                ...getAuthHeaders(),
                ...options.headers,
              },
            };

            const retryResponse = await fetch(url, retryConfig);
            if (retryResponse.ok) {
              return await retryResponse.json();
            } else {
              throw new Error("토큰 갱신 후에도 요청이 실패했습니다.");
            }
          } catch (refreshError) {
            clearAuth();
            throw new Error("인증이 만료되었습니다. 다시 로그인해주세요.");
          }
        }

        if (response.status === 403) {
          throw new Error("접근 권한이 없습니다.");
        }

        // fetch는 4xx, 5xx 에러에서 예외를 발생시키지 않으므로, 직접 처리
        if (!response.ok) {
          // 서버에서 보낸 에러 메시지를 우선적으로 사용하도록 시도
          const errorData = await response.json().catch(() => null);
          const errorMessage =
            errorData?.message || `API 요청 실패: ${response.status}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        console.error("API 요청 에러:", err);
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [getAuthHeaders, refreshTokens, clearAuth]
  );

  // 5. 편의 메서드들
  const get = useCallback(
    (url) => apiRequest(url, { method: "GET" }),
    [apiRequest]
  );

  const post = useCallback(
    (url, data) =>
      apiRequest(url, { method: "POST", body: JSON.stringify(data) }),
    [apiRequest]
  );

  const patch = useCallback(
    (url, data) =>
      apiRequest(url, { method: "PATCH", body: JSON.stringify(data) }),
    [apiRequest]
  );

  const put = useCallback(
    (url, data) =>
      apiRequest(url, { method: "PUT", body: JSON.stringify(data) }),
    [apiRequest]
  );

  const del = useCallback(
    (url) => apiRequest(url, { method: "DELETE" }),
    [apiRequest]
  );

  // 6. FormData 전송을 위한 별도 메서드 (파일 업로드용)
  const postFormData = useCallback(
    (url, formData) => {
      const token = getAccessToken();
      const headers = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // FormData 요청 시 Content-Type을 명시적으로 설정하지 않음
      // 브라우저가 자동으로 multipart/form-data와 boundary를 설정
      return apiRequest(url, {
        method: "POST",
        headers, // 이미 Content-Type이 없는 상태
        body: formData,
      });
    },
    [apiRequest, getAccessToken]
  );

  // 7. 인증 관련 함수들
  const login = useCallback(
    async (email, password) => {
      try {
        // 로그인 API 호출
        const response = await post(`${BASE_URL}/api/auth/login`, {
          email,
          password,
        });

        // 실패 조건을 먼저 확인 (가드 클로즈)
        if (!response.accessToken || !response.refreshToken) {
          throw new Error(
            response.message ||
              "로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요."
          );
        }

        // 성공 로직 - 두 토큰 모두 저장
        setTokens(response.accessToken, response.refreshToken);
        if (response.userId) {
          localStorage.setItem("userId", response.userId.toString());
        }

        return response; // 성공 응답 반환
      } catch (err) {
        // post 요청 자체에서 발생한 에러 또는 위에서 throw한 에러가 여기서 잡힘
        console.error("로그인 프로세스 에러:", err.message);
        // 에러를 다시 던져서 이 함수를 호출한 컴포넌트(UI)에서 처리할 수 있도록 함
        throw err;
      }
    },
    [post, setTokens, BASE_URL]
  );

  const logout = useCallback(() => {
    clearAuth();
    // 필요하다면, 로그아웃 후 로그인 페이지로 이동하는 로직을 추가할 수 있습니다.
    // window.location.href = '/login';
  }, [clearAuth]);

  const isAuthenticated = useCallback(() => {
    return !!getAccessToken();
  }, [getAccessToken]);

  return {
    // 상태
    isLoading,
    error,

    // API 메서드
    get,
    post,
    patch,
    put,
    del,
    postFormData,
    apiRequest, // 커스텀 요청용

    // 토큰 관리
    getAccessToken,
    getRefreshToken,
    setTokens,
    refreshTokens,
    clearAuth,

    // 인증 관련
    login,
    logout,
    isAuthenticated,
  };
};
