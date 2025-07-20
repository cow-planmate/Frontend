// components/DepartureModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useApiClient } from "../assets/hooks/useApiClient";

const DepartureModal = ({
  isOpen,
  onClose,
  onLocationSelect,
  title = "출발지 검색",
  placeholder = "출발지를 입력해주세요",
  onAuthError,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef(null);

  // API 클라이언트 훅 사용
  const { post, isLoading, error, isAuthenticated } = useApiClient();

  // 모달이 열릴 때 input에 포커스
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // 검색 API 호출
  const searchDeparture = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // 인증 체크
    if (!isAuthenticated()) {
      if (onAuthError) {
        onAuthError();
      }
      return;
    }

    try {
      const data = await post("/api/departure", {
        departureQuery: query,
      });
      console.log(data);
      setSearchResults(data.departures || []);
    } catch (err) {
      console.error("검색 API 에러:", err);

      // 인증 에러인 경우 콜백 호출
      if (err.message.includes("인증이 만료") && onAuthError) {
        onAuthError();
      }

      // 검색 결과 초기화
      setSearchResults([]);
    }
  };

  // 검색어 변경 시 디바운싱 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      searchDeparture(searchQuery);
      console.log(searchResults);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 검색어 입력 핸들러
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 위치 선택 핸들러 - 객체와 문자열 모두 처리
  const handleLocationClick = (location) => {
    let locationName;

    // location이 객체인지 문자열인지 확인
    if (typeof location === "object" && location !== null) {
      locationName =
        location.name ||
        location.departureName ||
        location.address ||
        String(location);
    } else {
      locationName = String(location);
    }

    const locationObject = { name: locationName };
    onLocationSelect(locationObject);
    setSearchQuery("");
    setSearchResults([]);
    onClose();
  };

  // 모달 닫기 핸들러
  const handleClose = () => {
    setSearchQuery("");
    setSearchResults([]);
    onClose();
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // 모달이 열릴 때 인증 상태 체크
  useEffect(() => {
    if (isOpen && !isAuthenticated()) {
      if (onAuthError) {
        setTimeout(() => {
          onAuthError();
        }, 1000);
      }
    }
  }, [isOpen, isAuthenticated, onAuthError]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      {/* 모달 컨테이너 */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 font-pretendard">
            {title}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
          </button>
        </div>

        {/* 검색 입력 영역 */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={placeholder}
              disabled={!isAuthenticated()}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-pretendard disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {/* 검색 결과 영역 */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600 font-pretendard">
                검색중...
              </span>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="p-6 text-center">
              <div
                className={`p-4 rounded-lg ${
                  error.includes("로그인") ||
                  error.includes("인증") ||
                  error.includes("권한")
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <p
                  className={`font-pretendard ${
                    error.includes("로그인") ||
                    error.includes("인증") ||
                    error.includes("권한")
                      ? "text-yellow-700"
                      : "text-red-600"
                  }`}
                >
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* 인증되지 않은 경우 메시지 */}
          {!isAuthenticated() && !error && (
            <div className="p-6 text-center">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="text-yellow-700 font-pretendard">
                  로그인이 필요한 서비스입니다.
                </p>
              </div>
            </div>
          )}

          {!isLoading &&
            !error &&
            isAuthenticated() &&
            searchQuery &&
            searchResults.length === 0 && (
              <div className="p-6 text-center">
                <p className="text-gray-500 font-pretendard">
                  검색 결과가 없습니다.
                </p>
              </div>
            )}

          {!isLoading && !error && searchResults.length > 0 && (
            <div className="py-2">
              {searchResults.map((location, index) => {
                // location이 객체인지 문자열인지 확인하고 적절히 처리
                let displayName;
                if (typeof location === "object" && location !== null) {
                  displayName =
                    location.name ||
                    location.departureName ||
                    location.address ||
                    JSON.stringify(location);
                } else {
                  displayName = String(location);
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleLocationClick(location)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-blue-500 mr-3 flex-shrink-0"
                      />
                      <div>
                        <p className="font-medium text-gray-800 font-pretendard">
                          {displayName}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {!searchQuery && !error && isAuthenticated() && (
            <div className="p-6 text-center">
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-gray-300 text-4xl mb-4"
              />
              <p className="text-gray-500 font-pretendard">
                위치를 검색해보세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartureModal;
