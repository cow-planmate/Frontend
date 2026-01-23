import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faUserPlus, faInfo } from "@fortawesome/free-solid-svg-icons";
import { faMap } from "@fortawesome/free-regular-svg-icons";

import PlanInfoModal from "./PlanInfoModal";
import ShareModal from "../common/ShareModal";

export default function PlanInfo({planFrame}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const flexCenter = "flex items-center";
  
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <div className={`mx-auto min-[1464px]:w-[1416px] min-[1464px]:px-0 md:px-6 md:pt-6 p-4 pb-0 ${flexCenter} justify-between w-full`}>
      <div className={`${flexCenter} space-x-3`}>
        <div className="rounded-lg py-1 px-2 text-lg font-semibold">
          {planFrame.planName}
        </div>
        <button 
          className="block text-sm rounded-full bg-gray-300 hover:bg-gray-400 p-2 w-9"
          onClick={() => setIsInfoOpen(true)}
        >
          <div className="w-5"><FontAwesomeIcon icon={faInfo} /></div>
        </button>
      </div>
      <div className={`${flexCenter} mx-2 sm:w-auto`}>
        <div className={`space-x-2 sm:space-x-3 ${flexCenter}`}>
          <button 
            onClick={() => navigate(`/create?id=${id}`)}
            className="text-sm sm:text-base sm:px-4 p-2 rounded-full sm:rounded-lg border border-gray-500 hover:bg-gray-100"
          >
            <div className="block sm:hidden w-5"><FontAwesomeIcon icon={faMap} /></div>
            <div className="hidden sm:block">수정</div>
          </button>
          <button 
            onClick={() => setIsShareOpen(true)}
            className="text-sm sm:text-base sm:px-4 p-2 rounded-full sm:rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            <div className="block sm:hidden w-5"><FontAwesomeIcon icon={faUserPlus} /></div>
            <div className="hidden sm:block">공유</div>
          </button>
          <button
            onClick={() => navigate(`/mypage`)}
            className="text-sm sm:text-base sm:px-4 p-2 rounded-full sm:rounded-lg bg-main hover:bg-mainDark text-white"
          >
            <div className="block sm:hidden w-5"><FontAwesomeIcon icon={faCheck} /></div>
            <div className="hidden sm:block">확인</div>
          </button>
        </div>
      </div>

      {isInfoOpen && <PlanInfoModal 
        setIsInfoOpen={setIsInfoOpen} 
        planFrame={planFrame}
      />}

      {isShareOpen && <ShareModal
        isOwner={true}
        setIsShareOpen={setIsShareOpen}
        id={id}
      />}
    </div>
  )
}