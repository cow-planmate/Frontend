import useState from "react";
export default function Themestart({ onThemeOpen, selectedThemeKeywords }) {
  const [showThemes, setShowThemes] = useState(false);
  const getThemeSelectionText = () => {
    if (!selectedThemeKeywords) return "선호테마 선택하기";
    const totalSelected =
      selectedThemeKeywords.tourist.length +
      selectedThemeKeywords.accommodation.length +
      selectedThemeKeywords.restaurant.length;

    if (totalSelected === 0) {
      return "선호테마 선택하기";
    }
    return `선호테마 선택완료 (${totalSelected}개)`;
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 text-left">
            선호테마
          </label>
          <div
            className="relative"
            onMouseEnter={() => setShowThemes(true)}
            onMouseLeave={() => setShowThemes(false)}
          >
            <button
              type="button"
              className="text-xs border border-gray-300 px-2 py-0.5 rounded-md text-gray-600 hover:bg-gray-100"
            >
              보기
            </button>
            {showThemes &&
              selectedThemeKeywords &&
              (selectedThemeKeywords.tourist.length > 0 ||
                selectedThemeKeywords.accommodation.length > 0 ||
                selectedThemeKeywords.restaurant.length > 0) && (
                <div className="absolute bottom-full right-0 mb-1 w-max max-w-xs bg-white p-3 border border-gray-200 rounded-lg shadow-xl z-10">
                  <div className="text-xs text-gray-700 text-left space-y-1">
                    {selectedThemeKeywords.tourist.length > 0 && (
                      <p>
                        <strong>관광지:</strong>{" "}
                        {selectedThemeKeywords.tourist.join(", ")}
                      </p>
                    )}
                    {selectedThemeKeywords.accommodation.length > 0 && (
                      <p>
                        <strong>숙소:</strong>{" "}
                        {selectedThemeKeywords.accommodation.join(", ")}
                      </p>
                    )}
                    {selectedThemeKeywords.restaurant.length > 0 && (
                      <p>
                        <strong>식당:</strong>{" "}
                        {selectedThemeKeywords.restaurant.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
        <button
          type="button"
          onClick={onThemeOpen}
          className={`w-full py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
            selectedThemeKeywords &&
            (selectedThemeKeywords.tourist.length > 0 ||
              selectedThemeKeywords.accommodation.length > 0 ||
              selectedThemeKeywords.restaurant.length > 0)
              ? "bg-main text-white border-main"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
        >
          {getThemeSelectionText()}
        </button>
      </div>
    </div>
  );
}
