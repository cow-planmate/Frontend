import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import usePlanStore from "../../store/Plan";

export default function PlanInfoModal({setIsInfoOpen}) {
  const { 
    travelName, 
    travelCategoryName, 
    travelId,
    departure, 
    transportationCategoryId,
    adultCount, 
    childCount,
    setPlanField
  } = usePlanStore();

  const infoButton = "rounded-lg p-2 hover:bg-gray-100 w-full";
  const flexCenter = "flex items-center";
  const transInfo = {0: "대중교통", 1: "자동차"};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-pretendard">
      <div className="relative bg-white p-4 rounded-2xl shadow-2xl w-[80vw] border border-gray-100 max-h-[80vh] overflow-y-auto space-y-2">
        <div className="flex justify-between items-center px-2 pt-2">
          <div className="font-bold text-lg">
            일정 정보
          </div>
          <button 
            className="text-2xl hover:bg-gray-100 w-8 h-8 rounded-full"
            onClick={() => setIsInfoOpen(false)}
          >
            ×
          </button>
        </div>
        <p className="text-sm px-2 pb-2 text-main break-keep"><FontAwesomeIcon className="mr-1" icon={faCircleInfo}/> 각 영역을 클릭하면 정보를 수정할 수 있어요.</p>
        <button
          className={infoButton}
        >
          <div className="space-y-1.5">
            <p className="text-gray-500 text-start font-semibold">인원 수</p>

            <div className={flexCenter}>
              <p className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs mr-2">
                성인
              </p>
              <p className="mr-4">{adultCount}명</p>

              <p className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs mr-2">
                어린이
              </p>
              <p className="">{childCount}명</p>
            </div>
          </div>
        </button>
        <button
          className={infoButton}
        >
          <div className="space-y-1.5">
            <p className="text-gray-500 text-start font-semibold">출발지</p>
            <p className="text text-start max-w-full truncate">{departure}</p>
          </div>
        </button>
        <button
          className={infoButton}
        >
          <div className="space-y-1.5">
            <p className="text-gray-500 text-start font-semibold">여행지</p>
            <p className="text text-start max-w-full truncate">{travelName}</p>
          </div>
        </button>
        <button
          className={infoButton}
        >
          <div className="space-y-1.5">
            <p className="text-gray-500 text-start font-semibold">이동수단</p>
            <p className="text text-start max-w-full">{transInfo[transportationCategoryId]}</p>
          </div>
        </button>
      </div>
    </div>
  )
}