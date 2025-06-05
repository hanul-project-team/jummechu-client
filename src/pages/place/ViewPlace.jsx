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
  const placeDetail = zustandStore(state => state.placeDetail); // 현재 Zustand에 저장된 placeDetail

  const { id: storeId } = useParams(); // URL에서 가게 ID 가져오기

  const user = useSelector(state => state.auth.user);
  const userId = user?.id; // Redux에서 사용자 ID 가져오기

  // --- 1. placeDetail 데이터 로딩 및 동기화 useEffect ---
  // 이 useEffect는 URL의 storeId가 변경되거나, placeDetail이 아직 로드되지 않았을 때 실행됩니다.
  useEffect(() => {
    const fetchPlaceDetail = async () => {
      // URL의 storeId가 없으면 아무것도 하지 않습니다.
      if (!storeId) {
        console.log('ViewPlace: URL에서 storeId를 찾을 수 없습니다.');
        return;
      }

      // 이미 placeDetail이 로드되었고, 현재 URL의 storeId와 일치하면 다시 불러오지 않습니다.
      // (성능 최적화: 불필요한 API 호출 방지)
      if (placeDetail && placeDetail._id === storeId) {
        console.log('ViewPlace: placeDetail이 이미 로드되었고 URL storeId와 일치합니다. API 호출을 건너뜜.');
        return;
      }

      // location.state에 데이터가 있고, URL의 storeId와 일치하면 먼저 사용합니다.
      // (초기 로딩 시 더 빠른 렌더링을 위해)
      if (location.state && location.state._id === storeId) {
        setPlaceDetail(location.state);
        console.log('ViewPlace: location.state에서 placeDetail을 설정했습니다:', location.state);
        return;
      }

      // 위 조건들이 모두 해당되지 않으면, 백엔드에서 직접 상세 정보를 불러옵니다.
      try {
        console.log(`ViewPlace: 백엔드에서 placeDetail (ID: ${storeId})을 불러오는 중...`);
        // 가정: /api/places/:id 엔드포인트가 상세 정보를 반환합니다. (아래 백엔드 수정 필요)
        const response = await axios.get(`http://localhost:3000/api/places/${storeId}`);
        
        if (response.data.success && response.data.place) {
          setPlaceDetail(response.data.place);
          console.log('ViewPlace: 백엔드에서 placeDetail 로드 성공:', response.data.place);
        } else {
          console.error('ViewPlace: 백엔드에서 placeDetail을 찾을 수 없습니다. 응답:', response.data);
          setPlaceDetail(null); // 찾지 못했음을 나타내기 위해 null로 설정
          // 필요하다면 에러 페이지로 리다이렉트하거나 사용자에게 메시지 표시
          // navigate('/error-page');
        }
      } catch (error) {
        console.error('ViewPlace: placeDetail 로드 중 오류 발생:', error.response?.data || error.message);
        setPlaceDetail(null); // 오류 발생 시 null로 설정
      }
    };

    fetchPlaceDetail();
  }, [storeId, location.state, placeDetail, setPlaceDetail]); // storeId, location.state, placeDetail 상태 변경 시 실행

  // --- 2. 페이지 상단으로 스크롤 ---
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  // --- 3. 최근 본 가게 기록 추가 useEffect ---
  useEffect(() => {
    const addRecentViewToHistory = async () => {
      // API 호출을 위한 필수 정보가 아직 로드되지 않았거나 유효하지 않으면 건너뜠니다.
      // placeDetail.name이 필수이므로 이 조건에 포함시킵니다.
      if (!userId || !storeId || !placeDetail || !placeDetail.name) {
        console.log('ViewPlace: 최근 기록 추가를 위한 필수 정보 (userId, storeId, placeDetail.name)가 아직 로드되지 않았거나 유효하지 않아 백엔드 호출을 건너뜀.');
        console.log('ViewPlace Debug Info (Skipped): userId:', userId, 'storeId:', storeId, 'placeDetail:', placeDetail);
        return;
      }

      // 만약 URL의 storeId와 현재 placeDetail의 _id가 일치하지 않는다면,
      // 잘못된 데이터를 보낼 수 있으므로 이 경우도 건너뜁니다.
      if (placeDetail._id !== storeId) {
          console.log('ViewPlace: placeDetail의 _id와 URL의 storeId가 일치하지 않아 최근 기록 추가를 건너뜁니다.');
          return;
      }

      try {
        console.log('ViewPlace: addRecentView API 호출 시도 중 (백엔드 DB 저장)...');
        console.log('ViewPlace: 전송할 userId:', userId);
        console.log('ViewPlace: 전송할 storeId:', storeId);
        console.log('ViewPlace: 전송할 keywords (placeDetail에서):', placeDetail.keywords);
        console.log('ViewPlace: 전송할 name (placeDetail에서, 최종 확인):', placeDetail.name);

        const response = await axios.post('http://localhost:3000/auth/recent-history', {
          userId: userId,
          storeId: storeId,
          keywords: placeDetail.keywords || [], // keywords가 없으면 빈 배열 전송
          name: placeDetail.name, // placeDetail에서 가져온 이름 사용
        }, {
          withCredentials: true // 세션 쿠키 등 인증 정보를 함께 전송
        });
        console.log('ViewPlace: 최근 기록 백엔드에 추가 성공:', response.data);
      } catch (err) {
        console.error('ViewPlace: 최근 기록 백엔드 추가 실패:', err.response?.data || err.message);
      }
    };

    // placeDetail이 유효하게 로드될 때마다 addRecentViewToHistory를 호출합니다.
    addRecentViewToHistory();
  }, [userId, storeId, placeDetail]); // userId, storeId, placeDetail 상태 변경 시 실행

  // placeDetail이 로드되지 않았다면 로딩 메시지를 표시하거나 null을 반환
  if (!placeDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>가게 정보를 불러오는 중이거나, 가게를 찾을 수 없습니다...</p>
      </div>
    );
  }

  return <ViewPlaceDetail />;
};

export default ViewPlace;
