const DayGrid = ({setTimetables, timetable, index}) => {
  const rowClass = "space-x-3 py-2 grid grid-cols-[40px_150px_120px_120px] gap-4 items-center border-b min-w-max";
  const times = [];
  for (let h = 0; h < 25; h++) {
    for (let m = 0; m < 60; m += 60) {
      const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(
        2,
        "0"
      )}:00`;
      times.push(formatted);
    }
  }

  return (
    <div className={rowClass}>
      <div>{index+1}일차</div>
      {index === 0 ? 
        <input
          type="date"
          value={timetable.date}
          className="border rounded-lg px-2 h-11"
          // onChange={updateDate}
        />
      :
        <div>{timetable.date}</div>
      }
      <select
        value={timetable.startTime}
        // onChange={(e) => updateTime(e, index, timetable.timetableId, "start")}
        className="border rounded-lg px-2 h-11"
      >
        {times.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <select
        value={timetable.endTime}
        // onChange={(e) => updateTime(e, index, timetable.timetableId, "end")}
        className="border rounded-lg px-2 h-11"
      >
        {times.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DayGrid;