import { create } from 'zustand';

const usePlanStore = create((set) => ({
  planName: "",
  travelCategoryName: "",
  travelName: "",
  travelId: null,
  departure: "",
  transportationCategoryId: 0,
  adultCount: 0,
  childCount: 0,

  // --- 아래 두 줄 추가 ---
  startDate: "", // "YYYY-MM-DD" 형식
  period: 0,     // 숫자 (여행 기간)

  setPlanField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),

  setPlanAll: (payload) =>
    set(() => ({
      ...payload,
    })),
}));

export default usePlanStore;
