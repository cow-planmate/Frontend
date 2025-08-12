// useReducer로 바꾸기 위한 컴포넌트입니다.

import { useState, useEffect, useRef } from "react";
import TransportModal from "./TransportModal";
import PersonCountModal from "./HomePerson";
import DepartureModal from "./Departure";
import LocationModal from "./HomeDestination";
import { useApiClient } from "../assets/hooks/useApiClient";
import { useNavigate } from 'react-router-dom';
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk"
import useKakaoLoader from "../hooks/useKakaoLoader"


export default function PlanInfo({info, id, planDispatch, schedule, selectedDay}) {
  const { patch, isAuthenticated } = useApiClient();
  const navigate = useNavigate();
  const flexCenter = "flex items-center";
  
  const [sendCreate, setSendCreate] = useState({});

  const transInfo = {"bus": "대중교통", "car": "자동차"};
  const transInfo2 = {0: "bus", 1: "car"};
  const transInfo3 = {"bus": 0, "car": 1};

  const [isDepartureOpen, setIsDepartureOpen] = useState(false);
  //const [departureLocation, setDepartureLocation] = useState(info.departure);

  //const [destinationLocation, setDestinationLocation] = useState(info.travel);
  const [isDestinationOpen, setIsDestinationOpen] = useState(false);

  const [isTransportOpen, setIsTransportOpen] = useState(false); 
  const [selectedTransport, setSelectedTransport] = useState(transInfo2[info.transportationCategoryId]);

  const [isPersonCountOpen, setIsPersonCountOpen] = useState(false);
  const [personCount, setPersonCount] = useState({ adults: info.adultCount, children: info.childCount });

  const [title, setTitle] = useState(info.planName);

  const [mapModalOpen, setMapModalOpen] = useState(false);

  const [sortedState, setSortedState] = useState({});

  const [isShareOpen, setIsShareOpen] = useState(false);

  const spanRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      const spanWidth = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${spanWidth + 2}px`;
      console.log(spanWidth)
    }
  }, [title]);

  useEffect(() => {
    const sade = Object.fromEntries(
      Object.entries(schedule).map(([key, places]) => [
        key,
        [...places].sort((a, b) => {
          // "HH:MM" 형식을 Date 비교로 변환
          const timeA = a.timeSlot.split(":").map(Number);
          const timeB = b.timeSlot.split(":").map(Number);
          return timeA[0] - timeB[0] || timeA[1] - timeB[1];
        })
      ])
    );

    console.log(sade);
    setSortedState(sade);
  }, [schedule])

  /*useEffect(() => {
    const patchApi = async () => {
      if (isAuthenticated()) {
        try {
          await patch(`/api/plan/${id}/name`, {
            planName: title
          });
        } catch (err) {
          console.error("패치에 실패해버렸습니다:", err);
        }
      }
    };
    patchApi();
  }, [title]);*/

  const handleTransportOpen = () => {
    setIsTransportOpen(true);
  };

  const handleTransportClose = () => {
    setIsTransportOpen(false);
  };

  const handleTransportChange = (transport) => {
    setSelectedTransport(transport);
    planDispatch({ type: 'SET_FIELD', field: "transportationCategoryId", value: transInfo3[transport] });
  };

  const handlePersonCountOpen = () => {
    setIsPersonCountOpen(true);
  };

  const handlePersonCountClose = () => {
    setIsPersonCountOpen(false);
  };

  const handlePersonCountChange = (count) => {
    planDispatch({ type: 'SET_FIELD', field: "adultCount", value: count.adults });
    planDispatch({ type: 'SET_FIELD', field: "childCount", value: count.children });
  };

  const handleDepartureOpen = () => {
    setIsDepartureOpen(true);
  };

  const handleDepartureClose = () => {
    setIsDepartureOpen(false);
  };

  const handleDepartureLocationSelect = (location) => {
    planDispatch({ type: 'SET_FIELD', field: "departure", value: location.name });
  };

  const handleDestinationLocationSelect = (location) => {
    console.log(location)
    planDispatch({ type: 'SET_FIELD', field: "travelId", value: location.id });
    planDispatch({ type: 'SET_FIELD', field: "travelName", value: location.name.split(" ").pop() });
  };

  const handleDestinationOpen = () => {
    setIsDestinationOpen(true);
  };

  const handleDestinationClose = () => {
    setIsDestinationOpen(false);
  };

  useEffect(() => {
    setSelectedTransport(transInfo2[info.transportationCategoryId]);
    setTitle(info.planName);
  }, [info]);

  /*useEffect(() => {
    setSendCreate({"transportation": transInfo3[selectedTransport], "adultCount": personCount["adults"], "childCount": personCount["children"]});
  }, [selectedTransport, personCount])*/

  return (
    <div className={`mx-auto w-[1416px] pt-6 ${flexCenter} justify-between`}>
      <div className={`${flexCenter} space-x-6`}>
        <div>
          <input 
            ref={inputRef}
            type="text"
            className="rounded-lg py-1 px-2 hover:bg-gray-100 mr-3 text-lg font-semibold"
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            onBlur={() => {
              planDispatch({ type: 'SET_FIELD', field: 'planName', value: title });
            }}
            style={{ minWidth: '1ch', maxWidth: "220px" }}
            value={title}
          />
        </div>
        <button className="rounded-lg py-1 px-2 hover:bg-gray-100" onClick={handlePersonCountOpen}>
          <div className={`${flexCenter}`}>
            <p className="text-gray-500 mr-3">인원 수</p>

            <p className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-sm mr-2">성인</p>
            <p className="text-lg mr-4">{info.adultCount}명</p>

            <p className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-sm mr-2">어린이</p>
            <p className="text-lg">{info.childCount}명</p>
          </div>
        </button>
        <button className="rounded-lg py-1 px-2 hover:bg-gray-100" onClick={handleDepartureOpen}>
          <div className={`${flexCenter}`}>
            <p className="text-gray-500 mr-3">출발지</p>
            <p className="text-lg truncate max-w-56">{info.departure}</p>
          </div>
        </button>
        <button className="rounded-lg py-1 px-2 hover:bg-gray-100" onClick={handleDestinationOpen}>
          <div className={`${flexCenter}`}>
            <p className="text-gray-500 mr-3">여행지</p>
            <p className="text-lg">{info.travelName}</p>
          </div>
        </button>
        <button className="rounded-lg py-1 px-2 hover:bg-gray-100" onClick={handleTransportOpen}>
          <div className={flexCenter}>
            <p className="text-gray-500 mr-3">이동수단</p>
            <p className="text-lg">{transInfo[selectedTransport]}</p>
          </div>
        </button>
      </div>
      <div className={`${flexCenter} mr-2`}>
        <button onClick={() => setMapModalOpen(true)} className="px-4 py-2 rounded-lg bg-gray-300 mr-3 hover:bg-gray-400">
          지도로 보기
        </button>
        <button onClick={() => setIsShareOpen(true)} className="px-4 py-2 rounded-lg bg-gray-300 mr-3 hover:bg-gray-400">
          공유
        </button>
        <button onClick={() => navigate(`/complete?id=${id}`)} className="px-4 py-2 rounded-lg bg-main">
          완료
        </button>
      </div>

      <DepartureModal
        isOpen={isDepartureOpen}
        onClose={handleDepartureClose}
        onLocationSelect={handleDepartureLocationSelect}
        title="출발지 검색"
        placeholder="출발지를 입력해주세요"
      />

      <LocationModal
        isOpen={isDestinationOpen}
        onClose={handleDestinationClose}
        onLocationSelect={handleDestinationLocationSelect}
        title="여행지 검색"
        placeholder="여행지를 입력해주세요"
      />

      <PersonCountModal
        isOpen={isPersonCountOpen}
        onClose={handlePersonCountClose}
        personCount={{adults: info.adultCount, children: info.childCount}}
        onPersonCountChange={handlePersonCountChange}
      />
      
      <TransportModal
        isOpen={isTransportOpen}
        onClose={handleTransportClose}
        selectedTransport={selectedTransport}
        onTransportChange={handleTransportChange}
      />

      {mapModalOpen && <MapModal
        setMapModalOpen={setMapModalOpen}
        schedule={sortedState}
        selectedDay={selectedDay}
      />}

      {isShareOpen && <ShareModal
        isShareOpen={isShareOpen}
        setIsShareOpen={setIsShareOpen}
        id={id}
      />}

      <span
        ref={spanRef}
        className="invisible absolute whitespace-pre text-lg font-semibold px-2"
      >
        {title || ' '}
      </span>
    </div>
  )
}

const MapModal = ({setMapModalOpen, schedule, selectedDay}) => {
  useKakaoLoader()

  const [map, setMap] = useState();

  const sortedSchedule = [...schedule[selectedDay]].sort((a, b) =>
    a.timeSlot.localeCompare(b.timeSlot)
  );

  const positions = sortedSchedule.length > 0
  ? sortedSchedule.map(item => ({
      lat: item.ylocation,
      lng: item.xlocation,
    }))
  : [
      { lat: 37.5665, lng: 126.9780 } // 기본 좌표 (예: 서울 시청)
    ];

  console.log(schedule[selectedDay])

  // useEffect를 사용하여 map 인스턴스가 생성된 후 한 번만 실행되도록 설정
  useEffect(() => {
    if (!map) return; // map 인스턴스가 아직 생성되지 않았다면 아무것도 하지 않음

    // LatLngBounds 객체에 모든 마커의 좌표를 추가합니다.
    const bounds = new window.kakao.maps.LatLngBounds();
    positions.forEach((pos) => {
      bounds.extend(new window.kakao.maps.LatLng(pos.lat, pos.lng));
    });

    // 계산된 bounds를 지도에 적용합니다.
    map.setBounds(bounds);
  }, [map]); // map 인스턴스가 변경될 때마다 이 useEffect를 다시 실행

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-pretendard">
      <div className="w-[1200px] shadow-2xl relative">
        <Map // 지도를 표시할 Container
          id="map"
          className="rounded-2xl"
          center={{
            // 지도의 중심좌표
            lat: 33.452278,
            lng: 126.567803,
          }}
          style={{
            // 지도의 크기
            width: "100%",
            height: "700px",
          }}
          level={3} // 지도의 확대 레벨
          onCreate={setMap}
        >
          {(schedule[selectedDay] || []).map((item, index) => {
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
                  <div className="flex items-center space-x-1">
                    <div className="text-sm w-[22px] h-[22px] border border-black rounded-full flex items-center justify-center">{index+1}</div>
                    <a
                      href={item.url}
                      style={{ color: "blue" }}
                      className="text-sm hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      장소 정보 보기
                    </a>
                  </div>
                </div>
              </MapMarker>
            );
          })}
          {positions.slice(0, -1).map((pos, idx) => {
            return (
              <Polyline
                path={[
                  [
                    pos, 
                    positions[idx + 1],
                  ],
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
        <button
          onClick={() => setMapModalOpen(false)}
          className="absolute shadow-2xl top-6 right-6 z-50 text-2xl w-10 h-10 bg-main/60 hover:bg-[#0E32C5]/60 backdrop-blur-sm text-white rounded-full font-medium transition-all duration-200"
        >
          ×
        </button>
      </div>
    </div>
  )
}

const ShareModal = ({ isShareOpen, setIsShareOpen, id }) => {
  const { patch, post, get, del } = useApiClient();
  const [editors, setEditors] = useState([]);
  const [receiverNickname, setreceiverNickname] = useState("");
  const [shareURL, setShareURL] = useState("");
  const BASE_URL = import.meta.env.VITE_API_URL;

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