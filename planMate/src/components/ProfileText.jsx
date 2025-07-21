import { useState } from "react"
import { useApiClient } from "../assets/hooks/useApiClient";

export default function ProfileText({title, content, change}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [naeyong, setNaeyong] = useState(content);

  return (
    <div className="py-3 border-b border-gray-300">
      <div className="flex justify-between pb-1">
        <p className="font-semibold text-xl">{title}</p>
        {change ?<button onClick={() => setIsModalOpen(true)} className="underline text-blue-500 text-sm">변경하기</button> :<></>}
      </div>
      {content === 'password'
      ?<button className="mt-1 px-2 py-1 border border-gray-300 rounded-lg hover:bg-gray-100">변경하기</button>
      :<p>{naeyong}</p>}

      {isModalOpen ? <Modal title={title} setIsModalOpen={setIsModalOpen} content={naeyong} setNaeyong={setNaeyong}/> : <></>}
    </div>
  )
}

const Modal = ({title, setIsModalOpen, content, setNaeyong}) => {
  const [selected, setSelected] = useState(content);
  const { patch, isAuthenticated } = useApiClient();
  const genderGubun = {"남자": 0, "여자": 1};

  const apiUrl = {
    "나이": "/api/user/age",
    "성별": "/api/user/gender",
    "선호테마": "/api/user/preferredThemes",
  }

  const handleChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setSelected(numericValue);
  }

  const age = (
    <div className="space-y-2 my-4">
      <p className="text-sm text-gray-500">나이 입력</p>
      <input 
        className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
        value={selected}
        type="number"
        min={0}
        onChange={handleChange}
      />
    </div>
  )

  const gender = () => {
    return (
      <div className="space-y-2 my-4">
        <p className="text-sm text-gray-500">성별 선택</p>
        <div className="space-x-2 flex w-full">
          <button 
            onClick={() => setSelected("남자")} 
            className={
              `py-2 px-4 w-full rounded-lg border hover:bg-gray-100 
              ${selected === "남자" ? "border-main" : "border-gray-300"}`
            }
          >
            남자
          </button>
          <button 
            onClick={() => setSelected("여자")} 
            className= {
              `py-2 px-4 w-full rounded-lg border hover:bg-gray-100
              ${selected === "여자" ? "border-main" : "border-gray-300"}`
            }
          >
            여자
          </button>
        </div>
      </div>
    )
  }

  const patchApi = async (title, data) => {
    if (isAuthenticated()) {
      try {
        if (title == "나이") {
          await patch(apiUrl[title], {
            age: data
          });
        } else if (title == "성별") {
          await patch(apiUrl[title], {
            gender: genderGubun[data]
          })
        }
        setNaeyong(data);
        setIsModalOpen(false);

      } catch (err) {
        console.error("패치에 실패해버렸습니다:", err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold">{title} 변경</h2>
        {title === "나이" ? age
        : title === "성별" ? gender()
        : <></>}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={() => patchApi(title, selected)}
            className="px-3 py-1 bg-main text-white rounded"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}