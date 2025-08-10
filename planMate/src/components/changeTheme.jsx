import React, { useState, useEffect } from "react";
import { useApiClient } from "../assets/hooks/useApiClient";

export default function Theme({ isOpen, onClose, onComplete }) {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [allSelectedKeywords, setAllSelectedKeywords] = useState({});
  const [keywordsByStep, setKeywordsByStep] = useState([]);
  const [categories, setCategories] = useState([]);
  const { get } = useApiClient();
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setSelectedKeywords([]);
      setAllSelectedKeywords({});
      getPreferredTheme();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getPreferredTheme = async () => {
    try {
      const res = await get(`${BASE_URL}/api/user/preferredTheme`);
      console.log("API 응답:", res); // 디버깅용

      const themeList = res.preferredThemes || [];

      if (Array.isArray(themeList) && themeList.length > 0) {
        const categoryMap = {};
        const categorizedKeywords = [];
        const categoryList = [];

        themeList.forEach((item) => {
          const catId = item.preferredThemeCategoryId;
          const catName = item.preferredThemeCategoryName;

          if (!categoryMap[catId]) {
            categoryMap[catId] = [];
            categoryList.push({
              id: catId,
              name: catName,
            });
          }
          categoryMap[catId].push(item);
        });

        categoryList.sort((a, b) => a.id - b.id);

        categoryList.forEach((cat) => {
          categorizedKeywords.push(categoryMap[cat.id] || []);
        });

        setCategories(categoryList);
        setKeywordsByStep(categorizedKeywords);

        const initialSelected = {};
        categoryList.forEach((cat) => {
          initialSelected[cat.id] = [];
        });
        setAllSelectedKeywords(initialSelected);
      } else {
        console.error("API 응답 형식이 올바르지 않습니다:", res);
      }
    } catch (err) {
      console.error("선호 테마 가져오기 실패:", err.message);
    }
  };

  const toggleKeyword = (index) => {
    setSelectedKeywords((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : prev.length < 5
        ? [...prev, index]
        : prev
    );
  };

  const goToStep = (step) => {
    setCurrentStep(step);

    const categoryId = categories[step]?.id;
    if (!categoryId) {
      setSelectedKeywords([]);
      return;
    }

    // 이미 저장된 키워드 가져오기
    const savedKeywords = allSelectedKeywords[categoryId] || [];
    const currentStepKeywords = keywordsByStep[step] || [];

    // 저장된 키워드가 현재 step의 몇 번째 index인지 찾아서 복원
    const restoredIndexes = savedKeywords
      .map((saved) =>
        currentStepKeywords.findIndex(
          (k) => k.preferredThemeId === saved.preferredThemeId
        )
      )
      .filter((i) => i !== -1);

    setSelectedKeywords(restoredIndexes);
  };

  const nextStep = () => {
    if (categories.length === 0 || !keywordsByStep[currentStep]) return;

    const currentCategoryId = categories[currentStep].id;
    const currentStepKeywords = keywordsByStep[currentStep];
    const selected = selectedKeywords
      .map((i) => currentStepKeywords[i])
      .filter((item) => !!item);

    setAllSelectedKeywords((prev) => ({
      ...prev,
      [currentCategoryId]: selected,
    }));

    if (currentStep < categories.length - 1) {
      goToStep(currentStep + 1);
    } else {
      const final = {
        ...allSelectedKeywords,
        [currentCategoryId]: selected,
      };
      onComplete(final);
    }
  };

  const skipStep = () => {
    if (categories.length === 0) return;

    const currentCategoryId = categories[currentStep].id;
    setAllSelectedKeywords((prev) => ({
      ...prev,
      [currentCategoryId]: [],
    }));

    if (currentStep < categories.length - 1) {
      goToStep(currentStep + 1);
    } else {
      const final = {
        ...allSelectedKeywords,
        [currentCategoryId]: [],
      };
      onComplete(final);
    }
  };

  const currentKeywords = keywordsByStep[currentStep];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60] font-pretendard"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-lg font-bold text-gray-900 text-center mb-4">
          {categories.length > 0 && categories[currentStep]
            ? `좋아하는 ${categories[currentStep].name} 키워드를 선택해주세요!`
            : "로딩 중..."}
        </h1>

        <div className="flex-1 overflow-y-auto mb-4">
          <div className="grid grid-cols-3 gap-3">
            {currentKeywords && Array.isArray(currentKeywords) ? (
              currentKeywords.map((keyword, index) => (
                <button
                  key={keyword.preferredThemeId}
                  onClick={() => toggleKeyword(index)}
                  className={`rounded-lg px-2 py-2 text-sm text-gray-800 border border-gray-300 hover:bg-blue-100 transition-all ${
                    selectedKeywords.includes(index)
                      ? "bg-blue-200 border-blue-400"
                      : ""
                  }`}
                >
                  {keyword.preferredThemeName}
                </button>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                키워드를 불러오는 중...
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mb-4">
          {selectedKeywords.length}/5 선택됨
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={skipStep}
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            건너뛰기
          </button>

          <div className="flex space-x-2">
            {currentStep > 0 && (
              <button
                onClick={() => goToStep(currentStep - 1)} // ✅ 변경
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                이전
              </button>
            )}
            <button
              onClick={nextStep}
              className="px-4 py-2 rounded-lg bg-main text-white hover:bg-blue-700"
            >
              {currentStep === categories.length - 1 ? "완료" : "다음"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
