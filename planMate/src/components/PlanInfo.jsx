export default function PlanInfo({info}) {
  const flexCenter = "flex items-center";

  return (
    <div className={`w-full pb-8 ${flexCenter} justify-between`}>
      <div className={flexCenter}>
        <p className="text-lg font-semibold mr-12">{info.title}</p>
        <div className={`${flexCenter} mr-8`}>
          <p className="text-gray-500 mr-3">인원 수</p>

          <p className="px-2 py-1 bg-slate-200 rounded-md text-sm mr-2">성인</p>
          <p className="text-lg mr-4">{info.person.adult}명</p>

          <p className="px-2 py-1 bg-slate-200 rounded-md text-sm mr-2">어린이</p>
          <p className="text-lg">{info.person.children}명</p>
        </div>
        <div className={`${flexCenter} mr-8`}>
          <p className="text-gray-500 mr-3">출발지</p>
          <p className="text-lg text-ellipsis overflow-hidden max-w-56 whitespace-nowrap">{info.departure}</p>
        </div>
        <div className={`${flexCenter} mr-8`}>
          <p className="text-gray-500 mr-3">여행지</p>
          <p className="text-lg">{info.travel}</p>
        </div>
        <div className={flexCenter}>
          <p className="text-gray-500 mr-3">이동수단</p>
          <p className="text-lg">{info.trans}</p>
        </div>
      </div>
      <div className="{flexCenter}">

      </div>
    </div>
  )
}