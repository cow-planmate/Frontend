export default function CreateTimetable() {
  return (
    <div className="w-[450px] h-full">
      <div 
        className="border border-gray-300 bg-white rounded-lg px-5 py-7 relative h-[calc(100vh-187px)]" 
        style={{ overflowY: 'auto' }}
      >
        <div className="relative border-t border-gray-200">
          {timeSlots.map((time, index) => (
            <div
              key={time}
              className="flex items-center relative border-b border-gray-200"
              style={{ height: '30px' }}
              onDrop={(e) => handleDrop(e, time)}
              onDragOver={handleDragOver}
            >
              <div className="w-10 text-xs text-gray-500 absolute top-[-25%] bg-white">{time}</div>
              {index + 1 === timeSlots.length ? 
                <div className="w-10 text-xs text-gray-500 absolute bottom-[-30%] bg-white">{endTime}:00</div>
              :<></>}
              <div className="flex-1 h-full"></div>
            </div>
          ))}
          
          {/* 스케줄 아이템들 */}
          {schedule[selectedDay].map(item => renderScheduleItem(item))}
        </div>
      </div>
    </div>
  )
}