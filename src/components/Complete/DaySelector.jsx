export default function DaySelector({timetables, selectedDay, setSelectedDay}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}.${day}.`;
  };

  return (
    <div
      className="
        flex md:flex-col
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
  )
}