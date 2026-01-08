import { create } from 'zustand';

const useUserStore = create((set) => ({
  users: [],

  setUserAll: (payload) =>
    set(() => ({
      users: payload
    }))
}));

export default useUserStore;