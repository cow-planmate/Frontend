import { create } from 'zustand';

const useUserStore = create((set) => ({
  userDayIndexes: [],

  setUserUpdate: (value) =>
    set((state) => {
      const filtered = state.userDayIndexes.filter(
        (item) => item.nickname !== value.nickname
      );
      return {
        userDayIndexes: [...filtered, value],
      };
    }),

  setUserCreate: (value) =>
    set((state) => ({
      userDayIndexes: [...state.userDayIndexes, value],
    })),

  setUserDelete: (value) =>
    set((state) => ({
      userDayIndexes: state.userDayIndexes.filter(
        (item) => item.nickname !== value.nickname
      ),
    })),

  setUserAll: (payload) =>
    set(() => ({
      userDayIndexes: payload
    }))
}));

export default useUserStore;