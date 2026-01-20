import useTimetableStore from "../store/Timetables";

export const formatTime = (slotIndex) => {
  const { START_HOUR } = useTimetableStore.getState();

  const totalMin = slotIndex * 15 + START_HOUR * 60;
  const h = Math.floor(totalMin / 60).toString().padStart(2, '0');
  const m = (totalMin % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

export const checkOverlap = (start, duration, items, excludeId = null) => {
  const end = start + duration;
  if (!items) {
    return false;
  }
  return items.some((i) => {
    if (excludeId && i.id === excludeId) return false;
    const iEnd = i.start + i.duration;
    console.log(start, end)
    console.log(i.start, iEnd)
    return start < iEnd && end > i.start;
  });
};

export const findEmptySlot = (duration, items) => {
  const { TOTAL_SLOTS } = useTimetableStore.getState();

  for (let i = 0; i <= TOTAL_SLOTS - duration; i++) {
    const isOverlapping = checkOverlap(i, duration, items);
    if (!isOverlapping) {
      return i;
    }
  }
  return -1;
};

export const getTimeTableId = (timetables, selectedDay) => {
  return timetables[selectedDay].timeTableId;
}

export function slotIndexToTime(START_HOUR, newStart, intervalMinutes = 15) {
  const totalMinutes =
    START_HOUR * 60 + newStart * intervalMinutes;

  const h = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const m = (totalMinutes % 60)
    .toString()
    .padStart(2, '0');

  return `${h}:${m}:00`;
}

export function exportBlock(timeTableId, place, newStart, duration, blockId) {
  const { START_HOUR } = useTimetableStore.getState();
  const blockStartTime = slotIndexToTime(START_HOUR, newStart);
  const blockEndTime = slotIndexToTime(START_HOUR, newStart + duration);
  const block = {
    blockId: Math.random(),
    placeName: place.name,
    placeTheme: blockId,
    placeRating: place.rating,
    placeAddress: place.formatted_address,
    placeLink: place.url,
    blockStartTime: blockStartTime,
    blockEndTime: blockEndTime,
    xLocation: place.xlocation,
    yLocation: place.ylocation,
    placeCategoryId: place.categoryId,
    timeTableId: timeTableId,
    placePhotoId: place.placeId
  }
  return block;
}

export function getTimeSlotIndex(timeTableStartTime, time, intervalMinutes = 15) {
  const toMinutes = (t) => {
    const [h, m, s] = t.split(':').map(Number);
    return h * 60 + m + s / 60;
  };

  const startMinutes = toMinutes(timeTableStartTime);
  const targetMinutes = toMinutes(time);

  return Math.floor((targetMinutes - startMinutes) / intervalMinutes);
}

export function convertBlock(block) {
  const timeTableId = block.timeTableId;
  const { timetables } = useTimetableStore.getState();
  const timeTableStartTime = timetables.find(
    (t) => t.timeTableId === timeTableId
  )?.timeTableStartTime;
  const start = getTimeSlotIndex(timeTableStartTime, block.blockStartTime);
  const duration = getTimeSlotIndex(block.blockStartTime, block.blockEndTime);
  const blockId = block.placeTheme;
  console.log(start)
  console.log(duration)

  const place = {
    placeId: block.placePhotoId,
    categoryId: block.placeCategoryId,
    url: block.placeLink,
    name: block.placeName,
    formatted_address: block.placeAddress,
    rating: block.placeRating,
    iconUrl: "./src/assets/imgs/default.png",
    xlocation: block.xLocation || block.xlocation,
    ylocation: block.yLocation || block.ylocation,
  }

  return {timeTableId, place, start, duration, blockId};
}