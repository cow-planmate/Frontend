import { useState } from "react";
import TransportModal from "./TransportModal";
import PersonCountModal from "./HomePerson";

export default function PlanInfo({info}) {
  const flexCenter = "flex items-center";

  const [isTransportOpen, setIsTransportOpen] = useState(false); 
  const [selectedTransport, setSelectedTransport] = useState("bus");
  const [isPersonCountOpen, setIsPersonCountOpen] = useState(false);
  const [personCount, setPersonCount] = useState({ adults: 0, children: 0 });

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
    <div className={`w-full pb-6 ${flexCenter} justify-between`}>
      <div className={`${flexCenter} space-x-6`}>
        <button className="rounded-lg py-1 px-2 hover:bg-gray-100 mr-3">
          <p className="text-lg font-semibold">{info.title}</p>
        </button>
        <button className="rounded-lg py-1 px-2 hover:bg-gray-100" onClick={handlePersonCountOpen}>
          <div className={`${flexCenter}`}>
            <p className="text-gray-500 mr-3">인원 수</p>

            <p className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-sm mr-2">성인</p>
            <p className="text-lg mr-4">{info.person.adult}명</p>

            <p className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-sm mr-2">어린이</p>
            <p className="text-lg">{info.person.children}명</p>
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
            <p className="text-lg">{info.trans}</p>
          </div>
        </button>
      </div>
      <div className={flexCenter}>
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
    </div>
  )
}