import Navbar from "../components/navbar.jsx";
import Profile from "../components/Profile.jsx";
import PlanList from "../components/PlanList.jsx";

function App() {
  return (
    <div className="font-pretendard min-h-screen max-h-fit">
      <Navbar isLogin={true} />
      <div className="flex flex-col mx-auto w-[1400px] py-8 min-h-[calc(100vh-91px)] max-h-max">
        <div className="font-bold text-3xl pb-6">마이페이지</div>
        <div className="flex w-full flex-1">
          <Profile />
          <PlanList />
        </div>
      </div>
    </div>
  );
}

export default App;
