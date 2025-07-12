import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export default function Recommend() {
  const [category, setCategory] = useState(0);
  const cate = ["관광지", "숙소", "식당"];
  const place = {
    0: [
      {
        "placeCategory": 0,
        'placeName': "성산일출봉",
        'placeTheme': "국가유산",
        'placeRating': 4.7,
        'placeAddress': "제주특별자치도 서귀포시 성산읍 성산리 78",
        'placeLink': "https://place.map.kakao.com/25285071",
        'xLocation': 126.942490,
        'yLocation': 33.458813,
      },
      {
        "placeCategory": 0,
        'placeName': "경복궁",
        'placeTheme': "고궁",
        'placeRating': 4.8,
        'placeAddress': "서울 종로구 사직로 161 1층",
        'placeLink': "https://place.map.kakao.com/25285071",
        'xLocation': 126.942490,
        'yLocation': 33.458813,
      },
    ],
    1: [
      {
        "placeCategory": 1,
        'placeName': "서울신라호텔",
        'placeTheme': "호텔",
        'placeRating': 4.5,
        'placeAddress': "서울 중구 동호로 249",
        'placeLink': "https://place.map.kakao.com/14576878",
        'xLocation': 127.005255,
        'yLocation': 37.555916, 
      },
      {
        "placeCategory": 1,
        'placeName': "명지대학교 인문생활관",
        'placeTheme': "기숙사",
        'placeRating': 2.5,
        'placeAddress': "서울 서대문구 거북골로 34",
        'placeLink': "https://place.map.kakao.com/25285071",
        'xLocation': 126.942490,
        'yLocation': 33.458813,
      },
    ],
    2: [
      {
        "placeCategory": 2,
        'placeName': "모수서울",
        'placeTheme': "양식",
        'placeRating': 3.9,
        'placeAddress': "서울 용산구 회나무로41길 4 1층",
        'placeLink': "https://place.map.kakao.com/1791830911",
        'xLocation': 126.996196, 
        'yLocation': 37.541153, 
      },
      {
        "placeCategory": 2,
        'placeName': "짜장일번지",
        'placeTheme': "중국요리",
        'placeRating': 5.0,
        'placeAddress': "경북 영주시 영주로 306",
        'placeLink': "https://place.map.kakao.com/11155107",
        'xLocation': 126.996196, 
        'yLocation': 37.541153, 
      },
    ],
  }

  return (
    <div>
      <div>
        {cate.map((item, index) => {
          return (
            <button 
              key={index}
              className={`${index == category ? "bg-main text-white font-semibold" : "bg-gray-300 hover:bg-gray-400"} py-2 w-20 rounded-t-lg`}
              onClick={() => {
                setCategory(index)
              }}
            >
              {item}
            </button>
          )
        })}
      </div>
      <div className="border border-gray-300 rounded-lg rounded-tl-none w-[906px] px-5">
        {place[category].map((item) => {
          return (
            <div className="flex justify-between items-center py-5 border-b border-gray-300">
              <div>
                <p className="text-xl font-bold mb-1">{item.placeName}</p>
                <div className="flex items-center">
                  <p className="text-main mr-3">{item.placeTheme}</p>
                  <p className="mr-3">
                    <span className="text-yellow-400">★</span> {item.placeRating}
                  </p>
                  <p className="text-gray-500">
                    {item.placeAddress}
                  </p>
                </div>
              </div>
              <button className="rounded-md border border-main bg-sub px-2 py-1">
                카카오맵
                <FontAwesomeIcon className="ml-2" icon={faArrowUpRightFromSquare} />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}