import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiClient } from "../../assets/hooks/useApiClient";
import usePlanStore from "../../store/Plan";
import PlaceItem from "./PlaceItem";

// AI 서버 URL 및 날짜 계산 함수
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

const PlaceRecommendations = ({ places, schedule, onPlacesUpdate }) => {
  const [selectedTab, setSelectedTab] = useState("관광지");

  // 검색 탭용 상태
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // 날씨 탭 상태
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const lastWeatherParams = useRef(null);

  // AI 옷차림 추천 펼치기/접기 상태
  const [isRecommendationExpanded, setIsRecommendationExpanded] = useState(false);

  // 요약 관련 상태
  const [priceData, setPriceData] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(null);

  // plan data 상태 (component-local)
  const [placeBlocks, setPlaceBlocks] = useState([]);
  const [timeTables, setTimeTables] = useState([]);
  const [planLoading, setPlanLoading] = useState(false);

  // plan id, API 클라이언트
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { get } = useApiClient();
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Zustand store
  const travelCategoryName = usePlanStore((state) => state.travelCategoryName);
  const startDate = usePlanStore((state) => state.startDate);
  const period = usePlanStore((state) => state.period);
  const headcount = usePlanStore((state) => state.adultCount + state.childCount);

  // 검색 함수
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

  // currentList 계산
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

  // Plan fetch effect: load placeBlocks and timeTables from backend
  useEffect(() => {
    if (!id) return;
    if (planLoading) return;

    const fetchPlan = async () => {
      setPlanLoading(true);
      try {
        const planData = await get(`${BASE_URL}/api/plan/${id}`);
        if (!planData) {
          console.warn('plan API returned empty data for id', id);
          return;
        }

        // 응답에서 placeBlocks / timetables 키를 찾아 설정
        if (Array.isArray(planData.placeBlocks)) setPlaceBlocks(planData.placeBlocks);
        else if (Array.isArray(planData.places)) setPlaceBlocks(planData.places);

        if (Array.isArray(planData.timetables)) setTimeTables(planData.timetables);
        else if (Array.isArray(planData.timeTables)) setTimeTables(planData.timeTables);
      } catch (err) {
        console.error('일정 정보를 가져오는데 실패했습니다:', err);
      } finally {
        setPlanLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  // Weather effect
  useEffect(() => {
    if (selectedTab !== '날씨') return;

    const params = JSON.stringify({ travelCategoryName, startDate, period });
    if (lastWeatherParams.current === params) return;

    const fetchWeather = async () => {
      if (!travelCategoryName || !startDate || !period) {
        setWeatherError('여행지, 시작 날짜, 여행 기간 정보가 필요합니다. (Home 페이지에서 입력 확인)');
        lastWeatherParams.current = params;
        return;
      }

      setWeatherLoading(true);
      setWeatherError(null);
      lastWeatherParams.current = params;

      try {
        const calculatedEndDate = getEndDate(startDate, period);
        if (!calculatedEndDate) throw new Error('종료 날짜 계산에 실패했습니다.');

        const response = await axios.post(`${AI_API_URL}/recommendations`, {
          city: travelCategoryName,
          start_date: startDate,
          end_date: calculatedEndDate,
        });
        setWeatherData(response.data);
      } catch (err) {
        console.error('날씨 정보 호출 실패:', err);
        setWeatherError(`날씨 정보를 불러오는 데 실패했습니다. (AI 서버: ${AI_API_URL})`);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [selectedTab, travelCategoryName, startDate, period]);

  // Price effect: calls AI price API when '요약' tab selected and plan data present
  useEffect(() => {
    if (selectedTab !== '요약') return;
    if (priceData || priceLoading) return;
    if (!placeBlocks || placeBlocks.length === 0 || !timeTables || timeTables.length === 0) {
      console.warn('요약 예측을 위한 일정 데이터가 부족합니다.');
      return;
    }

    const fetchPrice = async () => {
      setPriceLoading(true);
      setPriceError(null);
      try {
        const response = await axios.post(`${AI_API_URL}/price`, {
          headcount,
          placeBlocks,
          timeTables,
        });
        console.log('요약 예측 성공:', response.data);
        setPriceData(response.data);
      } catch (err) {
        console.error('요약 정보 호출 실패:', err);
        setPriceError(`요약 정보를 불러오는 데 실패했습니다. (AI 서버: ${AI_API_URL})`);
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPrice();
  }, [selectedTab, placeBlocks, timeTables]);

  // 탭 색상 객체
  const tripColor3 = {
    관광지: "lime-700",
    숙소: "orange-700",
    식당: "blue-700",
    날씨: "cyan-700",
    요약: "cyan-700",
    검색: "gray-700",
  };

  const renderWeatherTab = () => {
    if (weatherLoading) return <p className="text-center p-4">날씨 및 옷차림 추천을 불러오는 중...</p>;
    if (weatherError) return <p className="text-center p-4 text-red-500">{weatherError}</p>;
    if (!weatherData) return null;

    const calculatedEndDate = getEndDate(startDate, period);
    return (
      <div className="p-4 space-y-6 overflow-y-auto h-full">
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            {travelCategoryName} 날씨 예보
            <span className="text-base font-medium text-gray-600 ml-2">({startDate} ~ {calculatedEndDate})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weatherData.weather && weatherData.weather.length > 0 ? (
              weatherData.weather.map((day, index) => (
                <div key={index} className="p-4 border rounded-lg shadow-sm bg-white">
                  <p className="font-bold text-lg text-blue-600">{day.date}</p>
                  <p className="text-gray-700 capitalize">{day.description || '날씨 정보 없음'}</p>
                  <p className="text-sm text-gray-600">기온: {day.temp_min}°C / {day.temp_max}°C</p>
                  <p className="text-sm text-gray-600">체감 온도: {day.feels_like}°C</p>
                </div>
              ))
            ) : (
              <p>날씨 예보 정보가 없습니다.</p>
            )}
          </div>
        </div>

        <div>
          <button onClick={() => setIsRecommendationExpanded(!isRecommendationExpanded)} className="w-full flex justify-between items-center text-left mb-3 cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-800">AI 옷차림 추천</h3>
            <span className="text-lg font-medium text-main">{isRecommendationExpanded ? '▲ 접기' : '▼ 펼치기'}</span>
          </button>
          {isRecommendationExpanded && (
            <div className="p-4 border rounded-lg bg-gray-50 whitespace-pre-line text-gray-700 leading-relaxed">
              {weatherData.recommendation || '옷차림 추천 정보가 없습니다.'}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1">
      <div className="flex space-x-1">
        {["관광지", "숙소", "식당", "날씨", "요약", "검색"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t-lg ${selectedTab === tab ? `bg-${tripColor3[tab]} text-white` : "bg-gray-200 text-gray-700"}`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="h-[calc(100vh-229px)] border border-gray-300 rounded-lg rounded-tl-none divide-y divide-gray-300">
        {selectedTab === "검색" && (
          <div className="px-3 py-2">
            <div className="flex items-center space-x-2">
              <input type="text" placeholder="장소를 입력하세요" className="flex-1 border rounded-md px-3 py-2" value={searchText} onChange={(e) => setSearchText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') doSearch(); }} />
              <button className="px-4 py-2 rounded-md bg-main text-white font-semibold disabled:opacity-60" onClick={doSearch} disabled={searchLoading}>{searchLoading ? '검색 중...' : '검색'}</button>
            </div>
          </div>
        )}

        {selectedTab === '날씨' ? (
          <div className="h-full overflow-y-auto">{renderWeatherTab()}</div>
        ) : selectedTab === '요약' ? (
          <div className="p-4">
            {priceLoading && <p>요약 정보를 불러오는 중...</p>}
            {priceError && <p className="text-red-500">{priceError}</p>}

            {priceData ? (
              // Prefer server-rendered HTML when available
              priceData.renderHtml ? (
                <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: priceData.renderHtml }} />
              ) : (
                <div>
                  <h4 className="font-semibold mb-2">요약 예측 결과</h4>
                  <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded border">{JSON.stringify(priceData, null, 2)}</pre>
                </div>
              )
            ) : (
              !priceLoading && <p className="text-sm text-gray-600">일정 데이터를 불러오면 요약 예측을 시도합니다.</p>
            )}
          </div>
        ) : (
          <div className={`overflow-y-auto ${selectedTab === "검색" ? "h-[calc(100vh-287px)]" : "h-full"}`}>
            {currentList.map((place) => <PlaceItem key={place.placeId} place={place} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceRecommendations;