import { useState } from "react";

export default function FeedbackModal({ isOpen, onClose }) {
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!content.trim()) return;

    // TODO: API 연결 위치
    console.log("피드백 내용:", content);

    setContent("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">피드백 보내기</h2>

        <textarea
          className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-main"
          placeholder="불편한 점이나 개선 아이디어를 적어주세요 :)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded-lg bg-main text-white hover:opacity-90"
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
}
