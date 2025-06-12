// src/pages/place/ViewPlace.jsx

import React, { useEffect } from 'react';
import zustandStore from '../../app/zustandStore.js';
import ViewPlaceDetail from '../../features/place/ViewPlaceDetail.jsx';
import { useLocation } from 'react-router-dom'; // useParams를 직접 사용하지 않음
import axios from 'axios'; // 백엔드 API 호출을 위해 axios 추가
import { useSelector } from 'react-redux'; // 사용자 ID를 가져오기 위해 useSelector 추가

const ViewPlace = () => {
  const location = useLocation();
  const setPlaceDetail = zustandStore(state => state.setPlaceDetail);

  // Redux 스토어에서 로그인된 사용자 ID를 가져옵니다.
  const user = useSelector(state => state.auth.user);
  const userId = user?.id;

  // --- 1. location.state에 데이터가 있을 경우 Zustand 스토어에 placeDetail을 설정합니다. ---
  useEffect(() => {
    // location.state가 유효한 객체 형태인지 확인합니다.
    if (location.state && typeof location.state === 'object' && !Array.isArray(location.state)) {
      setPlaceDetail(location.state);
      console.log('ViewPlace: location.state에서 placeDetail을 설정했습니다:', location.state);
    } else {
      // location.state가 없거나 유효하지 않으면 placeDetail을 null로 초기화합니다.
      // 이 경우 ViewPlaceDetail 컴포넌트는 데이터를 받지 못할 수 있습니다.
      setPlaceDetail(null);
      console.log('ViewPlace: location.state에 유효한 placeDetail 데이터가 없습니다. placeDetail을 null로 초기화합니다.');
    }
  }, [location.state, setPlaceDetail]); // location.state 또는 setPlaceDetail이 변경될 때마다 실행

  // --- 2. 페이지 로드 또는 경로 변경 시 항상 페이지 상단으로 스크롤합니다. ---
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]); // location.pathname이 변경될 때마다 실행

  // --- 3. 최근 본 가게 기록을 백엔드에 추가하는 useEffect ---
  useEffect(() => {
    const addRecentViewToHistory = async () => {
      // 최근 기록 추가에 필요한 데이터는 location.state에서 직접 가져옵니다.
      const currentPlaceData = location.state;

      // API 호출 전에 userId와 location.state에 필수 데이터(_id, name)가 있는지 확인합니다.
      if (!userId || !currentPlaceData || !currentPlaceData._id || !currentPlaceData.name || String(currentPlaceData.name).trim() === '') {
        console.log('ViewPlace: 최근 기록 추가를 위한 필수 정보 (userId, location.state의 _id 및 name)가 없거나 유효하지 않아 백엔드 호출을 건너뜠습니다.');
        console.log('ViewPlace Debug Info (Skipped Recent History Add): userId:', userId, 'currentPlaceData:', currentPlaceData);
        return; // 필수 데이터가 없거나 유효하지 않으면 함수를 종료합니다.
      }

      try {
        console.log('ViewPlace: addRecentView API 호출 시도 중 (백엔드 DB 저장)...');
        console.log('ViewPlace: 전송할 userId:', userId);
        console.log('ViewPlace: 전송할 storeId (from location.state):', currentPlaceData._id);
        console.log('ViewPlace: 전송할 name (from location.state):', currentPlaceData.name);

        // 키워드 전처리 로직 (쉼표로 구분된 문자열 또는 배열을 처리하여 항상 배열로 만듭니다.)
        let processedKeywords = [];
        if (currentPlaceData.keywords) {
          if (Array.isArray(currentPlaceData.keywords)) {
            // 이미 배열인 경우, 각 요소를 trim하고 빈 문자열 제거
            processedKeywords = currentPlaceData.keywords.map(k => String(k).trim()).filter(k => k !== '');
          } else if (typeof currentPlaceData.keywords === 'string' && currentPlaceData.keywords.trim() !== '') {
            // 문자열인 경우, 쉼표로 분리하고 각 요소를 trim하며 빈 문자열 제거
            processedKeywords = currentPlaceData.keywords.split(',').map(k => k.trim()).filter(k => k !== '');
          }
        }
        console.log('ViewPlace: 전송할 keywords (처리 후):', processedKeywords);

        // 백엔드의 recent-history API에 POST 요청을 보냅니다.
        const response = await axios.post('http://localhost:3000/auth/recent-history', {
          userId: userId,
          storeId: currentPlaceData._id,    // location.state에서 가져온 가게 ID
          name: currentPlaceData.name,      // location.state에서 가져온 가게 이름
          keywords: processedKeywords,      // 처리된 키워드 배열
        }, {
          withCredentials: true // 인증 쿠키를 함께 전송
        });
        console.log('ViewPlace: 최근 기록 백엔드에 추가 성공:', response.data);
      } catch (err) {
        console.error('ViewPlace: 최근 기록 백엔드 추가 실패:', err.response?.data || err.message);
      }
    };

    // userId 또는 location.state가 변경될 때마다 이 이펙트를 실행합니다.
    // 이는 location.state가 업데이트된 후에 `addRecentViewToHistory`가 호출되도록 보장합니다.
    addRecentViewToHistory();
  }, [userId, location.state]); // 의존성 배열에 userId와 location.state 포함

  // ViewPlaceDetail 컴포넌트는 placeDetail 상태를 zustandStore에서 직접 가져와 사용합니다.
  // 이 컴포넌트에는 더 이상 props를 전달할 필요가 없습니다.
  return <ViewPlaceDetail />;
};

export default ViewPlace;
