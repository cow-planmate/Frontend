import { useState, useEffect, useRef } from "react";
import TransportModal from "./TransportModal";
import PersonCountModal from "./HomePerson";

export default function PlanInfo({info}) {
  const transInfo = {"bus": "대중교통", "car": "자동차"};
  const flexCenter = "flex items-center";

  const [isTransportOpen, setIsTransportOpen] = useState(false); 
  const [selectedTransport, setSelectedTransport] = useState(info.trans);
  const [isPersonCountOpen, setIsPersonCountOpen] = useState(false);
  const [personCount, setPersonCount] = useState({ adults: info.person.adult, children: info.person.children });
  const [title, setTitle] = useState(info.title);

  const spanRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${spanWidth + 2}px`;
    }
  }, [title]);

  const handleTransportOpen = () => {
    setIsTransportOpen(true);
  };

  const handleTransportClose = () => {
    setIsTransportOpen(false);
  };

  const handleTransportChange = (transport) => {
    setSelectedTransport(transport);
  };

  const handlePersonCountOpen = () => {
    setIsPersonCountOpen(true);
  };

  const handlePersonCountClose = () => {
    setIsPersonCountOpen(false);
  };

  const handlePersonCountChange = (count) => {
    setPersonCount(count);
  };

  return (
    <div className={`mx-auto w-[1416px] pt-6 ${flexCenter} justify-between`}>
      <div className={`${flexCenter} space-x-6`}>
        <div>
          <input 
            ref={inputRef}
            type="text"
            className="rounded-lg py-1 px-2 hover:bg-gray-100 mr-3 text-lg font-semibold"
            onChange={(e) => setTitle(e.target.value)}
            style={{ minWidth: '1ch', maxWidth: "220px" }}
            value={title}
          />
        </div>
        <button className="rounded-lg py-1 px-2 hover:bg-gray-100" onClick={handlePersonCountOpen}>
          <div className={`${flexCenter}`}>
            <p className="text-gray-500 mr-3">인원 수</p>

            <p className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-sm mr-2">성인</p>
            <p className="text-lg mr-4">{personCount["adults"]}명</p>

            <p className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-sm mr-2">어린이</p>
            <p className="text-lg">{personCount["children"]}명</p>
          </div>
        </button>
        <button className="rounded-lg py-1 px-2 hover:bg-gray-100">
          <div className={`${flexCenter}`}>
            <p className="text-gray-500 mr-3">출발지</p>
            <p className="text-lg truncate max-w-56">{info.departure}</p>
          </div>
        </button>
        <button className="rounded-lg py-1 px-2 hover:bg-gray-100">
          <div className={`${flexCenter}`}>
            <p className="text-gray-500 mr-3">여행지</p>
            <p className="text-lg">{info.travel}</p>
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
        <button className="px-4 py-2 rounded-lg bg-gray-300 mr-3 hover:bg-gray-400">
          저장
        </button>
        <button className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">
          완료
        </button>
      </div>

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

      <span
        ref={spanRef}
        className="invisible absolute whitespace-pre text-lg font-semibold px-2"
      >
        {title || ' '}
      </span>
    </div>
  )
}