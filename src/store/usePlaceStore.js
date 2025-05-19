import {create} from 'zustand';

const usePlaceStore = create((set) => ({
    searchData: null,
    center: null,
    kakaoPlace: null,

    setSearchData: data => set({searchData: data}),
    setCenter: data => set({center: data}),
    setKakaoPlace: data => set({kakaoPlace: data}),
}))

export default usePlaceStore;