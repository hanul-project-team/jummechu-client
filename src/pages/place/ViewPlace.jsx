// src/pages/place/ViewPlace.jsx

import React, { useEffect } from 'react';
import zustandStore from '../../app/zustandStore.js';
import ViewPlaceDetail from '../../features/place/ViewPlaceDetail.jsx';
import { useLocation, useParams } from 'react-router-dom';
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
    const fetchAndSetPlaceDetail = async () => {
      // URL의 storeId가 없으면 아무것도 하지 않고 Zustand를 초기화합니다.
      if (!storeId) {
        console.log('ViewPlace: URL에서 storeId를 찾을 수 없습니다. placeDetail을 null로 설정.');
        setPlaceDetail(null);
        return;
      }

      // 1-1. Zustand의 placeDetail이 이미 현재 URL의 storeId와 일치하고 유효하면 API 호출을 건너뜁니다.
      // placeDetail이 객체이고, 배열이 아니며, _id가 storeId와 일치하고 name 필드가 유효한지 확인합니다.
      if (placeDetail && typeof placeDetail === 'object' && !Array.isArray(placeDetail) && placeDetail._id === storeId && placeDetail.name && String(placeDetail.name).trim() !== '') {
          console.log('ViewPlace: placeDetail이 이미 Zustand에 로드되었고 URL storeId와 일치하며 유효합니다. API 호출을 건너뜜.');
          return;
      }

      // 1-2. location.state에 데이터가 있고, URL의 storeId와 일치하며 유효한 객체 형태일 경우 먼저 사용합니다.
      // placeDetail이 아직 설정되지 않았거나, 현재 storeId와 일치하지 않을 때만 location.state를 확인합니다.
      if (location.state && typeof location.state === 'object' && !Array.isArray(location.state) && location.state._id === storeId && location.state.name && String(location.state.name).trim() !== '') {
          setPlaceDetail(location.state);
          console.log('ViewPlace: location.state에서 placeDetail을 설정했습니다:', location.state);
          return; // location.state에서 성공적으로 설정했으면 다음 API 호출 방지
      }

      // 1-3. 위의 조건들이 모두 해당되지 않으면, 백엔드에서 직접 상세 정보를 불러옵니다.
      try {
        console.log(`ViewPlace: 백엔드에서 placeDetail (ID: ${storeId})을 불러오는 중...`);
        // /api/places/:id 엔드포인트에서 상세 정보를 반환한다고 가정합니다.
        const response = await axios.get(`http://localhost:3000/auth/places/${storeId}`);
        
        if (response.data.success && response.data.place) {
          setPlaceDetail(response.data.place);
          console.log('ViewPlace: 백엔드에서 placeDetail 로드 성공:', response.data.place);
        } else {
          console.error('ViewPlace: 백엔드에서 placeDetail을 찾을 수 없습니다. 응답:', response.data);
          setPlaceDetail(null); // 찾지 못했음을 나타내기 위해 null로 설정
        }
      } catch (error) {
        console.error('ViewPlace: placeDetail 로드 중 오류 발생:', error.response?.data || error.message);
        setPlaceDetail(null); // 오류 발생 시 null로 설정
      }
    };

    fetchAndSetPlaceDetail();
  }, [storeId, location.state, setPlaceDetail, placeDetail]); // placeDetail을 의존성에 추가하여 Zustand 상태 변경 시에도 반응

  // --- 2. 페이지 상단으로 스크롤 ---
  // --- 2. 페이지 상단으로 스크롤 ---
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);
  }, [location.pathname]);

  // --- 3. 최근 본 가게 기록 추가 useEffect ---
  // 이 이펙트는 userId, storeId, 그리고 placeDetail이 Zustand에 유효하게 로드되었을 때만 실행됩니다.
  useEffect(() => {
    const addRecentViewToHistory = async () => {
      // userId, storeId, 그리고 placeDetail이 유효하고 현재 페이지의 가게 정보와 일치할 때만 API 호출
      // placeDetail이 아직 null이거나 유효하지 않은 객체 형태이거나, URL의 storeId와 _id가 일치하지 않으면 건너뜁니다.
      if (!userId || !storeId || !placeDetail || typeof placeDetail !== 'object' || Array.isArray(placeDetail) || placeDetail._id !== storeId || !placeDetail.name || String(placeDetail.name).trim() === '') {
        console.log('ViewPlace: 최근 기록 추가를 위한 필수 정보 (userId, storeId, placeDetail 객체, placeDetail.name)가 아직 로드되지 않았거나 유효하지 않아 백엔드 호출을 건너뜁니다.');
        console.log('ViewPlace Debug Info (Skipped History Add): userId:', userId, 'storeId:', storeId, 'placeDetail:', placeDetail);
        return;
      }

      try {
        console.log('ViewPlace: addRecentView API 호출 시도 중 (백엔드 DB 저장)...');
        console.log('ViewPlace: 전송할 userId:', userId);
        console.log('ViewPlace: 전송할 storeId:', storeId);
        
        // placeDetail에서 keywords를 직접 전송하기 전에 유효성 검사 및 전처리 강화
        let processedKeywords = [];
        if (placeDetail.keywords) {
          if (Array.isArray(placeDetail.keywords)) {
            // 배열 안에 있는 각 요소가 쉼표 포함 문자열일 수 있으므로 다시 분리
            placeDetail.keywords.forEach(k => {
              const trimmedK = String(k).trim();
              if (trimmedK.includes(',')) {
                // 쉼표가 있다면 쉼표로 분리하여 추가
                processedKeywords.push(...trimmedK.split(',').map(s => s.trim()));
              } else if (trimmedK !== '') {
                // 쉼표가 없다면 바로 추가
                processedKeywords.push(trimmedK);
              }
            });
          } else if (typeof placeDetail.keywords === 'string' && placeDetail.keywords.trim() !== '') {
            // 단일 문자열이라면 쉼표로 분리
            processedKeywords = placeDetail.keywords.split(',').map(k => k.trim());
          }
        }
        // 최종적으로 빈 문자열 키워드 제거
        processedKeywords = processedKeywords.filter(k => k !== '');

        console.log('ViewPlace: 전송할 keywords (처리 후):', processedKeywords); 
        console.log('ViewPlace: 전송할 name (placeDetail에서):', placeDetail.name);

        // 백엔드의 recentHistory.js addRecentView 함수가 'name'을 받으므로 'storeName' 대신 'name'으로 전송
        const response = await axios.post('http://localhost:3000/auth/recent-history', {
          userId: userId,
          storeId: currentPlaceData._id,
          name: currentPlaceData.name,
          keywords: processedKeywords,
          thumbnail: currentPlaceData.thumbnail,
          rating: currentPlaceData.rating,
          address: currentPlaceData.address,
          storeId: storeId,
          name: placeDetail.name, // 백엔드에서 'name'으로 받으므로 'name'으로 보냅니다.
          keywords: processedKeywords, 
        }, {
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
