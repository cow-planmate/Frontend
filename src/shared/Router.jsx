import { BrowserRouter, Route, Routes } from "react-router-dom";
import Complete from "../pages/Complete";
import Create2 from "../pages/Create2";
import Home from "../pages/Home";
import Landingpage from "../pages/Landingpage";
import Logintest from "../pages/Logintest";
import Mypage from "../pages/Mypage";
import Create from "../pages/NewCreate";
import OAuthAdditionalInfo from "../pages/OAuthAdditionalInfo";
import OAuthCallback from "../pages/OAuthCallback";
import Passwordfindtest from "../pages/Passwordfindtest";
import PlanmateV2 from "../pages/PlanmateV2";
import Signuptest from "../pages/Signuptest";
import Themetest from "../pages/Themetest";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlanmateV2 />} />
        <Route path="community" element={<PlanmateV2 />} />
        <Route path="mypage" element={<PlanmateV2 />} />
        <Route path="legacy-home" element={<Home />} />
        <Route path="complete" element={<Complete />} />
        <Route path="create" element={<Create />} />
        <Route path="signuptest" element={<Signuptest />} />
        <Route path="logintest" element={<Logintest />} />
        <Route path="themetest" element={<Themetest />} />
        <Route path="passwordfindtest" element={<Passwordfindtest />} />
        <Route path="landingpage" element={<Landingpage />} />
        <Route path="create2" element={<Create2 />} />

        <Route path="oauth/callback" element={<OAuthCallback />} />
        <Route path="oauth/additional-info" element={<OAuthAdditionalInfo />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
