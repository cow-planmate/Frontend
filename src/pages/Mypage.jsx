import Navbar from "../components/common/Navbar";
import Profile from "../components/Mypage/Profile";
import PlanList from "../components/Mypage/PlanList";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useApiClient } from "../hooks/useApiClient";

function App() {
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const { get, isAuthenticated, logout } = useApiClient();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [userProfile, setUserProfile] = useState(null);
  const [myPlans, setMyPlans] = useState([]);
  const [editablePlans, setEditablePlans] = useState([]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

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
          console.log("프로필 데이터:", profileData);
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
    <div className="font-pretendard min-h-screen">
      <Navbar onInvitationAccept={handlePlanListRefresh} />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="font-bold text-2xl sm:text-3xl pb-4 sm:pb-6">
            마이페이지
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 w-full items-start">
            <div className="w-full lg:w-[30%] lg:min-w-[320px] lg:max-w-[450px] flex-shrink-0">
              <Profile
                userProfile={userProfile}
                setUserProfile={setUserProfile}
              />
            </div>

            <div className="w-full lg:flex-1">
              <PlanList
                myPlans={myPlans}
                setMyPlans={setMyPlans}
                editablePlans={editablePlans}
                setEditablePlans={setEditablePlans}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
