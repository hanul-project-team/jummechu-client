import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const zustandStore = create(
  persist(
    (set, get) => ({
      placeDetail: [],
      reviewInfo: [],
      searchData: [],
      center: null,
      userNearPlace: [],
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
        if (!data || data.length === 0) {
          set({ reviewInfo: [] })
        } else {
          set({ reviewInfo: data ?? [] })
        }
      },
      clearSearchData: () => set({ searchData: [] }),
      setCenter: data => set({ center: data }),
      setUserNearPlace: data => set({ userNearPlace: data }),
      setIsLoading: value => set({ isLoading: value }),
      setSearchNearData: data => set({ searchNearData: data }),
    }),
    {
      name: 'place-storage',
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

export default zustandStore
