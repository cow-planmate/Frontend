import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar, faBus, faTimes } from "@fortawesome/free-solid-svg-icons";

const TransportModal = ({
  isOpen,
  onClose,
  selectedTransport,
  onTransportChange,
}) => {
  if (!isOpen) return null;

  const handleTransportSelect = (transport) => {
    onTransportChange(transport);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h2 className="text-xl font-pretendard font-bold mb-6 text-center">
          이동수단 선택
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleTransportSelect("bus")}
            className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center gap-3 ${
              selectedTransport === "bus"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <FontAwesomeIcon icon={faBus} className="text-3xl text-blue-500" />
            <span className="font-pretendard font-medium">대중교통</span>
          </button>

          <button
            onClick={() => handleTransportSelect("car")}
            className={`p-6 rounded-lg border-2 transition-all flex flex-col items-center gap-3 ${
              selectedTransport === "car"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <FontAwesomeIcon icon={faCar} className="text-3xl text-blue-500" />
            <span className="font-pretendard font-medium">자동차</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransportModal;
