import { useState } from "react";
import usePlanStore from "../../../store/Plan"

export default function TitleModal({setIsTitleOpen}) {
  const { planName, setPlanField } = usePlanStore();
  const [localName, setLocalName] = useState(planName);

  const handleComfirm = async () => {
    // if (isAuthenticated()) {
    //   try {
    //     const response = await patch(`${BASE_URL}/api/plan/${id}/name`, {
    //       planName: newTitle,
    //     });
    //     console.log(response);

    //     if (response.edited === true) {
    //       setTitle(newTitle);
    //       setIsTitleOpen(false);
    //     } else {
    //       const errorMessage =
    //         response.message || "패치에 실패했습니다. 다시 시도해주세요.";
    //       console.log(`${response.message}`);
    //       alert(errorMessage);
    //     }
    //   } catch (err) {
    //     console.error("패치에 실패했습니다:", err);
    //   }
    // }
    setPlanField("planName", localName);
    setIsTitleOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-pretendard">
      <div className="relative bg-white p-6 rounded-2xl shadow-2xl sm:w-[440px] w-[70vw] border border-gray-100 max-h-[90vh] overflow-y-auto space-y-5">
        <div className="font-bold text-xl text-gray-800">
          제목 바꾸기
        </div>
        <input 
          onChange={(e) => setLocalName(e.target.value)}
          className="px-4 py-3 w-full border border-gray-300 rounded-lg"
          type="text"
          value={localName}
        />
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={() => setIsTitleOpen(false)}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
          >
            취소
          </button>
          <button
            className="px-4 py-2.5 bg-main hover:bg-mainDark text-white rounded-xl font-medium transition-all duration-200"
            onClick={handleComfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}