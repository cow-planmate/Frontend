import { useState } from "react"
import { useApiClient } from "../assets/hooks/useApiClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheck, faC } from "@fortawesome/free-solid-svg-icons";

export default function ProfileText({title, content, change}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [naeyong, setNaeyong] = useState(content);

  return (
    <div className="py-3 border-b border-gray-300">
      <div className="flex justify-between pb-1">
        <p className="font-semibold text-xl">{title}</p>
        {change ?<button onClick={() => setIsModalOpen(true)} className="underline text-blue-500 text-sm">변경하기</button> :<></>}
      </div>
      {content === 'password'
      ?<button onClick={() => setIsPasswordOpen(true)} className="mt-1 px-2 py-1 border border-gray-300 rounded-lg hover:bg-gray-100">변경하기</button>
      :<p>{naeyong}</p>}

      {isModalOpen ? <Modal title={title} setIsModalOpen={setIsModalOpen} content={naeyong} setNaeyong={setNaeyong}/> : <></>}
      {isPasswordOpen ? <PasswordModal setIsPasswordOpen={setIsPasswordOpen} /> : <></>}

    </div>
  )
}

const Modal = ({title, setIsModalOpen, content, setNaeyong}) => { // 나이, 성별, 선호테마 전용
  const [selected, setSelected] = useState(content);
  const { patch, isAuthenticated } = useApiClient();
  const genderGubun = {"남자": 0, "여자": 1};

  const apiUrl = {
    "나이": "/api/user/age",
    "성별": "/api/user/gender",
    "선호테마": "/api/user/preferredThemes",
  }

  const handleChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setSelected(numericValue);
  }

  const age = (
    <div className="space-y-2 my-4">
      <p className="text-sm text-gray-500">나이 입력</p>
      <input 
        className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
        value={selected}
        type="number"
        min={0}
        onChange={handleChange}
      />
    </div>
  )

  const gender = () => {
    return (
      <div className="space-y-2 my-4">
        <p className="text-sm text-gray-500">성별 선택</p>
        <div className="space-x-2 flex w-full">
          <button 
            onClick={() => setSelected("남자")} 
            className={
              `py-2 px-4 w-full rounded-lg border hover:bg-gray-100 
              ${selected === "남자" ? "border-main" : "border-gray-300"}`
            }
          >
            남자
          </button>
          <button 
            onClick={() => setSelected("여자")} 
            className= {
              `py-2 px-4 w-full rounded-lg border hover:bg-gray-100
              ${selected === "여자" ? "border-main" : "border-gray-300"}`
            }
          >
            여자
          </button>
        </div>
      </div>
    )
  }

  const patchApi = async (title, data) => {
    if (isAuthenticated()) {
      try {
        if (title == "나이") {
          await patch(apiUrl[title], {
            age: data
          });
        } else if (title == "성별") {
          await patch(apiUrl[title], {
            gender: genderGubun[data]
          })
        }
        setNaeyong(data);
        setIsModalOpen(false);

      } catch (err) {
        console.error("패치에 실패해버렸습니다:", err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold">{title} 변경</h2>
        {title === "나이" ? age
        : title === "성별" ? gender()
        : <></>}
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={() => patchApi(title, selected)}
            className="px-3 py-1 bg-main text-white rounded"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

const PasswordModal = ({setIsPasswordOpen}) => {
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
      if (rePassword != "" && (password == rePassword)) {
        if (prevPassword != "") {
          try {
            const passwordVerified = await post("/api/auth/password/verify", {
              password: prevPassword
            });

            if (passwordVerified.passwordVerified) {
              try {
                await patch("/api/auth/password", {
                  password: password,
                  confirmPassword: rePassword
                });
                setIsPasswordOpen(false);
              } catch (err) {
                console.error("비밀번호를 변경하는 과정에서 오류가 발생했습니다:", err);
              }

            } else {
              setWrongPrev(true);
            }

          } catch (err) {
            console.error("현재 비밀번호를 검증하는 과정에서 오류가 발생했습니다:", err);
          }
        } else {
          setWrongPrev(true);
        }
      } else {
        setWrongRe(true);
      }
    }
  }

  const handlePassword = (e) => {
    setPassword(e.target.value);

    if (password.length >= 8 && password.length <= 20) {
      setIs8to20(true);
    } else {
      setIs8to20(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold">비밀번호 변경</h2>
        <div className="my-4 space-y-3">
          <div>
            <p className="text-sm text-gray-500 mb-2">현재 비밀번호</p>
            <div className="relative">
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                type={showPrev ? "text" : "password"}
                placeholder="현재 비밀번호를 입력하세요."
                onChange={(e) => setPrevPassword(e.target.value)}
              />
              <button
                onClick={() => setShowPrev((prev) => !prev)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${showPrev ? "text-gray-700" : "text-gray-500"}`}
              >
                {showPrev ? <FontAwesomeIcon icon={faEye}/> : <FontAwesomeIcon icon={faEyeSlash}/>}
              </button>
            </div>
            {wrongPrev ? <span className="text-red-500 text-sm">현재 비밀번호가 일치하지 않습니다.</span> : <></>}
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">비밀번호</p>
            <div className="relative">
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                type={showNew ? "text" : "password"}
                placeholder="비밀번호를 입력하세요."
                onChange={handlePassword}
              />
              <button
                onClick={() => setShowNew((prev) => !prev)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${showNew ? "text-gray-700" : "text-gray-500"}`}
              >
                {showNew ? <FontAwesomeIcon icon={faEye}/> : <FontAwesomeIcon icon={faEyeSlash}/>}
              </button>
            </div>
            <div className="mt-2 space-y-1">
              <p className={`text-sm ${isMix ? "text-main" : "text-gray-500"}`}><FontAwesomeIcon icon={faCheck} /> 영어, 숫자, 특수문자 3가지 조합</p>
              <p className={`text-sm ${is8to20 ? "text-main" : "text-gray-500"}`}><FontAwesomeIcon icon={faCheck} /> 최소 8자 ~ 최대 20자</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">비밀번호 재입력</p>
            <div className="relative">
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                type={showRe ? "text" : "password"}
                placeholder="비밀번호를 다시 입력하세요."
                onChange={(e) => setRePassword(e.target.value)}
              />
              <button
                onClick={() => setShowRe((prev) => !prev)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm ${showRe ? "text-gray-700" : "text-gray-500"}`}
              >
                {showRe ? <FontAwesomeIcon icon={faEye}/> : <FontAwesomeIcon icon={faEyeSlash}/>}
              </button>
            </div>
            {wrongRe ? <span className="text-red-500 text-sm">비밀번호가 일치하지 않습니다</span> : <></>}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsPasswordOpen(false)}
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={() => passwordChange()}
            className="px-3 py-1 bg-main text-white rounded"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  )
}