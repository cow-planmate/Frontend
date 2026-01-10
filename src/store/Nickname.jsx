import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import gravatarUrl from '../utils/gravatarUrl';

const useNicknameStore = create(
  persist(
    (set) => ({
      nickname: '',
      gravatar: '',
      lastSelectedDay: {},

      setNickname: (value) => 
        set((state) => ({
          ...state,
          nickname: value 
        })),
        
      setGravatar: (value) => 
        set((state) => ({
          ...state,
          gravatar: gravatarUrl(value)
        })),

      setLastSelectedDay: (id, day) => 
        set((state) => ({
          ...state,
          lastSelectedDay: {
            ...state.lastSelectedDay,
            [id]: day,
          }
        }))
    }),
    {
      name: 'nickname',
    }
  )
)

export default useNicknameStore;