import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const usePlaceStore = create(
  persist(
    (set, get) => ({
      placeDetail: [],
      reviewInfo: [],
      searchData: [],
      center: null,
      kakaoPlace: [],
      isLoading: true,

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
          set({reviewInfo: []})
        } else {
          set({reviewInfo: data ?? []})
        }
      },
      clearSearchData: () => set({ searchData: [] }),
      setCenter: data => set({ center: data }),
      setKakaoPlace: data => set({ kakaoPlace: data }),
      setIsLoading: value => set({ isLoading: value }),
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

export default usePlaceStore
