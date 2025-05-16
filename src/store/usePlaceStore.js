import {create} from 'zustand';

const usePlaceStore = create((set) => ({
    placeDetails: null,
    nearPlaces: [],
    center: null,
    kakaoPlace: null,

    setPlaceDetails: data => set({placeDetails: data}),
    setNearPlaces: data => set({nearPlaces: data}),
    setCenter: data => set({center: data}),
    setKakaoPlace: data => set({kakaoPlace: data}),
}))

export default usePlaceStore;