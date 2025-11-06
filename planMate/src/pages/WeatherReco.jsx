import { useState } from "react";
import Navbar from "../components/Navbar";

// API URL (로컬에서 실행 중인 FastAPI 서버)
const API_URL = "https://ai.salmakis.online/recommendations";

function WeatherReco() {
  const [formData, setFormData] = useState({
    destination: "",
    travel_date: "",
    duration: 1,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          duration: Number(formData.duration), // duration을 숫자로 변환
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-pretendard">
      <Navbar isLogin={false} />
      <div className="max-w-4xl mx-auto p-8 mt-10">
        <h1 className="text-4xl font-bold mb-6 text-center">
          날씨별 AI 옷차림 추천 🌦️👕
        </h1>
        <p className="text-center text-gray-600 mb-8">
          여행지와 날짜, 기간을 입력하시면 날씨에 맞는 옷차림을 AI가
          추천해 드립니다.
        </p>

        {/* --- 입력 폼 --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-lg p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 여행지 */}
            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                여행지 (도시명)
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="예: 서울, 부산, 인천"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 여행 시작 날짜 */}
            <div>
              <label
                htmlFor="travel_date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                여행 시작 날짜
              </label>
              <input
                type="text"
                id="travel_date"
                name="travel_date"
                value={formData.travel_date}
                onChange={handleChange}
                placeholder="예: 10월 28일 또는 2025-10-28"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 여행 기간 */}
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                여행 기간 (일)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                max="7"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="text-center mt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-12 py-3 bg-[#1344FF] text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-all disabled:bg-gray-400"
            >
              {loading ? "추천받는 중..." : "AI 추천 받기"}
            </button>
          </div>
        </form>

        {/* --- 로딩 및 에러 표시 --- */}
        {loading && (
          <div className="text-center text-blue-600 font-semibold">
            AI가 열심히 날씨와 옷차림을 분석 중입니다...
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <strong>에러 발생:</strong> {error} <br />
            (API 서버가 켜져 있는지, `http://localhost:8010`이 맞는지
            확인해 주세요.)
          </div>
        )}

        {/* --- 결과 표시 --- */}
        {result && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center mb-4">
              AI 추천 결과
            </h2>
            {result.recommendations.map((rec, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
              >
                {/* 날짜 및 날씨 요약 */}
                <div className="bg-blue-100 p-6 border-b border-blue-200">
                  <h3 className="text-2xl font-bold text-blue-800">
                    {rec.date} ({rec.day_of_week})
                  </h3>
                  <p className="text-gray-700">
                    {rec.destination} 날씨
                  </p>
                  {rec.weather_summary && (
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-700">
                      <span>
                        🌡️ 기온: {rec.weather_summary.temp}°C (체감{" "}
                        {rec.weather_summary.feels_like}°C)
                      </span>
                      <span>💧 습도: {rec.weather_summary.humidity}%</span>
                      <span>💨 풍속: {rec.weather_summary.wind_speed} m/s</span>
                      <span>
                        ☀️ 날씨: {rec.weather_summary.description}
                      </span>
                    </div>
                  )}
                  {rec.error && (
                    <p className="text-yellow-700 mt-2">
                      <strong>참고:</strong> {rec.error}
                    </p>
                  )}
                </div>

                {/* 시간대별 예보 */}
                {rec.hourly_forecasts && rec.hourly_forecasts.length > 0 && (
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      시간대별 날씨
                    </h4>
                    <div className="flex overflow-x-auto space-x-4 pb-2">
                      {rec.hourly_forecasts.map((hourly, hIndex) => (
                        <div
                          key={hIndex}
                          className="flex-shrink-0 w-28 text-center bg-gray-50 p-3 rounded-lg border"
                        >
                          <div className="font-bold text-gray-800">
                            {hourly.time}
                          </div>
                          <div className="text-lg text-blue-600">
                            {hourly.temp}°C
                          </div>
                          <div className="text-xs text-gray-600">
                            {hourly.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI 옷차림 추천 */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    AI 옷차림 추천
                  </h4>
                  {/* recommendation 내용을 \n 기준으로 줄바꿈하여 보여줍니다. */}
                  <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed font-pretendard">
                    {rec.recommendation}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherReco;