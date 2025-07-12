// components/Schedule.jsx
import { useDrop, useDragLayer } from 'react-dnd'
import DraggableItem from './DraggableItem'
import { useRef, useState } from 'react'

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 08:00 ~ 20:00

const Schedule = ({ dayIndex, schedule, setSchedule, recommendations, setRecommendations }) => {
  const containerRef = useRef()
  const [resizingId, setResizingId] = useState(null)

  const [, drop] = useDrop(() => ({
    accept: ['관광지', '숙소', '식당'],
    drop: (item, monitor) => {
      const dropOffset = monitor.getClientOffset()
      const container = containerRef.current
      if (!container || !dropOffset) return

      const containerTop = container.getBoundingClientRect().top
      const relativeY = dropOffset.y - containerTop
      const hourIndex = Math.floor(relativeY / 60)
      const startHour = HOURS[hourIndex] || 8
      const start = `${startHour.toString().padStart(2, '0')}:00`
      const end = `${(startHour + 1).toString().padStart(2, '0')}:00`

      setSchedule((prev) => {
        const newSchedule = [...prev]
        if (!newSchedule[dayIndex].some((i) => i.id === item.id)) {
          newSchedule[dayIndex].push({ ...item, time: `${start} ~ ${end}`, duration: 1 })
        }
        return newSchedule
      })

      setRecommendations((prev) => {
        const newRecs = { ...prev }
        newRecs[item.type] = newRecs[item.type].filter((r) => r.id !== item.id)
        return newRecs
      })
    }
  }))

  const [, recDrop] = useDrop(() => ({
    accept: ['관광지', '숙소', '식당'],
    drop: (item) => {
      setRecommendations((prev) => {
        const newRecs = { ...prev }
        if (!newRecs[item.type].some((r) => r.id === item.id)) {
          newRecs[item.type].push(item)
        }
        return newRecs
      })

      setSchedule((prev) => {
        const newSchedule = [...prev]
        newSchedule[dayIndex] = newSchedule[dayIndex].filter((i) => i.id !== item.id)
        return newSchedule
      })
    }
  }))

  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    item: monitor.getItem(),
    currentOffset: monitor.getClientOffset()
  }))

  const handleMouseDown = (e, id) => {
    e.preventDefault()
    setResizingId(id)
  }

  const handleMouseMove = (e) => {
    if (!resizingId || !containerRef.current) return

    const containerTop = containerRef.current.getBoundingClientRect().top
    const relativeY = e.clientY - containerTop
    const newDuration = Math.max(1, Math.round(relativeY / 60) - HOURS.indexOf(parseInt(getItem(resizingId).time.split(':')[0])))

    setSchedule((prev) => {
      const updated = [...prev]
      updated[dayIndex] = updated[dayIndex].map((i) =>
        i.id === resizingId ? { ...i, duration: newDuration } : i
      )
      return updated
    })
  }

  const handleMouseUp = () => {
    setResizingId(null)
  }

  const getItem = (id) => schedule[dayIndex].find((i) => i.id === id)

  return (
    <div
      ref={(node) => {
        drop(node)
        containerRef.current = node
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      id={`schedule-${dayIndex}`}
      className="flex-1 p-6 border-r min-w-[400px] bg-white relative"
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{dayIndex + 1}일차</h2>
        <p className="text-gray-500">07.0{dayIndex + 4}</p>
      </div>
      <div ref={recDrop} className="relative border-l-2 border-gray-300 h-full pl-4">
        {HOURS.map((hour) => (
          <div key={hour} className="relative h-[60px]">
            <div className="absolute -left-10 text-sm text-gray-400">{hour}:00</div>
          </div>
        ))}

        {schedule[dayIndex].map((item) => {
          const startHour = parseInt(item.time.split(':')[0])
          return (
            <div
              key={item.id}
              className="absolute left-4 right-4 bg-blue-100 border border-blue-400 rounded-md p-2 shadow-sm cursor-move"
              style={{
                top: `${(startHour - 8) * 60}px`,
                height: `${(item.duration || 1) * 60}px`
              }}
            >
              <div className="font-semibold">{item.title}</div>
              <div className="text-sm text-gray-500">{item.time}</div>
              <div
                className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize bg-blue-300 hover:bg-blue-500"
                onMouseDown={(e) => handleMouseDown(e, item.id)}
              />
            </div>
          )
        })}

        {/* 미리보기 */}
        {isDragging && currentOffset && item && (
          <div
            className="absolute left-4 right-4 bg-blue-200 opacity-50 border border-blue-400 rounded-md p-2 pointer-events-none"
            style={{
              top: `${currentOffset.y - containerRef.current.getBoundingClientRect().top}px`,
              height: '60px'
            }}
          >
            <div className="font-semibold">{item.title}</div>
            <div className="text-sm text-gray-500">미리보기</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Schedule