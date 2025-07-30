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

        {/* 선호테마 선택 모달 */}
        {isModalOpen && (
          <ThemeSelectionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onComplete={(selectedThemes) => {
              // 선택된 테마로 업데이트
              setNaeyong(selectedThemes);
              setIsModalOpen(false);
            }}
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

// 선호테마 선택 모달 컴포넌트 (두 번째 코드에서 가져옴)
const ThemeSelectionModal = ({ isOpen, onClose, onComplete }) => {
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [allSelectedKeywords, setAllSelectedKeywords] = useState({});
  const [keywordsByStep, setKeywordsByStep] = useState([]);
  const [categories, setCategories] = useState([]);
  const { get, patch } = useApiClient();

  const getPreferredTheme = async () => {
    try {
      const res = await get("/api/user/preferredTheme");
      const themeList = res.preferredThemes || [];

      console.log(themeList);

      if (Array.isArray(themeList) && themeList.length > 0) {
        const categoryMap = {};
        const categorizedKeywords = [];
        const categoryList = [];

        themeList.forEach((item) => {
          const catId = item.preferredThemeCategoryId;
          const catName = item.preferredThemeCategoryName;

          if (!categoryMap[catId]) {
            categoryMap[catId] = [];
            categoryList.push({
              id: catId,
              name: catName,
            });
          }
          categoryMap[catId].push(item);
        });

        categoryList.sort((a, b) => a.id - b.id);

        categoryList.forEach((cat) => {
          categorizedKeywords.push(categoryMap[cat.id] || []);
        });

        setCategories(categoryList);
        setKeywordsByStep(categorizedKeywords);

        const initialSelected = {};
        categoryList.forEach((cat) => {
          initialSelected[cat.id] = [];
        });
        setAllSelectedKeywords(initialSelected);
      }
    } catch (err) {
      console.error("선호 테마 가져오기 실패:", err.message);
    }
  };

  useState(() => {
    if (isOpen) {
      getPreferredTheme();
    }
  }, [isOpen]);

  const toggleKeyword = (index) => {
    setSelectedKeywords((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : prev.length < 5
        ? [...prev, index]
        : prev
    );
  };

  const nextStep = async () => {
    if (categories.length === 0 || !keywordsByStep[currentStep]) return;

    const currentCategoryId = categories[currentStep].id;
    const currentStepKeywords = keywordsByStep[currentStep];
    const selected = selectedKeywords
      .map((i) => currentStepKeywords[i])
      .filter((item) => !!item);

    const newAllSelected = {
      ...allSelectedKeywords,
      [currentCategoryId]: selected,
    };
    setAllSelectedKeywords(newAllSelected);

    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedKeywords([]);
    } else {
      // 마지막 단계 - API 호출해서 저장하고 완료

      try {
        // 선택된 테마 ID들을 배열로 변환
        const selectedThemeIds = Object.values(newAllSelected)
          .flat()
          .map((theme) => theme.preferredThemeId);

        console.log("💡 보낼 ID 목록:", selectedThemeIds);

        await patch("/api/user/preferredThemes", {
          preferredThemeIds: selectedThemeIds,
        });

        // 선택된 테마 데이터를 변환해서 전달
        const selectedThemesForDisplay = Object.values(newAllSelected).flat();
        onComplete(selectedThemesForDisplay);
      } catch (err) {
        console.error("선호 테마 저장 실패:", err);
        // 에러가 발생해도 UI는 업데이트
        const selectedThemesForDisplay = Object.values(newAllSelected).flat();
        onComplete(selectedThemesForDisplay);
      }
    }
  };

  const skipStep = () => {
    if (categories.length === 0) return;

    const currentCategoryId = categories[currentStep].id;
    const newAllSelected = {
      ...allSelectedKeywords,
      [currentCategoryId]: [],
    };
    setAllSelectedKeywords(newAllSelected);

    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedKeywords([]);
    } else {
      const selectedThemesForDisplay = Object.values(newAllSelected).flat();
      onComplete(selectedThemesForDisplay);
    }
  };

  const currentKeywords = keywordsByStep[currentStep];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60] font-pretendard"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-lg font-bold text-gray-900 text-center mb-4">
          {categories.length > 0 && categories[currentStep]
            ? `좋아하는 ${categories[currentStep].name} 키워드를 선택해주세요!`
            : "로딩 중..."}
        </h1>

        <div className="flex-1 overflow-y-auto mb-4">
          <div className="grid grid-cols-3 gap-3">
            {currentKeywords && Array.isArray(currentKeywords) ? (
              currentKeywords.map((keyword, index) => (
                <button
                  key={keyword.preferredThemeId}
                  onClick={() => toggleKeyword(index)}
                  className={`rounded-lg px-2 py-2 text-sm text-gray-800 border border-gray-300 hover:bg-blue-100 transition-all ${
                    selectedKeywords.includes(index)
                      ? "bg-blue-200 border-blue-400"
                      : ""
                  }`}
                >
                  {keyword.preferredThemeName}
                </button>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                키워드를 불러오는 중...
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mb-4">
          {selectedKeywords.length}/5 선택됨
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={skipStep}
            className="px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            건너뛰기
          </button>

          <div className="flex space-x-2">
            {currentStep > 0 && (
              <button
                onClick={() => {
                  setCurrentStep(currentStep - 1);
                  setSelectedKeywords([]);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                이전
              </button>
            )}
            <button
              onClick={nextStep}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              {currentStep === categories.length - 1 ? "완료" : "다음"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modal 컴포넌트 (나이, 성별 전용)
const Modal = ({ title, setIsModalOpen, content, setNaeyong }) => {
  const [selected, setSelected] = useState(content);
  const { patch, isAuthenticated } = useApiClient();
  const genderGubun = { 남자: 0, 여자: 1 };

  const apiUrl = {
    나이: "/api/user/age",
    성별: "/api/user/gender",
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
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm"
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
    hasInvalidChar: false,
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
    const hasInvalidChar = !/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/.test(password);
    const hasAllRequired = hasEnglish && hasNumber && hasSpecialChar;

    return {
      hasMinLength,
      hasMaxLength,
      hasEnglish,
      hasNumber,
      hasSpecialChar,
      hasInvalidChar,
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
                <ValidationItem
                  isValid={!passwordValidation.hasInvalidChar}
                  text="연속 문자, 숫자 금지"
                  isError={passwordValidation.hasInvalidChar}
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
                {passwordValidation.hasInvalidChar && (
                  <div className="text-red-600 text-sm mt-2">
                    사용 불가능한 문자입니다
                  </div>
                )}
                {!passwordValidation.hasAllRequired &&
                  passwordValidation.hasMinLength &&
                  !passwordValidation.hasInvalidChar && (
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
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all duration-200 shadow-sm"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
