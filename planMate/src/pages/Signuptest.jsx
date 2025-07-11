import React, { useState } from "react";

function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form className="font-pretendard">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
        <div className="w-full bg-white rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <p className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              회원가입
            </p>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                이메일
              </label>
              <input
                placeholder="honggildong@planmate.com"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                id="username"
                type="text"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                비밀번호
              </label>
              <input
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                id="password"
                type={showPassword ? "text" : "password"}
              />
              <label className="inline-flex items-center mt-2 text-gray-700 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                비밀번호 보기
              </label>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                비밀번호 확인
              </label>
              <input
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
              />
              <label className="inline-flex items-center mt-2 text-gray-700 text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showConfirmPassword}
                  onChange={() => setShowConfirmPassword(!showConfirmPassword)}
                />
                비밀번호 보기
              </label>
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5"></div>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                닉네임
              </label>
              <input
                placeholder="홍길동"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5"
                id="username"
                type="text"
              />
            </div>

            <button
              className="w-full bg-main hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center focus:ring-blue-800 text-white"
              type="submit"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default App;
