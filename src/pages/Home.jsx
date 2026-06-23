import { useState } from "react";
import { Helmet } from "react-helmet";
import DepartureModal from "../components/common/DepartureModal";
import DestinationModal from "../components/common/LocationModal";
import Navbar from "../components/common/Navbar";
import PersonCountModal from "../components/common/PersonCountModal";
import TransportModal from "../components/common/TransportModal";
import DateRangeModal from "../components/Home/HomeCal";
import { useApiClient } from "../hooks/useApiClient";

import {
  faBus,
  faCalendar,
  faCar,
  faLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useNavigate } from "react-router-dom";
import usePlanStore from "../store/Plan";

import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

import img1 from "../assets/imgs/img1.jpg";
import img2 from "../assets/imgs/img2.jpg";
import img3 from "../assets/imgs/img3.jpg";
import useTimetableStore from "../store/Timetables";
import { ErrorToast, WarningToast } from "../components/common/Toast";

function App({ hideNavbar = false }) {
  const navigate = useNavigate();

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPersonCountOpen, setIsPersonCountOpen] = useState(false);
  const [isTransportOpen, setIsTransportOpen] = useState(false);
  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);

  const [personCount, setPersonCount] = useState({ adults: 1, children: 0 });
  const [selectedTransport, setSelectedTransport] = useState("bus");
  const [departureLocation, setDepartureLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const { setPlanField, setPlanAll } = usePlanStore();
  const { setTimetableAll } = useTimetableStore();
  const { post, isAuthenticated } = useApiClient();

  const sliderHeightClass = "h-[16rem] sm:h-[24rem] lg:h-[32rem]";

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true,
    arrows: false,
    pauseOnHover: false,
    pauseOnFocus: false,
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
    if (isSubmitting) return; // 이미 요청 중이면 무시

    try {
      setIsSubmitting(true);

      if (
        !destinationLocation ||
        !dateRange[0].startDate ||
        !dateRange[0].endDate ||
        personCount.adults + personCount.children === 0
      ) {
        WarningToast("입력되지 않은 값이 있습니다.");
        return;
      }

      const allDates = getDatesBetween(
        dateRange[0].startDate,
        dateRange[0].endDate,
      );
      const formattedDates = allDates.map((date) => formatDateForApi(date));

      if (isAuthenticated()) {
        const requestData = {
          departure: "null",
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
        setPlanAll({
          planName:
            destinationLocation?.name.split(" ")[1] || "제목을 입력하세요",
          planId: -1,
          travelCategoryName: destinationLocation?.name.split(" ")[0] || "",
          travelName: destinationLocation?.name.split(" ")[1] || "",
          travelId: destinationLocation?.id || null,
          departure: departureLocation?.name || "",
          transportationCategoryId: selectedTransport === "car" ? 1 : 0,
          adultCount: Number(personCount.adults),
          childCount: Number(personCount.children),
        });

        const putTimetables = formattedDates.map((date, index) => ({
          timeTableId: index,
          date,
          timeTableStartTime: "09:00:00",
          timeTableEndTime: "20:00:00",
        }));
        setTimetableAll(putTimetables);
        navigate(`/create`);
      }
    } catch (err) {
      console.error("에러, 다시시도해주세요", err);
      ErrorToast("에러, 다시시도 해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] font-pretendard flex flex-col">
      <Helmet>
        <title>planMate : 동시협업 여행플래너</title>
        <meta
          name="description"
          content="planMate는 친구들과 여행 일정을 함께 만드는 실시간 협업 플래너입니다. 복잡한 계획 없이도 누구나 쉽고 빠르게 나만의 여행 일정을 완성해보세요."
        />
      </Helmet>

      {/* Navbar */}
      {!hideNavbar && (
        <div className="w-full bg-white relative z-50">
          <Navbar isLogin={false} />
        </div>
      )}

      {/* 메인 히어로 섹션 (슬라이더) */}
      <div className="w-full relative">
        <Slider {...settings} className={`w-full ${sliderHeightClass}`}>
          <div>
            <img
              src={img1}
              className={`w-full ${sliderHeightClass} object-cover`}
              alt="여행 일정 협업 플래너 planMate 메인 비주얼"
            />
          </div>
          <div>
            <img
              src={img2}
              className={`w-full ${sliderHeightClass} object-cover`}
              alt="동시에 함께 만드는 여행 스케줄"
            />
          </div>
          <div>
            <img
              src={img3}
              className={`w-full ${sliderHeightClass} object-cover`}
              alt="여행지와 기간으로 일정 생성"
            />
          </div>
        </Slider>

        {/* 텍스트 및 오버레이 */}
        <div
          className={`absolute top-0 left-0 right-0 ${sliderHeightClass} bg-gradient-to-b from-black/30 via-transparent to-black/60 flex flex-col justify-center px-6 sm:px-12 lg:px-24 pointer-events-none`}
        >
          <div className="w-full max-w-7xl mx-auto -mt-12 lg:-mt-20 text-white drop-shadow-lg">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-medium mb-2 opacity-90 tracking-wide">
              나다운, 우리다운
            </h2>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              여행의 시작
            </h1>
          </div>
        </div>
      </div>

      {/* 검색 바 폼 (카드 형태, 슬라이더 아래에 살짝 걸치도록 -mt-16 적용) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10 -mt-16 sm:-mt-20 lg:-mt-24 mb-20 flex justify-center">
        <div className="w-full max-w-[1200px] bg-white rounded-3xl sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-2 sm:p-3 flex flex-col lg:flex-row lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          {/* 여행지 */}
          <div
            className="flex-1 px-4 sm:px-6 py-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group"
            onClick={() => setIsDestinationOpen(true)}
          >
            <label className="block text-[13px] font-bold text-gray-400 mb-1 cursor-pointer group-hover:text-[#1344FF] transition-colors">
              여행지
            </label>
            <div className="flex items-center justify-between">
              <input
                type="text"
                className="bg-transparent focus:outline-none w-full text-gray-900 font-semibold text-[15px] sm:text-base placeholder-gray-300 truncate cursor-pointer"
                placeholder="어디로 떠나시나요?"
                value={destinationLocation ? destinationLocation.name : ""}
                readOnly
              />
              <FontAwesomeIcon
                icon={faLocationDot}
                className="text-gray-300 group-hover:text-[#1344FF] transition-colors ml-2"
              />
            </div>
          </div>

          {/* 기간 */}
          <div
            className="flex-1 px-4 sm:px-6 py-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group"
            onClick={() => setIsCalendarOpen(true)}
          >
            <label className="block text-[13px] font-bold text-gray-400 mb-1 cursor-pointer group-hover:text-[#1344FF] transition-colors">
              기간
            </label>
            <div className="flex items-center justify-between">
              <input
                type="text"
                className="bg-transparent focus:outline-none w-full text-gray-900 font-semibold text-[15px] sm:text-base placeholder-gray-300 truncate cursor-pointer"
                placeholder="날짜 선택"
                value={formatDateRange()}
                readOnly
              />
              <FontAwesomeIcon
                icon={faCalendar}
                className="text-gray-300 group-hover:text-[#1344FF] transition-colors ml-2"
              />
            </div>
          </div>

          {/* 인원수 */}
          <div
            className="flex-1 px-4 sm:px-6 py-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group"
            onClick={() => setIsPersonCountOpen(true)}
          >
            <label className="block text-[13px] font-bold text-gray-400 mb-1 cursor-pointer group-hover:text-[#1344FF] transition-colors">
              인원수
            </label>
            <div className="flex items-center justify-between">
              <input
                type="text"
                className="bg-transparent focus:outline-none w-full text-gray-900 font-semibold text-[15px] sm:text-base placeholder-gray-300 truncate cursor-pointer"
                placeholder="인원수 선택"
                value={formatPersonCount()}
                readOnly
              />
              <FontAwesomeIcon
                icon={faUser}
                className="text-gray-300 group-hover:text-[#1344FF] transition-colors ml-2"
              />
            </div>
          </div>

          {/* 이동수단 */}
          <div
            className="flex-1 px-4 sm:px-6 py-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group"
            onClick={() => setIsTransportOpen(true)}
          >
            <label className="block text-[13px] font-bold text-gray-400 mb-1 cursor-pointer group-hover:text-[#1344FF] transition-colors">
              이동수단
            </label>
            <div className="flex items-center justify-between">
              <input
                type="text"
                className="bg-transparent focus:outline-none w-full text-gray-900 font-semibold text-[15px] sm:text-base placeholder-gray-300 truncate cursor-pointer"
                placeholder="이동수단 선택"
                value={getTransportText()}
                readOnly
              />
              <FontAwesomeIcon
                icon={getTransportIcon()}
                className="text-gray-300 group-hover:text-[#1344FF] transition-colors ml-2"
              />
            </div>
          </div>

          {/* 생성 버튼 */}
          <div className="p-2 lg:p-0 lg:pl-3 lg:pr-1 flex-shrink-0 flex items-center h-full">
            <button
              disabled={isSubmitting}
              className={`w-full lg:w-[140px] h-14 lg:h-[72px] flex items-center justify-center text-[16px] font-bold rounded-2xl transition-all duration-200
                ${
                  isSubmitting
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-[#1344FF] text-white hover:bg-blue-700 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-blue-500/20"
                }`}
              onClick={makePlan}
              type="button"
            >
              {isSubmitting ? "생성중..." : "일정생성"}
            </button>
          </div>
        </div>
      </div>

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
