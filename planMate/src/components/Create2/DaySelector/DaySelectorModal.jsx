import { createPortal } from 'react-dom';
import useTimetableStore from '../../../store/Timetables';
import { useState } from 'react';
import { getClient } from '../../../websocket/client';
import DayGrid from './DayGrid';

const DaySelectorModal = ({setIsModalOpen}) => {
  const client = getClient();

  const [timetables, setTimetables] = useState(structuredClone(useTimetableStore.getState().timetables));
  const [create, setCreate] = useState([]);
  const [update, setUpdate] = useState({"timetableVOs": []});
  const [deleteTime, setDelete] = useState({"timetableVOs": []});
  const [isAddDay, setIsAddDay] = useState(false);

  const addDay = () => {
    let lastDateStr; 
    if (create.length > 0) {
      lastDateStr = create[create.length - 1].date;
    } else {
      lastDateStr = timetables[timetables.length - 1].date;
    }
    const lastDate = new Date(lastDateStr);
    lastDate.setDate(lastDate.getDate() + 1);
    const newDate = lastDate.toISOString().split('T')[0];
    const newId = Math.random();

    const timetableVO = {
      timetableId: newId,
      date: newDate,
      startTime: "09:00:00",
      endTime: "20:00:00",
    }

    setCreate((prev) => ([
      ...prev, timetableVO
    ]));
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-pretendard">
      <div className="relative bg-white p-6 rounded-2xl shadow-2xl min-[587px]:w-[530px] w-[90vw] border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="font-bold text-lg mb-2">
          일정 변경
        </div>
        <div className="overflow-x-auto break-keep">
          <div className="space-x-3 py-2 grid grid-cols-[40px_150px_120px_120px] gap-4 items-center text-sm text-gray-500 border-b min-w-max">
            <div>일차</div>
            <div>날짜</div>
            <div>시작 시간</div>
            <div>종료 시간</div>
          </div>
          {timetables.map((timetable, index) => (
            <DayGrid key={timetable.timetableId} setTimetables={setTimetables} timetable={timetable} index={index} />
          ))}
          {create.map((timetable, index) => (
            <DayGrid key={timetable.timetableId} setTimetables={setCreate} timetable={timetable} index={index+(timetables.length)} />
          ))}
        </div>
        <div className="py-3 space-x-2 text-end">
          <button 
            // onClick={() => deleteDay()}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
          >
            -
          </button>
          <button 
            onClick={addDay}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-xl"
          >
            +
          </button>
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
          >
            취소
          </button>
          <button
            className="px-4 py-2.5 bg-main hover:bg-mainDark text-white rounded-xl font-medium transition-all duration-200"
            // onClick={() => handleComfirm()}
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default DaySelectorModal;