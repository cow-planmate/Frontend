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

  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),

  setAll: (payload) =>
    set(() => ({
      ...payload,
    })),
}));

export default usePlanStore;