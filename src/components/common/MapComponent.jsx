import { useEffect, useState } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk"
import useKakaoLoader from "../../hooks/useKakaoLoader"

export default function MapComponent({schedule}) {
  useKakaoLoader()

  const [map, setMap] = useState();

  const sortedSchedule = [...schedule].sort((a, b) => a.start - b.start);
  
  const isValidPosition = (place) =>
    place?.ylocation != null && place?.xlocation != null;

  const positions = sortedSchedule
    .map((item, index) => ({
      index, // ← 원래 순서 번호 유지용
      lat: isValidPosition(item.place) ? item.place.ylocation : null,
      lng: isValidPosition(item.place) ? item.place.xlocation : null,
    }))
    .filter(pos => pos.lat != null && pos.lng != null);

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
  }, [map]);

  return (
    sortedSchedule && sortedSchedule.length > 0 ? (
      <Map // 지도를 표시할 Container
        id="map"
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
        {sortedSchedule.map((item, index) => {
          if (!isValidPosition(item.place)) return null;

          return (
            <MapMarker
              key={item.id}
              position={{
                lat: item.place.ylocation,
                lng: item.place.xlocation,
              }}
            >
              <div className="p-2 w-[159px]" style={{ borderRadius: "4rem" }}>
                <p className="text-lg font-semibold truncate">
                  {item.place.name}
                </p>
                <div className="flex items-center space-x-1">
                  <div className="text-sm w-[22px] h-[22px] border border-main text-main font-semibold rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                  <a
                    href={item.place.url}
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
        {positions.length > 1 && (
          <Polyline
            path={positions.map(pos => ({
              lat: pos.lat,
              lng: pos.lng,
            }))}
            strokeWeight={4}
            strokeColor="#1344FF"
            strokeOpacity={0.5}
            strokeStyle="dash"
          />
        )}
      </Map>
    ) : (
      <div className="w-full h-full flex-col flex items-center justify-center space-y-2 p-5">
        <p className="text-main text-3xl font-bold">일차에 블록 없음</p>
        <p className="text-lg">블록을 추가하면 지도가 보여요.</p>
      </div>
    )
  )
}