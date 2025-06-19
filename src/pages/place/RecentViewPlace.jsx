// src/pages/place/RecentViewPlace.jsx
import React, { useEffect, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom' // useParams 추가
import axios from 'axios'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import zustandStore from '../../app/zustandStore.js'

const RecentViewPlace = () => {
  const location = useLocation()
  const { id: urlPlaceId } = useParams() // URL에서 가게 ID 추출

  // Zustand 스토어의 상태와 액션 가져오기
  const placeDetailFromStore = zustandStore(state => state.placeDetail)
  const setPlaceDetail = zustandStore(state => state.setPlaceDetail) // setPlaceDetail 추가
  const setIsLoading = zustandStore(state => state.setIsLoading) // setIsLoading 추가

  // Redux에서 사용자 ID 가져오기
  const user = useSelector(state => state.auth.user)
  const userId = user?.id

  // 마지막으로 추가된 가게 ID를 추적하여 중복 API 호출 방지
  const lastAddedStoreId = useRef(null)
  // 이전 URL ID를 추적하여 새로운 ID로 이동했는지 감지
  const previousUrlPlaceId = useRef(urlPlaceId)

  // 이 Effect는 경로가 변경될 때마다 페이지 상단으로 스크롤합니다. (유지)
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  // ★★★ 새로운 useEffect 추가: URL ID 변경 시 ViewPlaceDetail의 상태를 강제로 초기화 ★★★
  // 이 Effect는 ViewPlace나 ViewPlaceDetail의 기존 코드를 수정하지 않으면서
  // URL의 가게 ID가 변경될 때마다 ViewPlaceDetail이 항상 새로운 데이터를 로드하도록 강제합니다.
  useEffect(() => {
    // urlPlaceId가 존재하고, 이전 urlPlaceId와 현재 urlPlaceId가 다를 경우에만 실행
    // (즉, 다른 가게 상세 페이지로 이동했을 때)
    if (urlPlaceId && urlPlaceId !== previousUrlPlaceId.current) {
      setPlaceDetail(null) // Zustand 스토어의 placeDetail을 null로 설정하여 ViewPlaceDetail이 로딩 상태로 전환되도록 함
      setIsLoading(true) // 로딩 스피너를 강제로 표시
    }

    // 현재 urlPlaceId를 이전 urlPlaceId로 업데이트하여 다음 렌더링 시 비교
    previousUrlPlaceId.current = urlPlaceId
  }, [urlPlaceId, setPlaceDetail, setIsLoading]) // urlPlaceId, setPlaceDetail, setIsLoading에 의존하여 상태 변경에 반응

  // 이 Effect는 사용자 ID와 가게 상세 정보가 모두 준비되었을 때 최근 본 기록을 추가합니다. (유지 및 조건 확인)
  useEffect(() => {
    let addHistoryAbortController = new AbortController() // API 요청 취소를 위한 AbortController

    // 최근 본 기록을 백엔드에 추가하는 비동기 함수
    const addRecentViewToHistory = async (placeData, signal) => {
      // 필수 정보 누락 여부 확인
      if (
        !userId ||
        !placeData ||
        !placeData._id ||
        !placeData.name ||
        String(placeData.name).trim() === ''
      ) {
        return
      }

      // 이미 마지막으로 추가된 가게 ID와 현재 가게 ID가 같으면 중복 호출 방지
      if (lastAddedStoreId.current === placeData._id) {
        return
      }

      try {
        // 키워드 데이터 정제 (배열이 아니거나 빈 문자열인 경우 처리)
        let processedKeywords = []
        if (placeData.keywords) {
          if (Array.isArray(placeData.keywords)) {
            processedKeywords = placeData.keywords.map(k => String(k).trim()).filter(k => k !== '')
          } else if (typeof placeData.keywords === 'string' && placeData.keywords.trim() !== '') {
            processedKeywords = placeData.keywords
              .split(',')
              .map(k => k.trim())
              .filter(k => k !== '')
          }
        }

        // 사진 데이터 정제 (배열이 아니거나 thumbnail이 있는 경우 처리)
        const photosToSend = Array.isArray(placeData.photos)
          ? placeData.photos
          : placeData.thumbnail
            ? [placeData.thumbnail]
            : []

        // 백엔드 API 호출
        const response = await axios.post(
          'http://localhost:3000/auth/recent-history',
          {
            userId: userId,
            storeId: placeData._id,
            name: placeData.name,
            keywords: processedKeywords,
            photos: photosToSend,
            rating: placeData.rating,
            address: placeData.address,
          },
          {
            withCredentials: true,
            signal: signal, // 요청 취소를 위한 signal 전달
          },
        )
        lastAddedStoreId.current = placeData._id // 성공 시 마지막 추가된 ID 업데이트
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log(
            'RecentViewPlace - addRecentViewToHistory: 요청이 취소되었습니다 (새로운 요청 발생).',
          )
        } else {
          console.error(
            'RecentViewPlace - addRecentViewToHistory: 최근 기록 백엔드 추가 실패:',
            err.response?.data || err.message,
          )
          toast.error('최근 본 가게 기록 업데이트에 실패했습니다.') // 사용자에게 토스트 메시지 표시
        }
      }
    }

    // 최근 기록 추가 조건: userId, urlPlaceId가 있고, placeDetailFromStore가 urlPlaceId와 일치하며 유효한 데이터일 때
    // 특히, placeDetailFromStore가 빈 배열이 아닌 유효한 객체여야 합니다.
    if (
      userId &&
      urlPlaceId &&
      placeDetailFromStore &&
      Object.keys(placeDetailFromStore).length > 0 && // placeDetailFromStore가 빈 객체가 아닌지 확인
      placeDetailFromStore._id === urlPlaceId
    ) {
      addRecentViewToHistory(placeDetailFromStore, addHistoryAbortController.signal)
    } else {
      ;({
        userId: userId,
        urlPlaceId: urlPlaceId,
        placeDetailFromStore: placeDetailFromStore,
        isMatchingUrl: placeDetailFromStore?._id === urlPlaceId,
      })
    }

    // 클린업 함수: 컴포넌트 언마운트 또는 의존성 변경 시 이전 요청을 취소
    return () => {
      addHistoryAbortController.abort()
    }
  }, [userId, urlPlaceId, placeDetailFromStore])

  // 이 컴포넌트는 UI를 렌더링하지 않습니다.
  return null
}

export default RecentViewPlace
