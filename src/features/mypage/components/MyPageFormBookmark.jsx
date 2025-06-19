// src/features/mypage/components/MyPageFormBookmark.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import zustandUser from '../../../app/zustandUser.js' // zustandUser.js 수정하지 않음
import axios from 'axios'
import { toast } from 'react-toastify'
import { shallow } from 'zustand/shallow'

const MyPageFormBookmark = () => {
  const navigate = useNavigate()

  // zustandUser에서 userBookmark 상태를 가져옵니다.
  const userBookmarkRaw = zustandUser(state => state.userBookmark, shallow)
  const userBookmark = userBookmarkRaw === null ? [] : userBookmarkRaw

  const setUserBookmark = zustandUser(state => state.setUserBookmark)

  const user = useSelector(state => state.auth.user)
  const userId = user?.id

  // 찜 목록 로딩 상태
  const [isBookmarksLoading, setIsBookmarksLoading] = useState(true)

  // 이전에 성공적으로 로드된 userId를 저장하여 불필요한 fetch 방지
  const lastSuccessfullyFetchedUserId = useRef(null)

  // --- 1. 찜 상태 확인 함수 (userBookmark 배열을 기반으로 직접 확인) ---
  const isBookmarkedCheck = useCallback(
    item => {
      const targetStoreId = item.store?._id || item._id
      return userBookmark.some(bookmark => bookmark.store?._id === targetStoreId)
    },
    [userBookmark],
  )

  // --- 2. 찜 목록 불러오기 (MyPageFormBookmark 자체에서 처리) ---
  useEffect(() => {
    let isMounted = true

    const fetchUserBookmarks = async () => {
      if (!userId) {
        console.log(
          'MyPageFormBookmark: 사용자 ID가 없어 찜 목록을 불러올 수 없습니다. userBookmark 초기화.',
        )
        if (isMounted) {
          setUserBookmark([])
          setIsBookmarksLoading(false)
          lastSuccessfullyFetchedUserId.current = null
        }
        return
      }

      if (lastSuccessfullyFetchedUserId.current === userId) {
        console.log(
          `MyPageFormBookmark: 찜 목록이 이미 로드되어 다시 불러오지 않습니다. (userId: ${userId})`,
        )
        if (isMounted) setIsBookmarksLoading(false)
        return
      }

      if (isMounted) setIsBookmarksLoading(true)

      try {
        console.log(`MyPageFormBookmark: 찜 목록 불러오는 중... (userId: ${userId})`)
        const response = await axios.get(`http://localhost:3000/bookmark/read/${userId}`, {
          withCredentials: true,
        })

        if (isMounted) {
          if (Array.isArray(response.data)) {
            const newBookmarks = response.data

            const areBookmarksIdentical = (arr1, arr2) => {
              if (arr1.length !== arr2.length) return false
              const sortedArr1 = [...arr1].sort((a, b) =>
                (a.store?._id || '').localeCompare(b.store?._id || ''),
              )
              const sortedArr2 = [...arr2].sort((a, b) =>
                (a.store?._id || '').localeCompare(b.store?._id || ''),
              )

              for (let i = 0; i < sortedArr1.length; i++) {
                if (sortedArr1[i].store?._id !== sortedArr2[i].store?._id) {
                  return false
                }
              }
              return true
            }

            if (!areBookmarksIdentical(userBookmark, newBookmarks)) {
              setUserBookmark(newBookmarks)
              console.log('MyPageFormBookmark: 찜 목록 새로고침 성공:', newBookmarks)
            } else {
              console.log('MyPageFormBookmark: 찜 목록 변경 없음, 업데이트 건너뜜.')
            }
            lastSuccessfullyFetchedUserId.current = userId
          } else {
            console.warn('MyPageFormBookmark: 찜 목록 응답 형식이 배열이 아닙니다:', response.data)
            setUserBookmark([])
            toast.error('찜 목록 데이터를 처리할 수 없습니다.')
          }
        }
      } catch (error) {
        console.error(
          'MyPageFormBookmark: 찜 목록 불러오기 실패:',
          error.response?.data || error.message,
        )
        if (isMounted) {
          setUserBookmark([])
          toast.error('찜 목록을 불러오는데 실패했습니다.')
        }
        lastSuccessfullyFetchedUserId.current = null
      } finally {
        if (isMounted) setIsBookmarksLoading(false)
      }
    }

    fetchUserBookmarks()

    return () => {
      isMounted = false
    }
  }, [userId, setUserBookmark])

  // --- 3. 찜 토글 핸들러 (MyPageFormBookmark 자체에서 직접 axios 호출 및 상태 업데이트) ---
  const handleBookmarkToggle = async itemToToggle => {
    if (!userId) {
      toast.info('로그인 후 찜 기능을 이용할 수 있습니다.')
      navigate('/login')
      return
    }

    const targetStoreId = itemToToggle.store?._id || itemToToggle._id
    if (!targetStoreId) {
      console.error('handleBookmarkToggle: 유효한 storeId를 찾을 수 없습니다.', itemToToggle)
      toast.error('찜할 가게 정보를 찾을 수 없습니다.')
      return
    }

    const isCurrentlyBookmarked = isBookmarkedCheck(itemToToggle)

    try {
      if (isCurrentlyBookmarked) {
        await axios.delete(`http://localhost:3000/bookmark/delete/${targetStoreId}`, {
          headers: { user: userId },
          withCredentials: true,
        })
        toast.success('찜이 해제되었습니다.')
        setUserBookmark(prevBookmarks => {
          const newBookmarks = prevBookmarks.filter(
            bookmark => bookmark.store?._id !== targetStoreId,
          )
          lastSuccessfullyFetchedUserId.current = null
          return newBookmarks
        })
      } else {
        await axios.post(
          `http://localhost:3000/bookmark/regist/${targetStoreId}`,
          {
            headers: { user: userId },
          },
          {
            withCredentials: true,
          },
        )
        toast.success('찜 목록에 추가되었습니다.')
        setUserBookmark(prevBookmarks => {
          const newBookmarkItem = {
            _id: `temp-${Date.now()}-${targetStoreId}`,
            store: {
              _id: targetStoreId,
              name: itemToToggle.store?.name || 'Unknown',
              // ★★★ photos를 직접 전달 (thumbnail 대신) ★★★
              photos: itemToToggle.store?.photos || [],
              rating: itemToToggle.store?.rating,
              address: itemToToggle.store?.address,
              keywords: itemToToggle.store?.keywords,
            },
          }
          if (!prevBookmarks.some(b => b.store?._id === newBookmarkItem.store?._id)) {
            lastSuccessfullyFetchedUserId.current = null
            return [...prevBookmarks, newBookmarkItem]
          }
          return prevBookmarks
        })
      }
    } catch (error) {
      console.error('MyPageFormBookmark: 찜 토글 실패:', error.response?.data || error.message)
      const errorMessage = error.response?.data?.msg || '찜 기능 처리 중 오류가 발생했습니다.'
      toast.error(errorMessage)
      lastSuccessfullyFetchedUserId.current = null
    }
  }

  // 로딩 중일 때 표시할 내용
  if (isBookmarksLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-gray-600">찜 목록을 불러오는 중입니다...</p>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      {Array.isArray(userBookmark) && userBookmark.length === 0 ? (
        <p className="py-5 text-gray-600">찜한 목록이 없습니다.</p>
      ) : (
        Array.isArray(userBookmark) && (
          <ul className="flex flex-col gap-9 py-5">
            {userBookmark.map(item => (
              <li
                key={item.store?._id || item._id || `bookmark-item-${Math.random()}`}
                className="flex gap-4"
              >
                <div
                  className="relative w-[250px] h-[250px] cursor-pointer"
                  onClick={() => {
                    if (item.store?._id) {
                      // ★★★ 경로를 /place/:id로 변경 ★★★
                      navigate(`/place/${item.store._id}`)
                    } else {
                      console.warn(
                        'MyPageFormBookmark: 유효한 가게 ID가 없어 상세 페이지로 이동할 수 없습니다.',
                        item,
                      )
                    }
                  }}
                >
                  <img
                    // ★★★ item.store?.photos를 우선 사용하고, 없으면 플레이스홀더 이미지로 대체 ★★★
                    src={
                      item.store?.photos && item.store.photos.length > 0
                        ? item.store.photos[0]
                        : `https://placehold.co/250x250/F0F0F0/6C757D?text=${encodeURIComponent(item.store?.name ? item.store.name.substring(0, Math.min(5, item.store.name.length)) : 'No Image')}`
                    }
                    alt={item.store?.name || '가게 이미지'}
                    className="w-full h-full object-cover rounded-lg"
                    onError={e => {
                      e.target.onerror = null
                      e.target.src = `https://placehold.co/250x250/F0F0F0/6C757D?text=${encodeURIComponent(item.store?.name ? item.store.name.substring(0, Math.min(5, item.store.name.length)) : 'No Image')}`
                    }}
                  />
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation()
                      handleBookmarkToggle(item)
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
                  <h2 className="text-lg py-1 font-SinchonRhapsody flex">
                    {item.store?.name || '이름 없음'}
                  </h2>
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
                      #
                      {Array.isArray(item.store.keywords)
                        ? item.store.keywords.join(', #')
                        : String(item.store.keywords)
                            .split(',')
                            .map(k => k.trim())
                            .join(', #')}
                    </p>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (item.store?._id) {
                        // ★★★ 경로를 /place/:id로 변경 ★★★
                        navigate(`/place/${item.store._id}`, {state:item})
                        console.log(item)
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
            ))}
          </ul>
        )
      )}
    </div>
  )
}

export default MyPageFormBookmark
