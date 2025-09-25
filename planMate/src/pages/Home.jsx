import React, { useState } from "react";
import img1 from "../assets/imgs/img1.jpg";
import { useApiClient } from "../assets/hooks/useApiClient";
import Navbar from "../components/Navbar";
import DateRangeModal from "../components/HomeCal";
import PersonCountModal from "../components/HomePerson";
import TransportModal from "../components/TransportModal";
import DepartureModal from "../components/Departure";
import DestinationModal from "../components/HomeDestination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLocationDot,
  faCalendar,
  faCar,
  faBus,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import usePlanStore from "../store/Plan";
function App() {
  const navigate = useNavigate();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPersonCountOpen, setIsPersonCountOpen] = useState(false);
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  const [personCount, setPersonCount] = useState({ adults: 0, children: 0 });
  const [selectedTransport, setSelectedTransport] = useState("bus");
  const [departureLocation, setDepartureLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const { setPlanField, setPlanAll } = usePlanStore();

  const { post, isAuthenticated } = useApiClient();

  const handleDateChange = (item) => {
    setDateRange([item.selection]);
  };

  const formatDateRange = () => {
    const start = dateRange[0].startDate.toLocaleDateString("ko-KR");
    const end = dateRange[0].endDate.toLocaleDateString("ko-KR");
    return `${start} ~ ${end}`;
  };

  const handleDepartureOpen = () => {
    setIsDepartureOpen(true);
  };

  const handleDepartureClose = () => {
    setIsDepartureOpen(false);
  };

  const handleDepartureLocationSelect = (location) => {
    console.log("선택된 출발지:", location); // 디버깅용
    setDepartureLocation(location);
    setPlanField("departure", location.name);
  };

  const handleDestinationLocationSelect = (location) => {
    setDestinationLocation(location);
    setPlanField("travelName", location.name);
    setPlanField("travelId", location.id);
  };

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
    setPlanField("adultCount", count.adults);
    setPlanField("childCount", count.children);
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
    setPlanField("transportationCategoryId", transportId);
  };

  const getTransportIcon = () => {
    return selectedTransport === "car" ? faCar : faBus;
  };

  const getTransportText = () => {
    return selectedTransport === "car" ? "자동차" : "대중교통";
  };
  const formatDateForApi = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const getDatesBetween = (start, end) => {
    const dateArray = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      dateArray.push(new Date(currentDate)); // 날짜 복사
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
  };

  const makePlan = async () => {
    try {
      if (
        !departureLocation ||
        !destinationLocation ||
        !dateRange[0].startDate ||
        !dateRange[0].endDate ||
        personCount.adults + personCount.children === 0
      ) {
        alert("입력되지 않은 값이 있습니다");
        return;
      }

      const allDates = getDatesBetween(
        dateRange[0].startDate,
        dateRange[0].endDate
      );
      const formattedDates = allDates.map((date) => formatDateForApi(date));

      // 전역 상태에 모든 데이터 저장
      setPlanAll({
        planName: "", // 필요시 기본값 설정
        travelCategoryName: destinationLocation.categoryName || "",
        travelName: destinationLocation.name,
        travelId: destinationLocation.id,
        departure: departureLocation.name,
        transportationCategoryId: selectedTransport === "car" ? 1 : 0,
        adultCount: Number(personCount.adults),
        childCount: Number(personCount.children),
      });

      if (isAuthenticated()) {
        const requestData = {
          departure: departureLocation.name,
          travelId: destinationLocation.id,
          dates: formattedDates,
          adultCount: Number(personCount.adults),
          childCount: Number(personCount.children),
          transportation: selectedTransport === "car" ? 1 : 0,
        };

        const BASE_URL = import.meta.env.VITE_API_URL;
        console.log("보내는 데이터:", requestData);

        const data = await post(`${BASE_URL}/api/plan`, requestData);
        console.log("서버 응답:", data);

        if (data && data.planId) {
          navigate(`/create?id=${data.planId}`);
        }
      } else {
        navigate(`/create2`);
      }
    } catch (err) {
      console.error("에러, 다시시도해주세요", err);
      alert("에러, 다시시도 해주세요");
    }
  };
  return (
    <div className="relative pr-0 pl-0 right-0 left-0">
      <div className="text-center h-auto font-pretendard">
        <Navbar isLogin={false} />
      </div>

      <div className=" flex flex-col items-center ">
        <img
          src={img1}
          className=" w-screen [140rem] h-[40rem] object-cover bg-gradient-to-b "
        />
        <div className="absolute top-[5rem] max-h-[40rem] inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none"></div>{" "}
      </div>

      <div className="absolute bottom-[5rem] left-0 right-0 px-8">
        <div className="w-full max-w-7xl min-w-[1000px] mx-auto">
          <div className="font-pretendard text-white text-5xl font-bold text-left ">
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
              <button
                className="cursor-pointer transition-all bg-[#1344FF] text-white px-4 py-3 rounded-lg
            border-[#1344FF] active:translate-y-[2px] hover:bg-blue-600 shadow-lg w-full font-pretendard whitespace-nowrap"
                onClick={makePlan}
              >
                일정생성
              </button>
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

      <DestinationModal
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
