import { useState } from "react"

export default function ProfileText({title, content, change}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="py-3 border-b border-gray-300">
      <div className="flex justify-between pb-1">
        <p className="font-semibold text-xl">{title}</p>
        {change ?<button onClick={() => setIsModalOpen(true)} className="underline text-blue-500 text-sm">변경하기</button> :<></>}
      </div>
      {content === 'password'
      ?<button className="mt-1 px-2 py-1 border border-gray-300 rounded-lg hover:bg-gray-100">변경하기</button>
      :<p>{content}</p>}

      {isModalOpen ? <Modal title={title} setIsModalOpen={setIsModalOpen}/> : <></>}
    </div>
  )
}

const Modal = ({title, setIsModalOpen}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">{title} 변경</h2>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">비밀번호 입력</p>
          <input className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="비밀번호를 입력하세요"/>

        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-3 py-1 bg-main text-white rounded"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}