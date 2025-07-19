import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const DepartureModal = ({
  isOpen,
  onClose,
  onLocationSelect,
  title = "출발지 검색",
  placeholder = "출발지를 입력해주세요",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

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

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/departure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departureQuery: query,
        }),
      });

      if (!response.ok) {
        throw new Error("검색 중 오류가 발생했습니다.");
      }

      const data = await response.json();
      setSearchResults(data.departures || []); // API 응답 구조에 맞게 조정
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색어 변경 시 디바운싱 적용
  useEffect(() => {
    const timer = setTimeout(() => {
      searchDeparture(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 검색어 입력 핸들러
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 위치 선택 핸들러
  const handleLocationClick = (locationName) => {
    // 문자열을 객체 형태로 변환하여 전달
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
    setError(null);
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-pretendard"
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

          {error && (
            <div className="p-6 text-center">
              <p className="text-red-500 font-pretendard">{error}</p>
            </div>
          )}

          {!isLoading &&
            !error &&
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
              {searchResults.map((locationName, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationClick(locationName)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-blue-500 mr-3 flex-shrink-0"
                    />
                    <div>
                      <p className="font-medium text-gray-800 font-pretendard">
                        {locationName}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!searchQuery && (
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
