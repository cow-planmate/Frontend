import React, { useState } from "react";
import img1 from "../assets/imgs/img1.jpg";
import Navbar from "../components/navbar";
import DateRangeModal from "../components/HomeCal";
import PersonCountModal from "../components/HomePerson";
import TransportModal from "../components/TransportModal";
import DepartureModal from "../components/Departure"; // 출발지와 여행지에 같은 컴포넌트 사용
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLocationDot,
  faCalendar,
  faCar,
  faBus,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function App() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPersonCountOpen, setIsPersonCountOpen] = useState(false);
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  const [personCount, setPersonCount] = useState({ adults: 0, children: 0 });
  const [selectedTransport, setSelectedTransport] = useState("bus");
  const [departureLocation, setDepartureLocation] = useState(null); // 출발지 상태를 객체로 변경
  const [destinationLocation, setDestinationLocation] = useState(null); // 여행지 상태 추가
  const [isDestinationOpen, setIsDestinationOpen] = useState(false); // 여행지 모달 상태 추가
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

  // 출발지 관련 함수들
  const handleDepartureOpen = () => {
    setIsDepartureOpen(true);
  };

  const handleDepartureClose = () => {
    setIsDepartureOpen(false);
  };

  const handleDepartureLocationSelect = (location) => {
    setDepartureLocation(location);
  };

  const handleDestinationLocationSelect = (location) => {
    setDestinationLocation(location);
  };

  // 여행지 관련 함수들
  const handleDestinationOpen = () => {
    setIsDestinationOpen(true);
  };

  const handleDestinationClose = () => {
    setIsDestinationOpen(false);
  };

  const handleCalendarOpen = () => {
    setIsCalendarOpen(true);
  };

  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };

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

  const handleTransportOpen = () => {
    setIsTransportOpen(true);
  };

  const handleTransportClose = () => {
    setIsTransportOpen(false);
  };

  const handleTransportChange = (transport) => {
    setSelectedTransport(transport);
  };

  const getTransportIcon = () => {
    return selectedTransport === "car" ? faCar : faBus;
  };

  const getTransportText = () => {
    return selectedTransport === "car" ? "자동차" : "대중교통";
  };

  return (
    <div className="absolute pr-0 pl-0 right-0 left-0">
      <div className="text-center h-auto font-pretendard">
        <Navbar isLogin={false} />
      </div>

      <div className="flex flex-col items-center ">
        <img src={img1} className=" w-[140rem] h-[38rem] object-cover" />
      </div>

      <div className="absolute bottom-[5rem] left-0 right-0 px-8">
        <div className="w-full max-w-7xl min-w-[1000px] mx-auto">
          <div className="font-pretendard text-white text-5xl font-bold text-left">
            <div className="mb-4">나다운, 우리다운</div>
            <div>여행의 시작</div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-20 left-0 right-0 px-8 pb-0">
        <div className="w-full max-w-[90rem] min-w-[1000px] bg-white rounded-xl shadow-2xl p-6 mb-6 mx-auto">
          <div className="grid grid-cols-6 gap-[18px] items-end min-w-[900px]">
            <div className="block min-w-[130px] relative">
              <label className="text-gray-600 text-sm mb-1 font-pretendard whitespace-nowrap block">
                출발지
              </label>
              <input
                type="text"
                className="border-b-2 border-gray-300 pb-2 focus:border-blue-500 font-pretendard focus:outline-none w-full pr-8 cursor-pointer"
                placeholder="출발지 입력"
                value={departureLocation ? departureLocation.name : ""}
                onClick={handleDepartureOpen}
                readOnly
              />
              <button
                className="absolute right-0 bottom-2"
                onClick={handleDepartureOpen}
              >
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-gray-400"
                />
              </button>
            </div>

            <div className="block min-w-[130px] relative">
              <label className="text-gray-600 text-sm mb-1 font-pretendard whitespace-nowrap block">
                여행지
              </label>
              <input
                type="text"
                className="font-pretendard border-b-2 border-gray-300 pb-2 focus:border-blue-500 focus:outline-none w-full pr-8 cursor-pointer"
                placeholder="여행지 입력"
                value={destinationLocation ? destinationLocation.name : ""}
                onClick={handleDestinationOpen}
                readOnly
              />
              <button
                className="absolute right-0 bottom-2"
                onClick={handleDestinationOpen}
              >
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-gray-400"
                />
              </button>
            </div>

            <div className="block min-w-[130px] relative">
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

            <div className="block min-w-[130px] relative">
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

            <div className="block min-w-[130px] relative">
              <label className="text-gray-600 text-sm mb-1 font-pretendard whitespace-nowrap block">
                이동수단
              </label>
              <input
                type="text"
                className="font-pretendard border-b-2 border-gray-300 pb-2 focus:border-blue-500 focus:outline-none w-full pr-8 cursor-pointer"
                placeholder="이동수단 선택"
                value={getTransportText()}
                onClick={handleTransportOpen}
                readOnly
              />
              <button
                className="absolute right-0 bottom-2"
                onClick={handleTransportOpen}
              >
                <FontAwesomeIcon
                  icon={getTransportIcon()}
                  className="text-gray-400"
                />
              </button>
            </div>

            <div className="block min-w-[160px]">
              <Link to="/Create">
                <button
                  className="cursor-pointer transition-all bg-[#1344FF] text-white px-4 py-3 rounded-lg
            border-[#1344FF] active:translate-y-[2px] hover:bg-blue-600 shadow-lg w-full font-pretendard whitespace-nowrap"
                >
                  일정생성
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <DateRangeModal
        isOpen={isCalendarOpen}
        onClose={handleCalendarClose}
        dateRange={dateRange}
        onDateChange={handleDateChange}
      />

      <PersonCountModal
        isOpen={isPersonCountOpen}
        onClose={handlePersonCountClose}
        personCount={personCount}
        onPersonCountChange={handlePersonCountChange}
      />

      <TransportModal
        isOpen={isTransportOpen}
        onClose={handleTransportClose}
        selectedTransport={selectedTransport}
        onTransportChange={handleTransportChange}
      />

      <DepartureModal
        isOpen={isDepartureOpen}
        onClose={handleDepartureClose}
        onLocationSelect={handleDepartureLocationSelect}
        title="출발지 검색"
        placeholder="출발지를 입력해주세요"
      />

      <DepartureModal
        isOpen={isDestinationOpen}
        onClose={handleDestinationClose}
        onLocationSelect={handleDestinationLocationSelect}
        title="여행지 검색"
        placeholder="여행지를 입력해주세요"
      />
    </div>
  );
}

export default App;
