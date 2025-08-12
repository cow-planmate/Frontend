import Navbar from "../components/Navbar.jsx";
import Profile from "../components/Profile.jsx";
import PlanList from "../components/PlanList.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인 시에만 접근 가능한 페이지입니다.");
      navigate("/");
      return;
    }
  }, [navigate]);

  const handlePlanListRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
  return (
    <div className="font-pretendard min-h-screen max-h-fit">
      <Navbar onInvitationAccept={handlePlanListRefresh} />
      <div className="flex flex-col mx-auto w-[1400px] py-8">
        <div className="font-bold text-3xl pb-6">마이페이지</div>
        <div className="flex gap-[2rem] w-full flex-1">
          <Profile />
          <PlanList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}

export default App;
