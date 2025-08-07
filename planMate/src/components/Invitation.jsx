// Invitation.js에서
export default function InvitationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white shadow-lg p-4 rounded-lg">
        <button onClick={onClose}>닫기</button>
        {/* 모달 내용 */}
      </div>
    </div>
  );
}
