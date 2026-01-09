import { create } from "zustand";

const sortByDate = (list) =>
  [...list].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

const useTimetableStore = create((set, get) => ({
  timetables: [],
  selectedDay: 0,

  START_HOUR: 0,
  END_HOUR: 0,
  SLOT_HEIGHT: 40,
  TOTAL_SLOTS: 0,

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

      // 2. 같은 date 있고 timeTableId는 다름 → 기존 삭제 후 새로 넣기
      const filtered = state.timetables.filter(
        (item) => item.date !== newTimetable.date
      );

      return {
        timetables: sortByDate([...filtered, newTimetable]),
      };
    }),

  // UPDATE
  setTimetableUpdate: (updatedTimetable) =>
    set((state) => {
      const filtered = state.timetables.filter(
        (item) => item.timeTableId !== updatedTimetable.timeTableId
      );
      return {
        timetables: sortByDate([...filtered, updatedTimetable]),
      };
    }),

  // DELETE
  setTimetableDelete: (timeTableId) =>
    set((state) => ({
      timetables: sortByDate(
        state.timetables.filter(
          (item) => item.timeTableId !== timeTableId
        )
      ),
    })),

  setTimetableAll: (payload) =>
    set((state) => ({
      ...state,
      timetables: payload
    })),

  setSelectedDay: (dayIndex) => {
    const { timetables } = get();
    const timetable = timetables[dayIndex];

    if (!timetable) return;

    const startHour = Number(timetable.timeTableStartTime.split(":")[0]);
    const endHour = Number(timetable.timeTableEndTime.split(":")[0]);

    set({
      selectedDay: dayIndex,
      START_HOUR: startHour,
      END_HOUR: endHour,
      TOTAL_SLOTS: ((endHour - startHour) * 60) / 15,
    });
  }
}));

export default useTimetableStore;

/*
[
    {
        "timeTableId": 130,
        "date": "2025-11-19",
        "startTime": "09:00:00",
        "endTime": "20:00:00"
    },
    {
        "timeTableId": 131,
        "date": "2025-11-20",
        "startTime": "09:00:00",
        "endTime": "20:00:00"
    },
    {
        "timeTableId": 132,
        "date": "2025-11-21",
        "startTime": "09:00:00",
        "endTime": "20:00:00"
    }
]
*/