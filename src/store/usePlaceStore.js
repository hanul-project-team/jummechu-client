import { create } from 'zustand'

const usePlaceStore = create(set => ({
  placeDetail: [],
  searchData: [],
  center: null,
  kakaoPlace: [],

  setSearchData: data => {
    if (!data || data.length === 0) {
      set({ searchData: [] })
    } else {
      set({ searchData: data })
    }
  },
  setPlaceDetail: data => set({placeDetail: data}),
  clearSearchData: () => set({ searchData: [] }),
  setCenter: data => set({ center: data }),
  setKakaoPlace: data => set({ kakaoPlace: data }),
}))

export default usePlaceStore
