// App.jsx
import React, { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DaySelector from '../components/DaySelector'
import Schedule from '../components/Schedule'
import Recommendation from '../components/Recommendation'

const initialRecommendations = {
  관광지: [
    { id: 'spot1', title: '동궁과 월지', type: '관광지' },
    { id: 'spot2', title: '불국사', type: '관광지' }
  ],
  숙소: [
    { id: 'hotel1', title: '경주호텔', type: '숙소' }
  ],
  식당: [
    { id: 'food1', title: '맛집1', type: '식당' }
  ]
}

const App = () => {
  const [selectedDay, setSelectedDay] = useState(0)
  const [schedule, setSchedule] = useState([
    [], [], [] // 3일차 예시
  ])
  const [recommendations, setRecommendations] = useState(initialRecommendations)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <DaySelector selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
        <Schedule
          dayIndex={selectedDay}
          schedule={schedule}
          setSchedule={setSchedule}
          recommendations={recommendations}
          setRecommendations={setRecommendations}
        />
        <Recommendation
          recommendations={recommendations}
          setRecommendations={setRecommendations}
          schedule={schedule}
          setSchedule={setSchedule}
          dayIndex={selectedDay}
        />
      </div>
    </DndProvider>
  )
}

export default App
