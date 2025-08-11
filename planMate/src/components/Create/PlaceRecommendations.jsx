import { useEffect, useState } from "react";
import PlaceItem from "./PlaceItem";

const PlaceRecommendations = ({ 
  places,
  schedule,
  onPlacesUpdate 
}) => {
  const [selectedTab, setSelectedTab] = useState("관광지");

  useEffect(() => {
    const filteredSchedule = {};

    for (const dayKey in places) {
      const arr = places[dayKey];
      const uniqueArr = Array.from(
        new Map(arr.map(item => [item.placeId, item])).values()
      );
      filteredSchedule[dayKey] = uniqueArr;
    }

    if (JSON.stringify(filteredSchedule) !== JSON.stringify(places)) {
      onPlacesUpdate(filteredSchedule);
    }
  }, [places]);

  useEffect(() => {
    // 1. schedule에서 모든 placeId 추출
    const scheduledPlaceIds = Object.values(schedule)
      .flat()
      .map(item => item.placeId);
    console.log(scheduledPlaceIds)

    // 2. places에서 해당 placeId가 없는 항목만 필터링
    const updatedPlaces = Object.fromEntries(
      Object.entries(places).map(([category, placeList]) => [
        category,
        placeList.filter(place => !scheduledPlaceIds.includes(place.placeId))
      ])
    );
    console.log(updatedPlaces)

    // 3. 상태 업데이트
    onPlacesUpdate(updatedPlaces);
  }, [schedule]);

  return (
    <div className="flex-1">
      <div className="flex space-x-1">
        {["관광지", "숙소", "식당"].map((tab) => (
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

      <div className="border border-gray-300 rounded-lg rounded-tl-none h-[calc(100vh-229px)] overflow-y-auto">
        {places[selectedTab].map((place) => (
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