import Navbar from "../components/navbar.jsx";

function App() {
  return (
    <div className="font-pretendard">
      <Navbar isLogin={false} />
      <div className="mx-auto w-[1400px] pt-8">
        <div className="font-bold text-3xl pb-6">마이페이지</div>
        <div className="flex w-full">
          <div className="border border-gray-300 rounded-lg w-96 h-full py-5 px-5 mr-5"></div>
          <div className="border border-gray-300 rounded-lg w-full h-full py-5 px-5">
            ?
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
