import React, { useState } from "react";

import { useApiClient } from "../hooks/useApiClient";
import Navbar from "../components/common/Navbar";
import DateRangeModal from "../components/Home/HomeCal";
import PersonCountModal from "../components/common/PersonCountModal";
import TransportModal from "../components/common/TransportModal";
import DepartureModal from "../components/common/DepartureModal";
import DestinationModal from "../components/common/LocationModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLocationDot,
  faCalendar,
  faCar,
  faBus,
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import usePlanStore from "../store/Plan";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import img1 from "../assets/imgs/img1.jpg";
import img2 from "../assets/imgs/img2.jpg";
import img3 from "../assets/imgs/img3.jpg";

function App() {
  const navigate = useNavigate();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPersonCountOpen, setIsPersonCountOpen] = useState(false);
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);

  const [personCount, setPersonCount] = useState({ adults: 0, children: 0 });
  const [selectedTransport, setSelectedTransport] = useState("bus");
  const [departureLocation, setDepartureLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const { setPlanField, setPlanAll } = usePlanStore();
  const { post, isAuthenticated } = useApiClient();

  const sliderHeightClass = "h-[18rem] sm:h-[26rem] lg:h-[45rem]";

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    arrows: true,
  };

  const handleDateChange = (item) => {
    setDateRange([item.selection]);
  };

  const formatDateRange = () => {
    const start = dateRange[0].startDate?.toLocaleDateString("ko-KR") ?? "";
    const end = dateRange[0].endDate?.toLocaleDateString("ko-KR") ?? "";
    return `${start} ~ ${end}`;
  };

  const handleDepartureLocationSelect = (location) => {
    setDepartureLocation(location);
    setPlanField("departure", location?.name ?? "");
  };

  const handleDestinationLocationSelect = (location) => {
    setDestinationLocation(location);
    setPlanField("travelName", location?.name ?? "");
    setPlanField("travelId", location?.id ?? null);
    setPlanField("travelCategoryName", location?.name ?? "");
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

  const handleTransportChange = (transport) => {
    setSelectedTransport(transport);
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
      dateArray.push(new Date(currentDate));
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

      const apiStartDate = formatDateForApi(dateRange[0].startDate);
      const apiPeriod = allDates.length;

      setPlanAll({
        planName: "",
        travelCategoryName: destinationLocation?.name || "",
        travelName: destinationLocation?.name || "",
        travelId: destinationLocation?.id || null,
        departure: departureLocation?.name || "",
        transportationCategoryId: selectedTransport === "car" ? 1 : 0,
        adultCount: Number(personCount.adults),
        childCount: Number(personCount.children),
        startDate: apiStartDate,
        period: apiPeriod,
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

        const data = await post(`${BASE_URL}/api/plan`, requestData);

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
    <div className="relative w-full">
      {/* Navbar */}
      <div className="text-center h-auto font-pretendard">
        <Navbar isLogin={false} />
      </div>

      {/* Hero Slider */}
      <div className="relative flex flex-col items-center">
        <Slider {...settings} className={`w-full ${sliderHeightClass}`}>
          <div>
            <img
              src={img1}
              className={`w-full ${sliderHeightClass} object-cover`}
              alt="slide1"
            />
          </div>
          <div>
            <img
              src={img2}
              className={`w-full ${sliderHeightClass} object-cover`}
              alt="slide2"
            />
          </div>
          <div>
            <img
              src={img3}
              className={`w-full ${sliderHeightClass} object-cover`}
              alt="slide3"
            />
          </div>
        </Slider>

        {/* overlay */}
        <div
          className={`absolute top-0 left-0 right-0 ${sliderHeightClass} bg-gradient-to-b from-transparent to-black/60 pointer-events-none`}
        />
      </div>
      <div className="absolute top-[38rem] left-0 right-0 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="font-pretendard bottom-0 text-white font-bold text-left text-3xl sm:text-4xl lg:text-5xl leading-tight ">
            <div className="mb-2 sm:mb-4">나다운, 우리다운</div>
            <div>여행의 시작</div>
          </div>
        </div>
      </div>

      <div className="relative px-4 sm:px-6 lg:absolute lg:-bottom-1 lg:left-0 lg:right-0 lg:px-8">
        <div className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-2xl p-4 sm:p-6 mt-6 lg:mt-0 mb-8">
          <div className="grid gap-4 items-end grid-cols-1 sm:grid-cols-2 lg:grid-cols-6">
            {/* 출발지 */}
            <div className="block relative">
              <label className="text-gray-600 text-sm mb-1 font-pretendard whitespace-nowrap block">
                출발지
              </label>
              <input
                type="text"
                className="border-b-2 border-gray-300 pb-2 focus:border-blue-500 font-pretendard focus:outline-none w-full pr-8 cursor-pointer"
                placeholder="출발지 입력"
                value={departureLocation ? departureLocation.name : ""}
                onClick={() => setIsDepartureOpen(true)}
                readOnly
              />
              <button
                className="absolute right-0 bottom-2"
                onClick={() => setIsDepartureOpen(true)}
                type="button"
              >
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-gray-400"
                />
              </button>
            </div>

            {/* 여행지 */}
            <div className="block relative">
              <label className="text-gray-600 text-sm mb-1 font-pretendard whitespace-nowrap block">
                여행지
              </label>
              <input
                type="text"
                className="font-pretendard border-b-2 border-gray-300 pb-2 focus:border-blue-500 focus:outline-none w-full pr-8 cursor-pointer"
                placeholder="여행지 입력"
                value={destinationLocation ? destinationLocation.name : ""}
                onClick={() => setIsDestinationOpen(true)}
                readOnly
              />
              <button
                className="absolute right-0 bottom-2"
                onClick={() => setIsDestinationOpen(true)}
                type="button"
              >
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-gray-400"
                />
              </button>
            </div>

            {/* 기간 */}
            <div className="block relative">
              <label className="text-gray-600 text-sm mb-1 font-pretendard whitespace-nowrap block">
                기간
              </label>
              <input
                type="text"
                className="border-b-2 border-gray-300 pb-2 focus:border-blue-500 focus:outline-none w-full pr-8 cursor-pointer font-pretendard"
                placeholder="날짜 선택"
                value={formatDateRange()}
                onClick={() => setIsCalendarOpen(true)}
                readOnly
              />
              <button
                className="absolute right-0 bottom-2"
                onClick={() => setIsCalendarOpen(true)}
                type="button"
              >
                <FontAwesomeIcon icon={faCalendar} className="text-gray-400" />
              </button>
            </div>

            {/* 인원수 */}
            <div className="block relative">
              <label className="text-gray-600 text-sm mb-1 font-pretendard whitespace-nowrap block">
                인원수
              </label>
              <input
                type="text"
                className="font-pretendard border-b-2 border-gray-300 pb-2 focus:border-blue-500 focus:outline-none w-full pr-8 cursor-pointer"
                placeholder="인원수 선택"
                value={formatPersonCount()}
                onClick={() => setIsPersonCountOpen(true)}
                readOnly
              />
              <button
                className="absolute right-0 bottom-2"
                onClick={() => setIsPersonCountOpen(true)}
                type="button"
              >
                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
              </button>
            </div>

            {/* 이동수단 */}
            <div className="block relative">
              <label className="text-gray-600 text-sm mb-1 font-pretendard whitespace-nowrap block">
                이동수단
              </label>
              <input
                type="text"
                className="font-pretendard border-b-2 border-gray-300 pb-2 focus:border-blue-500 focus:outline-none w-full pr-8 cursor-pointer"
                placeholder="이동수단 선택"
                value={getTransportText()}
                onClick={() => setIsTransportOpen(true)}
                readOnly
              />
              <button
                className="absolute right-0 bottom-2"
                onClick={() => setIsTransportOpen(true)}
                type="button"
              >
                <FontAwesomeIcon
                  icon={getTransportIcon()}
                  className="text-gray-400"
                />
              </button>
            </div>

            {/* 버튼 */}
            <div className="block">
              <button
                className="cursor-pointer transition-all bg-[#1344FF] text-white px-4 py-3 rounded-lg
                border-[#1344FF] active:translate-y-[2px] hover:bg-blue-600 shadow-lg w-full font-pretendard whitespace-nowrap"
                onClick={makePlan}
                type="button"
              >
                일정생성
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block h-24" />

      {/* Modals */}
      <DateRangeModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        dateRange={dateRange}
        onDateChange={handleDateChange}
      />

      <PersonCountModal
        isOpen={isPersonCountOpen}
        onClose={() => setIsPersonCountOpen(false)}
        personCount={personCount}
        onPersonCountChange={handlePersonCountChange}
      />

      <TransportModal
        isOpen={isTransportOpen}
        onClose={() => setIsTransportOpen(false)}
        selectedTransport={selectedTransport}
        onTransportChange={handleTransportChange}
      />

      <DepartureModal
        isOpen={isDepartureOpen}
        onClose={() => setIsDepartureOpen(false)}
        onLocationSelect={handleDepartureLocationSelect}
        title="출발지 검색"
        placeholder="출발지를 입력해주세요"
      />

      <DestinationModal
        isOpen={isDestinationOpen}
        onClose={() => setIsDestinationOpen(false)}
        onLocationSelect={handleDestinationLocationSelect}
        title="여행지 검색"
        placeholder="여행지를 입력해주세요"
      />
    </div>
  );
}

export default App;
