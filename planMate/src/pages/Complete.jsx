import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import PlanInfo from "../components/PlanInfo";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useApiClient } from "../assets/hooks/useApiClient";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import useKakaoLoader from "../hooks/useKakaoLoader";

const TravelPlannerApp = () => {
  const { get } = useApiClient();
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
  const [isShareOpen, setIsShareOpen] = useState(false);

  useKakaoLoader();

  const [map, setMap] = useState();
  const [positions, setPositions] = useState([{ lat: 37.5665, lng: 126.978 }]); // 초기값 설정

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
      const targetTimetableId = place.timetableId ?? place.timeTableId;
      
      if (result[targetTimetableId]) {
        result[targetTimetableId].push(transformedPlace);
      }
    });

    return result;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (id) {
        try {
          const planData = await get(`${BASE_URL}/api/plan/${id}/complete`); // BASE_URL
          console.log("초기 데이터", planData)
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
  }, [id, get]);

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

      const newPositions =
        sortedSchedule.length > 0
          ? sortedSchedule.map((item) => ({
              lat: item.ylocation,
              lng: item.xlocation,
            }))
          : [{ lat: 37.5665, lng: 126.978 }]; // 기본값

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
          backgroundImage:
            "linear-gradient(to bottom, transparent, #E8EDFF), linear-gradient(-45deg, #718FFF 40px, #E8EDFF 40px)",
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

  return (
    <div className="min-h-screen font-pretendard">
      <Navbar />
      <div className="w-[1400px] mx-auto py-6">
        <div className={`flex items-center justify-between pb-6`}>
          <div className="font-bold text-2xl">
            {data?.planFrame?.planName || "여행 계획"}
          </div>
          <div className="space-x-3">
            <button
              onClick={() => navigate(`/create?id=${id}`)}
              className="px-3 py-1.5 rounded-lg bg-gray-300 hover:bg-gray-400"
            >
              수정
            </button>
            <button
              onClick={() => setIsShareOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-sub border border-main"
            >
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
                    <div
                      className="p-2 w-[159px]"
                      style={{ borderRadius: "4rem" }}
                    >
                      <p className="text-lg font-semibold truncate">
                        {item.name}
                      </p>
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
                );
              })}
              {positions.length > 1 &&
                positions.slice(0, -1).map((pos, idx) => {
                  return (
                    <Polyline
                      key={`polyline-${idx}`}
                      path={[pos, positions[idx + 1]]}
                      strokeWeight={4} // 선의 두께 입니다
                      strokeColor={"#1344FF"} // 선의 색깔입니다
                      strokeOpacity={0.5} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                      strokeStyle={"arrow"} // 선의 스타일입니다
                      endArrow={true}
                    />
                  );
                })}
            </Map>
          </div>
        </div>
      </div>
      {isShareOpen && (
        <ShareModal
          isShareOpen={isShareOpen}
          setIsShareOpen={setIsShareOpen}
          id={id}
        />
      )}
    </div>
  );
};

const ShareModal = ({ isShareOpen, setIsShareOpen, id }) => {
  const { patch, post, get, del } = useApiClient();
  const [editors, setEditors] = useState([]);
  const [receiverNickname, setreceiverNickname] = useState("");
  const [shareURL, setShareURL] = useState("");
  const BASE_URL = "" // import.meta.env.VITE_API_URL;

  useEffect(() => {
    getShareLink();
    getEditors();
  }, [isShareOpen]);

  const removeEditorAccessByOwner = async (targetUserId) => {
    try {
      const response = await del(
        `${BASE_URL}/api/plan/${id}/editors/${targetUserId}`
      );
      console.log(response);
      getEditors();
    } catch (err) {
      console.error("에디터 제거에 실패했습니다:", err);
    }
  };

  const getEditors = async () => {
    try {
      const response = await get(`${BASE_URL}/api/plan/${id}/editors`);
      console.log(response);
      setEditors(response.simpleEditorVOs || []);
    } catch (error) {
      console.error("에디터 조회에 실패했습니다:", error);
    }
  };

  const inviteUserToPlan = async () => {
    try {
      const response = await post(`${BASE_URL}/api/plan/${id}/invite`, {
        receiverNickname: receiverNickname,
      });
      console.log(response);
      setreceiverNickname("");
      alert("초대를 보냈습니다!");
    } catch (err) {
      console.error("초대에 실패했습니다:", err);

      const errorMessage =
        err.response?.data?.message ||
        "초대에 실패했습니다. 다시 시도해주세요.";
      alert(errorMessage);
    }
  };

  const getShareLink = async () => {
    try {
      const completeURL = `${window.location.origin}/complete?id=${id}`;
      setShareURL(completeURL);
    } catch (error) {
      console.error("공유 링크 생성 실패", error);
    }
  };
  //get share 함수 api버전
  /**  const getShareLink = async () => {
    try {
      const response = await get(`${BASE_URL}/api/plan/${id}/share`);
      console.log(response);
      setShareURL(response.sharedPlanUrl || "");
    } catch (error) {
      console.error("공유 링크 조회 실패", error);
    }
  };*/

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareURL);
    alert("링크가 복사되었습니다!");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative bg-white p-6 rounded-2xl shadow-2xl w-96 border border-gray-100 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">공유 및 초대</h2>
        <button
          onClick={() => setIsShareOpen(false)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            완성본 공유 URL
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
              value={shareURL}
              readOnly
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
            >
              복사
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            편집 권한이 있는 사용자
          </label>
          <div className="space-y-2">
            {editors.length > 0 ? (
              editors.map((editor) => (
                <div
                  key={editor.userId}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-xl"
                >
                  <span className="text-gray-700">{editor.nickName}</span>
                  <button
                    onClick={() => removeEditorAccessByOwner(editor.userId)}
                    className="w-6 h-6 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <span className="text-red-500 text-sm">×</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-sm text-center py-2">
                편집 권한을 가진 사용자가 없습니다
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            일정 편집 초대
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
              value={receiverNickname}
              onChange={(e) => setreceiverNickname(e.target.value)}
              placeholder="닉네임"
            />
            <button
              onClick={inviteUserToPlan}
              className="px-4 py-3 bg-main hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm"
              disabled={!receiverNickname.trim()}
            >
              초대
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TravelPlannerApp;
