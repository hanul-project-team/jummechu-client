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

const zustandStore = create(
  persist(
    (set, get) => ({
      placeDetail: [],
      reviewInfo: [],
      searchData: [],
      center: null,
      userNearPlace: [],
      nearPlaceReviews: null,
      isLoading: true,
      searchNearData: [],

      setSearchData: data => {
        if (!data || data.length === 0) {
          set({ searchData: [] })
        } else {
          set({ searchData: data ?? [] })
        }
      },
      setPlaceDetail: data => set({ placeDetail: data }),
      setReviewInfo: data => {
        set(state => ({
          reviewInfo: typeof data === 'function' ? data(state.reviewInfo) : (data ?? []),
        }))
      },
      clearSearchData: () => set({ searchData: [] }),
      setCenter: data => set({ center: data }),
      setUserNearPlace: data => set({ userNearPlace: data }),
      setNearPlaceReviews: data => set({ nearPlaceReviews: data }),
      setIsLoading: value => set({ isLoading: value }),
      setSearchNearData: data => set({ searchNearData: data }),
      reset: () => {
        set({
          placeDetail: [],
          reviewInfo: [],
          searchData: [],
          center: null,
          // userNearPlace: [],
          // nearPlaceReviews: null,
          isLoading: true,
          searchNearData: [],
        })
        localStorage.removeItem('place-storage')
      },
    }),
    {
      name: 'place-storage',
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

export default zustandStore
