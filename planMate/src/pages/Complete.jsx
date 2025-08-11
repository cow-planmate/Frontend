import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PlanInfo from "../components/PlanInfo";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApiClient } from "../assets/hooks/useApiClient";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk"
import useKakaoLoader from "../hooks/useKakaoLoader"

const TravelPlannerApp = () => {
  const { get, post, patch, isAuthenticated } = useApiClient();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const [data, setData] = useState(null);
  const [timetables, setTimetables] = useState([]);
  const tripCategory = { 0: "관광지", 1: "숙소", 2: "식당" };
  const [transformedData, setTransformedData] = useState(null);
  const [schedule, setSchedule] = useState({});
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [selectedDay, setSelectedDay] = useState(null); // 초기값을 null로 변경
  const [selectedTab, setSelectedTab] = useState("관광지");
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedFromSchedule, setDraggedFromSchedule] = useState(null);
  const [places, setPlaces] = useState({}); // places state 추가

  useKakaoLoader();
  
  const [map, setMap] = useState();
  const [positions, setPositions] = useState([{ lat: 37.5665, lng: 126.9780 }]); // 초기값 설정

  // 두 번째 API 응답을 첫 번째 형태로 변환하는 함수
  const transformApiResponse = (apiResponse) => {
    const { placeBlocks, timetables } = apiResponse;
    // timetableId를 키로 하는 객체 생성
    const result = {};

    // 각 timetable에 대해 빈 배열 초기화
    timetables.forEach((timetable) => {
      result[timetable.timetableId] = [];
    });

    // placeBlocks를 순회하면서 데이터 변환
    placeBlocks.forEach((place) => {
      // startTime과 endTime으로부터 duration 계산 (15분 단위)
      const startTime = new Date(`2000-01-01T${place.startTime}`);
      const endTime = new Date(`2000-01-01T${place.endTime}`);
      const durationMinutes = (endTime - startTime) / (1000 * 60); // 분 단위
      const duration = Math.round(durationMinutes / 15); // 15분 단위로 변환

      // timeSlot을 HH:MM 형태로 변환
      const timeSlot = place.startTime.substring(0, 5);

      // Google Maps URL에서 placeId 추출
      const urlMatch = place.placeLink.match(/place_id:([^&]+)/);
      const placeId = urlMatch ? urlMatch[1] : "";

      // categoryId에 따른 iconUrl 설정
      let iconUrl;
      if (place.placeCategory === 0) {
        iconUrl =
          "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/park-71.png";
      } else if (place.placeCategory === 1) {
        iconUrl =
          "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/lodging-71.png";
      } else {
        iconUrl =
          "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/generic_business-71.png";
      }

      // 변환된 객체 생성
      const transformedPlace = {
        placeId: placeId,
        url: place.placeLink,
        name: place.placeName,
        formatted_address: place.placeAddress,
        rating: place.placeRating,
        iconUrl: iconUrl,
        categoryId: place.placeCategory,
        xlocation: place.xlocation || 0, // 원본 데이터에서 0.0으로 되어있음
        ylocation: place.ylocation || 0,
        timeSlot: timeSlot,
        duration: duration,
      };

      // 해당하는 timetableId를 찾아서 데이터 추가
      // 여기서는 순서대로 배치하는 로직이 필요할 수 있습니다.
      // 예시로 첫 3개는 78, 다음 3개는 79, 마지막 4개는 80에 배치
      const placeIndex = placeBlocks.indexOf(place);
      let targetTimetableId;

      if (placeIndex < 4) {
        targetTimetableId = timetables[0]?.timetableId || 78;
      } else if (placeIndex < 7) {
        targetTimetableId = timetables[1]?.timetableId || 79;
      } else {
        targetTimetableId = timetables[2]?.timetableId || 80;
      }

      if (result[targetTimetableId]) {
        result[targetTimetableId].push(transformedPlace);
      }
    });

    return result;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (id && isAuthenticated()) {
        try {
          const planData = await get(`${BASE_URL}/api/plan/${id}`); // BASE_URL
          setData(planData);
          // timetables 데이터 설정
          if (planData.timetables) {
            setTimetables(planData.timetables);
            // 첫 번째 날을 기본 선택일로 설정
            if (planData.timetables.length > 0) {
              setSelectedDay(planData.timetables[0].timetableId);
            }
          }

          const result = transformApiResponse(planData);
          setTransformedData(result);
        } catch (err) {
          console.error("일정 정보를 가져오는데 실패했습니다:", err);
        }
      } else {
        setData(null);
      }
    };

    fetchUserProfile();
  }, [id, isAuthenticated, get]);

  useEffect(() => {
    console.log(schedule);
  }, [schedule]);

  // timetables 변경 시 schedule 초기화
  useEffect(() => {
    if (transformedData) {
      setSchedule(transformedData);
    } else if (timetables.length > 0) {
      const initialSchedule = {};
      timetables.forEach((timetable) => {
        initialSchedule[timetable.timetableId] = [];
      });
      setSchedule(initialSchedule);
    }
  }, [timetables, transformedData]);

  // positions 업데이트를 위한 별도 useEffect
  useEffect(() => {
    if (selectedDay && schedule[selectedDay]) {
      const sortedSchedule = [...(schedule[selectedDay] || [])].sort((a, b) =>
        a.timeSlot.localeCompare(b.timeSlot)
      );

      const newPositions = sortedSchedule.length > 0
        ? sortedSchedule.map(item => ({
            lat: item.ylocation,
            lng: item.xlocation,
          }))
        : [{ lat: 37.5665, lng: 126.9780 }]; // 기본값

      setPositions(newPositions);
    }
  }, [selectedDay, schedule]);

  // useEffect를 사용하여 map 인스턴스가 생성된 후 한 번만 실행되도록 설정
  useEffect(() => {
    if (!map || !positions.length) return; // map 인스턴스가 아직 생성되지 않았다면 아무것도 하지 않음

    // LatLngBounds 객체에 모든 마커의 좌표를 추가합니다.
    const bounds = new window.kakao.maps.LatLngBounds();
    positions.forEach((pos) => {
      bounds.extend(new window.kakao.maps.LatLng(pos.lat, pos.lng));
    });

    // 계산된 bounds를 지도에 적용합니다.
    map.setBounds(bounds);
  }, [map, positions]); // positions도 dependency에 추가

  // 현재 선택된 날의 시간 슬롯 계산
  const getCurrentTimeSlots = () => {
    if (!selectedDay || !timetables.length) return [];

    const currentTimetable = timetables.find(
      (t) => t.timetableId === selectedDay
    );
    if (!currentTimetable) return [];

    const startHour = parseInt(currentTimetable.startTime.split(":")[0]);
    const endHour = parseInt(currentTimetable.endTime.split(":")[0]);

    const timeSlots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        timeSlots.push(
          `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`
        );
      }
    }
    return timeSlots;
  };

  const timeSlots = getCurrentTimeSlots();

  // 현재 선택된 날의 종료 시간 가져오기
  const getCurrentEndTime = () => {
    if (!selectedDay || !timetables.length) return "20:00";

    const currentTimetable = timetables.find(
      (t) => t.timetableId === selectedDay
    );
    return currentTimetable
      ? currentTimetable.endTime.substring(0, 5)
      : "20:00";
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${month}.${day}.`;
  };

  // 일차 번호 계산 함수
  const getDayNumber = (timetableId) => {
    const index = timetables.findIndex((t) => t.timetableId === timetableId);
    return index + 1;
  };

  // 시간 겹침 체크 함수
  const checkTimeOverlap = (newItem, excludeId = null) => {
    const daySchedule = schedule[selectedDay] || [];
    const newStartIndex = getTimeSlotIndex(newItem.timeSlot);
    const newEndIndex = newStartIndex + newItem.duration - 1;

    return daySchedule.some((item) => {
      if (excludeId && item.placeId === excludeId) return false;

      const existingStartIndex = getTimeSlotIndex(item.timeSlot);
      const existingEndIndex = existingStartIndex + item.duration - 1;

      return !(
        newEndIndex < existingStartIndex || newStartIndex > existingEndIndex
      );
    });
  };

  // 가장 가까운 빈 시간대 찾기
  const findNearestAvailableTime = (preferredTimeSlot, duration) => {
    const preferredIndex = getTimeSlotIndex(preferredTimeSlot);

    // 선호 시간부터 시작해서 아래로 검색
    for (let i = preferredIndex; i <= timeSlots.length - duration; i++) {
      const testItem = { timeSlot: timeSlots[i], duration };
      if (!checkTimeOverlap(testItem)) {
        return timeSlots[i];
      }
    }

    // 위로 검색
    for (let i = preferredIndex - 1; i >= 0; i--) {
      if (i + duration > timeSlots.length) continue;
      const testItem = { timeSlot: timeSlots[i], duration };
      if (!checkTimeOverlap(testItem)) {
        return timeSlots[i];
      }
    }

    return null;
  };

  // 삭제 함수
  const handleDeleteItem = (item) => {
    const newSchedule = { ...schedule };
    newSchedule[selectedDay] = newSchedule[selectedDay].filter(
      (scheduleItem) => scheduleItem.placeId !== item.placeId
    );
    setSchedule(newSchedule);

    // 추천 탭에 다시 추가
    const newPlaces = { ...places };
    const originalItem = { ...item };
    delete originalItem.timeSlot;
    delete originalItem.duration;

    // 원래 카테고리가 있으면 그것을 사용, 없으면 iconUrl로 판단
    let category = originalItem.originalCategory;

    if (!category) {
      // iconUrl을 기반으로 카테고리 결정 (아님)
      const getCategory = (categoryId) => {
        if (categoryId == 0) {
          return "관광지";
        } else if (categoryId == 1) {
          return "숙소";
        } else {
          return "식당";
        }
      };
      category = getCategory(originalItem.categoryId);
    }

    delete originalItem.originalCategory; // 원래 카테고리 정보 제거
    if (!newPlaces[category]) {
      newPlaces[category] = [];
    }
    newPlaces[category].push(originalItem);

    setPlaces(newPlaces);
  };

  const handleDragStart = (e, item, fromSchedule = false) => {
    setDraggedItem(item);
    setDraggedFromSchedule(fromSchedule);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, timeSlot) => {
    e.preventDefault();
    if (!draggedItem) return;

    const newSchedule = { ...schedule };

    if (draggedFromSchedule) {
      // 스케줄 내에서 이동
      const originalItem = newSchedule[selectedDay].find(
        (item) => item.placeId === draggedItem.placeId
      );
      if (!originalItem) return;

      const testItem = { ...originalItem, timeSlot };

      // 겹침 체크 (자기 자신은 제외)
      if (checkTimeOverlap(testItem, draggedItem.placeId)) {
        // 겹치면 가장 가까운 빈 시간대로 이동
        const availableTime = findNearestAvailableTime(
          timeSlot,
          originalItem.duration
        );
        if (availableTime) {
          testItem.timeSlot = availableTime;
        } else {
          // 빈 시간대가 없으면 원래 위치 유지
          setDraggedItem(null);
          setDraggedFromSchedule(null);
          return;
        }
      }

      newSchedule[selectedDay] = newSchedule[selectedDay].filter(
        (item) => item.placeId !== draggedItem.placeId
      );
      newSchedule[selectedDay].push(testItem);
    } else {
      // 추천 탭에서 스케줄로 이동
      const newPlaces = { ...places };
      const category = Object.keys(newPlaces).find((key) =>
        newPlaces[key].some((place) => place.placeId === draggedItem.placeId)
      );

      if (category) {
        const newItem = {
          ...draggedItem,
          timeSlot,
          duration: 4, // 기본 1시간 (15분 * 4)
        };

        // 겹침 체크
        if (checkTimeOverlap(newItem)) {
          // 겹치면 가장 가까운 빈 시간대로 이동
          const availableTime = findNearestAvailableTime(
            timeSlot,
            newItem.duration
          );
          if (availableTime) {
            newItem.timeSlot = availableTime;
          } else {
            // 빈 시간대가 없으면 추가하지 않음
            setDraggedItem(null);
            setDraggedFromSchedule(null);
            return;
          }
        }

        newPlaces[category] = newPlaces[category].filter(
          (place) => place.placeId !== draggedItem.placeId
        );
        setPlaces(newPlaces);
        newSchedule[selectedDay].push(newItem);
      }
    }

    setSchedule(newSchedule);
    setDraggedItem(null);
    setDraggedFromSchedule(null);
  };

  const handleResizeStart = (e, item, direction) => {
    e.stopPropagation();
    e.preventDefault();

    const startY = e.clientY;
    const originalItem = { ...item };
    const originalTimeIndex = getTimeSlotIndex(originalItem.timeSlot);

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const deltaSlots = Math.round(deltaY / 30);

      const newSchedule = { ...schedule };
      const itemIndex = newSchedule[selectedDay].findIndex(
        (scheduleItem) => scheduleItem.placeId === item.placeId
      );

      if (itemIndex !== -1) {
        let testItem = { ...originalItem };

        if (direction === "top") {
          // 위쪽 리사이징: 시작 시간 변경, 길이 조절
          const newStartIndex = Math.max(
            0,
            Math.min(
              originalTimeIndex + deltaSlots,
              originalTimeIndex + originalItem.duration - 1
            )
          );
          const newDuration =
            originalItem.duration - (newStartIndex - originalTimeIndex);

          if (newDuration >= 1 && newStartIndex < timeSlots.length) {
            testItem = {
              ...originalItem,
              timeSlot: timeSlots[newStartIndex],
              duration: newDuration,
            };
          }
        } else {
          // 아래쪽 리사이징: 길이만 변경
          const newDuration = Math.max(1, originalItem.duration + deltaSlots);
          const endIndex = originalTimeIndex + newDuration - 1;

          if (endIndex < timeSlots.length) {
            testItem = {
              ...originalItem,
              duration: newDuration,
            };
          }
        }

        // 겹침 체크 (자기 자신은 제외)
        if (!checkTimeOverlap(testItem, item.placeId)) {
          newSchedule[selectedDay][itemIndex] = testItem;
          setSchedule(newSchedule);
        }
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const getTimeSlotIndex = (timeSlot) => {
    return timeSlots.indexOf(timeSlot);
  };

  const renderScheduleItem = (item) => {
    const startIndex = getTimeSlotIndex(item.timeSlot);
    const height = item.duration * 30; // 15분당 30px

    return (
      <div
        key={item.placeId}
        className="absolute left-16 p-2 font-hand text-sm shadow-lg border border-[#718FFF] rounded-lg z-10 group"
        style={{
          top: `${startIndex * 30}px`,
          height: `${height}px`,
          width: "329px",
          backgroundImage: "linear-gradient(to bottom, transparent, #E8EDFF), linear-gradient(-45deg, #718FFF 40px, #E8EDFF 40px)"
        }}
      >
        {/* 컨텐츠 */}
        <div
          className="p-3 h-full flex items-center justify-between"
          style={{ paddingTop: "12px", paddingBottom: "12px" }}
        >
          <div className="flex-1 min-w-0">
            <div className="font-bold text-lg truncate">{item.name}</div>
            <div className="text-gray-500 truncate text-sm">
              {tripCategory[item.categoryId]}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 선택된 날이 없거나 timetables가 로딩되지 않은 경우 로딩 표시
  if (!selectedDay || !timetables.length) {
    return (
      <div className="min-h-screen font-pretendard">
        <Navbar />
        <div className="w-[1400px] mx-auto py-6 flex items-center justify-center">
          <div>일정 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  const addMinutes = (time, minsToAdd) => {
    const [hour, min] = time.split(":").map(Number);
    const date = new Date(0, 0, 0, hour, min + minsToAdd);
    return date.toTimeString().slice(0, 5); // "HH:MM"
  };

  const getDateById = (id) => {
    const matched = data?.timetables?.find((t) => t.timetableId === id);
    return matched?.date ?? null;
  };

  const exportSchedule = () => {
    const grouped = {}; // { date: [block1, block2, ...] }

    Object.entries(schedule).forEach(([timetableIdStr, day]) => {
      if (!Array.isArray(day) || day.length === 0) return;

      const timetableId = parseInt(timetableIdStr, 10);
      const date = getDateById(timetableId);

      for (const place of day) {
        const startTime = place.timeSlot;
        const endTime = addMinutes(startTime, place.duration * 15);

        const block = {
          placeCategory: place.categoryId,
          placeName: place.name,
          placeAddress: place.formatted_address,
          placeRating: place.rating,
          startTime: `${startTime}:00`,
          endTime: `${endTime}:00`,
          date: date,
          xLocation: place.xlocation,
          yLocation: place.ylocation,
          placeLink: place.url,
          placeTheme: "역사",
        };

        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(block);
      }
    });

    // 2차원 배열 형태로 반환
    return Object.values(grouped);
  };

  return (
    <div className="min-h-screen font-pretendard">
      <Navbar />
      <div className="w-[1400px] mx-auto py-6">
        <div className={`flex items-center justify-between pb-6`}>
          <div className="font-bold text-2xl">{data?.planFrame?.planName || '여행 계획'}</div>
          <div className="space-x-3">
            <button
              onClick={() => navigate(`/create?id=${id}`)}
              className="px-3 py-1.5 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              수정
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-sub border border-main">
              공유
            </button>
            <button
              onClick={() => navigate("/mypage")}
              className="px-3 py-1.5 rounded-lg text-white bg-main"
            >
              확인
            </button>
          </div>
        </div>
        <div className="flex space-x-6 flex-1">
          {/* 일차 선택 */}
          <div className="flex flex-col space-y-4">
            {timetables.map((timetable) => (
              <button
                key={timetable.timetableId}
                className={`px-4 py-4 rounded-lg ${
                  selectedDay === timetable.timetableId
                    ? "bg-main text-white"
                    : "bg-white text-gray-700 border border-gray-300"
                }`}
                onClick={() => setSelectedDay(timetable.timetableId)}
              >
                <div className="text-xl font-semibold">
                  {getDayNumber(timetable.timetableId)}일차
                </div>
                <div className="text-sm">{formatDate(timetable.date)}</div>
              </button>
            ))}
          </div>

          {/* 시간표 */}
          <div className="w-[450px] h-full">
            <div className="border border-gray-300 bg-white rounded-lg px-5 py-7 relative h-[calc(100vh-189px)] overflow-y-auto">
              <div className="relative border-t border-gray-200">
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className="flex items-center relative border-b border-gray-200"
                    style={{ height: "30px" }}
                  >
                    <div className="w-10 text-xs text-gray-500 absolute top-[-25%] bg-white">
                      {time}
                    </div>
                    {index + 1 === timeSlots.length ? (
                      <div className="w-10 text-xs text-gray-500 absolute bottom-[-30%] bg-white">
                        {getCurrentEndTime()}
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="flex-1 h-full"></div>
                  </div>
                ))}

                {/* 스케줄 아이템들 */}
                {(schedule[selectedDay] || []).map((item) =>
                  renderScheduleItem(item)
                )}
              </div>
            </div>
          </div>

          {/* 지도 */}
          <div className="flex-1 border border-gray-300 rounded-lg h-[calc(100vh-189px)] overflow-y-auto">
            <Map // 지도를 표시할 Container
              id="map"
              //className="rounded-2xl"
              center={{
                // 지도의 중심좌표
                lat: 33.452278,
                lng: 126.567803,
              }}
              style={{
                // 지도의 크기
                width: "100%",
                height: "100%",
              }}
              level={3} // 지도의 확대 레벨
              onCreate={setMap}
            >
              {(schedule[selectedDay] || []).map((item) => {
                return (
                  <MapMarker // 인포윈도우를 생성하고 지도에 표시합니다
                    key={item.placeId}
                    position={{
                      // 인포윈도우가 표시될 위치입니다
                      lat: item.ylocation,
                      lng: item.xlocation,
                    }}
                  >
                    <div className="p-2 w-[159px]" style={{borderRadius: '4rem'}}>
                      <p className="text-lg font-semibold truncate">{item.name}</p>
                      <a
                        href={item.url}
                        style={{ color: "blue" }}
                        className="text-sm"
                        target="_blank"
                        rel="noreferrer"
                      >
                        장소 정보 보기
                      </a>
                    </div>
                  </MapMarker>
                )
              })}
              {positions.length > 1 && positions.slice(0, -1).map((pos, idx) => {
                return (
                  <Polyline
                    key={`polyline-${idx}`}
                    path={[
                      pos, 
                      positions[idx + 1],
                    ]}
                    strokeWeight={4} // 선의 두께 입니다
                    strokeColor={"#1344FF"} // 선의 색깔입니다
                    strokeOpacity={0.5} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    strokeStyle={"arrow"} // 선의 스타일입니다
                    endArrow={true}
                  />
                )
              })}
            </Map>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelPlannerApp;