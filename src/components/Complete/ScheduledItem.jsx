export const ScheduledItem = ({ item, START_HOUR }) => {
  const SLOT_HEIGHT = 40;
  
  const place = item?.place;

  const localState = {
    height: item.duration * SLOT_HEIGHT,
    top: 20 + item.start * SLOT_HEIGHT,
  };

  const formatTime = (slotIndex) => {
    const totalMin = slotIndex * 15 + START_HOUR * 60;
    const h = Math.floor(totalMin / 60).toString().padStart(2, '0');
    const m = (totalMin % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  const tripCategory = { 0: "관광지", 1: "숙소", 2: "식당", 4: "검색" };
  const tripColor1 = { 0: "bg-lime-50", 1: "bg-orange-50", 2: "bg-blue-50", 4: "bg-gray-50" };
  const tripColor2 = { 0: "bg-lime-100", 1: "bg-orange-100", 2: "bg-blue-100", 4: "bg-gray-100" };
  const tripColor3 = { 0: "border-lime-500", 1: "border-orange-500", 2: "border-blue-500", 4: "boder-gray-500" };
  const tripColor4 = { 0: "text-lime-600", 1: "text-orange-600", 2: "text-blue-600", 4: "text-gray-600" };
  const tripColor5 = { 0: "text-lime-900", 1: "text-orange-900", 2: "text-blue-900", 4: "text-gray-900" };

  return (
    <div
      style={{
        top: localState.top,
        height: localState.height,
        position: 'absolute',
        left: '4rem',
        right: '8px',
      }}
      className="absolute touch-none"
    >
        <div
          className={`w-full h-full ${tripColor1[place.categoryId]} border-l-4 ${tripColor3[place.categoryId]} rounded shadow-sm overflow-hidden select-none hover:${tripColor2[place.categoryId]} transition-colors
            ${localState.height <= 80 ? 'flex flex-col items-start justify-center px-5' : "p-5"}`}
        >
          <div className="w-full flex items-center gap-2 min-w-0">
            <div className="flex-1 min-w-0">
              <div
                className={`font-bold text-lg ${tripColor5[place.categoryId]} truncate pointer-events-none`}
              >
                {place.name}
              </div>

              <div
                className={`text-xs ${tripColor4[place.categoryId]} font-medium pointer-events-none`}
              >
                <p>
                  {tripCategory[place.categoryId]} | {formatTime(item.start)} -{' '}
                  {formatTime(item.start + Math.round(localState.height / SLOT_HEIGHT))}
                </p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};