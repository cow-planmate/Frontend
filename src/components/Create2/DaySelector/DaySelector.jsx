import useTimetableStore from "../../../store/Timetables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import DaySelectorModal from "./DaySelectorModal";
import { useState } from "react";

export default function DaySelector() {
  const { timetables, selectedDay, setSelectedDay } = useTimetableStore();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}.${day}.`;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex md:flex-col">
      {/* 날짜 버튼 영역 */}
      <div
        className="
          flex md:flex-col
          md:flex-initial flex-1
          overflow-x-auto md:overflow-y-auto
          space-x-3 md:space-x-0 md:space-y-4
        "
      >
        {timetables.map((timetable, index) => (
          <button
            key={timetable.timeTableId}
            className={`px-4 py-3 md:py-4 rounded-lg flex flex-col items-center shrink-0 ${
              selectedDay === index
                ? "bg-main text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
            onClick={() => setSelectedDay(index)}
          >
            <div className="text-lg md:text-xl font-semibold">
              {index + 1}일차
            </div>
            <div
              className={`text-xs md:text-sm ${
                selectedDay === index ? "text-white opacity-80" : "text-gray-500"
              }`}
            >
              {formatDate(timetable.date)}
            </div>
          </button>
        ))}
      </div>

      {/* 캘린더 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="
          ml-3 md:ml-0
          shrink-0
          text-2xl text-gray-500 hover:text-gray-700
          bg-white
          py-3
          md:sticky md:bottom-0
        "
      >
        <FontAwesomeIcon icon={faCalendarDays} />
      </button>

      {isModalOpen && <DaySelectorModal setIsModalOpen={setIsModalOpen} />}
    </div>
  )
}