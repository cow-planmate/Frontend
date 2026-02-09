import { useEffect, useState } from "react"
import { useApiClient } from "../../hooks/useApiClient";

import Sunny from "../../assets/imgs/weather/clear-day.svg";             // 맑음
import SemiSunny from "../../assets/imgs/weather/cloudy-day-1.svg";      // 대체로 맑음
import SemiCloudy from "../../assets/imgs/weather/cloudy-day-2.svg";     // 구름 조금
import Cloudy from "../../assets/imgs/weather/cloudy-original.svg";      // 흐림
import Fog from "../../assets/imgs/weather/fog.svg";                     // 안개
import SemiRainy from "../../assets/imgs/weather/rainy-5.svg";           // 이슬비
import Rainy from "../../assets/imgs/weather/rainy-6.svg";               // 비
import Snowy from "../../assets/imgs/weather/snowy-6.svg";               // 눈
import Sonagi from "../../assets/imgs/weather/sonagi.svg";               // 소나기
import Thunderstorms from "../../assets/imgs/weather/thunderstorms.svg"; // 뇌우

export default function Weather({timetables, selectedDay, travelCategoryName, travelName, travelId}) {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const { post } = useApiClient();

  const [weather, setWeather] = useState({});
  const [nowWeather, setNowWeather] = useState({});

  const weatherIcons = {
    "맑음": Sunny,
    "대체로 맑음": SemiSunny,
    "구름 조금": SemiCloudy,
    "흐림": Cloudy,
    "안개": Fog,
    "이슬비": SemiRainy,
    "비": Rainy,
    "눈": Snowy,
    "소나기": Sonagi,
    "뇌우": Thunderstorms,
  }

  useEffect(() => {
    const loadWeather = async () => {
      const startDate = timetables?.[0]?.date;
      const endDate = timetables?.[timetables.length - 1]?.date;
      
      if (timetables && travelCategoryName && travelName && travelId) {
        try {
          const weatherData = await post(`${BASE_URL}/api/weather/recommendations`, {
            city: `${travelCategoryName} ${travelName}`,
            start_date: startDate,
            end_date: endDate,
          });
          setWeather(weatherData);
        } catch (err) {
          console.error("날씨를 불러오지 못했습니다.", err);
        }
      }
    }
    loadWeather();
  }, [timetables, travelCategoryName, travelName, travelId])
  
  useEffect(() => {
    const dayWeather = weather.weather?.[selectedDay];
    if (dayWeather) setNowWeather(dayWeather);
  }, [selectedDay, weather]);

  useEffect(() => {
    console.log(nowWeather)
    if(nowWeather) console.log(true);
    else console.log(false);
  }, [nowWeather])

  return (
    <div className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center">
        <div
          className={nowWeather.description ? 'right-0 w-14 h-12 bg-no-repeat bg-center' : 'size-12 bg-gray-300 mr-2 rounded-lg'}
          style={{ backgroundImage: `url(${weatherIcons[nowWeather?.description]})` }}
        />
        <div className="-space-y-1">
          <p className="text-xs text-gray-500">{selectedDay+1}일차</p>
          {nowWeather.description ? 
            <p className="text-lg font-semibold">{nowWeather?.description}</p> :
            <div className="bg-gray-300 rounded-lg w-9 h-6"></div>
          }
        </div>
      </div>
      <div className="flex space-x-4 items-center">
        <div className="-space-y-1">
          <p className="text-xs text-gray-500">최저</p>
          {nowWeather.temp_min != null ? 
            <p className="text-lg font-semibold text-blue-600">{nowWeather?.temp_min}℃</p> :
            <div className="bg-gray-300 rounded-lg w-9 h-6"></div>
          }
        </div>
        <div className="-space-y-1">
          <p className="text-xs text-gray-500">최고</p>
          {nowWeather.temp_max != null ? 
            <p className="text-lg font-semibold text-red-600">{nowWeather?.temp_max}℃</p> :
            <div className="bg-gray-300 rounded-lg w-9 h-6"></div>
          }
        </div>
        <div className="-space-y-1">
          <p className="text-xs text-gray-500">체감</p>
          {nowWeather.feels_like != null ? 
            <p className="text-lg font-semibold">{nowWeather?.feels_like}℃</p> :
            <div className="bg-gray-300 rounded-lg w-9 h-6"></div>
          }
        </div>
      </div>
    </div>
  )
}