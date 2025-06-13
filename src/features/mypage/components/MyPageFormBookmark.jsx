import React, { useState } from 'react'
import zustandUser from '../../../app/zustandUser.js'

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import zustandUser from '../../../app/zustandUser.js'; // zustandUser 스토어는 그대로 사용 (수정하지 않음)
import axios from 'axios'; // axios 임포트

const MyPageFormBookmark = () => {
  const navigate = useNavigate();

  // zustandUser에서 userBookmark 상태와 setUserBookmark 액션만 가져옵니다.
  const userBookmarkFromStore = zustandUser(state => state.userBookmark); 
  const setUserBookmark = zustandUser(state => state.setUserBookmark); 

  const user = useSelector(state => state.auth.user);
  const userId = user?.id;

  const [isBookmarksLoading, setIsBookmarksLoading] = useState(true);
  const [displayedBookmarks, setDisplayedBookmarks] = useState([]);

  // zustandUser에서 가져온 찜 목록을 로컬 상태에 동기화
  useEffect(() => {
    const areBookmarksEqual = (arr1, arr2) => {
      if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].store?._id !== arr2[i].store?._id) return false;
      }
      return true;
    };

    if (!areBookmarksEqual(userBookmarkFromStore, displayedBookmarks)) {
      setDisplayedBookmarks(userBookmarkFromStore || []);
      console.log('MyPageFormBookmark: displayedBookmarks 업데이트됨:', userBookmarkFromStore);
    }
  }, [userBookmarkFromStore, displayedBookmarks]);

  // 찜 상태 확인 함수 (displayedBookmarks 배열을 기반으로 확인)
  const isBookmarkedCheck = (item) => {
    const targetStoreId = item.store?._id || item._id;
    return Array.isArray(displayedBookmarks) && displayedBookmarks.some(bookmark => bookmark.store?._id === targetStoreId);
  };

  // 찜 목록 불러오기 (MyPageFormBookmark 자체에서 처리)
  useEffect(() => {
    const fetchUserBookmarks = async () => {
      setIsBookmarksLoading(true);
      if (!userId) {
        console.log('MyPageFormBookmark: 사용자 ID가 없어 찜 목록을 불러올 수 없습니다. userBookmark 초기화.');
        setUserBookmark([]);
        setDisplayedBookmarks([]);
        setIsBookmarksLoading(false);
        return;
      }
      try {
        console.log(`MyPageFormBookmark: 찜 목록 불러오는 중... (userId: ${userId})`);
        const response = await axios.get(`http://localhost:3000/bookmark`, {
          withCredentials: true,
        });
        if (response.data.success && Array.isArray(response.data.bookmarkedStores)) {
          setUserBookmark(response.data.bookmarkedStores);
          console.log('MyPageFormBookmark: 찜 목록 새로고침 성공:', response.data.bookmarkedStores);
        } else {
          console.warn('MyPageFormBookmark: 찜 목록 응답 형식이 유효하지 않습니다:', response.data);
          setUserBookmark([]);
        }
      } catch (error) {
        console.error('MyPageFormBookmark: 찜 목록 불러오기 실패:', error.response?.data || error.message);
        setUserBookmark([]);
      } finally {
        setIsBookmarksLoading(false);
      }
    };
    fetchUserBookmarks();
  }, [userId, setUserBookmark]);

  // 찜 토글 핸들러 (MyPageFormBookmark 자체에서 직접 axios 호출 및 상태 업데이트)
  const handleBookmarkToggle = async (itemToToggle) => {
    if (!userId) {
        alert('로그인 후 찜 기능을 이용할 수 있습니다.');
        return;
    }

    const targetStoreId = itemToToggle.store?._id || itemToToggle._id;
    if (!targetStoreId) {
        console.error('handleBookmarkToggle: 유효한 storeId를 찾을 수 없습니다.', itemToToggle);
        alert('찜할 가게 정보를 찾을 수 없습니다.');
        return;
    }

    const isCurrentlyBookmarked = isBookmarkedCheck(itemToToggle);

    try {
        if (isCurrentlyBookmarked) {
            await axios.delete(`http://localhost:3000/bookmark`, {
                data: { storeId: targetStoreId },
                withCredentials: true
            });
            alert('찜이 해제되었습니다.');
            setUserBookmark(prevBookmarks => prevBookmarks.filter(bookmark => bookmark.store?._id !== targetStoreId));
        } else {
            await axios.post(`http://localhost:3000/bookmark`, { storeId: targetStoreId }, {
                withCredentials: true
            });
            alert('찜 목록에 추가되었습니다.');
            setUserBookmark(prevBookmarks => [
              ...prevBookmarks, 
              { 
                _id: `temp-${Date.now()}-${targetStoreId}`, 
                store: { 
                  _id: targetStoreId, 
                  name: itemToToggle.store?.name || 'Unknown', 
                  photos: itemToToggle.store?.photos || [], // 이 부분이 itemToToggle에서 photos를 가져와 추가합니다.
                  rating: itemToToggle.store?.rating, 
                  address: itemToToggle.store?.address, 
                  keywords: itemToToggle.store?.keywords 
                } 
              }
            ]);
        }
    } catch (error) {
        console.error('MyPageFormBookmark: 찜 토글 실패:', error.response?.data || error.message);
        alert('찜 기능 처리 중 오류가 발생했습니다.');
    }
  };

  // 로딩 중일 때 표시할 내용
  if (isBookmarksLoading) {
    return <p className="py-5 text-gray-600">찜 목록을 불러오는 중입니다...</p>;
  }

  // 로딩이 끝났는데도 displayedBookmarks가 유효한 배열이 아닐 경우
  if (!Array.isArray(displayedBookmarks)) {
    return <p className="py-5 text-gray-600">찜 목록을 불러오지 못했습니다.</p>;
  }

  return (
    <div className="flex justify-center">
      {displayedBookmarks.length === 0 ? (
        <p className="py-5 text-gray-600">찜한 목록이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-9 py-5">
          {displayedBookmarks.map(item => (
            <li key={item.store?._id || item._id || `bookmark-item-${Math.random()}`} className="flex gap-4"> 
              <div
                className="relative w-[250px] h-[250px] cursor-pointer"
                onClick={() => {
                  if (item.store?._id) {
                    navigate(`/place/${item.store._id}`); 
                  } else {
                    console.warn('MyPageFormBookmark: 유효한 가게 ID가 없어 상세 페이지로 이동할 수 없습니다.', item);
                  }
                }} 
              >
                <img
                  src={
                    // item.store.photos가 배열이고 비어있지 않다면 첫 번째 사진 사용
                    item.store?.photos && item.store.photos.length > 0
                      ? item.store.photos[0]
                      : `https://placehold.co/250x250/F0F0F0/6C757D?text=${encodeURIComponent(item.store?.name ? item.store.name.substring(0, Math.min(5, item.store.name.length)) : 'No Image')}`
                  }
                  alt={item.store?.name || '가게 이미지'}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => { // 에러 발생 시 플레이스홀더 이미지로 대체
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/250x250/F0F0F0/6C757D?text=${encodeURIComponent(item.store?.name ? item.store.name.substring(0, Math.min(5, item.store.name.length)) : 'No Image')}`;
                  }}
                />
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation(); 
                    handleBookmarkToggle(item); 
                  }}
                  className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100"
                >
                  {isBookmarkedCheck(item) ? ( 
                    <span role="img" aria-label="bookmarked">
                      ❤️
                    </span>
                  ) : (
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
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="py-3">
                <h2 className="text-lg py-1 font-SinchonRhapsody flex">{item.store?.name || '이름 없음'}</h2>
                {item.store?.rating && <p className="py-1">⭐{item.store.rating} </p>}
                <p className="py-1 flex items-center text-sm text-gray-500">
                  <svg
                    fill="#000000"
                    height="25px"
                    width="25px"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 487.379 487.379"
                    xmlSpace="preserve"
                  >
                    <g>
                      <path
                        d="M393.722,438.868L371.37,271.219h0.622c6.564,0,11.885-5.321,11.885-11.885V17.668c0-4.176-2.183-8.03-5.751-10.18
                          c-3.569-2.152-7.998-2.279-11.679-0.335c-46.345,24.454-75.357,72.536-75.357,124.952v101.898
                          c0,20.551,16.665,37.215,37.218,37.215h2.818l-22.352,167.649c-1.625,12.235,2.103,24.599,10.228,33.886
                          c8.142,9.289,19.899,14.625,32.246,14.625c12.346,0,24.104-5.336,32.246-14.625C391.619,463.467,395.347,451.104,393.722,438.868z"
                        />
                        <path
                          d="M207.482,0c-9.017,0-16.314,7.297-16.314,16.313v91.128h-16.314V16.313C174.854,7.297,167.557,0,158.54,0
                          c-9.017,0-16.313,7.297-16.313,16.313v91.128h-16.314V16.313C125.912,7.297,118.615,0,109.599,0
                          c-9.018,0-16.314,7.297-16.314,16.313v91.128v14.913v41.199c0,24.2,19.611,43.811,43.811,43.811h3.616L115,438.74
                          c-1.37,12.378,2.596,24.758,10.896,34.047c8.317,9.287,20.186,14.592,32.645,14.592c12.459,0,24.327-5.305,32.645-14.592
                          c8.301-9.289,12.267-21.669,10.896-34.047l-25.713-231.375h3.617c24.199,0,43.811-19.611,43.811-43.811v-41.199v-14.913V16.313
                          C223.796,7.297,216.499,0,207.482,0z"
                        />
                    </g>
                  </svg>
                  {item.store?.address || '주소 없음'}
                </p>
                {item.store?.keywords && (
                  <p className="py-1 text-sm text-gray-700">
                    #{Array.isArray(item.store.keywords) ? item.store.keywords.join(', #') : String(item.store.keywords).split(',').map(k => k.trim()).join(', #')}
                  </p>
                )}
                <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.store?._id) {
                        navigate(`/place/${item.store._id}`);
                      } else {
                        console.warn('MyPageFormBookmark: 유효한 가게 ID가 없어 상세 페이지로 이동할 수 없습니다.', item);
                      }
                    }}
                    className="mt-2 text-blue-500 hover:underline text-sm"
                >
                    상세 보기
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyPageFormBookmark;
