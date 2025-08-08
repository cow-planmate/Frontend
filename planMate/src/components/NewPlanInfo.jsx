// useReducer로 바꾸기 위한 컴포넌트입니다.

import { useState, useEffect, useRef } from "react";
import TransportModal from "./TransportModal";
import PersonCountModal from "./HomePerson";
import DepartureModal from "./Departure";
import LocationModal from "./HomeDestination";
import { useApiClient } from "../assets/hooks/useApiClient";
import { useNavigate } from 'react-router-dom';

export default function PlanInfo({info, id, savePlan, planDispatch}) {
  const { patch, isAuthenticated } = useApiClient();
  const navigate = useNavigate();
  const flexCenter = "flex items-center";
  
  const [sendCreate, setSendCreate] = useState({});

  const transInfo = {"bus": "대중교통", "car": "자동차"};
  const transInfo2 = {0: "bus", 1: "car"};
  const transInfo3 = {"bus": 0, "car": 1};

  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  //const [departureLocation, setDepartureLocation] = useState(info.departure);

  //const [destinationLocation, setDestinationLocation] = useState(info.travel);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);

  const [isTransportOpen, setIsTransportOpen] = useState(false); 
  const [selectedTransport, setSelectedTransport] = useState(transInfo2[info.transportationCategoryId]);

  const [isPersonCountOpen, setIsPersonCountOpen] = useState(false);
  const [personCount, setPersonCount] = useState({ adults: info.adultCount, children: info.childCount });

  const [title, setTitle] = useState(info.planName);

  const spanRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${spanWidth + 2}px`;
      console.log(spanWidth)
    }
  }, [title]);

  /*useEffect(() => {
    const patchApi = async () => {
      if (isAuthenticated()) {
        try {
          await patch(`/api/plan/${id}/name`, {
            planName: title
          });
        } catch (err) {
          console.error("패치에 실패해버렸습니다:", err);
        }
      }
    };
    patchApi();
  }, [title]);*/

  const handleTransportOpen = () => {
    setIsTransportOpen(true);
  };

  const handleTransportClose = () => {
    setIsTransportOpen(false);
  };

  const handleTransportChange = (transport) => {
    setSelectedTransport(transport);
    planDispatch({ type: 'SET_FIELD', field: "transportationCategoryId", value: transInfo3[transport] });
  };

  const handlePersonCountOpen = () => {
    setIsPersonCountOpen(true);
  };

  const handlePersonCountClose = () => {
    setIsPersonCountOpen(false);
  };

  const handlePersonCountChange = (count) => {
    planDispatch({ type: 'SET_FIELD', field: "adultCount", value: count.adults });
    planDispatch({ type: 'SET_FIELD', field: "childCount", value: count.children });
  };

  const handleDepartureOpen = () => {
    setIsDepartureOpen(true);
  };

  const handleDepartureClose = () => {
    setIsDepartureOpen(false);
  };

  const handleDepartureLocationSelect = (location) => {
    planDispatch({ type: 'SET_FIELD', field: "departure", value: location.name });
  };

  const handleDestinationLocationSelect = (location) => {
    console.log(location)
    planDispatch({ type: 'SET_FIELD', field: "travelId", value: location.id });
    planDispatch({ type: 'SET_FIELD', field: "travelName", value: location.name.split(" ").pop() });
  };

  const handleDestinationOpen = () => {
    setIsDestinationOpen(true);
  };

  const handleDestinationClose = () => {
    setIsDestinationOpen(false);
  };

  useEffect(() => {
    setSelectedTransport(transInfo2[info.transportationCategoryId]);
    setTitle(info.planName);
  }, [info]);

  /*useEffect(() => {
    setSendCreate({"transportation": transInfo3[selectedTransport], "adultCount": personCount["adults"], "childCount": personCount["children"]});
  }, [selectedTransport, personCount])*/

  return (
    <div className={`mx-auto w-[1416px] pt-6 ${flexCenter} justify-between`}>
      <div className={`${flexCenter} space-x-6`}>
        <div>
          <input 
            ref={inputRef}
            type="text"
            className="rounded-lg py-1 px-2 hover:bg-gray-100 mr-3 text-lg font-semibold"
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            onBlur={() => {
              planDispatch({ type: 'SET_FIELD', field: 'planName', value: title });
            }}
            style={{ minWidth: '1ch', maxWidth: "220px" }}
            value={title}
          />
        </div>
        <button className="rounded-lg py-1 px-2 hover:bg-gray-100" onClick={handlePersonCountOpen}>
          <div className={`${flexCenter}`}>
            <p className="text-gray-500 mr-3">인원 수</p>

            <p className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-sm mr-2">성인</p>
            <p className="text-lg mr-4">{info.adultCount}명</p>

            <p className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-sm mr-2">어린이</p>
            <p className="text-lg">{info.childCount}명</p>
          </div>
        </button>
        <button className="rounded-lg py-1 px-2 hover:bg-gray-100" onClick={handleDepartureOpen}>
          <div className={`${flexCenter}`}>
            <p className="text-gray-500 mr-3">출발지</p>
            <p className="text-lg truncate max-w-56">{info.departure}</p>
          </div>
        </button>
        <button className="rounded-lg py-1 px-2 hover:bg-gray-100" onClick={handleDestinationOpen}>
          <div className={`${flexCenter}`}>
            <p className="text-gray-500 mr-3">여행지</p>
            <p className="text-lg">{info.travelName}</p>
          </div>
        </button>
        <button className="rounded-lg py-1 px-2 hover:bg-gray-100" onClick={handleTransportOpen}>
          <div className={flexCenter}>
            <p className="text-gray-500 mr-3">이동수단</p>
            <p className="text-lg">{transInfo[selectedTransport]}</p>
          </div>
        </button>
      </div>
      <div className={`${flexCenter} mr-2`}>
        <button className="px-4 py-2 rounded-lg bg-gray-300 mr-6 hover:bg-gray-400">
          지도로 보기
        </button>
        <button onClick={() => savePlan(sendCreate)} className="px-4 py-2 rounded-lg bg-gray-300 mr-3 hover:bg-gray-400">
          저장
        </button>
        <button onClick={() => navigate(`/complete?id=${id}`)} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">
          완료
        </button>
      </div>

      <DepartureModal
        isOpen={isDepartureOpen}
        onClose={handleDepartureClose}
        onLocationSelect={handleDepartureLocationSelect}
        title="출발지 검색"
        placeholder="출발지를 입력해주세요"
      />

      <LocationModal
        isOpen={isDestinationOpen}
        onClose={handleDestinationClose}
        onLocationSelect={handleDestinationLocationSelect}
        title="여행지 검색"
        placeholder="여행지를 입력해주세요"
      />

      <PersonCountModal
        isOpen={isPersonCountOpen}
        onClose={handlePersonCountClose}
        personCount={{adults: info.adultCount, children: info.childCount}}
        onPersonCountChange={handlePersonCountChange}
      />
      
      <TransportModal
        isOpen={isTransportOpen}
        onClose={handleTransportClose}
        selectedTransport={selectedTransport}
        onTransportChange={handleTransportChange}
      />

      <span
        ref={spanRef}
        className="invisible absolute whitespace-pre text-lg font-semibold px-2"
      >
        {title || ' '}
      </span>
    </div>
  )
}