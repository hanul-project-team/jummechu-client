// src/pages/place/ViewPlace.jsx

import React, { useEffect } from 'react';
import zustandStore from '../../app/zustandStore.js';
import ViewPlaceDetail from '../../features/place/ViewPlaceDetail.jsx';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ViewPlace = () => {
  const location = useLocation();
  const setPlaceDetail = zustandStore(state => state.setPlaceDetail);
  const placeDetail = zustandStore(state => state.placeDetail); // Zustand에서 현재 placeDetail 상태 가져오기

  const { id: storeId } = useParams(); // URL에서 가게 ID 가져오기

  const user = useSelector(state => state.auth.user);
  const userId = user?.id; // Redux 스토어에서 사용자 ID 가져오기

  // --- 1. placeDetail 데이터 로딩 useEffect ---
  // 이 useEffect는 URL의 storeId가 변경될 때마다 실행되어 올바른 placeDetail을 보장합니다.
  useEffect(() => {
    // placeDetail이 이미 Zustand 스토어에 있고, 현재 location.state의 _id와 같다면 업데이트를 건너뜜
    const currentPlaceDetailInStore = zustandStore.getState().placeDetail;
    if (location.state && typeof location.state === 'object' && !Array.isArray(location.state)) {
      if (currentPlaceDetailInStore && currentPlaceDetailInStore._id === location.state._id) {
        console.log('ViewPlace: placeDetail이 이미 스토어에 존재하며 동일한 가게입니다. 업데이트를 건너뜜니다.');
        return;
      }
      setPlaceDetail(location.state);
      console.log('ViewPlace: location.state에서 placeDetail을 설정했습니다:', location.state);
    } else {
      // location.state가 없거나 유효하지 않으면 placeDetail을 null로 설정하여 ViewPlaceDetail이 스스로 불러오도록 유도
      setPlaceDetail(null);
      console.log('ViewPlace: location.state에 유효한 placeDetail 데이터가 없습니다. placeDetail을 null로 초기화합니다.');
    }
  }, [location.state, setPlaceDetail]);

  // --- 2. 페이지 상단으로 스크롤 ---
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);
  }, [location.pathname]);

  // --- 3. 최근 본 가게 기록 추가 useEffect ---
  // 이 이펙트는 userId, storeId, 그리고 placeDetail이 Zustand에 유효하게 로드되었을 때만 실행됩니다.
  useEffect(() => {
    const addRecentViewToHistory = async () => {
      const currentPlaceData = zustandStore.getState().placeDetail; // Zustand 스토어에서 최신 placeDetail 가져오기

      if (!userId || !currentPlaceData || !currentPlaceData._id || !currentPlaceData.name || String(currentPlaceData.name).trim() === '') {
        console.log('ViewPlace: 최근 기록 추가를 위한 필수 정보 (userId, placeDetail의 _id 및 name)가 없거나 유효하지 않아 백엔드 호출을 건너뜜습니다.');
        console.log('ViewPlace Debug Info (Skipped Recent History Add): userId:', userId, 'currentPlaceData:', currentPlaceData);
        return;
      }

      try {
        console.log('ViewPlace: addRecentView API 호출 시도 중 (백엔드 DB 저장)...');
        console.log('ViewPlace: 전송할 userId:', userId);
        console.log('ViewPlace: 전송할 storeId (from placeDetail):', currentPlaceData._id);
        console.log('ViewPlace: 전송할 name (from placeDetail):', currentPlaceData.name);

        let processedKeywords = [];
        if (currentPlaceData.keywords) {
          if (Array.isArray(currentPlaceData.keywords)) {
            processedKeywords = currentPlaceData.keywords.map(k => String(k).trim()).filter(k => k !== '');
          } else if (typeof currentPlaceData.keywords === 'string' && currentPlaceData.keywords.trim() !== '') {
            processedKeywords = currentPlaceData.keywords.split(',').map(k => k.trim()).filter(k => k !== '');
          }
        }
        console.log('ViewPlace: 전송할 keywords (처리 후):', processedKeywords);

        const response = await axios.post('http://localhost:3000/auth/recent-history', {
          userId: userId,
          storeId: currentPlaceData._id,
          name: currentPlaceData.name,
          keywords: processedKeywords,
          thumbnail: currentPlaceData.thumbnail,
          rating: currentPlaceData.rating,
          address: currentPlaceData.address,
        }, {
          withCredentials: true
          withCredentials: true
        });
        console.log('ViewPlace: 최근 기록 백엔드에 추가 성공:', response.data);
      } catch (err) {
        console.error('ViewPlace: 최근 기록 백엔드 추가 실패:', err.response?.data || err.message);
      }
    };

    // placeDetail이 스토어에 설정된 후에만 최근 기록을 추가하도록 종속성 설정
    // 이렇게 하면 ViewPlaceDetail이 자신의 URL 기반 로딩을 완료한 후, 이 훅이 실행됩니다.
    const unsubscribe = zustandStore.subscribe(
      (state) => state.placeDetail,
      (placeDetailFromStore) => {
        if (placeDetailFromStore && placeDetailFromStore._id && userId) {
          addRecentViewToHistory();
        }
      },
      { fireImmediately: false } // 초기 마운트 시 바로 실행하지 않도록 설정
    );

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();

  }, [userId]); // userId가 변경될 때만 이 effect를 재설정

  // ViewPlaceDetail 컴포넌트는 placeDetail 상태를 zustandStore에서 직접 가져와 사용합니다.
  return <ViewPlaceDetail />;
};

export default ViewPlace;
