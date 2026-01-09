import { create } from 'zustand';
import gravatarUrl from '../utils/gravatarUrl';

const useUserStore = create((set) => ({
  users: [],

  setUserAll: (payload) =>
    set(() => ({
      users: payload.map((user) => ({
        ...user,
        userInfo: {
          ...user.userInfo,
          email: gravatarUrl(user.userInfo.email),
        }
      }))
    }))
}));

export default useUserStore;