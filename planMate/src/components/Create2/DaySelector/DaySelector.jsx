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
    <div className="flex md:space-y-4 md:space-x-0 md:flex-col space-x-3">
      {timetables.map((timetable, index) => {
        return (
          <button
            key={timetable.timetableId}
            className={`px-4 md:py-4 py-3 rounded-lg flex items-center flex-col ${
              selectedDay === index
                ? "bg-main text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }`}
            onClick={() => setSelectedDay(index)}
          >
            <div className="md:text-xl text-lg font-semibold">{index+1}일차</div>
            <div className={`md:text-sm text-xs ${
                selectedDay === index
                  ? "text-gray-200"
                  : "text-gray-500"
              }`}>
              {formatDate(timetable.date)}
            </div>
          </button>
        )
      })}
      <button
        className="text-2xl text-gray-500 hover:text-gray-700"
        onClick={() => setIsModalOpen(true)}
      >
        <FontAwesomeIcon icon={faCalendarDays} />
      </button>

      {isModalOpen && <DaySelectorModal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}