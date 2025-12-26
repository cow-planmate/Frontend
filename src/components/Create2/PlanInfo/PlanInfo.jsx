import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePlanStore from "../../../store/Plan";
import useUserStore from "../../../store/UserDayIndexes";
import useTimetableStore from "../../../store/Timetables";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faUserPlus, faInfo } from "@fortawesome/free-solid-svg-icons";
import { faMap } from "@fortawesome/free-regular-svg-icons";

import PlanInfoModal from "./PlanInfoModal";
import ShareModal from "../../common/ShareModal";

export default function PlanInfo({id}) {
  const { 
    planName, 
    transportationCategoryId, 
    setPlanField
  } = usePlanStore();
  const { userDayIndexes } = useUserStore();
  const { setSelectedDay } = useTimetableStore();

  const navigate = useNavigate();

  const flexCenter = "flex items-center";
  const infoButton = "rounded-lg py-1 px-2 hover:bg-gray-100";

  const spanRef = useRef(null);
  const inputRef = useRef(null);
  
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [localName, setLocalName] = useState(planName);

  useEffect(() => {
    setLocalName(planName);
  }, [planName]);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const spanWidth = spanRef.current.getBoundingClientRect().width;
      inputRef.current.style.width = `${spanWidth}px`;
    }
  }, [localName]);

  return (
    <div className={`mx-auto min-[1464px]:w-[1416px] min-[1464px]:px-0 md:px-6 md:pt-6 p-4 pb-0 ${flexCenter} justify-between w-full`}>
      <div className={`${flexCenter} space-x-3`}>
        <div>
          <input
            ref={inputRef}
            type="text"
            className={`${infoButton} box-content text-lg font-semibold`}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={() => setPlanField("planName", localName)}
            style={{ minWidth: '1ch' }}
            value={localName}
          />
        </div>
        <button 
          className="block text-sm rounded-full bg-gray-300 hover:bg-gray-400 p-2 w-9"
          onClick={() => setIsInfoOpen(true)}
        >
          <div className="w-5"><FontAwesomeIcon icon={faInfo} /></div>
        </button>
        <div className={`hidden md:block ${flexCenter} py-2 px-3 border border-gray-300 rounded-full`}>
          <span className="text-gray-500 mr-1 text-sm">이동수단</span>
          <select value={transportationCategoryId} onChange={(e) => setPlanField("transportationCategoryId", e.target.value)}>
            <option value='0'>대중교통</option>
            <option value='1'>자동차</option>
          </select>
        </div>
      </div>
      <div className={`${flexCenter} mx-2 sm:w-auto`}>
        <div className={`space-x-2 sm:space-x-3 ${flexCenter}`}>
            {userDayIndexes && userDayIndexes.map((userDayIndex) => {
              return (
                <button
                  key={userDayIndex.nickname}
                  className="rounded-full w-10 h-10 bg-contain bg-no-repeat bg-[url('./assets/imgs/default.png')]"
                  title={userDayIndex.nickname}
                  onClick={() => setSelectedDay(userDayIndex.dayIndex)}
                  //style={{backgroundImage: `url('./assets/imgs/default.png')`}}
                >
                </button>
              )
            })}
          <button 
            className="text-sm sm:text-base sm:px-4 p-2 rounded-full sm:rounded-lg border border-gray-500 hover:bg-gray-100"
          >
            <div className="block sm:hidden w-5"><FontAwesomeIcon icon={faMap} /></div>
            <div className="hidden sm:block">지도로 보기</div>
          </button>
          <button 
            onClick={() => setIsShareOpen(true)}
            className="text-sm sm:text-base sm:px-4 p-2 rounded-full sm:rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            <div className="block sm:hidden w-5"><FontAwesomeIcon icon={faUserPlus} /></div>
            <div className="hidden sm:block">공유</div>
          </button>
          <button
            onClick={() => navigate(`/complete?id=${id}`)}
            className="text-sm sm:text-base sm:px-4 p-2 rounded-full sm:rounded-lg bg-main hover:bg-mainDark text-white"
          >
            <div className="block sm:hidden w-5"><FontAwesomeIcon icon={faCheck} /></div>
            <div className="hidden sm:block">완료</div>
          </button>
        </div>
      </div>

      <span
        ref={spanRef}
        className="invisible absolute whitespace-pre text-base md:text-lg"
      >
        {localName}
      </span>

      {isInfoOpen && <PlanInfoModal setIsInfoOpen={setIsInfoOpen}/>}

      {isShareOpen && <ShareModal
        isOwner={true}
        setIsShareOpen={setIsShareOpen}
        id={id}
      />}
    </div>
  )
}