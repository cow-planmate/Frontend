import axios from 'axios';
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiClient } from "../../assets/hooks/useApiClient";
import usePlanStore from "../../store/Plan";
import PlaceItem from "./PlaceItem";

// AI 서버 URL 및 날짜 계산 함수 (원본 유지) (여기 .env에 VITE_AI_API_URL=http://localhost:8010 이렇게 파이썬 localhost:8010으로 통신하게 한거에요!)
const AI_API_URL = import.meta.env.VITE_AI_API_URL;
const getEndDate = (startDate, period) => {
  if (!startDate || !period) return '';
  try {
    const date = new Date(startDate);
    date.setDate(date.getDate() + period - 1);
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('날짜 계산 오류:', error);
    return '';
  }
};


const PlaceRecommendations = ({ 
  places,
  schedule,
  onPlacesUpdate 
}) => {
  const [selectedTab, setSelectedTab] = useState("관광지");

  // 검색 탭용 상태 (원본 유지)
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // 날씨 탭 전용 상태 추가 (원본 유지)
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  // plan id, API 클라이언트 등 (원본 유지)
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { get } = useApiClient();
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Zustand 스토어 구독 방식 (수정된 방식 유지)
  const travelCategoryName = usePlanStore((state) => state.travelCategoryName);
  const startDate = usePlanStore((state) => state.startDate);
  const period = usePlanStore((state) => state.period);

  
  // 🔎 검색 실행 (원본 유지)
  const doSearch = async () => {
    const q = searchText.trim();
    if (!q || !id) return;
    try {
      setSearchLoading(true);
      const res = await get(`${BASE_URL}/api/plan/${id}/place/${encodeURIComponent(q)}`);
      const newSearchList = Array.isArray(res?.places) ? res.places : [];

      onPlacesUpdate({
        ...places,
        검색: newSearchList,
      });
    } catch (err) {
      console.error("검색 실패:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  // 🌤️ 날씨 정보 호출 (의존성 배열 수정)
  useEffect(() => {
    // 1. 날씨 탭이 아니면 아무것도 안 함
    if (selectedTab !== '날씨') {
      return;
    }
    
    // 2. 이미 데이터가 있거나 로딩 중이면 API 호출 방지
    if (weatherData || weatherLoading) {
      return;
    }

    const fetchWeather = async () => {
      if (!travelCategoryName || !startDate || !period) {
        setWeatherError('여행지, 시작 날짜, 여행 기간 정보가 필요합니다. (Home 페이지에서 입력 확인)');
        return;
      }

      setWeatherLoading(true);
      setWeatherError(null);

      try {
        const calculatedEndDate = getEndDate(startDate, period);
        if (!calculatedEndDate) {
          throw new Error('종료 날짜 계산에 실패했습니다.');
        }
        
        const response = await axios.post(
          `${AI_API_URL}/recommendations`,
          {
            city: travelCategoryName,
            start_date: startDate,
            end_date: calculatedEndDate,
          }
        );
        setWeatherData(response.data);
      } catch (err) {
        console.error('날씨 정보 호출 실패:', err);
        setWeatherError(`날씨 정보를 불러오는 데 실패했습니다. (AI 서버: ${AI_API_URL})`);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();

  // --- [무한 루프 수정] ---
  // 의존성 배열에서 weatherData와 weatherLoading을 제거합니다.
  // 이 useEffect는 "입력값" (탭, 여행지, 날짜)이 바뀔 때만 실행되어야 합니다.
  }, [selectedTab, travelCategoryName, startDate, period]); // weatherData, weatherLoading 제거

  
  // 렌더링할 리스트를 useMemo로 계산 (원본 유지)
  const currentList = useMemo(() => {
    if (!places || !schedule) return [];

    const list = Array.isArray(places?.[selectedTab]) ? places[selectedTab] : [];

    const scheduledPlaceIds = new Set(
      Object.values(schedule)
        .flat()
        .map(item => item?.placeId)
        .filter(v => v != null)
    );

    const filteredList = list.filter(place => !scheduledPlaceIds.has(place?.placeId));

    return Array.from(new Map(filteredList.map(item => [item.placeId, item])).values());

  }, [places, schedule, selectedTab]);

  
  // 탭 색상 객체 (원본 유지)
  const tripColor3 = { 
    관광지: "lime-700", 
    숙소: "orange-700", 
    식당: "blue-700", 
    날씨: "cyan-700",
    검색: "gray-700" 
  };

  // 날씨 탭 UI 렌더링 함수 (원본 유지)
  const renderWeatherTab = () => {
    if (weatherLoading) {
      return <p className="text-center p-4">날씨 및 옷차림 추천을 불러오는 중...</p>;
    }
    if (weatherError) {
      return <p className="text-center p-4 text-red-500">{weatherError}</p>;
    }
    if (weatherData) {
      const calculatedEndDate = getEndDate(startDate, period);
      return (
        <div className="p-4 space-y-6 overflow-y-auto h-full">
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              {travelCategoryName} 날씨 예보
              <span className="text-base font-medium text-gray-600 ml-2">
                ({startDate} ~ {calculatedEndDate})
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weatherData.weather && weatherData.weather.length > 0 ? (
                weatherData.weather.map((day, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg shadow-sm bg-white"
                  >
                    <p className="font-bold text-lg text-blue-600">{day.date}</p>
                    <p className="text-gray-700 capitalize">
                      {day.description || '날씨 정보 없음'}
                    </p>
                    <p className="text-sm text-gray-600">
                      기온: {day.temp_min}°C / {day.temp_max}°C
                    </p>
                    <p className="text-sm text-gray-600">
                      체감 온도: {day.feels_like}°C
                    </p>
                  </div>
                ))
              ) : (
                <p>날씨 예보 정보가 없습니다.</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              AI 옷차림 추천
            </h3>
            <div className="p-4 border rounded-lg bg-gray-50 whitespace-pre-line text-gray-700 leading-relaxed">
              {weatherData.recommendation || '옷차림 추천 정보가 없습니다.'}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Tailwind JIT 컴파일러용 더미 클래스 (원본 유지)
  // bg-lime-700 bg-orange-700 bg-blue-700 bg-cyan-700 bg-gray-700
  
  return (
    <div className="flex-1">
      {/* 탭 버튼 배열 (원본 유지) */}
      <div className="flex space-x-1">
        {["관광지", "숙소", "식당", "날씨", "검색"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t-lg ${
              selectedTab === tab
                ? `bg-${tripColor3[tab]} text-white`
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="h-[calc(100vh-229px)] border border-gray-300 rounded-lg rounded-tl-none divide-y divide-gray-300">
        {/* 검색 탭 전용 입력 UI (원본 유지) */}
        {selectedTab === "검색" && (
          <div className="px-3 py-2">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="장소를 입력하세요"
                className="flex-1 border rounded-md px-3 py-2"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") doSearch();
                }}
              />
              <button
                className="px-4 py-2 rounded-md bg-main text-white font-semibold disabled:opacity-60"
                onClick={doSearch}
                disabled={searchLoading}
              >
                {searchLoading ? "검색 중..." : "검색"}
              </button>
            </div>
          </div>
        )}

        {/* 탭에 따라 날씨 UI 또는 장소 목록 렌더링 (원본 유지) */}
        {selectedTab === "날씨" ? (
          <div className="h-full overflow-y-auto"> 
            {renderWeatherTab()}
          </div>
        ) : (
          <div className={`overflow-y-auto ${selectedTab === "검색" ? "h-[calc(100vh-287px)]" : "h-full"}`}>
            {/* 렌더링 시 useMemo로 계산된 currentList 사용 */}
            {currentList.map((place) => ( 
              <PlaceItem
                key={place.placeId}
                place={place}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceRecommendations;

