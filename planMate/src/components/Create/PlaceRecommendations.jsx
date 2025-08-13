import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PlaceItem from "./PlaceItem";
// 네 프로젝트 경로 기준으로 조정 (Create/ 아래면 ../../)
import { useApiClient } from "../../assets/hooks/useApiClient";

const PlaceRecommendations = ({ 
  places,
  schedule,
  onPlacesUpdate 
}) => {
  const [selectedTab, setSelectedTab] = useState("관광지");

  // 🔎 검색 탭용 상태
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // plan id 가져오기 (?id=60 형태)
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  // API 클라이언트
  const { post } = useApiClient();

  // ✅ places 중복 제거 (placeId 기준)
  useEffect(() => {
    if (!places) return;
    const filtered = {};
    let changed = false;

    for (const key in places) {
      const arr = Array.isArray(places[key]) ? places[key] : [];
      const uniqueArr = Array.from(new Map(arr.map(item => [item.placeId, item])).values());
      filtered[key] = uniqueArr;
      if (uniqueArr.length !== arr.length) changed = true;
    }

    if (changed) onPlacesUpdate(filtered);
  }, [places, onPlacesUpdate]);

  // ✅ schedule에 포함된 placeId는 추천에서 제거
  useEffect(() => {
    if (!schedule || !places) return;

    const scheduledPlaceIds = Object.values(schedule)
      .flat()
      .map(item => item?.placeId)
      .filter(v => v != null);

    if (scheduledPlaceIds.length === 0) return;

    const updatedPlaces = Object.fromEntries(
      Object.entries(places).map(([category, placeList]) => [
        category,
        (placeList ?? []).filter(place => !scheduledPlaceIds.includes(place?.placeId))
      ])
    );

    if (JSON.stringify(updatedPlaces) !== JSON.stringify(places)) {
      onPlacesUpdate(updatedPlaces);
    }
  }, [schedule]); // 의존성 최소화

  // 🔎 검색 실행 (App.jsx 수정 없이 여기서 직접 호출)
  const doSearch = async () => {
    const q = searchText.trim();
    if (!q || !id) return;
    try {
      setSearchLoading(true);
      // 백엔드 규격: POST /api/plan/{id}/place  body: { "query": "서울역" }
      const res = await post(`/api/plan/${id}/place`, { query: q });
      const newSearchList = Array.isArray(res?.places) ? res.places : [];

      // places.검색만 덮어쓰기
      onPlacesUpdate({
        ...places,
        검색: newSearchList,
      });
    } catch (err) {
      console.error("검색 실패:", err);
      // 실패 시 검색 결과를 비우고 싶다면 아래 주석 해제
      // onPlacesUpdate({ ...places, 검색: [] });
    } finally {
      setSearchLoading(false);
    }
  };

  const currentList = Array.isArray(places?.[selectedTab]) ? places[selectedTab] : [];

  return (
    <div className="flex-1">
      <div className="flex space-x-1">
        {["관광지", "숙소", "식당", "검색"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t-lg ${
              selectedTab === tab
                ? "bg-main text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔎 검색 탭 전용 입력 UI */}
      {selectedTab === "검색" && (
        <div className="border border-gray-300 border-b-0 px-3 py-2 rounded-tl-none rounded-tr-lg">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="장소를 입력하세요 (예: 서울역)"
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

      <div className="border border-gray-300 rounded-lg rounded-tl-none h-[calc(100vh-229px)] overflow-y-auto">
        {(currentList ?? []).map((place) => (
          <PlaceItem
            key={place.placeId}
            place={place}
          />
        ))}
      </div>
    </div>
  );
};

export default PlaceRecommendations;
