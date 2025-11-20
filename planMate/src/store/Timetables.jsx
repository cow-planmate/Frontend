import { create } from "zustand";

const useTimetableStore = create((set) => ({
  timetables: [],
  selectedDay: 0,

  // CREATE
  setTimetableCreate: (newTimetable) =>
    set((state) => {
      const sameDateItem = state.timetables.find(
        (item) => item.date === newTimetable.date
      );

      // 1. 같은 date 없음 → push
      if (!sameDateItem) {
        return {
          timetables: [...state.timetables, newTimetable],
        };
      }

      // 2. 같은 date 있고 timetableId는 다름 → 기존 삭제 후 새로 넣기
      const filtered = state.timetables.filter(
        (item) => item.date !== newTimetable.date
      );

      return {
        timetables: [...filtered, newTimetable],
      };
    }),

  // UPDATE
  setTimetableUpdate: (updatedTimetable) =>
    set((state) => {
      const filtered = state.timetables.filter(
        (item) => item.timetableId !== updatedTimetable.timetableId
      );
      return {
        timetables: [...filtered, updatedTimetable],
      };
    }),

  // DELETE
  setTimetableDelete: (timetableId) =>
    set((state) => ({
      timetables: state.timetables.filter(
        (item) => item.timetableId !== timetableId
      ),
    })),

  setTimetableAll: (payload) =>
    set((state) => ({
      ...state,
      timetables: payload
    })),

  setSelectedDay: (day) =>
    set((state) => ({
      ...state,
      selectedDay: day
    }))
}));

export default useTimetableStore;

/*
[
    {
        "timetableId": 130,
        "date": "2025-11-19",
        "startTime": "09:00:00",
        "endTime": "20:00:00"
    },
    {
        "timetableId": 131,
        "date": "2025-11-20",
        "startTime": "09:00:00",
        "endTime": "20:00:00"
    },
    {
        "timetableId": 132,
        "date": "2025-11-21",
        "startTime": "09:00:00",
        "endTime": "20:00:00"
    }
]
*/