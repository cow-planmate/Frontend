import { useState } from "react";
import { SidebarItem } from "./SidebarItem";
import { useApiClient } from "../../../hooks/useApiClient";
import usePlacesStore from "../../../store/Places";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingRing from "../../../assets/imgs/ring-resize.svg?react";

export default function Sidebar({
  planId,
  isMobile,
  showSidebar,
  handleMobileAdd,
}) {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { get } = useApiClient();
  const store = usePlacesStore();
  const { search, setAddSearch, setAddNext } = store;

  const [selectedTab, setSelectedTab] = useState("tour");
  const [searchText, setSearchText] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);

  const tabSelectedClass = {
    tour: "bg-lime-700 text-white",
    lodging: "bg-orange-700 text-white",
    restaurant: "bg-blue-700 text-white",
    custom: "bg-violet-700 text-white",
    search: "bg-gray-700 text-white",
  };
  const koreanName = {
    tour: "관광지",
    lodging: "숙소",
    restaurant: "식당",
    custom: "직접 추가",
    search: "검색",
  };

  const [customPlaces, setCustomPlaces] = useState([]);
  const [customPlaceName, setCustomPlaceName] = useState("");

  const currentPlaces =
    selectedTab === "weather"
      ? []
      : selectedTab === "custom"
        ? customPlaces
        : (store[selectedTab] ?? []);

  const createCustomPlace = (name) => ({
    placeId: `custom-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: name.trim(),
    categoryId: 3,
    formatted_address: "",
    rating: null,
    url: "",
    iconUrl:
      "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png",
  });

  const handleCustomAdd = () => {
    const name = customPlaceName.trim();
    if (!name) return;
    setCustomPlaces((prev) => [...prev, createCustomPlace(name)]);
    setCustomPlaceName("");
  };

  const removeCustomPlace = (placeId) => {
    setCustomPlaces((prev) => prev.filter((p) => p.placeId !== placeId));
  };

  const doSearch = async () => {
    const q = searchText.trim();
    if (!q || !planId) return;
    try {
      setSearchLoading(true);
      const res = await get(
        `${BASE_URL}/api/plan/${planId}/place/${encodeURIComponent(q)}`,
      );
      setAddSearch({
        search: Array.isArray(res?.places) ? res.places : [],
        searchNext: res.nextPageTokens,
      });
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
      const res = await get(`${BASE_URL}/api/plan/nextplace/${nextPageTokens}`);
      setAddNext(currentTab, res.places, res.nextPageTokens);
    } catch (err) {
      console.error("실패!", err);
    } finally {
      setNextLoading(false);
    }
  };

  return (
    <div
      className={`flex-1 w-full flex flex-col min-h-0 overflow-hidden transition-transform duration-300 absolute inset-0 md:relative md:transform-none z-20 
      ${showSidebar ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
    >
      <div className="flex space-x-1 overflow-x-auto shrink-0">
        {["tour", "lodging", "restaurant", "custom", "search"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t-lg text-nowrap ${
              selectedTab === tab
                ? tabSelectedClass[tab]
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {koreanName[tab]}
          </button>
        ))}
      </div>
      <div className="flex-1 min-h-0 flex flex-col border border-gray-300 rounded-lg rounded-tl-none divide-y divide-gray-300 md:min-h-0">
        {selectedTab === "search" && (
          <div className="px-3 py-2 shrink-0">
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
                className="px-4 py-2 rounded-md bg-main text-white font-semibold disabled:opacity-60 hover:bg-mainDark"
                onClick={doSearch}
                disabled={searchLoading}
              >
                {searchLoading ? "검색 중..." : "검색"}
              </button>
            </div>
          </div>
        )}
        {selectedTab === "custom" && (
          <div className="px-3 py-2 border-b border-gray-300 shrink-0">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="장소 이름을 입력하세요"
                className="flex-1 border rounded-md px-3 py-2 border-gray-300"
                value={customPlaceName}
                onChange={(e) => setCustomPlaceName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCustomAdd();
                }}
              />
              <button
                className="px-4 py-2 rounded-md bg-violet-600 text-white font-semibold hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleCustomAdd}
                disabled={!customPlaceName.trim()}
              >
                추가
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              리스트에 추가된 뒤 드래그하여 시간표에 넣을 수 있습니다.
            </p>
          </div>
        )}
        <div
          className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden divide-y divide-gray-300`}
        >
          {currentPlaces?.map((place) => (
            <SidebarItem
              key={place.placeId}
              place={place}
              isMobile={isMobile}
              onMobileAdd={() => handleMobileAdd(place)}
              onDelete={
                selectedTab === "custom"
                  ? () => removeCustomPlace(place.placeId)
                  : undefined
              }
            />
          ))}
          {selectedTab === "custom" && customPlaces.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              위 입력란에 장소 이름을 입력한 뒤 &quot;추가&quot; 버튼을 누르면
              리스트에 추가됩니다. 추가된 항목을 드래그하여 시간표에 넣어보세요.
            </div>
          )}
          {selectedTab !== "custom" &&
            (selectedTab !== "search" || search.length !== 0) && (
              <div className="text-center py-3">
                <button
                  className="text-3xl text-main hover:text-mainDark"
                  onClick={handleNext}
                >
                  {nextLoading ? (
                    <LoadingRing className="w-[30px]" />
                  ) : (
                    <FontAwesomeIcon icon={faCirclePlus} />
                  )}
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
