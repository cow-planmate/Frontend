import "tailwindcss/tailwind.css";

function App() {
  return (
    <div>
      <div className="absolute top-[5px] right-[10rem] p-4">
        <div className="text-white">로그인/회원가입</div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh] px-8">
        <div className="text-center mb-8">
          <h2 className="text-white text-4xl font-bold mb-2"></h2>
          <h3 className="text-white text-2xl">여행의 시작</h3>
        </div>

        <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">출발지</label>
              <input
                type="text"
                className="border-b-2 border-gray-300 pb-2 focus:border-blue-500 focus:outline-none"
                placeholder="출발지 입력"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">여행지</label>
              <input
                type="text"
                className="border-b-2 border-gray-300 pb-2 focus:border-blue-500 focus:outline-none"
                placeholder="여행지 입력"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">기간</label>
              <input
                type="date"
                className="border-b-2 border-gray-300 pb-2 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">인원수</label>
              <select className="border-b-2 border-gray-300 pb-2 focus:border-blue-500 focus:outline-none">
                <option>1명</option>
                <option>2명</option>
                <option>3명</option>
                <option>4명+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          className="cursor-pointer transition-all bg-[#1344FF] text-white px-8 py-3 rounded-lg
            border-[#1344FF] font-semibold text-lg
            active:border-b-[2px] active:brightness-90 active:translate-y-[2px] 
            hover:bg-blue-600 shadow-lg"
        >
          일정생성하기
        </button>
      </div>

      {/* Bridge Image (decorative) */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none"></div>
    </div>
  );
}

export default App;
