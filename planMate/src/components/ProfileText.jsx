// ProfileText.jsx
import { useState } from "react";
import { useApiClient } from "../assets/hooks/useApiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ThemeStart from "../components/changeThemeStart";
import Theme from "../components/changeTheme";

import {
  faEye,
  faEyeSlash,
  faCheck,
  faUtensils,
  faBed,
  faMapMarkerAlt,
  faMars,
  faVenus,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { Check, X } from "lucide-react";

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
  const [isThemestartOpen, setIsThemestartOpen] = useState(false);
  const [selectedThemeKeywords, setSelectedThemeKeywords] = useState({
    tourist: [],
    accommodation: [],
    restaurant: [],
  });
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isNicknameOpen, setIsNicknameOpen] = useState(false);

  // 성별 아이콘 결정 함수
  const getGenderIcon = (genderText) => {
    return genderText === "남자" ? faMars : faVenus;
  };

  // 표시할 아이콘 결정
  const displayIcon = title === "성별" ? getGenderIcon(naeyong) : icon;

  const handleThemestartOpen = () => {
    setIsThemestartOpen(true);
  };

  const handleThemestartClose = () => {
    setIsThemestartOpen(false);
  };

  const handleThemeOpen = () => {
    setIsThemeOpen(true);
  };

  const handleThemeClose = () => {
    setIsThemeOpen(false);
  };

  const handleThemeComplete = (keywords) => {
    setSelectedThemeKeywords(keywords);
    setIsThemeOpen(false);
  };

  let categoryNames = null;
  let groupedThemes = null;

  if (title == "선호테마") {
    categoryNames = {
      0: "관광지",
      1: "숙소",
      2: "식당",
    };

    // 카테고리 아이콘 매핑
    const categoryIcons = {
      0: faMapMarkerAlt, // 관광지
      1: faUtensils, // 식당
      2: faBed, // 숙소
    };

    // naeyong 사용 (content 대신)
    groupedThemes = naeyong.reduce((acc, theme) => {
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
              onClick={() => handleThemestartOpen()}
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

        {/* 선호테마 선택 모달 */}
        {isThemestartOpen && (
          <ThemeStart
            isOpen={isThemestartOpen}
            onClose={handleThemestartClose}
            onThemeOpen={handleThemeOpen}
            selectedThemeKeywords={selectedThemeKeywords}
            onComplete={(selectedThemes) => {
              // 선택된 테마로 업데이트
              setNaeyong(selectedThemes);
              setIsThemestartOpen(false); // 수정: setIsModalOpen -> setIsThemestartOpen
            }}
          />
        )}
        {isNicknameOpen && (
          <NicknameModal
            setIsNicknameOpen={setIsNicknameOpen}
            currentNickname={naeyong}
            setNaeyong={setNaeyong}
          />
        )}
        <Theme
          isOpen={isThemeOpen}
          onClose={handleThemeClose}
          onComplete={handleThemeComplete}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={displayIcon}
            className={`w-4 h-4 ${iconColor}`}
          />
          <div className="flex-1">
            <span className="font-semibold text-lg text-gray-800">{title}</span>
            {title !== "비밀번호" && (
              <div className="text-gray-600 text-sm mt-1">{naeyong}</div>
            )}
          </div>
        </div>
        {title === "비밀번호" ? (
          <button
            onClick={() => setIsPasswordOpen(true)}
            className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            변경하기
          </button>
        ) : title === "닉네임" ? (
          <button
            onClick={() => setIsNicknameOpen(true)}
            className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
          >
            <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
          </button>
        ) : (
          change && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              변경하기
            </button>
          )
        )}
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

// Modal 컴포넌트 (나이, 성별 전용)
const Modal = ({ title, setIsModalOpen, content, setNaeyong }) => {
  const [selected, setSelected] = useState(content);
  const { patch, isAuthenticated } = useApiClient();
  const genderGubun = { 남자: 0, 여자: 1 };
  const BASE_URL = import.meta.env.VITE_API_URL;

  const apiUrl = {
    나이: `${BASE_URL}/api/user/age`,
    성별: `${BASE_URL}/api/user/gender`,
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
                ? "bg-main text-white hover:bg-blue-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            남자
          </button>
          <button
            onClick={() => setSelected("여자")}
            className={`py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200 ${
              selected === "여자"
                ? "bg-main text-white hover:bg-blue-800"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
        {title === "나이" ? age : title === "성별" ? gender() : null}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
          >
            취소
          </button>
          <button
            onClick={() => patchApi(title, selected)}
            className="px-4 py-2.5 bg-main hover:bg-blue-800 text-white rounded-xl font-medium transition-all duration-200 shadow-sm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

// PasswordModal 컴포넌트 (기존과 동일)
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

  const [passwordValidation, setPasswordValidation] = useState({
    hasMinLength: false,
    hasMaxLength: true,
    hasEnglish: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasAllRequired: false,
  });

  const ValidationItem = ({ isValid, text, isError = false }) => (
    <div className="flex items-center gap-2 text-sm">
      {isValid ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X
          className={`w-4 h-4 ${isError ? "text-red-500" : "text-gray-400"}`}
        />
      )}
      <span
        className={
          isValid
            ? "text-green-600"
            : isError
            ? "text-red-600"
            : "text-gray-500"
        }
      >
        {text}
      </span>
    </div>
  );

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasMaxLength = password.length <= 20;
    const hasEnglish = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const hasAllRequired = hasEnglish && hasNumber && hasSpecialChar;

    return {
      hasMinLength,
      hasMaxLength,
      hasEnglish,
      hasNumber,
      hasSpecialChar,
      hasAllRequired,
    };
  };

  const handleInputChange = (field, value) => {
    if (field === "password") {
      setPassword(value);
      const validation = validatePassword(value);
      setPasswordValidation(validation);
    }
  };

  const passwordChange = async () => {
    setWrongPrev(false);
    setWrongRe(false);
    const BASE_URL = import.meta.env.VITE_API_URL;

    if (isAuthenticated()) {
      if (rePassword != "" && password == rePassword) {
        if (prevPassword != "") {
          try {
            const passwordVerified = await post(
              `${BASE_URL}/api/auth/password/verify`,
              {
                password: prevPassword,
              }
            );

            if (passwordVerified.passwordVerified) {
              try {
                await patch(`${BASE_URL}/api/auth/password`, {
                  password: password,
                  confirmPassword: rePassword,
                });
                setIsPasswordOpen(false);
                alert("비밀번호가 변경되었습니다!");
              } catch (err) {
                console.error(
                  "비밀번호를 변경하는 과정에서 오류가 발생했습니다:",
                  err
                );
                alert("비밀번호를 변경하는 과정에서 오류가 발생했습니다");
              }
            } else {
              setWrongPrev(true);
            }
          } catch (err) {
            console.error(
              "현재 비밀번호를 검증하는 과정에서 오류가 발생했습니다",
              err
            );
            alert("비밀번호를 변경하는 과정에서 오류가 발생했습니다");
          }
        } else {
          setWrongPrev(true);
        }
      } else {
        setWrongRe(true);
      }
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
                value={password}
                onChange={(e) => handleInputChange("password", e.target.value)}
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

            {password && password.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
                <ValidationItem
                  isValid={passwordValidation.hasMinLength}
                  text="최소 8자"
                />
                <ValidationItem
                  isValid={
                    passwordValidation.hasEnglish &&
                    passwordValidation.hasNumber &&
                    passwordValidation.hasSpecialChar
                  }
                  text="영문, 숫자, 특수문자 3가지 조합"
                />

                {!passwordValidation.hasMinLength && (
                  <div className="text-red-600 text-sm mt-2">
                    최소 8글자 이상 작성해야합니다
                  </div>
                )}
                {!passwordValidation.hasMaxLength && (
                  <div className="text-red-600 text-sm mt-2">
                    최대 20글자까지 작성할 수 있습니다
                  </div>
                )}

                {!passwordValidation.hasAllRequired &&
                  passwordValidation.hasMinLength && (
                    <div className="text-red-600 text-sm mt-2">
                      영어, 숫자, 특수문자 모두 포함해서 작성해주십시오
                    </div>
                  )}
              </div>
            )}
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
                value={rePassword}
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
            className="px-4 py-2.5 bg-main hover:bg-blue-800 text-white rounded-xl font-medium transition-all duration-200 shadow-sm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
