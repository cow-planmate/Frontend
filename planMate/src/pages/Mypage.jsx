import Navbar from "../components/navbar.jsx";
import Profile from "../components/Profile.jsx";
import PlanList from "../components/PlanList.jsx";
import { useApiClient } from "../assets/hooks/useApiClient";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert("로그인 시에만 접근 가능한 페이지입니다.");
      navigate('/');
      return;
    }
  }, [navigate]);
  
  return (
    <div className="font-pretendard min-h-screen max-h-fit">
      <Navbar isLogin={true} />
      <div className="flex flex-col mx-auto w-[1400px] py-8 h-[calc(100vh-77px)]">
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
