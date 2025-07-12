import { useState } from 'react';
import Navbar from '../components/navbar.jsx';
import PlanInfo from '../components/PlanInfo.jsx';
import Timetable from '../components/Timetable.jsx';
import Recommend from '../components/Recommend.jsx';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

function App() {
  const info = {
    "title": "제목없는 여행1",
    "person": {
      "adult": 2,
      "children": 1,
    },
    "departure": "명지대학교 인문캠퍼스 방목학술정보관",
    "travel": "부산",
    "trans": "대중교통"
  }

  const dates = ["2025-07-21", "2025-07-22", "2025-07-23"];
  const newDates = dates.map((date) => date.split("-"));

  const [day, setDay] = useState(0);

  return (
    <div className='font-pretendard'>
      <Navbar 
        isLogin = {true}
      />
      <div className='flex flex-col mx-auto w-[1400px] py-8'>
        <PlanInfo info={info} />
        <div className='flex w-full flex-1'>
          <div className='mr-5 flex flex-col'>
            {newDates.map((newDate, index) => {
              return (
                <button
                  key={index} 
                  className={`w-[74px] px-3 py-2 rounded-lg mb-5
                    ${day===index ? 'bg-main font-semibold text-white' : 'bg-gray-300 hover:bg-gray-400'}`}
                  onClick={() => {
                    setDay(index)
                  }}
                >
                  <p className='text-xl'>{index+1}일차</p>
                  <p>{newDate[1]}. {newDate[2]}.</p>
                </button>
              )
            })}
            <button className="text-gray-500 text-2xl hover:text-gray-700" title="설정"><FontAwesomeIcon icon={faGear}/></button>
          </div>
          <Timetable />
          <Recommend />
        </div>
      </div>
    </div>
  )
}

export default App;