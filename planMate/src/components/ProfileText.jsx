export default function ProfileText({title, content, change}) {
  return (
    <div className="py-3 border-b border-gray-300">
      <div className="flex justify-between pb-1">
        <p className="font-semibold text-xl">{title}</p>
        {change ?<div className="underline text-blue-500 text-sm">변경하기</div> :<></>}
      </div>
      {content === 'password'
      ?<button className="mt-1 px-2 py-1 border border-gray-300 rounded-lg hover:bg-gray-100">변경하기</button>
      :<p>{content}</p>}
    </div>
  )
}