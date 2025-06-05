import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const TTL = 30 * 60 * 1000

const createTTLStorage = (baseStorage, ttl) => {
  return {
    getItem: name => {
      const json = baseStorage.getItem(name)
      if (!json) return null

      try {
        const data = JSON.parse(json)
        if (data.expiredAt && Date.now() > data.expiredAt) {
          baseStorage.removeItem(name)
          return null
        }
        return JSON.stringify(data.value)
      } catch (e) {
        return json
      }
    },
    setItem: (name, value) => {
      const data = {
        value,
        expiredAt: Date.now() + ttl,
      }
      baseStorage.setItem(name, JSON.stringify(data))
    },
    removeItem: name => baseStorage.removeItem(name),
  }
}

const zustandUser = create(
  persist(
    (set, get) => ({
      userReviews: [],
      isLoading: true,
      userBookmark: null,
      isBookmarked: false,

      setUserReviews: updater =>
        set(state => ({
          userReviews: typeof updater === 'function' ? updater(state.userReviews) : updater,
        })),
      setIsLoading: value => set({ isLoading: value }),
      setUserBookmark: updater =>
        set(state => ({
          userBookmark: typeof updater === 'function' ? updater(state.userBookmark) : updater,
        })),
      setIsBookmarked: value => set({ isBookmarked: value }),
    }),
    {
      name: 'user-storage',
      storage: createTTLStorage(localStorage, TTL),
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
