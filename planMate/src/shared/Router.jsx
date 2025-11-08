import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Complete from "../pages/Complete";
import Create from "../pages/NewCreate";
import Mypage from "../pages/Mypage";
import Signuptest from "../pages/Signuptest";
import Passwordfindtest from "../pages/Passwordfindtest";
import Logintest from "../pages/Logintest";
import Themetest from "../pages/Themetest";
import Landingpage from "../pages/Landingpage";
import Create2 from "../pages/Create2";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="complete" element={<Complete />} />
        <Route path="create" element={<Create />} />
        <Route path="mypage" element={<Mypage />} />
        <Route path="signuptest" element={<Signuptest />} />
        <Route path="logintest" element={<Logintest />} />
        <Route path="themetest" element={<Themetest />} />
        <Route path="passwordfindtest" element={<Passwordfindtest />} />
        <Route path="landingpage" element={<Landingpage />} />
        <Route path="create2" element={<Create2 />} />
        {/* --- 날씨별 ai 옷차림 추천 경로 추가 --- */}
        <Route
          path="weather-recommendation"
          element={<WeatherReco />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
