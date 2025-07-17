import { useState } from "react";

export default function SettingModal({
  isOpen,
  onClose,
  info,
  onSettingChange,
}) {
  if (!isOpen) return null;

  const [title, setTitle] = useState(info.title);
  const [adult, setAdult] = useState(info.person.adult);
  const [children, setChildren] = useState(info.person.children);
  const []

  const handleConfirm = () => {
    onSettingChange({ title, adult, children });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-99 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-[320px] mx-4">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 font-pretendard">
            인원수
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* 카운터 */}
        <div className="p-4">
          ㅇㅇ
        </div>

        {/* 완료 버튼 */}
        <div className="p-4 text-center">
          <button
            onClick={handleConfirm}
            className="bg-main hover:bg-gray-300 text-white px-6 py-2 rounded font-pretendard transition-colors"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}
