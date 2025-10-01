import { useEffect, useRef, useState } from "react";
import usePlanStore from "../../store/Plan";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faUser, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faMap } from "@fortawesome/free-regular-svg-icons";

import PlanInfoModal from "./PlanInfoModal";

export default function PlanInfo() {
  const { 
    planName, 
    travelName, 
    travelCategoryName, 
    travelId,
    departure, 
    transportationCategoryId, 
    adultCount, 
    childCount,
    setPlanField
  } = usePlanStore();

  const flexCenter = "flex items-center";
  const infoButton = "rounded-lg py-1 px-2 hover:bg-gray-100";
  const transInfo = {0: "대중교통", 1: "자동차"};

  const spanRef = useRef(null);
  const inputRef = useRef(null);
  
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    // 초기 실행
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const spanWidth = spanRef.current.getBoundingClientRect().width;
      inputRef.current.style.width = `${spanWidth}px`;
    }
  }, [planName, isMobile]);

  return (
    <div className={`mx-auto min-[1464px]:w-[1416px] min-[1464px]:px-0 md:px-6 md:pt-6 p-4 ${flexCenter} justify-between`}>
      <div className={`${flexCenter} min-[1464px]:space-x-6 sm:space-x-3 space-x`}>
        <div>
          <input
            ref={inputRef}
            type="text"
            className={`${infoButton} box-content min-[1464px]:mr-3 min-[1464px]:max-w-48 mr-1.5 max-w-36 text-base md:text-lg font-semibold`}
            onChange={(e) => setPlanField("planName", e.target.value)}
            style={{ minWidth: '1ch' }}
            value={planName}
          />
        </div>
        <div className="hidden min-[1464px]:space-x-6 min-[1260px]:space-x-3 min-[1260px]:block">
          <button
            className={infoButton}
          >
            <div className={`${flexCenter}`}>
              <p className="text-gray-500 mr-3">인원 수</p>

              <p className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-sm mr-2">
                성인
              </p>
              <p className="text-lg mr-4">{adultCount}명</p>

              <p className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-sm mr-2">
                어린이
              </p>
              <p className="text-lg">{childCount}명</p>
            </div>
          </button>
          <button
            className={infoButton}
          >
            <div className={`${flexCenter}`}>
              <p className="text-gray-500 mr-3">출발지</p>
              <p className="text-lg truncate min-[1464px]:max-w-36 md:max-w-24" title={departure}>{departure}</p>
            </div>
          </button>
          <button
            className={infoButton}
          >
            <div className={`${flexCenter}`}>
              <p className="text-gray-500 mr-3">여행지</p>
              <p className="text-lg">{travelName}</p>
            </div>
          </button>
          <button
            className={infoButton}
          >
            <div className={flexCenter}>
              <p className="text-gray-500 mr-3">이동수단</p>
              <p className="text-lg">{transInfo[transportationCategoryId]}</p>
            </div>
          </button>
        </div>
        <button 
          className="block min-[1260px]:hidden text-sm sm:text-base rounded-full bg-gray-300 hover:bg-gray-400 py-2 px-4"
          onClick={() => setIsInfoOpen(true)}
        >
          자세히 보기
        </button>
      </div>
      <div className={`${flexCenter} mr-2 space-x-2 sm:space-x-3`}>
        <button 
          className="text-sm sm:text-base sm:px-4 p-2 rounded-full sm:rounded-lg border border-gray-500 hover:bg-gray-100"
        >
          <div className="block sm:hidden w-5"><FontAwesomeIcon icon={faMap} /></div>
          <div className="hidden sm:block">지도로 보기</div>
        </button>
        <button 
          className="text-sm sm:text-base sm:px-4 p-2 rounded-full sm:rounded-lg bg-gray-300 hover:bg-gray-400"
        >
          <div className="block sm:hidden w-5"><FontAwesomeIcon icon={faUserPlus} /></div>
          <div className="hidden sm:block">공유</div>
        </button>
        <button
          className="text-sm sm:text-base sm:px-4 p-2 rounded-full sm:rounded-lg bg-main hover:bg-mainDark text-white"
        >
          <div className="block sm:hidden w-5"><FontAwesomeIcon icon={faCheck} /></div>
          <div className="hidden sm:block">완료</div>
        </button>
      </div>

      <span
        ref={spanRef}
        className="invisible absolute whitespace-pre text-base md:text-lg"
      >
        {planName}
      </span>

      {isInfoOpen ? <PlanInfoModal setIsInfoOpen={setIsInfoOpen}/> : <></>}
    </div>
  )
}