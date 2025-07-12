// components/DaySelector.jsx
const DaySelector = ({ selectedDay, setSelectedDay }) => {
  return (
    <div className="w-[100px] p-4 bg-gray-100 flex flex-col gap-4">
      {[0, 1, 2].map((day) => (
        <button
          key={day}
          className={`py-2 rounded ${
            selectedDay === day ? 'bg-blue-500 text-white' : 'bg-white'
          }`}
          onClick={() => setSelectedDay(day)}
        >
          {day + 1}일차
        </button>
      ))}
    </div>
  )
}

export default DaySelector
