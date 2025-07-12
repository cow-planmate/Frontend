// components/Recommendation.jsx
import { useDrop } from 'react-dnd'
import DraggableItem from './DraggableItem'

const Recommendation = ({
  recommendations,
  setRecommendations,
  schedule,
  setSchedule,
  dayIndex
}) => {
  const [, drop] = useDrop(() => ({
    accept: ['관광지', '숙소', '식당'],
    drop: (item) => {
      setRecommendations((prev) => {
        const newRecs = { ...prev }
        newRecs[item.type].push(item)
        return newRecs
      })

      setSchedule((prev) => {
        const newSchedule = [...prev]
        newSchedule[dayIndex] = newSchedule[dayIndex].filter((i) => i.id !== item.id)
        return newSchedule
      })
    }
  }))

  return (
    <div ref={drop} className="w-[300px] p-4 bg-gray-50">
      <h2 className="text-xl font-bold mb-2">추천</h2>
      {Object.entries(recommendations).map(([type, items]) => (
        <div key={type}>
          <h3 className="font-semibold text-gray-600 mt-4 mb-2">{type}</h3>
          {items.map((item) => (
            <DraggableItem key={item.id} item={item} />
          ))}
        </div>
      ))}
    </div>
  )
}

export default Recommendation
