// src/features/mypage/components/MyPageFormBookmark.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // navigate 사용을 위해 추가
import { useSelector } from 'react-redux'; // userId를 가져오기 위해 추가
import zustandUser from '../../../app/zustandUser.js'; // 경로 확인: src/features/mypage/components에서 src/app으로 가는 경로

const MyPageFormBookmark = () => {
  const navigate = useNavigate();

  // ZustandUser 스토어에서 찜 목록 상태와 관련 액션을 개별적으로 가져오기
  // userBookmark는 null일 경우 빈 배열로 대체 (초기 로딩 시나 저장된 데이터 없을 때 안전)
  const userBookmark = zustandUser(state => state.userBookmark || []); 
  const refreshUserBookmarks = zustandUser(state => state.refreshUserBookmarks);
  const toggleUserBookmark = zustandUser(state => state.toggleUserBookmark);

  // Redux 스토어에서 사용자 ID 가져오기
  const user = useSelector(state => state.auth.user);
  const userId = user?.id;

  console.log('MyPageFormBookmark - 현재 userBookmark 상태:', userBookmark);
  console.log('MyPageFormBookmark - 현재 refreshUserBookmarks 함수:', refreshUserBookmarks); // 함수가 정의되었는지 확인
  console.log('MyPageFormBookmark - 현재 userId:', userId);

  // 찜 상태 확인 함수
  // userBookmark 항목은 { _id: "북마크ID", store: { _id: "가게ID", name: "가게이름", ... } } 형태입니다.
  const isBookmarked = (item) => {
    const targetStoreId = item.store?._id || item._id; // 'store' 객체 안의 _id 또는 직접 _id 사용
    return userBookmark.some(bookmark => bookmark.store?._id === targetStoreId);
  };

  // 컴포넌트 마운트 시 또는 userId 변경 시 찜 목록을 새로고침
  useEffect(() => {
    // refreshUserBookmarks 함수가 유효한지 확인 후 호출
    if (typeof refreshUserBookmarks === 'function') { 
        if (userId) { 
            refreshUserBookmarks(userId);
        } else {
            // userId가 없을 경우 찜 목록 초기화 (refreshUserBookmarks가 내부에서 처리)
            refreshUserBookmarks(null); 
        }
    } else {
        // 이 경고가 계속 나타나면 zustandUser.js 파일이 올바르게 업데이트되지 않았다는 의미입니다.
        console.warn('refreshUserBookmarks 함수가 아직 로드되지 않았거나 유효하지 않습니다. zustandUser.js를 확인해주세요.');
    }
  }, [userId, refreshUserBookmarks]); 

  return (
    <div className="flex justify-center">
      {userBookmark.length === 0 ? (
        <p className="py-5 text-gray-600">찜한 목록이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-9 py-5">
          {userBookmark.map(item => (
            // 각 찜 항목의 고유 키는 item.store._id를 사용합니다.
            // item.store가 null일 경우를 대비하여 item._id도 확인
            <li key={item.store?._id || item._id} className="flex gap-4"> 
              <div
                className="relative w-[250px] h-[250px] cursor-pointer"
                // 가게 상세 페이지로 이동
                onClick={() => navigate(`/place/${item.store?._id || item._id}`)} 
              >
                <img
                  // 이미지 URL은 item.store.thumbnail 사용, 없을 경우 플레이스홀더
                  src={item.store?.thumbnail || `https://placehold.co/250x250/F0F0F0/6C757D?text=${encodeURIComponent(item.store?.name ? item.store.name.substring(0, Math.min(5, item.store.name.length)) : 'No Image')}`}
                  alt={item.store?.name || '가게 이미지'}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation(); // li의 onClick 이벤트 방지
                    // toggleUserBookmark 함수가 유효한지 확인 후 호출
                    if (typeof toggleUserBookmark === 'function') { 
                        // toggleUserBookmark에 item 객체 전체를 전달 (내부에서 storeId 추출)
                        toggleUserBookmark(userId, item); 
                    } else {
                        // 이 경고가 계속 나타나면 zustandUser.js 파일이 올바르게 업데이트되지 않았다는 의미입니다.
                        console.warn('toggleUserBookmark 함수가 아직 로드되지 않았거나 유효하지 않습니다. zustandUser.js를 확인해주세요.');
                    }
                  }}
                  className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100"
                >
                  {isBookmarked(item) ? ( // 현재 찜 상태에 따라 하트 아이콘 변경
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
                    onClick={(e) => { e.stopPropagation(); navigate(`/place/${item.store?._id || item._id}`); }}
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
