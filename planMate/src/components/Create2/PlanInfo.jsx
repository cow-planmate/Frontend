import { useEffect, useRef } from "react";
import usePlanStore from "../../store/Plan";

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
    setField
  } = usePlanStore();

  const flexCenter = "flex items-center";
  const infoButton = "rounded-lg py-1 px-2 hover:bg-gray-100";
  const transInfo = {0: "대중교통", 1: "자동차"};

  const spanRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${spanWidth + 2}px`;
    }
  }, [planName]);

  return (
    <div className={`mx-auto min-[1440px]:w-[1416px] min-[1440px]:px-0 md:px-6 pt-6 ${flexCenter} justify-between`}>
      <div className={`${flexCenter} lg:space-x-6 md:space-x-3`}>
        <div>
          <input
            ref={inputRef}
            type="text"
            className={`${infoButton} mr-3 text-lg font-semibold`}
            onChange={(e) => setField("planName", e.target.value)}
            style={{ minWidth: "1ch", maxWidth: "220px" }}
            value={planName}
          />
        </div>
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
            <p className="text-lg truncate max-w-56">{departure}</p>
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
      <div className={`${flexCenter} mr-2`}>
        <button 
          className="px-4 py-2 rounded-lg border border-gray-300 mr-3 hover:bg-gray-100"
        >
          지도로 보기
        </button>
        <button 
          className="px-4 py-2 rounded-lg bg-gray-300 mr-3 hover:bg-gray-400"
        >
          공유
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-main hover:bg-mainDark text-white"
        >
          완료
        </button>
      </div>

      <span
        ref={spanRef}
        className="invisible absolute whitespace-pre text-lg font-semibold px-2"
      >
        {planName || " "}
      </span>
    </div>
  )
}