import { useState } from "react";
import PlaceItem from "./PlaceItem";

const PlaceRecommendations = ({ 
  places, 
  onPlacesUpdate 
}) => {
  const [selectedTab, setSelectedTab] = useState("관광지");

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