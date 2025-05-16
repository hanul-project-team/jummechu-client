import {create} from 'zustand';

const usePlaceStore = create((set) => ({
    searchData: null,
    nearPlaces: [],
    center: null,
    kakaoPlace: null,

    setSearchData: data => set({searchData: data}),
    setNearPlaces: data => set({nearPlaces: data}),
    setCenter: data => set({center: data}),
    setKakaoPlace: data => set({kakaoPlace: data}),
}))

export default usePlaceStore;