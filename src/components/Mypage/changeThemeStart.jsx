import { useApiClient } from "../../hooks/useApiClient";

export default function Themestart({
  isOpen,
  onClose,
  onThemeOpen,
  selectedThemeKeywords = {},
  onComplete,
}) {
  const { patch } = useApiClient();
  const categoryMap = {
    0: "관광지",
    1: "숙소",
    2: "식당",
  };
  const BASE_URL = import.meta.env.VITE_API_URL;

  if (!isOpen) return null;

  const changePreferredTheme = async () => {
    try {
      const selectedData = Object.values(selectedThemeKeywords)
        .flat()
        .reduce((acc, item) => {
          const categoryId = item.preferredThemeCategoryId;
          const themeId = item.preferredThemeId;

          if (!acc[categoryId]) {
            acc[categoryId] = [];
          }
          acc[categoryId].push(themeId);
          return acc;
        }, {});

      // 구조 확인
      console.log("grouped:", selectedData);

      const finalData = Object.entries(selectedData).map(
        ([categoryId, themeIds]) => ({
          preferredThemeCategoryId: parseInt(categoryId),
          preferredThemeIds: themeIds,
        })
      );

      console.log("보낼 데이터:", finalData);

      for (const data of finalData) {
        await patch(`${BASE_URL}/api/user/preferredThemes`, data);
      }
      onClose();
      if (onComplete) {
        const themesArray = Object.values(selectedThemeKeywords).flat();
        onComplete(themesArray);
      }
    } catch (err) {
      console.error("선호 테마 저장 실패:", err);
    }
  };

  const getThemeSelectionText = () => {
    const totalSelected = Object.values(selectedThemeKeywords).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    return totalSelected === 0 ? "선호테마 선택하기" : "선호테마 재선택하기";
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 font-pretendard"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          선호 테마 변경
        </h1>

        <div className="space-y-4">
          {Object.values(selectedThemeKeywords).some(
            (arr) => arr.length > 0
          ) && (
            <div className="p-3 border bg-gray-100 border-blue-200 rounded-xl text-sm font-medium text-gray-600 shadow-sm">
              <div className="text-sm font-bold mb-2 text-gray-800">
                선택된 테마
              </div>
              <div className="space-y-1 text-sm">
                {Object.entries(selectedThemeKeywords).map(
                  ([categoryId, keywords]) =>
                    keywords.length > 0 ? (
                      <div key={categoryId} className="flex flex-wrap  gap-1">
                        <span className="font-bold text-gray-700">
                          {categoryMap[categoryId]}:
                        </span>
                        <span className="font-semibold text-gray-700">
                          {keywords.map((k) => k.preferredThemeName).join(", ")}
                        </span>
                      </div>
                    ) : null
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onThemeOpen}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-colors ${
                Object.values(selectedThemeKeywords).some(
                  (arr) => arr.length > 0
                )
                  ? "bg-main text-white border-main"
                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {getThemeSelectionText()}
            </button>
            <button
              onClick={changePreferredTheme}
              className="bg-main text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-main/90 transition-colors"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
