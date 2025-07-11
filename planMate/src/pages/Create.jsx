import { useState } from 'react';
import Navbar from '../components/navbar.jsx';
import PlanInfo from '../components/PlanInfo.jsx';

function App() {
  const info = {
    "title": "제목없는 여행1",
    "person": {
      "adult": 2,
      "children": 1,
    },
    "departure": "명지대학교 인문캠퍼스 인문기숙사",
    "travel": "부산",
    "trans": "대중교통"
  }
  return (
    <div className='font-pretendard'>
      <Navbar 
        isLogin = {true}
      />
      <div className='mx-auto w-[1400px] pt-8'>
        <PlanInfo info={info} />

      </div>
    </div>
  )
}

export default App;