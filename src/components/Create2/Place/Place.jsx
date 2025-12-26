import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import { useApiClient } from "../../../hooks/useApiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import LoadingRing from "../../../assets/imgs/ring-resize.svg?react";

import usePlacesStore from "../../../store/Places";

import PlaceItem from "./PlaceItem";

export default function Place() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { get } = useApiClient();

  const { search, setAddSearch, setAddNext } = usePlacesStore();
  const store = usePlacesStore();

  const buttonColor = { 
    tour: "lime-700", 
    lodging: "orange-700", 
    restaurant: "blue-700", 
    weather: "cyan-700",
    search: "gray-700" 
  };

  const koreanName = {
    tour: "관광지",
    lodging: "숙소", 
    restaurant: "식당", 
    weather: "날씨",
    search: "검색" 
  }

  const [selectedTab, setSelectedTab] = useState("tour");
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);

  const currentPlaces =
    selectedTab === "weather"
      ? []
      : store[selectedTab] ?? [];

  const doSearch = async () => {
    const q = searchText.trim();
    if (!q || !id) return;
    try {
      setSearchLoading(true);
      const res = await get(`${BASE_URL}/api/plan/${id}/place/${encodeURIComponent(q)}`);
      const newSearchList = Array.isArray(res?.places) ? res.places : [];
      const nextPageTokens = res.nextPageTokens;
      console.log(nextPageTokens);
      setAddSearch({
        search: newSearchList,
        searchNext: nextPageTokens,
      })
    } catch (err) {
      console.error("검색 실패:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleNext = async () => {
    const currentTab = selectedTab;
    const nextPageTokens = store[`${currentTab}Next`];

    try {
      setNextLoading(true);
      const res = await get(`${BASE_URL}/api/plan/nextplace/${nextPageTokens}`)
      setAddNext(currentTab, res.places, res.nextPageTokens);
    } catch (err) {
      console.error("실패!", err);
    } finally {
      setNextLoading(false);
    }
  }

  return (
    <div className="flex-1 h-full">
      <div className="flex space-x-1 overflow-x-auto">
        {["tour", "lodging", "restaurant", "weather", "search"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t-lg text-nowrap ${
              selectedTab === tab
                ? `bg-${buttonColor[tab]} text-white`
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {koreanName[tab]}
          </button>
        ))}
      </div>
      <div className="h-[calc(100vh-228px)] border border-gray-300 rounded-lg rounded-tl-none divide-y divide-gray-300">
        {selectedTab === "search" && (
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
        <div className={`overflow-y-auto divide-y divide-gray-300 ${selectedTab === "search" ? "h-[calc(100vh-288px)]" : "h-full"}`}>
          {selectedTab === "weather" ? (
            <>안녕하세요</>
          ) : (
            <>
              {currentPlaces?.map((place) => (
                <PlaceItem
                  key={place.placeId}
                  place={place}
                />
              ))}
              {(selectedTab !== "search" || search.length !== 0) && (
                <div className="text-center py-3">
                  <button 
                    className="text-3xl text-main hover:text-mainDark"
                    onClick={handleNext}
                  >
                    {nextLoading ? <LoadingRing className="w-[30px]"/>
                    : <FontAwesomeIcon icon={faCirclePlus} />}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}