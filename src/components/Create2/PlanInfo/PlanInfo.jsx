import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePlanStore from "../../../store/Plan";
import useUserStore from "../../../store/Users";
import { v4 as uuidv4 } from 'uuid';
import { useApiClient } from "../../../hooks/useApiClient";
import { sendRedo, sendUndo } from "../../../websocket/client";

import Login from "../../auth/Login";
import PasswordFind from "../../auth/PasswordFind";
import Signup from "../../auth/Signup";
import Theme from "../../auth/Theme";
import Themestart from "../../auth/Themestart"; // 추가된 import

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faUserPlus, faInfo, faRotateLeft, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import { faMap } from "@fortawesome/free-regular-svg-icons";

import PlanInfoModal from "./PlanInfoModal";
import ShareModal from "../../common/ShareModal";
import MapModal from "./MapModal";
import NoLoginSave from "./NoLoginSave";
import TitleModal from "./TitleModal";

export default function PlanInfo({id}) {
  const { 
    planName, 
    transportationCategoryId, 
    setPlanField,
    planId
  } = usePlanStore();
  const { users } = useUserStore();
  const { isAuthenticated } = useApiClient();

  const navigate = useNavigate();

  const flexCenter = "flex items-center";
  const infoButton = "rounded-lg py-1 px-2 hover:bg-gray-100";
  
  const [isTitleOpen, setIsTitleOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPasswordFindOpen, setIsPasswordFindOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isThemestartOpen, setIsThemestartOpen] = useState(false); // 추가된 state
  const [selectedThemeKeywords, setSelectedThemeKeywords] = useState({
    tourist: [],
    accommodation: [],
    restaurant: [],
  });
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  const [step, setStep] = useState(0);

  const handleLoginOpen = () => {
    setStep(1);
    setIsLoginOpen(true);
  };

  const handleLoginClose = () => {
    setIsLoginOpen(false);
  };

  const handlePasswordFindOpen = () => {
    setIsLoginOpen(false);
    setIsPasswordFindOpen(true);
  };

  const handlePasswordFindClose = () => {
    setIsPasswordFindOpen(false);
    setIsLoginOpen(true);
  };

  const handleSignupOpen = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleSignupClose = () => {
    setIsSignupOpen(false);
  };

  const handleThemeOpen = () => {
    setIsThemeOpen(true);
  };

  const handleThemeClose = () => {
    setIsThemeOpen(false);
  };

  const handleThemeComplete = (keywords) => {
    setSelectedThemeKeywords(keywords);
    setIsThemeOpen(false);
  };

  // 추가된 함수들
  const handleThemestartOpen = () => {
    setIsThemestartOpen(true);
  };

  const handleThemestartClose = () => {
    setIsThemestartOpen(false);
    setStep(2);
  };

  const refreshUserProfile = () => {
    setStep(2);
  }

  useEffect(() => {
    if (step === 2) {
      setIsSaveOpen(true);
    }
  }, [step]);

  const handleSave = () => {
    if (!isAuthenticated()) {
      handleLoginOpen();
      return;
    }
    setStep(2);
  }

  return (
    <div className={`mx-auto min-[1464px]:w-[1416px] min-[1464px]:px-0 md:px-6 md:pt-6 p-4 pb-0 ${flexCenter} justify-between w-full`}>
      <div className={`${flexCenter} space-x-3`}>
        <button
          onClick={() => setIsTitleOpen(true)}
          className={`${infoButton} text-lg font-semibold`}
        >
          {planName}
        </button>
        {planId !== -1 && 
          <div className="flex">
            <button 
              onClick={() => sendUndo(id)}
              className="size-7 hover:bg-gray-200 rounded-full flex items-center justify-center"
              title="되돌리기 (Ctrl+Z)"
            >
              <FontAwesomeIcon icon={faRotateLeft} />
            </button>
            <button 
              onClick={() => sendRedo(id)}
              className="size-7 hover:bg-gray-200 rounded-full flex items-center justify-center"
              title="다시실행 (Ctrl+Y / Ctrl+Shift+Z)"
            >
              <FontAwesomeIcon icon={faRotateRight} />
            </button>
          </div>
        }
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
            {users && users.map((user) => {
              return (
                <div
                  key={uuidv4()}
                  className="rounded-full w-10 h-10 bg-contain bg-no-repeat"
                  style={
                    user.userInfo.email ? {
                      backgroundImage: `url('${user.userInfo.email}')`
                    } : {
                      backgroundImage: "url('./src/assets/imgs/default.png')"
                    }
                  }
                  title={user.userInfo.nickname}
                >
                </div>
              )
            })}
          <button 
            onClick={() => setIsMapOpen(true)}
            className="text-sm sm:text-base sm:px-4 p-2 rounded-full sm:rounded-lg border border-gray-500 hover:bg-gray-100"
          >
            <div className="block sm:hidden w-5"><FontAwesomeIcon icon={faMap} /></div>
            <div className="hidden sm:block">지도로 보기</div>
          </button>
          {planId === -1 ? 
            <>
              <button
                onClick={handleSave}
                className="text-sm sm:text-base sm:px-4 p-2 rounded-full sm:rounded-lg bg-main hover:bg-mainDark text-white"
              >
                <div className="block sm:hidden w-5"><FontAwesomeIcon icon={faCheck} /></div>
                <div className="hidden sm:block">저장</div>
              </button>
            </> 
          : 
            <>
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
            </>
          }
        </div>
      </div>
      
      {isTitleOpen && <TitleModal setIsTitleOpen={setIsTitleOpen} />}
      {isInfoOpen && <PlanInfoModal setIsInfoOpen={setIsInfoOpen} />}

      {isShareOpen && <ShareModal
        isOwner={true}
        setIsShareOpen={setIsShareOpen}
        id={id}
      />}

      {isMapOpen && <MapModal setIsMapOpen={setIsMapOpen} />}
      
      {step === 1 &&
        <>
          <Login
            isOpen={isLoginOpen}
            onClose={handleLoginClose}
            onPasswordFindOpen={handlePasswordFindOpen}
            onSignupOpen={handleSignupOpen}
            onLoginSuccess={refreshUserProfile} // 로그인 성공 후 프로필 새로고침
          />
          <PasswordFind
            isOpen={isPasswordFindOpen}
            onClose={handlePasswordFindClose}
          />
          <Signup
            isOpen={isSignupOpen}
            onClose={handleSignupClose}
            onThemeOpen={handleThemestartOpen} // 추가된 prop
            selectedThemeKeywords={selectedThemeKeywords}
            onLoginSuccess={null}
          />
          <Theme
            isOpen={isThemeOpen}
            onClose={handleThemeClose}
            onComplete={handleThemeComplete}
          />
          <Themestart
            isOpen={isThemestartOpen}
            onClose={handleThemestartClose}
            onThemeOpen={handleThemeOpen}
            selectedThemeKeywords={selectedThemeKeywords}
          />
        </>
      }

      {step === 2 && 
        <NoLoginSave isOpen={isSaveOpen}/>
      }
    </div>
  )
}