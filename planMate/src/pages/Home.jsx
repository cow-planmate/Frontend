import "tailwindcss/tailwind.css";

function App() {
  return (
    <div>
      <button
        className="cursor-pointer transition-all bg-[#1344FF] text-white px-6 py-2 rounded-lg
border-[#1344FF]
active:border-b-[2px] active:brightness-90 active:translate-y-[2px] "
      >
        일정생성하기
      </button>

      <div className="w-[1150px] h-[100px] mx-auto bg-gray-100 rounded-xl shadow-2xl pl-50"></div>
    </div>
  );
}

export default App;
