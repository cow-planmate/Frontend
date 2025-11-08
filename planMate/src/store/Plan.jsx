import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // 1. persist 미들웨어를 임포트합니다.

// 2. create() 함수를 persist() 함수로 감쌉니다.
const usePlanStore = create(
  persist(
    (set) => ({
      planName: "",
      travelCategoryName: "", // "날씨" 탭에서 사용할 상위 지역 (예: 인천광역시)
      travelName: "",
      travelId: null,
      departure: "",
      transportationCategoryId: 0,
      adultCount: 0,
      childCount: 0,
      startDate: "", // "날씨" 탭을 위해 추가 (예: "2025-11-01")
      period: 0,     // "날씨" 탭을 위해 추가 (예: 3)
    
      setPlanField: (field, value) =>
        set((state) => ({
          ...state,
          [field]: value,
        })),
    
      setPlanAll: (payload) =>
        set(() => ({
          ...payload,
        })),
    }),
    {
      // 3. localStorage에 저장할 이름(key)을 지정합니다.
      name: 'plan-storage', 
    }
  )
);

export default usePlanStore;