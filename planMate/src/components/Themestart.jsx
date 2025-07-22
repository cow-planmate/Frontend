import { useState } from "react";
import { useApiClient } from "../assets/hooks/useApiClient";

export default function Themestart({
  isOpen = false,
  onClose = () => {},
  onThemeOpen = () => {},
  selectedThemeKeywords = {},
}) {
  const [showThemes, setShowThemes] = useState(false);
  const { post } = useApiClient();
  const categoryMap = {
    0: "관광지",
    1: "식당",
    2: "숙소",
  };

  if (!isOpen) return null;
  const savePreferredTheme = async () => {
    try {
      const selectedIds = Object.values(selectedThemeKeywords)
        .flat()
        .map((item) => item.preferredThemeId); // ID만 추출

      await post("/api/user/preferredTheme", {
        preferredThemeIds: selectedIds,
      });

      onClose();
    } catch (err) {
      console.error("선호 테마 저장 실패:", err);
    }
  };

  const getThemeSelectionText = () => {
    const totalSelected = Object.values(selectedThemeKeywords).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    return totalSelected === 0 ? "선호테마 선택하기" : "선호테마 수정하기";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 font-pretendard">
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          끌리는 여행 키워드를 골라주세요!
        </h1>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-[16rem]">
            <div
              className="relative"
              onMouseEnter={() => setShowThemes(true)}
              onMouseLeave={() => setShowThemes(false)}
            >
              <button className="text-sm text-main cursor-pointer hover:underline">
                선택된 테마
              </button>
              {showThemes &&
                Object.values(selectedThemeKeywords).some(
                  (arr) => arr.length > 0
                ) && (
                  <div className="absolute top-6 left-0 bg-white border rounded-lg shadow-lg p-3 whitespace-nowrap z-10">
                    <div className="text-sm space-y-1">
                      {Object.entries(selectedThemeKeywords).map(
                        ([categoryId, keywords]) =>
                          keywords.length > 0 ? (
                            <div key={categoryId}>
                              <strong>{categoryMap[categoryId]}:</strong>{" "}
                              {keywords
                                .map((k) => k.preferredThemeName)
                                .join(", ")}
                            </div>
                          ) : null
                      )}
                    </div>
                  </div>
                )}
            </div>

            <button
              className="bg-main text-white text-sm rounded-md py-1"
              onClick={savePreferredTheme}
            >
              완료
            </button>
          </div>

          <button
            onClick={onThemeOpen}
            className={`w-full py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
              Object.values(selectedThemeKeywords).some((arr) => arr.length > 0)
                ? "bg-main text-white border-main"
                : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {getThemeSelectionText()}
          </button>
        </div>
      </div>
    </div>
  );
}
