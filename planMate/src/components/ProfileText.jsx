// ProfileText.jsx
import { useState } from "react";
import { useApiClient } from "../assets/hooks/useApiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCheck,
  faUtensils,
  faBed,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function ProfileText({
  icon,
  title,
  content,
  change,
  iconColor,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [naeyong, setNaeyong] = useState(content);

  let categoryNames = null;
  let groupedThemes = null;

  if (title == "선호테마") {
    categoryNames = {
      0: "관광지",
      1: "식당",
      2: "숙소",
    };

    // 카테고리 아이콘 매핑
    const categoryIcons = {
      0: faMapMarkerAlt, // 관광지
      1: faUtensils, // 식당
      2: faBed, // 숙소
    };

    groupedThemes = content.reduce((acc, theme) => {
      const categoryId = theme.preferredThemeCategoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(theme);
      return acc;
    }, {});

    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={icon} className={`w-4 h-4 ${iconColor}`} />
            <p className="font-semibold text-lg text-gray-800">{title}</p>
          </div>
          {change && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              변경하기
            </button>
          )}
        </div>

        <div className="space-y-4">
          {Object.entries(groupedThemes).map(([categoryId, themes]) => (
            <div key={categoryId} className="space-y-2">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={categoryIcons[categoryId]}
                  className="w-4 h-4 text-gray-600"
                />
                <span className="font-medium text-gray-700">
                  {categoryNames[categoryId]}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 ml-6">
                {themes.map((theme) => (
                  <span
                    key={theme.preferredThemeId}
                    className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-sm font-medium text-blue-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    {theme.preferredThemeName}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
          <Modal
            title={title}
            setIsModalOpen={setIsModalOpen}
            content={naeyong}
            setNaeyong={setNaeyong}
          />
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={icon} className={`w-4 h-4 ${iconColor}`} />
          <div className="flex-1">
            <span className="font-semibold text-lg text-gray-800">{title}</span>
            <div className="text-gray-600 text-sm mt-1">
              {content === "password" ? "••••••••" : naeyong}
            </div>
          </div>
        </div>
        {change ? (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            변경하기
          </button>
        ) : content === "password" ? (
          <button
            onClick={() => setIsPasswordOpen(true)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            변경하기
          </button>
        ) : null}
      </div>

      {isModalOpen && (
        <Modal
          title={title}
          setIsModalOpen={setIsModalOpen}
          content={naeyong}
          setNaeyong={setNaeyong}
        />
      )}
      {isPasswordOpen && (
        <PasswordModal setIsPasswordOpen={setIsPasswordOpen} />
      )}
    </div>
  );
}

// Modal 컴포넌트 (나이, 성별, 선호테마 전용)
const Modal = ({ title, setIsModalOpen, content, setNaeyong }) => {
  const [selected, setSelected] = useState(content);
  const { patch, isAuthenticated } = useApiClient();
  const genderGubun = { 남자: 0, 여자: 1 };

  const apiUrl = {
    나이: "/api/user/age",
    성별: "/api/user/gender",
    선호테마: "/api/user/preferredThemes",
  };

  const handleChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setSelected(numericValue);
  };

  const age = (
    <div className="space-y-3 my-6">
      <p className="text-sm font-medium text-gray-700">나이 입력</p>
      <input
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
        value={selected}
        type="number"
        min={1}
        onChange={handleChange}
        placeholder="나이를 입력하세요"
      />
    </div>
  );

  const gender = () => {
    return (
      <div className="space-y-3 my-6">
        <p className="text-sm font-medium text-gray-700">성별 선택</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelected("남자")}
            className={`py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200 ${
              selected === "남자"
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            남자
          </button>
          <button
            onClick={() => setSelected("여자")}
            className={`py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200 ${
              selected === "여자"
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            여자
          </button>
        </div>
      </div>
    );
  };

  const patchApi = async (title, data) => {
    if (isAuthenticated()) {
      try {
        if (title == "나이") {
          await patch(apiUrl[title], {
            age: data,
          });
        } else if (title == "성별") {
          await patch(apiUrl[title], {
            gender: genderGubun[data],
          });
        }
        setNaeyong(data);
        setIsModalOpen(false);
      } catch (err) {
        console.error("패치에 실패해버렸습니다:", err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{title} 변경</h2>
        {title === "나이" ? (
          age
        ) : title === "성별" ? (
          gender()
        ) : (
          <div className="my-6 text-center text-gray-500">준비 중입니다</div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
          >
            취소
          </button>
          <button
            onClick={() => patchApi(title, selected)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

// PasswordModal 컴포넌트
const PasswordModal = ({ setIsPasswordOpen }) => {
  const { post, patch, isAuthenticated } = useApiClient();

  const [prevPassword, setPrevPassword] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [showPrev, setShowPrev] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showRe, setShowRe] = useState(false);

  const [wrongPrev, setWrongPrev] = useState(false);
  const [wrongRe, setWrongRe] = useState(false);

  const [is8to20, setIs8to20] = useState(false);
  const [isMix, setIsMix] = useState(false);

  const passwordChange = async () => {
    setWrongPrev(false);
    setWrongRe(false);

    if (isAuthenticated()) {
      if (rePassword != "" && password == rePassword) {
        if (prevPassword != "") {
          try {
            const passwordVerified = await post("/api/auth/password/verify", {
              password: prevPassword,
            });

            if (passwordVerified.passwordVerified) {
              try {
                await patch("/api/auth/password", {
                  password: password,
                  confirmPassword: rePassword,
                });
                setIsPasswordOpen(false);
              } catch (err) {
                console.error(
                  "비밀번호를 변경하는 과정에서 오류가 발생했습니다:",
                  err
                );
              }
            } else {
              setWrongPrev(true);
            }
          } catch (err) {
            console.error(
              "현재 비밀번호를 검증하는 과정에서 오류가 발생했습니다:",
              err
            );
          }
        } else {
          setWrongPrev(true);
        }
      } else {
        setWrongRe(true);
      }
    }
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);

    if (password.length >= 8 && password.length <= 20) {
      setIs8to20(true);
    } else {
      setIs8to20(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">비밀번호 변경</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              현재 비밀번호
            </p>
            <div className="relative">
              <input
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                type={showPrev ? "text" : "password"}
                placeholder="현재 비밀번호를 입력하세요"
                onChange={(e) => setPrevPassword(e.target.value)}
              />
              <button
                onClick={() => setShowPrev((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <FontAwesomeIcon
                  icon={showPrev ? faEye : faEyeSlash}
                  className="w-4 h-4"
                />
              </button>
            </div>
            {wrongPrev && (
              <span className="text-red-500 text-sm mt-1 block">
                현재 비밀번호가 일치하지 않습니다.
              </span>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              새 비밀번호
            </p>
            <div className="relative">
              <input
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                type={showNew ? "text" : "password"}
                placeholder="새 비밀번호를 입력하세요"
                onChange={handlePassword}
              />
              <button
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <FontAwesomeIcon
                  icon={showNew ? faEye : faEyeSlash}
                  className="w-4 h-4"
                />
              </button>
            </div>
            <div className="mt-3 space-y-2">
              <p
                className={`text-xs flex items-center gap-2 ${
                  isMix ? "text-green-600" : "text-gray-500"
                }`}
              >
                <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                영어, 숫자, 특수문자 3가지 조합
              </p>
              <p
                className={`text-xs flex items-center gap-2 ${
                  is8to20 ? "text-green-600" : "text-gray-500"
                }`}
              >
                <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                최소 8자 ~ 최대 20자
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              비밀번호 재입력
            </p>
            <div className="relative">
              <input
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all duration-200"
                type={showRe ? "text" : "password"}
                placeholder="비밀번호를 다시 입력하세요"
                onChange={(e) => setRePassword(e.target.value)}
              />
              <button
                onClick={() => setShowRe((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <FontAwesomeIcon
                  icon={showRe ? faEye : faEyeSlash}
                  className="w-4 h-4"
                />
              </button>
            </div>
            {wrongRe && (
              <span className="text-red-500 text-sm mt-1 block">
                비밀번호가 일치하지 않습니다
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setIsPasswordOpen(false)}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
          >
            취소
          </button>
          <button
            onClick={() => passwordChange()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
