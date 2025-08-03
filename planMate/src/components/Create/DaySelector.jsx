const DaySelector = ({ timetables, selectedDay, onDaySelect }) => {
  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}.${day}.`;
  };

  // 일차 번호 계산 함수
  const getDayNumber = (timetableId) => {
    const index = timetables.findIndex((t) => t.timetableId === timetableId);
    return index + 1;
  };

  return (
    <div className="flex flex-col space-y-4">
      {timetables.map((timetable) => (
        <button
          key={timetable.timetableId}
          className={`px-4 py-4 rounded-lg ${
            selectedDay === timetable.timetableId
              ? "bg-main text-white"
              : "bg-white text-gray-700 border border-gray-300"
          }`}
          onClick={() => onDaySelect(timetable.timetableId)}
        >
          <div className="text-xl font-semibold">
            {getDayNumber(timetable.timetableId)}일차
          </div>
          <div className="text-sm">{formatDate(timetable.date)}</div>
        </button>
      ))}
    </div>
  );
};

export default DaySelector;