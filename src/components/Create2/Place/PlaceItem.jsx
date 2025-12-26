import { useDraggable } from "@dnd-kit/core";
import { useSearchParams } from "react-router-dom";

export default function PlaceItem({place}) {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, place });

  const BASE_URL = import.meta.env.VITE_API_URL;
  const imageUrl = place.placeId ? `${BASE_URL}/image/place/${encodeURIComponent(place.placeId)}` : place?.iconUrl;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex items-center p-5 hover:bg-gray-100"
    >
      <div className="w-12 h-12 bg-gray-300 rounded-lg mr-4 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={place.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = place?.iconUrl || defaultImg;
          }}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="flex-1 space-y-1">
        <div className="font-bold text-xl">{place.name}</div>
        <div className="flex items-center space-x-2">
          <p>
            <span className="text-yellow-400">★</span> {place.rating}
          </p>
          <span className="text-gray-500">{place.formatted_address}</span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          window.open(place.url);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="px-2 py-1 hover:bg-gray-200 rounded-lg border border-gray-300"
      >
        구글 지도
      </button>
    </div>
  )
}