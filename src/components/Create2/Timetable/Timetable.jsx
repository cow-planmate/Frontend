import useTimetableStore from "../../../store/Timetables";

export default function Timetable() {
  const { selectedDay, timetables } = useTimetableStore();

  const startTime = timetables[selectedDay].startTime.split(":")[0];
  const endTime = timetables[selectedDay].endTime.split(":")[0];
  const INTERVAL_MIN = 15;
  const SLOTS_PER_HOUR = 60 / INTERVAL_MIN;
  const TOTAL_SLOTS = (endTime - startTime) * SLOTS_PER_HOUR;

  const formatTimeFromIndex = (index) => {
    const totalMinutes = index * INTERVAL_MIN + startTime * 60;
    const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const m = (totalMinutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  return (
    <div 
      className="
        md:w-4/12 w-full h-full 
        border border-gray-300 bg-white rounded-lg px-5 py-4 relative overflow-y-auto
      "
    >
      <div
        id="timetable-droppable-area"
        className="relative"
      >
        {Array.from({ length: TOTAL_SLOTS }).map((_, index) => {
          return (
            <div key={`grid-${index}`} className="flex items-center h-8">
              <div className="w-8 text-center text-xs mr-4 text-gray-500">
                {formatTimeFromIndex(index)}
              </div>
              <div className="flex-1 h-[1px] bg-gray-200"></div>
            </div>
          )
        })}

        <div className="flex items-center h-8">
          <div className="w-8 text-center text-xs mr-4 text-gray-500">
            {formatTimeFromIndex(TOTAL_SLOTS)}
          </div>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}