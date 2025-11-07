import { create } from 'zustand';

const usePlanStore = create((set) => ({
  eventId: String(Date.now() + Math.random()),
  planName: "",
  travelCategoryName: "",
  travelName: "",
  travelId: null,
  departure: "",
  transportationCategoryId: 0,
  adultCount: 0,
  childCount: 0,

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