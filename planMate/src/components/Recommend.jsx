import { useState } from "react"

export default function Recommend() {
  const [category, setCategory] = useState(0);
  const cate = ["관광지", "숙소", "식당"];

  return (
    <div>
      <div>
        {cate.map((item, index) => {
          return (
            <button 
              key={index}
              className={`${index == category ? "bg-main text-white font-semibold" : "bg-gray-300 hover:bg-gray-400"} py-2 w-20 rounded-t-lg`}
              onClick={() => {
                setCategory(index)
              }}
            >
              {item}
            </button>
          )
        })}
      </div>
      <div className="border border-gray-300 rounded-lg rounded-tl-none w-[906px] p-5">
        {category}
      </div>
    </div>
  )
}