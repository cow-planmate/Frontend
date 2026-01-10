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

function slotIndexToTime(newStart, intervalMinutes = 15) {
  const { START_HOUR } = useTimetableStore.getState();
  
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
  const blockStartTime = slotIndexToTime(newStart);
  const blockEndTime = slotIndexToTime(newStart + duration);
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