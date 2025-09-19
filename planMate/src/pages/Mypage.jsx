import Navbar from "../components/Navbar.jsx";
import Profile from "../components/Profile.jsx";
import PlanList from "../components/PlanList.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApiClient } from "../assets/hooks/useApiClient";

function App() {
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const { get, isAuthenticated } = useApiClient();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [userProfile, setUserProfile] = useState(null);
  const [myPlans, setMyPlans] = useState([]);
  const [editablePlans, setEditablePlans] = useState([]);

  useEffect(() => {                                    
    if (!isAuthenticated()) {
      alert("로그인 시에만 접근 가능한 페이지입니다.");
      navigate("/");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated()) {
        try {
          const profileData = await get(`${BASE_URL}/api/user/profile`);

          setUserProfile(profileData);
          setMyPlans(profileData.myPlanVOs || []);
          setEditablePlans(profileData.editablePlanVOs || []);
        } catch (err) {
          console.error("프로필 정보를 가져오는데 실패했습니다:", err);
          setMyPlans([]);
          setEditablePlans([]);

          if (err.message.includes("인증이 만료")) {
            handleLogout();
          }
        }
      } else {
        setUserProfile(null);
        setMyPlans([]);
        setEditablePlans([]);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, get, refreshTrigger]);

  const handlePlanListRefresh = () => {
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <div className="font-pretendard min-h-screen max-h-fit">
      <Navbar onInvitationAccept={handlePlanListRefresh} />
      <div className="flex flex-col mx-auto w-[1400px] py-8">
        <div className="font-bold text-3xl pb-6">마이페이지</div>
        <div className="flex gap-[2rem] w-full flex-1">
          <Profile userProfile={userProfile} setUserProfile={setUserProfile} />
          <PlanList myPlans={myPlans} setMyPlans={setMyPlans} editablePlans={editablePlans} setEditablePlans={setEditablePlans} />
        </div>
      </div>
    </div>
  );
}

export default App;
