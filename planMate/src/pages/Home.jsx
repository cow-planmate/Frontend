import React, { useState } from "react";
import img1 from "../assets/imgs/img1.jpg";
import Navbar from "../components/Navbar";
import DateRangeModal from "../components/HomeCal";
import PersonCountModal from "../components/HomePerson"; // 새로 만든 컴포넌트 import
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLocationDot,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function App() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPersonCountOpen, setIsPersonCountOpen] = useState(false); // 인원수 모달 상태
  const [personCount, setPersonCount] = useState({ adults: 0, children: 0 }); // 인원수 상태
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleDateChange = (item) => {
    setDateRange([item.selection]);
  };

  const formatDateRange = () => {
    const start = dateRange[0].startDate.toLocaleDateString("ko-KR");
    const end = dateRange[0].endDate.toLocaleDateString("ko-KR");
    return `${start} ~ ${end}`;
  };

  const handleCalendarOpen = () => {
    setIsCalendarOpen(true);
  };

  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };

  // 인원수 모달 관련 함수들
  const handlePersonCountOpen = () => {
    setIsPersonCountOpen(true);
  };

  const handlePersonCountClose = () => {
    setIsPersonCountOpen(false);
  };

  const handlePersonCountChange = (count) => {
    setPersonCount(count);
  };

  const formatPersonCount = () => {
    const total = personCount.adults + personCount.children;
    if (total === 0) return "인원수 선택";
    return `성인 ${personCount.adults}명, 어린이 ${personCount.children}명`;
  };

  return (
    <div className="absolute pr-0 pl-0 right-0 left-0">
      <div className="text-center h-auto font-pretendard">
        <Navbar isLogin={false} />
      </div>

      <div>
        <img src={img1} className="relative w-full h-[38rem] object-cover" />
        <div className="absolute bottom-[5rem] left-[14rem] font-pretendard text-white text-5xl font-bold">
          <div className="mb-4">나다운, 우리다운</div>
          <div>여행의 시작</div>
        </div>
      </div>

      <div className="absolute -bottom-20 left-0 right-0 px-8 pb-0">
        <div className="w-full max-w-7xl min-w-[1000px] bg-white rounded-xl shadow-2xl p-6 mb-6 mx-auto">
          <div className="grid grid-cols-5 gap-4 items-end min-w-[900px]">
            <div className="block min-w-[160px] relative">
              <label className="text-gray-600 text-sm mb-1 font-pretendard whitespace-nowrap block">
                출발지
              </label>
              <input
                type="text"
                className="border-b-2 border-gray-300 pb-2 focus:border-blue-500 font-pretendard focus:outline-none w-full pr-8"
                placeholder="출발지 입력"
              />
              <button className="absolute right-0 bottom-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-gray-400"
                />
              </button>
            </div>

            <div className="block min-w-[160px] relative">
              <label className="text-gray-600 text-sm mb-1 font-pretendard whitespace-nowrap block">
                여행지
              </label>
              <input
                type="text"
                className="font-pretendard border-b-2 border-gray-300 pb-2 focus:border-blue-500 focus:outline-none w-full pr-8"
                placeholder="여행지 입력"
              />
              <button className="absolute right-0 bottom-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-gray-400"
                />
              </button>
            </div>

            <div className="block min-w-[160px] relative">
              <label className="text-gray-600 text-sm mb-1 font-pretendard whitespace-nowrap block">
                기간
              </label>
              <input
                type="text"
                className="border-b-2 border-gray-300 pb-2 focus:border-blue-500 focus:outline-none w-full pr-8 cursor-pointer"
                placeholder="날짜 선택"
                value={formatDateRange()}
                onClick={handleCalendarOpen}
                readOnly
              />
              <button
                className="absolute right-0 bottom-2"
                onClick={handleCalendarOpen}
              >
                <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
              </button>
            </div>

            <div className="block min-w-[160px] relative">
              <label className="text-gray-600 text-sm mb-1 font-pretendard whitespace-nowrap block">
                인원수
              </label>
              <input
                type="text"
                className="font-pretendard border-b-2 border-gray-300 pb-2 focus:border-blue-500 focus:outline-none w-full pr-8 cursor-pointer"
                placeholder="인원수 선택"
                value={formatPersonCount()}
                onClick={handlePersonCountOpen}
                readOnly
              />
              <button
                className="absolute right-0 bottom-2"
                onClick={handlePersonCountOpen}
              >
                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
              </button>
            </div>

            <div className="block min-w-[160px]">
              <Link to="/Create">
                <button
                  className="cursor-pointer transition-all bg-[#1344FF] text-white px-8 py-3 rounded-lg
            border-[#1344FF] active:translate-y-[2px] hover:bg-blue-600 shadow-lg w-full font-pretendard whitespace-nowrap"
                >
                  일정생성
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 캘린더 모달 */}
      <DateRangeModal
        isOpen={isCalendarOpen}
        onClose={handleCalendarClose}
        dateRange={dateRange}
        onDateChange={handleDateChange}
      />

      {/* 인원수 모달 */}
      <PersonCountModal
        isOpen={isPersonCountOpen}
        onClose={handlePersonCountClose}
        personCount={personCount}
        onPersonCountChange={handlePersonCountChange}
      />
    </div>
  );
}

export default App;
