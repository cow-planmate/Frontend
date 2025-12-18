import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useNicknameStore = create(
  persist(
    (set) => ({
      nickname: '',
      setNickname: (value) => set(() => ({ nickname: value })),
    }),
    {
      name: 'nickname',
    }
  )
)

export default useNicknameStore;