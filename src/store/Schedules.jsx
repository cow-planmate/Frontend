import { create } from "zustand";
import { checkOverlap, getTimeTableId } from "../utils/createUtils";

const useItemsStore = create((set) => ({
  items: {},

  /** 사이드바 → 드래그 추가 */
  addItemFromDrag: ({ timetables, selectedDay, active, newStart, duration, blockId }) =>
    set((state) => {
      const ttId = getTimeTableId(timetables, selectedDay);

      return {
        items: {
          ...state.items,
          [ttId]: [
            ...(state.items[ttId] || []),
            {
              id: blockId,
              place: active.data.current.place,
              start: newStart,
              duration,
            },
          ],
        },
      };
    }),

  /** 기존 일정 이동 */
  moveItem: ({ timetables, selectedDay, activeId, newStart }) =>
    set((state) => {
      const ttId = getTimeTableId(timetables, selectedDay);

      return {
        items: {
          ...state.items,
          [ttId]: (state.items[ttId] || []).map((item) =>
            item.id === activeId
              ? { ...item, start: newStart }
              : item
          ),
        },
      };
    }),

  /** 리사이즈 */
  resizeItem: ({
    timetables,
    selectedDay,
    id,
    newStart,
    newDuration,
    TOTAL_SLOTS,
  }) =>
    set((state) => {
      const ttId = getTimeTableId(timetables, selectedDay);
      const dayItems = state.items[ttId] || [];

      const target = dayItems.find((i) => i.id === id);
      if (!target) return state;

      let safeStart = newStart;
      let safeDuration = newDuration;

      if (safeDuration < 1) safeDuration = 1;
      if (safeStart < 0) {
        safeDuration += safeStart;
        safeStart = 0;
      }
      if (safeStart + safeDuration > TOTAL_SLOTS) {
        safeDuration = TOTAL_SLOTS - safeStart;
      }

      if (checkOverlap(safeStart, safeDuration, dayItems, id)) {
        return state;
      }

      return {
        items: {
          ...state.items,
          [ttId]: dayItems.map((i) =>
            i.id === id
              ? { ...i, start: safeStart, duration: safeDuration }
              : i
          ),
        },
      };
    }),

  /** 모바일 추가 */
  addItemMobile: ({ timetables, selectedDay, place, emptySlot, blockId }) =>
    set((state) => {
      const ttId = getTimeTableId(timetables, selectedDay);

      return {
        items: {
          ...state.items,
          [ttId]: [
            ...(state.items[ttId] || []),
            {
              id: blockId,
              place,
              start: emptySlot,
              duration: 4,
            },
          ],
        },
      };
    }),

  addItemFromWebsocket: ({ timeTableId, place, start, duration, blockId }) =>
    set((state) => {
      const dayItems = state.items[timeTableId] || [];
      const exists = dayItems.some(item => item.id === blockId);

      if (exists) {
        // 이미 존재하면 (내가 보낸 거라면) 서버에서 받은 진짜 PK(place.blockId)로 업데이트
        return {
          items: {
            ...state.items,
            [timeTableId]: dayItems.map(item =>
              item.id === blockId 
                ? { ...item, place: { ...item.place, blockId: place.blockId }, start, duration }
                : item
            )
          }
        };
      }

      // 존재하지 않으면 (다른 사람이 만든 거라면) 새로 추가
      return {
        items: {
          ...state.items,
          [timeTableId]: [
            ...dayItems,
            {
              id: blockId,
              place: place,
              start: start,
              duration,
            },
          ],
        },
      };
    }),

  moveItemFromWebsocket: ({ timeTableId, place, start, duration, blockId }) =>
    set((state) => {
      return {
        items: {
          ...state.items,
          [timeTableId]: (state.items[timeTableId] || []).map((item) =>
            item.id === blockId
              ? { 
                  ...item, 
                  start: start, 
                  duration: duration,
                  place: { ...item.place, blockId: place.blockId } 
                }
              : item
          ),
        },
      };
    }),

  deleteItem: (deleteItemId, timeTableId) =>
    set((state) => {
      const dayItems = state.items[timeTableId];
      if (!dayItems) return state;

      return {
        items: {
          ...state.items,
          [timeTableId]: dayItems.filter(
            (item) => item.id !== deleteItemId
          ),
        },
      }
    })
}));

export default useItemsStore;
