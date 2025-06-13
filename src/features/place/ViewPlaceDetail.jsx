// src/features/place/ViewPlaceDetail.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../assets/images/icon.png';
import '../../assets/styles/global.css';
import axios from 'axios';
import zustandStore from '../../app/zustandStore.js';
import zustandUser from '../../app/zustandUser.js';
import { useSelector } from 'react-redux';
import PlaceReview from './components/reviews/PlaceReview.jsx';
import KakaoMaps from '../../shared/kakaoMapsApi/KakaoMaps.jsx';
import RecommandPlace from './components/RecommandPlace.jsx';
import { toast } from 'react-toastify';

const ViewPlaceDetail = () => {
  const setReviewInfo = zustandStore(state => state.setReviewInfo);
  const reviewInfo = zustandStore(state => state.reviewInfo);
  // zustandStore에서 가져온 isLoading은 다른 로딩 상태일 수 있으므로 그대로 둡니다.
  const isLoading = zustandStore(state => state.isLoading);
  const placeDetail = zustandStore(state => state.placeDetail);
  const setPlaceDetail = zustandStore(state => state.setPlaceDetail);
  const navigate = useNavigate();
  const setSearchNearData = zustandStore(state => state.setSearchNearData);
  const searchNearData = zustandStore(state => state.searchNearData);
  const lastStoreRef = useRef(placeDetail?._id);
  const lastReviewRef = useRef(reviewInfo);
  const user = useSelector(state => state.auth.user);
  const userId = user?.id;
  
  const userBookmark = zustandUser(state => state.userBookmark || []); 
  const setUserBookmark = zustandUser(state => state.setUserBookmark); 

  const [linkCopied, setLinkCopied] = useState(false);
  const rootLocation = `${window.location.origin}`;
  const location = useLocation();

  // ★★★ 새로 추가된 로컬 상태: placeDetail 데이터 로딩 여부 추적 ★★★
  const [isPlaceDetailLoading, setIsPlaceDetailLoading] = useState(true);

  // --- 1. placeDetail이 없을시 URL에서 직접 불러오는 코드 ---
  // 이 useEffect는 placeDetail을 불러오는 책임과 로딩 상태 관리를 담당합니다.
  useEffect(() => {
    let activeFetch = true; // 컴포넌트 언마운트 시 상태 업데이트 방지 플래그

    // placeDetail이 이미 유효하고, ref와도 일치하면 다시 불러오지 않습니다.
    if (placeDetail && placeDetail._id && lastStoreRef.current === placeDetail._id) {
      if (activeFetch) {
        setIsPlaceDetailLoading(false); // 이미 로드 완료
      }
      return; 
    }

    const placeId = location.pathname.split('/')[2];
    if (!placeId) {
      console.warn('ViewPlaceDetail: URL에서 유효한 placeId를 찾을 수 없습니다.');
      if (activeFetch) {
        setPlaceDetail(null); // ID가 없으면 placeDetail을 null로 초기화
        setIsPlaceDetailLoading(false); // 로딩 완료 (데이터 없음)
      }
      return;
    }
    
    // 데이터 불러오기 시작: 로딩 상태 true 설정
    setIsPlaceDetailLoading(true);

    axios.get(`http://localhost:3000/store/read/${placeId}`, {
      withCredentials: true,
    })
    .then(res => {
      if (activeFetch) { // 컴포넌트가 마운트된 상태일 때만 상태 업데이트
        setPlaceDetail(res.data); // zustandStore에 placeDetail 업데이트
        lastStoreRef.current = res.data._id; 
        console.log('ViewPlaceDetail: URL로부터 placeDetail 불러오기 성공:', res.data);
      }
    })
    .catch(err => {
      console.error('ViewPlaceDetail: URL로부터 placeDetail 불러오기 실패:', err);
      if (activeFetch) { // 컴포넌트가 마운트된 상태일 때만 상태 업데이트
        setPlaceDetail(null); // 에러 발생 시 placeDetail을 null로 설정
      }
    })
    .finally(() => {
      if (activeFetch) { // 성공/실패와 상관없이 로딩 완료
        setIsPlaceDetailLoading(false); 
      }
    });

    // 클린업 함수: 컴포넌트 언마운트 시 activeFetch 플래그를 false로 설정하여,
    // 비동기 작업이 완료된 후에도 언마운트된 컴포넌트의 상태를 업데이트하는 것을 방지
    return () => {
      activeFetch = false;
    };
  }, [location.pathname, placeDetail, setPlaceDetail, lastStoreRef]); // placeDetail, location.pathname, setPlaceDetail, lastStoreRef 의존

  // --- 2. 가게 상세 정보(placeDetail)와 리뷰, 주변 장소 정보 호출 및 갱신 ---
  useEffect(() => {
    // placeDetail이 유효하게 로드된 후에만 관련 데이터를 불러옵니다.
    // isPlaceDetailLoading이 false일 때만 실행되어야 합니다.
    if (!isPlaceDetailLoading && placeDetail && placeDetail._id) {
      const storeId = placeDetail._id;
      const isDifferentStore = lastStoreRef.current !== storeId;

      if (isDifferentStore) { 
        console.log('ViewPlaceDetail: 가게 변경 감지, 리뷰 및 주변 장소 데이터 새로고침 시작.');
        Promise.all([
          axios.get(`http://localhost:3000/review/read/store/${placeDetail._id}`),
          axios.post(`http://localhost:3000/api/kakao/search/${placeDetail._id}`, {
            lat: placeDetail.latitude,
            lng: placeDetail.longitude,
          }),
        ])
        .then(([revRes, searchRes]) => {
          if (revRes.status === 200) {
            setReviewInfo(revRes.data);
            console.log('ViewPlaceDetail: 리뷰 정보 불러오기 성공:', revRes.data);
          } else if (revRes.status === 204) {
            setReviewInfo([]);
            console.log('ViewPlaceDetail: 불러올 리뷰 정보가 없습니다 (204 No Content).');
          }

          if (searchRes.status === 200) {
            setSearchNearData(searchRes.data);
            console.log('ViewPlaceDetail: 주변 장소 정보 불러오기 성공:', searchRes.data);
          }
          lastStoreRef.current = storeId; 
        })
        .catch(err => {
          console.error('ViewPlaceDetail: 리뷰 또는 주변 장소 데이터 불러오기 실패:', err);
          setReviewInfo([]);
          setSearchNearData([]);
        });
      }
    } else if (!placeDetail) { // placeDetail이 null이면 관련 정보 초기화
      setReviewInfo([]);
      setSearchNearData([]);
    }
  }, [placeDetail, setReviewInfo, setSearchNearData, isPlaceDetailLoading]); // placeDetail, setReviewInfo, setSearchNearData, isPlaceDetailLoading 의존

  // --- 3. 찜 상태 확인 함수 (userBookmark 배열을 기반으로 직접 확인) ---
  const isBookmarkedCheck = (storeId) => {
    return Array.isArray(userBookmark) && userBookmark.some(bookmark => bookmark.store?._id === storeId);
  };

  // --- 4. 찜 목록 불러오기 (zustandUser.js를 수정할 수 없으므로 ViewPlaceDetail에서 직접 처리) ---
  useEffect(() => {
    const fetchUserBookmarks = async () => {
      if (!userId) {
        console.log('ViewPlaceDetail: 사용자 ID가 없어 찜 목록을 불러올 수 없습니다. userBookmark 초기화.');
        setUserBookmark([]);
        return;
      }
      try {
        console.log(`ViewPlaceDetail: 찜 목록 불러오는 중... (userId: ${userId})`);
        const response = await axios.get(`http://localhost:3000/bookmark`, { // 경로 확인
          withCredentials: true,
        });
        if (response.data.success && Array.isArray(response.data.bookmarkedStores)) {
          setUserBookmark(response.data.bookmarkedStores);
          console.log('ViewPlaceDetail: 찜 목록 새로고침 성공:', response.data.bookmarkedStores);
        } else {
          console.warn('ViewPlaceDetail: 찜 목록 응답 형식이 유효하지 않습니다:', response.data);
          setUserBookmark([]);
        }
      } catch (error) {
        console.error('ViewPlaceDetail: 찜 목록 불러오기 실패:', error.response?.data || error.message);
        setUserBookmark([]);
      }
    };
    fetchUserBookmarks();
  }, [userId, setUserBookmark]);

  // --- 5. 찜 버튼 클릭 핸들러 (직접 axios 호출 및 userBookmark 상태 업데이트) ---
  const handleBookmarkToggle = async () => {
    if (!userId) {
      if (window.confirm('로그인이 필요한 기능입니다. 로그인 하시겠습니까?')) {
        navigate('/login');
      }
      return;
    }

    // placeDetail이 유효한지 다시 한번 확인
    if (!placeDetail || !placeDetail._id) {
      toast.error('찜할 가게 정보를 찾을 수 없습니다.');
      return;
    }

    const storeId = placeDetail._id;
    const isCurrentlyBookmarked = isBookmarkedCheck(storeId);

    try {
      if (isCurrentlyBookmarked) {
        await axios.delete(`http://localhost:3000/bookmark`, { // 경로 확인
          data: { storeId: storeId },
          withCredentials: true
        });
        toast.success('찜이 해제되었습니다.');
        setUserBookmark(prevBookmarks => prevBookmarks.filter(bookmark => bookmark.store?._id !== storeId));
      } else {
        await axios.post(`http://localhost:3000/bookmark`, { storeId: storeId }, { // 경로 확인
          withCredentials: true
        });
        toast.success('찜 목록에 추가되었습니다.');
        setUserBookmark(prevBookmarks => [...prevBookmarks, { _id: `temp-${Date.now()}`, store: { ...placeDetail } }]);
      }
    } catch (error) {
      console.error('ViewPlaceDetail: 찜 토글 실패:', error.response?.data || error.message);
      toast.error('찜 기능 처리 중 오류가 발생했습니다.');
    }
  };

  const handleTotalRating = data => {
    if (data && data.length > 0) {
      const result = data.reduce((acc, cur) => acc + cur.rating, 0) / data.length;
      const rounded = Math.round(result * 10) / 10;
      return rounded;
    } else {
      return 0;
    }
  };

  const handleCopyClipBoard = async () => {
    let shareLink = rootLocation + `${location.pathname}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareLink);
        toast.success(
          <div className="Toastify__toast-body cursor-default">링크를 복사했습니다.</div>,
          { position: 'top-center' },
        );
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      } else {
        toast.error('링크 복사를 지원하지 않는 브라우저입니다. 직접 복사해주세요.', { position: 'top-center' });
        console.warn('Clipboard API not supported.');
      }
    } catch (err) {
      toast.error(<div className="Toastify__toast-body cursor-default">다시 시도해 주세요.</div>, {
        position: 'top-center',
      });
      console.error('Failed to copy link:', err);
    }
  };

  const totalRate = reviewInfo ? handleTotalRating(reviewInfo) : 0;

  // ★★★ 강화된 로딩 및 데이터 유효성 검사 ★★★
  // isPlaceDetailLoading이 true이거나, placeDetail이 없거나, placeDetail._id가 없을 경우 로딩 UI 표시
  if (isLoading || isPlaceDetailLoading || !placeDetail || !placeDetail._id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="loading-jump">
          Loading
          <span className="jump-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      </div>
    );
  }

  // 이 시점에 도달했다면 placeDetail은 반드시 유효한 객체입니다.
  return (
    <div>
      <KakaoMaps />
      <div className="container md:max-w-5xl px-6 mx-auto p-3 m-3">
        {/* 타이틀 & 북마크 영역 */}
        <div className="flex items-center justify-between">
          {/* 이제 placeDetail이 null일 걱정 없이 .name에 접근합니다. */}
          <h1 className="text-3xl font-bold">{placeDetail.name}</h1> 
          <div className="flex items-center gap-1">
            {/* 북마크 */}
            <div
              className="flex border-1 py-2 px-3 rounded-3xl hover:cursor-pointer"
              onClick={handleBookmarkToggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={`${isBookmarkedCheck(placeDetail._id) ? 'red' : 'none'}`}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`size-6 transition-all duration-300 ${isBookmarkedCheck(placeDetail._id) ? 'text-red-500 scale-120' : 'text-black/80 scale-100'}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <p className="font-bold">저장</p>
            </div>
            {/* 링크 공유 */}
            <div
              className="flex border-1 py-2 px-3 rounded-3xl hover:cursor-pointer"
              onClick={handleCopyClipBoard}
            >
              {linkCopied === false ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              )}
              <p className="font-bold">공유</p>
            </div>
          </div>
        </div>
        <div>
          <img
            src={placeDetail.photos?.length > 0 ? placeDetail.photos[0] : Icon}
            alt={`${placeDetail.photos?.length > 0 ? 'photos' : 'Icon'}`}
            className="w-full h-[300px] object-cover rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = Icon;
            }}
          />
        </div>
        {/* 주소지 */}
        <div className="flex gap-2 relative my-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>
          <p>{placeDetail.address}</p>
        </div>
        {/* 전화 */}
        <div className="flex gap-2 my-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
            />
          </svg>
          <p>{placeDetail?.phone ? placeDetail.phone : '연락처 미제공'}</p>
        </div>
        {/* 문의? */}
        <div className="flex gap-2 my-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
          <div className="flex gap-2">
            <Link to="#">
              <p>폐업 신고</p>
            </Link>
            <span>&#183;</span>
            <Link to="#">
              <p>정보수정 제안</p>
            </Link>
          </div>
        </div>
        {/* 다른 장소 추천 */}
        <RecommandPlace placeDetail={placeDetail} />
      </div>
      <PlaceReview />
    </div>
  );
};

export default ViewPlaceDetail;
