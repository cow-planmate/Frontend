import ProfileText from "./ProfileText";

export default function Profile() {
  const exampleProfile = {
    "Email": "example@example.com",
    "Age": "22",
    "Gender": "남자"
  }

  const order = ["이메일", "나이", "성별", "선호테마", "비밀번호"];

  return (
    <div className='relative border border-gray-300 rounded-lg w-[380px] min-h-[746px] p-7 mr-5'>
      <div className="flex flex-col items-center text-2xl pb-5 border-b border-gray-300">
        <div className="w-24 h-24 bg-no-repeat bg-contain bg-[url('./assets/imgs/default.png')] rounded-full"></div>
        <p className="pt-3 font-bold">닉네임</p>
      </div>
      <ProfileText title="이메일" content={exampleProfile.Email} change={true} />
      <ProfileText title="나이" content={exampleProfile.Age} change={true} />
      <ProfileText title="성별" content={exampleProfile.Gender} change={true} />
      <ProfileText title="선호테마" content="써넣을말이없음" change={true} />
      <ProfileText title="비밀번호" content="password" change={false} />
      <div className="underline text-red-500 text-sm absolute bottom-7">탈퇴하기</div>
    </div>
  );
}