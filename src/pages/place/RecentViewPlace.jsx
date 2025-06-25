// src/pages/place/RecentViewPlace.jsx
import React, { useEffect, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import zustandStore from '../../app/zustandStore.js'
import axios from 'axios'
import { API } from '../../app/api.js'
import { toast } from 'react-toastify'

const RecentViewPlace = () => {
  const location = useLocation()
  const { id: urlPlaceId } = useParams() // URL에서 가게 ID 추출

  // Zustand 스토어의 placeDetail 상태 가져오기
  const placeDetailFromStore = zustandStore(state => state.placeDetail)

  // Redux에서 사용자 ID 가져오기
  const user = useSelector(state => state.auth.user)
  const userId = user?.id // user.id는 로그인된 사용자의 ID

  // 마지막으로 추가된 가게 ID를 추적하여 중복 API 호출 방지
  const lastAddedStoreId = useRef(null)

  // 이 Effect는 경로가 변경될 때마다 페이지 상단으로 스크롤합니다.
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  // 이 Effect는 가게 상세 페이지 ID와 사용자 ID가 유효할 때 최근 기록에 추가합니다.
  useEffect(() => {
    // 사용자 ID, 현재 URL의 가게 ID, placeDetailFromStore가 모두 있어야 하고,
    // 특히 placeDetailFromStore의 _id와 name이 유효해야 합니다.
    if (
      userId &&
      urlPlaceId &&
      placeDetailFromStore &&
      placeDetailFromStore._id === urlPlaceId &&
      placeDetailFromStore.name && // placeDetailFromStore.name이 존재하는지 확인
      String(placeDetailFromStore.name).trim() !== '' // name이 빈 문자열이 아닌지 확인
    ) {
      // 이전에 기록된 가게 ID와 현재 ID가 다를 경우에만 API 호출
      if (lastAddedStoreId.current !== urlPlaceId) {
        const addRecentView = async () => {
          try {

            // placeDetailFromStore에서 필요한 정보 추출
            const { name, photos, rating, address, keyword } = placeDetailFromStore

            // ★★★ 여기에서 전송할 데이터를 다시 한 번 로깅합니다. ★★★

            API.post('/auth/recent-history/add', {
              storeId: urlPlaceId,
              name: name,
              photos: photos || [],
              rating: rating || 0.0,
              address: address || '',
            }).catch(err => {
              toast.error(
                <div className="Toastify__toast-body cursor-default">방문 기록 갱신 실패.</div>,
                {
                  position: 'top-center',
                },
              )
            })
            lastAddedStoreId.current = urlPlaceId // 성공 시 마지막 기록된 ID 업데이트
          } catch (error) {
            // toast.error('최근 기록 추가 중 오류가 발생했습니다.'); // 사용자에게 보여줄 필요는 없을 수 있음
          }
        }

        addRecentView()
      }
    }
  }, [userId, urlPlaceId, placeDetailFromStore])

  // 이 컴포넌트 자체는 UI를 렌더링하지 않습니다.
  return null
}

export default RecentViewPlace
