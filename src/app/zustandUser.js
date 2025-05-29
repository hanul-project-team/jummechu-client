import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const zustandUser = create(
  persist(
    (set, get) => ({
      userReviews: [],
      isLoading: true,
      userBookmark: [],

      setUserReviews: data => set({ userReviews: data }),
      setIsLoading: value => set({ isLoading: value }),
      setUserBookmark: data => set({userBookmark: data}),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return state => {
          setTimeout(() => {
            state.setIsLoading(false)
          }, 0)
        }
      },
    },
  ),
)

export default zustandUser
