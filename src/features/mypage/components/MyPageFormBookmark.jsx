// src/features/mypage/components/MyPageFormBookmark.jsx

import React, { useEffect } from 'react' // useEffect를 임포트
import { useNavigate } from 'react-router-dom' // useNavigate를 임포트
import { useSelector } from 'react-redux' // useSelector를 임포트
import zustandUser from '../../../app/zustandUser.js' // 경로 확인: src/features/mypage/components에서 src/app으로 가는 경로
import zustandStore from '../../../app/zustandStore.js'
import { API } from '../../../app/api.js'
import defaultfood from '../../../assets/images/default2.png'
// toast는 사용자 요청에 따라 현재 이 파일에서 직접 추가하지 않지만,
// confirm() 대체 권장 사항에 따라 필요할 수 있습니다.
// import { toast } from 'react-toastify';

// recentStores는 현재 컴포넌트에서 사용되지 않지만, 사용자 요청에 따라 제거하지 않음
const MyPageFormBookmark = ({ backendBaseUrl, recentStores }) => {
  const navigate = useNavigate() // ZustandUser 스토어에서 찜 목록 상태와 관련 액션을 개별적으로 가져오기
  // userBookmark는 null일 경우 빈 배열로 대체 (초기 로딩 시나 저장된 데이터 없을 때 안전)

  const userBookmark = zustandUser(state => state.userBookmark || []) // setUserBookmark가 함수인지 확인하여 안전하게 호출되도록 합니다.
  const setUserBookmark = zustandUser(state => state.setUserBookmark)
  const refreshUserBookmarks = zustandUser(state => state.refreshUserBookmarks)
  const toggleUserBookmark = zustandUser(state => state.toggleUserBookmark) // 사용자 요청에 따라 유지
  const setPlaceDetail = zustandStore(state => state.setPlaceDetail) // Redux 스토어에서 사용자 ID 가져오기
  const user = useSelector(state => state.auth.user)
  const userId = user?.id

  const isBookmarked = item => {
    // item.store가 없을 경우 item._id로 대체 (찜 목록 아이템 자체의 _id)
    const targetStoreId = item.store?._id || item._id // userBookmark가 배열이고, 내부 항목에 store 객체가 있는지 확인 후 _id 비교
    return (
      Array.isArray(userBookmark) &&
      userBookmark.some(bookmark => bookmark.store?._id === targetStoreId)
    )
  } // 컴포넌트 마운트 시 또는 userId 변경 시 찜 목록을 새로고침

  useEffect(() => {
    // refreshUserBookmarks 함수가 유효한지 확인 후 호출
    if (typeof refreshUserBookmarks === 'function') {
      if (userId) {
        refreshUserBookmarks(userId)
      } else {
        // userId가 없을 경우 찜 목록 초기화 (refreshUserBookmarks가 내부에서 처리)
        console.log(
          'MyPageFormBookmark: 사용자 ID가 없어 찜 목록을 불러올 수 없습니다. 찜 목록을 초기화합니다.',
        )
        refreshUserBookmarks(null)
      }
    } else {
      // 이 경고가 계속 나타나면 zustandUser.js 파일이 올바르게 업데이트되지 않았다는 의미입니다.
      console.warn(
        'refreshUserBookmarks 함수가 아직 로드되지 않았거나 유효하지 않습니다. zustandUser.js를 확인해주세요.',
      )
    }
  }, [userId, refreshUserBookmarks]) // userId와 refreshUserBookmarks가 종속성 배열에 포함되어야 함
  // 사용자 요청에 따라 이 함수는 그대로 유지됩니다.

  const handleDeleteBookmark = item => {
    const storeId = item?.store?._id // confirm() 및 alert()는 사용자 요청에 따라 유지됩니다. (Canvas 환경에서는 작동하지 않음)

    if (confirm('북마크를 해제하시겠습니까?')) {
      API.delete(`/bookmark/delete/${storeId}`, {
        headers: {
          user: userId,
        },
      })
        .then(res => {
          const data = res.data // console.log(data);
          setUserBookmark(prev => prev.filter(ubm => ubm?.store?._id !== storeId)) // 옵셔널 체이닝 추가
        })
        .catch(err => {
          console.error('북마크 해제 요청 실패!', err)
          alert('북마크 해제에 실패했습니다. 다시 시도해주세요.') // alert() 유지
        })
    }
  }

  return (
    <div className="flex justify-center">
      {userBookmark.length === 0 ? (
        <p className="py-5 text-gray-600">찜한 목록이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-9 py-5">
          {userBookmark.map(item => {
            // item.store가 유효한지 먼저 확인합니다.
            const store = item.store
            if (!store) {
              console.warn('유효하지 않은 찜 항목이 감지되었습니다 (store 객체 없음):', item)
              return null // 유효하지 않은 항목은 렌더링하지 않습니다.
            } // isBookmarked 함수는 item 객체를 받으므로, store._id를 사용하여 찜 상태 확인
            const bookmarked = isBookmarked(item)

            return (
              <li key={store._id} className="flex gap-4">
                <div
                  className="relative w-[250px] h-[250px] cursor-pointer" // 가게 상세 페이지로 이동
                  onClick={() => {
                    if (store._id) {
                      // store._id가 유효한지 확인 후 navigate
                      setPlaceDetail(null) // 상세 페이지 이동 전에 기존 상세 정보 초기화 (선택 사항)
                      navigate(`/place/${store._id}`, { state: store }) // navigate state에 store 정보 전달
                    } else {
                      console.warn(
                        'MyPageFormBookmark: 유효한 가게 ID가 없어 상세 페이지로 이동할 수 없습니다.',
                        item,
                      )
                    }
                  }}
                >
                  <img
                    src={
                      store.photos && store.photos.length > 0
                        ? store.photos[0].startsWith('http') || store.photos[0].startsWith('https')
                          ? store.photos[0]
                          : `${backendBaseUrl}${store.photos[0]}`
                        : defaultfood
                    }
                    alt={store.name || '이미지 없음'} // item.name -> store.name
                    className="w-full h-full object-cover rounded-lg"
                    onError={e => {
                      e.target.onerror = null
                      e.target.src = defaultfood
                    }}
                  />
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      if (typeof toggleUserBookmark === 'function') {
                        toggleUserBookmark(userId, item)
                      } else {
                        console.warn(
                          'toggleUserBookmark 함수가 아직 로드되지 않았거나 유효하지 않습니다. zustandUser.js를 확인해주세요.',
                        )
                      }
                    }}
                    className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100"
                  >
                    {isBookmarked(item) ? (
                      <span
                        role="img"
                        aria-label="bookmarked"
                        onClick={e => {
                          e.stopPropagation()
                          handleDeleteBookmark(item)
                        }}
                      >
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
                  <h2 className="text-lg py-1 font-SinchonRhapsody flex">
                    {store.name || '이름 없음'}
                  </h2>
                
                  <div className="py-1 flex items-center text-sm text-gray-500">
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
                    {store.keywords && Array.isArray(store.keywords) && store.keywords.length > 0 && (
                    <p className="py-1 text-sm text-gray-700">#{store.keywords.join(', #')}</p>
                  )}
                  </div>
                    <div>{store.address || '주소 없음'}</div>
                    <p className="py-1">평점:⭐{store.rating}</p>

                  <button
                    onClick={e => {
                      e.stopPropagation()
                      if (store._id) {
                        // store._id가 유효한지 확인 후 navigate
                        setPlaceDetail(null)
                        navigate(`/place/${store._id}`, { state: store }) // navigate state에 store 정보 전달
                      } else {
                        console.warn(
                          'MyPageFormBookmark: 유효한 가게 ID가 없어 상세 페이지로 이동할 수 없습니다.',
                          item,
                        )
                      }
                    }}
                    className="mt-2 text-blue-500 hover:underline text-sm"
                  >
                    상세 보기
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default MyPageFormBookmark
