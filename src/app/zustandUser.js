import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const zustandUser = create(
  persist(
    (set, get) => ({
      userReviews: [],
      isLoading: true,
      userBookmark: null,
      isBookmarked: false,

      setUserReviews: data => set({ userReviews: data }),
      setIsLoading: value => set({ isLoading: value }),
      setUserBookmark: updater => set(state => ({
        userBookmark: typeof updater === 'function' ? updater(state.userBookmark) : updater
      })),
      setIsBookmarked: value => set({ isBookmarked: value }),
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
