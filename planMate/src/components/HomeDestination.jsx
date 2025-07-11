import React, { useState } from "react";

export default function LocationModal({
  isOpen,
  onClose,
  onLocationChange,
  modalType, // "departure" 또는 "destination"
}) {
  const [selectedUpperRegion, setSelectedUpperRegion] = useState("");
  const [selectedLowerRegion, setSelectedLowerRegion] = useState("");

  // 임시 데이터 - 나중에 API로 대체
  const regionData = {
    상위지역: {
      서울: [
        "강남구",
        "강북구",
        "강서구",
        "관악구",
        "광진구",
        "구로구",
        "금천구",
      ],
      부산: [
        "해운대구",
        "부산진구",
        "동래구",
        "남구",
        "북구",
        "사하구",
        "연제구",
      ],
      대전: ["유성구", "서구", "중구", "대덕구", "동구"],
      대구: ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구"],
      광주: ["동구", "서구", "남구", "북구", "광산구"],
      울산: ["중구", "남구", "동구", "북구", "울주군"],
      세종: ["세종시"],
    },
    하위지역: {
      인천: [
        "중구",
        "동구",
        "미추홀구",
        "연수구",
        "남동구",
        "부평구",
        "계양구",
      ],
      제주: ["제주시", "서귀포시"],
      경기: [
        "수원시",
        "성남시",
        "용인시",
        "안양시",
        "안산시",
        "과천시",
        "광명시",
      ],
      충북: [
        "청주시",
        "충주시",
        "제천시",
        "보은군",
        "옥천군",
        "영동군",
        "진천군",
      ],
      충남: [
        "천안시",
        "공주시",
        "보령시",
        "아산시",
        "서산시",
        "논산시",
        "계룡시",
      ],
      강원: [
        "춘천시",
        "원주시",
        "강릉시",
        "동해시",
        "태백시",
        "속초시",
        "삼척시",
      ],
      경북: [
        "포항시",
        "경주시",
        "김천시",
        "안동시",
        "구미시",
        "영주시",
        "영천시",
      ],
      전남: [
        "목포시",
        "여수시",
        "순천시",
        "나주시",
        "광양시",
        "담양군",
        "곡성군",
      ],
      경남: [
        "창원시",
        "진주시",
        "통영시",
        "사천시",
        "김해시",
        "밀양시",
        "거제시",
      ],
      전북: [
        "전주시",
        "군산시",
        "익산시",
        "정읍시",
        "남원시",
        "김제시",
        "완주군",
      ],
    },
  };

  if (!isOpen) return null;

  const handleUpperRegionClick = (region) => {
    setSelectedUpperRegion(region);
    setSelectedLowerRegion(""); // 상위 지역 변경 시 하위 지역 초기화
  };

  const handleLowerRegionClick = (region) => {
    setSelectedLowerRegion(region);
  };

  const handleConfirm = () => {
    if (selectedUpperRegion && selectedLowerRegion) {
      onLocationChange(`${selectedUpperRegion} ${selectedLowerRegion}`);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedUpperRegion("");
    setSelectedLowerRegion("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl w-[500px] mx-4 max-h-[600px] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="여행지를 입력해주세요"
              className="border border-gray-300 rounded-lg px-3 py-2 w-80 font-pretendard focus:outline-none focus:border-blue-500"
            />
            <button className="text-gray-400 hover:text-gray-600">🔍</button>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-4 max-h-[450px] overflow-y-auto">
          {/* 상위 지역 선택 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 font-pretendard">
              1. 상위 지역 선택
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(regionData.상위지역).map((region) => (
                <button
                  key={region}
                  onClick={() => handleUpperRegionClick(region)}
                  className={`px-4 py-2 rounded-full text-sm font-pretendard transition-colors ${
                    selectedUpperRegion === region
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* 하위 지역 선택 */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 font-pretendard">
              2. 하위 지역 선택
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(regionData.하위지역).map((region) => (
                <button
                  key={region}
                  onClick={() => handleUpperRegionClick(region)}
                  className={`px-4 py-2 rounded-full text-sm font-pretendard transition-colors ${
                    selectedUpperRegion === region
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* 선택된 상위 지역의 하위 지역들 */}
          {selectedUpperRegion && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 font-pretendard">
                {selectedUpperRegion} 세부 지역
              </h4>
              <div className="flex flex-wrap gap-2">
                {(
                  regionData.상위지역[selectedUpperRegion] ||
                  regionData.하위지역[selectedUpperRegion] ||
                  []
                ).map((subRegion) => (
                  <button
                    key={subRegion}
                    onClick={() => handleLowerRegionClick(subRegion)}
                    className={`px-4 py-2 rounded-full text-sm font-pretendard transition-colors ${
                      selectedLowerRegion === subRegion
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {subRegion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 완료 버튼 */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleConfirm}
            disabled={!selectedUpperRegion || !selectedLowerRegion}
            className={`w-full py-3 rounded-lg font-pretendard transition-colors ${
              selectedUpperRegion && selectedLowerRegion
                ? "bg-[#1344FF] text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
