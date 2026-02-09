import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useApiClient } from "../hooks/useApiClient";
import { getTimeSlotIndex } from "../utils/createUtils";

import { faCalendar, faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Navbar from "../components/common/Navbar";
import Loading from "../components/common/Loading";
import PlanInfo from "../components/Complete/PlanInfo";
import DaySelector from "../components/Complete/DaySelector";
import TimetableGrid from "../components/Complete/TimetableGrid";
import MapArea from "../components/Complete/MapArea";

function App() {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const { get, isAuthenticated } = useApiClient();

  const [finishLoading, setFinishLoading] = useState(false);
  const [planFrame, setPlanFrame] = useState({});
  const [placeBlocks, setPlaceBlocks] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);

  const [activeTab, setActiveTab] = useState('timetable');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showTimetable = !isMobile || activeTab === 'timetable';
  const showSidebar = !isMobile || activeTab === 'recommend';

  const sortByDate = (list) =>
    [...list].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  
  function convertBlock(block) {
    const timeTableId = block?.timeTableId;
    const timeTableStartTime = timetables?.find(
      (t) => t.timeTableId === timeTableId
    )?.timeTableStartTime;

    console.log(timetables)
    console.log(timeTableStartTime)
    const start = getTimeSlotIndex(timeTableStartTime, block?.blockStartTime);
    const duration = getTimeSlotIndex(block?.blockStartTime, block?.blockEndTime);
    const blockId = block.placeTheme;
    console.log(start)
    console.log(duration)

    const place = {
      placeId: block.placePhotoId,
      categoryId: block.placeCategoryId,
      url: block.placeLink,
      name: block.placeName,
      formatted_address: block.placeAddress,
      rating: block.placeRating,
      iconUrl: "./src/assets/imgs/default.png",
      xlocation: block.xLocation || block.xlocation,
      ylocation: block.yLocation || block.ylocation,
    }

    return {timeTableId, place, start, duration, blockId};
  }

  const addPlaceBlock = ({ timeTableId, place, start, duration, blockId }) => {
    setPlaceBlocks((prev) => ({
      ...prev,
      [timeTableId]: [
        ...(prev[timeTableId] || []),
        {
          id: blockId,
          place,
          start,
          duration,
        },
      ],
    }));
  };
  
  const [prevPlaces, setPrevPlaces] = useState(null);

  useEffect(() => {
    const addPlaceBlocks = () => {
      prevPlaces.map((item) => {
        console.log(item)
        const convert = convertBlock(item); 
        addPlaceBlock(convert); 
      });
    }
    console.log(timetables, prevPlaces)
    if (timetables && prevPlaces) {
      addPlaceBlocks();
    }
  }, [timetables, prevPlaces])


  useEffect(() => {
    const fetchUserProfile = async () => {
      let planData = null;
      if (id && isAuthenticated()) {
        try {
          planData = await get(`${BASE_URL}/api/plan/${id}/complete`);
        } catch (err) {
          console.error("일정 정보를 가져오는데 실패했습니다:", err);
        }
      } else if (token) {
        try {
          planData = await get(`${BASE_URL}/api/plan/${id}/complete?token=${token}`);
        } catch (err) {
          console.error("일정 정보를 가져오는데 실패했습니다:", err);
          alert("잘못된 접근입니다.");
          navigate("/");
          return;
        }
      } else {
        alert("잘못된 접근입니다.");
        navigate("/");
        return;
      }

      if (planData) {
        console.log("초기 데이터", planData);

        setPlanFrame(planData.planFrame);

        const sortTimetables = sortByDate(planData.timetables);
        setTimetables(sortTimetables);
        setSelectedDay(0);

        setPrevPlaces(planData.placeBlocks);

        setFinishLoading(true);
      }
    };

    fetchUserProfile();
  }, [id, get]);

  useEffect(() => {

  })

  if (!finishLoading) {
    return (
      <div className="font-pretendard h-screen">
        <Navbar />
        <Loading />
      </div>
    )
  }

  return (
    <div className="font-pretendard h-screen">
      <Navbar />
      <PlanInfo planFrame={planFrame} />
      <div
        className="
          min-[1464px]:w-[1400px] min-[1464px]:px-0
          md:px-8 md:py-6 px-6 py-3
          mx-auto
          h-[calc(100vh-140px)]
        "
      >
        <div className="flex md:flex-row flex-col md:space-x-6 space-y-4 md:space-y-0 h-full">
          <DaySelector 
            timetables={timetables}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
          <div className="flex flex-1 flex-col h-full overflow-hidden select-none">
            <div className="flex-1 flex overflow-hidden relative md:space-x-6">
              <TimetableGrid
                planFrame={planFrame}
                placeBlocks={placeBlocks}
                selectedDay={selectedDay}
                timetables={timetables}
                showTimetable={showTimetable}
              />
              <MapArea 
                placeBlocks={placeBlocks}
                timetables={timetables}
                selectedDay={selectedDay}
                showSidebar={showSidebar}
              />
            </div>
            {isMobile && (
              <nav className="mt-4 bg-white border-t h-16 flex shadow-lg">
                <button onClick={() => setActiveTab('timetable')} className={`flex-1 flex flex-col items-center justify-center ${activeTab === 'timetable' ? 'text-main' : 'text-gray-400'}`}>
                  <span className="text-xl"><FontAwesomeIcon icon={faCalendar}/></span><span className="text-xs font-medium">시간표</span>
                </button>
                <button onClick={() => setActiveTab('recommend')} className={`flex-1 flex flex-col items-center justify-center ${activeTab === 'recommend' ? 'text-main' : 'text-gray-400'}`}>
                  <span className="text-xl"><FontAwesomeIcon icon={faMap}/></span><span className="text-xs font-medium">지도로 보기</span>
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;