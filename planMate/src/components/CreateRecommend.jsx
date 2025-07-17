import { useState } from "react";

export default function CreateRecommend({handleDragStart}) {
  const [selectedTab, setSelectedTab] = useState('관광지');

  return (
    <div className="flex-1">
      <div className="flex space-x-1">
        {['관광지', '숙소', '식당'].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-t-lg ${
              selectedTab === tab
                ? 'bg-main text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setSelectedTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="border border-gray-300 rounded-lg rounded-tl-none h-[calc(100vh-227px)] overflow-y-auto">
        {places[selectedTab].map(place => (
          <div
            key={place.id}
            className="flex items-center p-5 cursor-move border-b border-gray-300 hover:bg-gray-100"
            draggable
            onDragStart={(e) => handleDragStart(e, place)}
          >
            <div className="w-12 h-12 bg-gray-300 rounded-lg mr-4 flex items-center justify-center">
              <img src={place.image} alt={place.name} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="font-bold text-xl">{place.name}</div>
              <div className="flex items-center space-x-2">
                <span className="text-main">{place.type}</span>
                <p><span className="text-yellow-400">★</span> {place.rating}</p>
                <span className="text-gray-500">{place.location}</span>
              </div>
            </div>
            <button className="p-1 hover:bg-gray-200 rounded">
              자세히 보기
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}