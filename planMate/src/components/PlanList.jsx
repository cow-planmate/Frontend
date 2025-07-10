import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

export default function PlanList() {
  const test = [
    {"id": 1, "title": "제목없는 여행1"},
    {"id": 2, "title": "2025 대전여행"},
    {"id": 3, "title": "제주도 관광 일정"},
  ];

  return (
    <div className='border border-gray-300 rounded-lg w-[1000px] p-7'>
      <div className="font-bold text-2xl mb-5">나의 일정</div>
      <div>
        <div className="text-gray-500 font-normal text-sm pl-3 pb-1">제목</div>
        {test.map((lst) => {
          return (
            <div className="flex justify-between items-center py-3 px-3 hover:bg-sub">
              <div key={lst.id} className="font-semibold text-xl">{lst.title}</div>
              <FontAwesomeIcon className="text-gray-500" icon={faEllipsisVertical} />
            </div>
          )
        }
        )}
      </div>
    </div>
  )
}