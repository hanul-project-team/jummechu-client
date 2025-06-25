// src/pages/mypage/MyPageForm.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { restoreLogin } from '../../auth/slice/authSlice.js'
import Modal from '../components/UserModal.jsx'
import PwdChangeModal from '../components/PwdChangeModal.jsx'
import MypagesAuthForm from '../components/MypagesAuthForm.jsx'
import MypageFormReview from './MyPageFormReviews.jsx'
import MyPageFormAI from './MyPageFormAI.jsx'
import MyPageFormRecent from '../components/MyPageFormRecent.jsx'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import '../MyPage.css'
import MyPageFormBookmark from '../components/MyPageFormBookmark.jsx'
import zustandUser from '../../../app/zustandUser.js'
import { toast } from 'react-toastify'
import defaultProfileImg from '../../../assets/images/defaultProfileImg.jpg'
import { shallow } from 'zustand/shallow'
import zustandStore from '../../../app/zustandStore.js'
import { API } from '../../../app/api.js'
import ConfirmModal from '../components/ConfirmModal.jsx' // ConfirmModal 임포트

const MyPageForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(state => state.auth.user)
  const userId = user?.id
  const wrapperRefs = useRef({}) // 환경 변수에서 backendBaseUrl 가져오기
  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
  const setPlaceDetail = zustandStore(state => state.setPlaceDetail)

  const userBookmark = zustandUser(state => state.userBookmark, shallow)
  const setUserBookmark = zustandUser(state => state.setUserBookmark)
  const setIsLoading = zustandUser(state => state.setIsLoading) // AI 추천 API 호출 중인지 여부를 추적하는 Ref (리렌더링을 유발하지 않음)

  const aiFetchInProgressRef = useRef(false)

  const fetchUserBookmarks = useCallback(async () => {
    if (!userId) {
      setIsLoading(false)
      setUserBookmark([])
      return
    }

    setIsLoading(true)
    try {
      // console.log(`MyPageForm: 찜 목록 불러오는 중... (userId: ${userId})`)
      const response = await API.get(`/bookmark/read/${userId}`, {
        withCredentials: true,
      })

      if (Array.isArray(response.data)) {
        const newBookmarks = response.data
        setUserBookmark(newBookmarks)
        // console.log('MyPageForm: 찜 목록 새로고침 성공:', newBookmarks)
      } else {
        // console.warn('MyPageForm: 찜 목록 응답 형식이 배열이 아닙니다:', response.data)
        setUserBookmark([])
        toast.error('찜 목록 데이터를 처리할 수 없습니다.')
      }
    } catch (error) {
      console.error('MyPageForm: 찜 목록 불러오기 실패:', error.response?.data || error.message)
      setUserBookmark([])
      toast.error('찜 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [userId, setUserBookmark, setIsLoading, API])

  useEffect(() => {
    fetchUserBookmarks()
  }, [fetchUserBookmarks])

  const [active, setActive] = useState(() => {
    if (location.state?.fromVerification && location.state?.activeTab) {
      return location.state.activeTab
    }
    return '최근기록'
  })

  const [isAuthenticatedForSettings, setIsAuthenticatedForSettings] = useState(() => {
    return location.state?.fromVerification && location.state?.activeTab === '계정 설정'
  })

  const tabs = ['최근기록', '찜', '리뷰', '음식점 추천(AI)', '계정 설정']
  const [isopen, setIsOpen] = useState(false)
  const [openai, setOpenAi] = useState([])
  const [dalleImage, setDalleImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userNickname, setUserNickname] = useState('로딩중')
  const [userEmail, setUserEmail] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [userName, setUserName] = useState('')
  const [userProfileImage, setUserProfileImage] = useState(defaultProfileImg)

  const [tempNickname, setTempNickname] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [recentStores, setRecentStores] = useState([])
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)

  const [hasFetchedAIRecommendations, setHasFetchedAIRecommendations] = useState(false)
  const [aiRecommendationKeyword, setAiRecommendationKeyword] = useState([])
  const defaultTags = [
    '패스트푸드',
    '치킨',
    '피자',
    '햄버거',
    '스테이크',
    '샤브샤브',
    '초밥',
    '갈비',
    '비빔밥',
    '커피',
    '디저트',
    '라면',
    '김밥',
    '전골',
    '샌드위치',
    '도시락',
    '삼계탕',
    '핫도그',
    '국수',
    '스테이크 하우스',
    '레스토랑',
    '커피숍',
    '호프',
    '감자탕',
    '술집',
    '고기집',
    '도넛',
    '회',
    '분식',
    '국밥',
    '찜닭',
    '파스타',
    '기사식당',
    '수제버거',
    '닭강정',
    '돈까스',
    '비빔국수',
    '회덮밥',
    '샐러드',
    '덮밥',
    '닭꼬치',
    '떡갈비',
    '돼지불백',
    '한식',
    '일식',
    '양식',
    '중식',
    '삼겹살',
    '김치찌개',
    '닭갈비',
    '불고기',
    '보쌈',
    '조개',
    '해장국',
    '갈비찜',
    '설렁탕',
    '매운탕',
    '빵',
    '떡볶이',
    '부대찌개',
    '짜장면',
    '탕수육',
    '아이스크림',
    '떡',
  ]
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState('')

  const handlePasswordChangeSuccess = () => {
    toast.success('비밀번호가 성공적으로 변경되었습니다! 다시 로그인 해주세요.', {
      position: 'top-center',
    })
    localStorage.removeItem('accessToken')
    navigate('/login')
  }

  useEffect(() => {
    if (active !== '음식점 추천(AI)') {
      return
    }

    if (userLocation || locationError) {
      return
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setLocationError('')
        },
        error => {
          console.error('위치 정보 획득 실패:', error)
          let errorMessage = '위치 정보를 가져올 수 없습니다.'
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = '위치 정보 사용 권한이 거부되었습니다.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = '위치 정보를 사용할 수 없습니다.'
              break
            case error.TIMEOUT:
              errorMessage = '위치 정보를 가져오는 시간이 초과되었습니다.'
              break
            default:
              errorMessage = '알 수 없는 위치 정보 오류가 발생했습니다.'
              break
          }
          setLocationError(errorMessage)
          toast.error(`위치 정보 오류: ${errorMessage}`, { position: 'top-center' })
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      )
    } else {
      const msg = '이 브라우저에서는 위치 정보가 지원되지 않습니다.'
      setLocationError(msg)
      toast.warn(msg, { position: 'top-center' })
    }
  }, [active, userLocation, locationError])

  useEffect(() => {
    const fetchRecentStores = async () => {
      if (!userId) {
        setRecentStores([])
        return
      }

      try {
        const response = await API.get(`/auth/recent-history?userId=${userId}`, {
          withCredentials: true,
        })
        const fetchedRecentStores = response.data.recentViewedStores
        setRecentStores(fetchedRecentStores)
      } catch (error) {
        console.error('MyPageForm: 최근 기록 불러오기 실패:', error)
        setRecentStores([])
      }
    }

    if (active !== '음식점 추천(AI)') {
      setHasFetchedAIRecommendations(false)
      aiFetchInProgressRef.current = false
    }

    if (active === '최근기록' || active === '음식점 추천(AI)') {
      fetchRecentStores()
    }
  }, [active, userId, API])

  useEffect(() => {
    if (location.state) {
      if (location.state.fromVerification && location.state.activeTab === '계정 설정') {
        setActive('계정 설정')
        setIsAuthenticatedForSettings(true)
        navigate(location.pathname, { replace: true, state: {} })
      } else if (location.state.fromMyPage) {
        // MyPageForm에서 인증 페이지로 이동했을 때의 처리 (이 경우, isAuthenticatedForSettings는 false 유지)
      }
    }
  }, [location.state, navigate, location.pathname])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await API.get(`/auth/myprofile`, {
          withCredentials: true,
        })

        const callUserNickname = response.data.nickname
        setUserNickname(callUserNickname || '익명 사용자')
        setTempNickname(callUserNickname || '익명 사용자')

        const callUserEmail = response.data.email
        setUserEmail(callUserEmail)

        const callUserPhone = response.data.phone
        setUserPhone(callUserPhone)

        const callUserName = response.data.name
        setUserName(callUserName)

        const callUserImage = response.data.profileImage
        setUserProfileImage(callUserImage ? `${import.meta.env.VITE_API_BASE_URL}${callUserImage}` : defaultProfileImg)
      } catch (error) {
        console.error('사용자 프로필 정보를 불러오는데 실패했습니다:', error)
        setUserProfileImage(defaultProfileImg)
      }
    }
    fetchUserProfile()
  }, [backendBaseUrl])

  const callOpenAi = async (promptContent, lat = null, lon = null) => {
    try {
      const payload = { prompt: promptContent }
      if (lat !== null && lon !== null) {
        payload.latitude = lat
        payload.longitude = lon
      }
      const response = await API.post(`/api/azure/openai`, payload)
      return response
    } catch (error) {
      console.error('OpenAI 호출 실패:', error.response?.data || error.message)
      return { data: null }
    }
  }

  const extractMostFrequentKeywords = useCallback(() => {
    const allKeywords = {}
    const excludeKeywords = ['#음식점']

    recentStores.forEach(item => {
      const keywordsArray = Array.isArray(item.keyword)
        ? item.keyword
        : item.keyword
          ? String(item.keyword)
              .split(',')
              .map(k => k.trim())
          : []

      keywordsArray.forEach(keyword => {
        if (keyword && !excludeKeywords.includes(keyword)) {
          allKeywords[keyword] = (allKeywords[keyword] || 0) + 1
        }
      })
    })

    userBookmark.forEach(bookmarkItem => {
      if (
        bookmarkItem.store &&
        bookmarkItem.store.keywords &&
        Array.isArray(bookmarkItem.store.keywords)
      ) {
        bookmarkItem.store.keywords.forEach(keyword => {
          if (keyword && !excludeKeywords.includes(keyword.trim())) {
            // 제외 키워드 필터링 추가
            allKeywords[keyword.trim()] = (allKeywords[keyword.trim()] || 0) + 1
          }
        })
      }
    })

    let maxCount = 0
    for (const keyword in allKeywords) {
      if (allKeywords[keyword] > maxCount) {
        maxCount = allKeywords[keyword]
      }
    }

    if (maxCount === 0) return []
    return Object.keys(allKeywords).filter(keyword => allKeywords[keyword] === maxCount)
  }, [recentStores, userBookmark])

  useEffect(() => {
    const fetchAIRecommendations = async () => {
      if (active !== '음식점 추천(AI)') {
        return
      }

      if (hasFetchedAIRecommendations || aiFetchInProgressRef.current) {
        return
      }

      if (recentStores.length === 0 && userBookmark.length === 0) {
        setOpenAi(['AI 추천을 위해 최근 본 가게 기록 또는 찜 목록이 필요합니다.'])
        setLoading(false)
        setHasFetchedAIRecommendations(true)
        return
      }

      if (!userLocation && !locationError) {
        setLoading(true)
        return
      }
      if (locationError) {
        setOpenAi([`AI 추천을 위해 위치 정보가 필요합니다: ${locationError}`])
        setLoading(false)
        setHasFetchedAIRecommendations(true)
        return
      }

      setLoading(true)
      setOpenAi([])
      setDalleImage(null)
      aiFetchInProgressRef.current = true

      try {
        const keywordsForAI = extractMostFrequentKeywords()
        const aiKeywordsForState = keywordsForAI?.length > 0 ? keywordsForAI : ['다양한 음식']
        setAiRecommendationKeyword(aiKeywordsForState)

        let promptToUse
        let dalleKeyword
        const aiKeywordsStringForPrompt = aiKeywordsForState.join(', ')

        if (
          aiKeywordsForState.length > 0 &&
          !(aiKeywordsForState.length === 1 && aiKeywordsForState[0] === '다양한 음식')
        ) {
          promptToUse = `
 다음은 사용자가 최근 관심 있어 했거나 찜한 음식점들의 키워드 목록입니다. 이 목록에 있는 키워드를 **최대한 많이 반영**하여 새로운 음식점을 추천해주세요:
${aiKeywordsStringForPrompt}
이 키워드들과 **가장 많이** 겹치고, 현재 위치 주변에서 **가까운** 주변 음식점 4곳을 추천해 주세요.
추천 시, '#음식점'과 같이 너무 일반적인 키워드는 생성하지 마십시오.
결과는 다음 필드를 포함하는 JSON 형식의 배열로만 출력하세요. JSON 외에는 아무 것도 출력하지 마세요.
- title: 음식점 이름
- rating: 평점 (0.0 ~ 5.0)
- description: 음식점 설명 (간단하고 매력적인 한 줄)
- keyword: 이 음식점의 키워드 배열 (예: ["#떡볶이", "#분식", "#매운맛"])
- overlap_count: 겹치는 키워드 수
`
          dalleKeyword = aiKeywordsStringForPrompt
        } else {
          promptToUse = `
사용자에게 현재 위치 주변에서 **가까운** 인기 있는 주변 음식점 4곳을 추천해 주세요.
다양한 종류의 음식점을 포함하여 추천해 주세요.
추천 시, '#음식점'과 같이 너무 일반적인 키워드는 생성하지 마십시오.
결과는 다음 필드를 포함하는 JSON 형식의 배열로만 출력하세요. JSON 외에는 아무 것도 출력하지 마세요.
- title: 음식점 이름
- rating: 평점 (0.0 ~ 5.0)
- description: 음식점 설명 (간단하고 매력적인 한 줄)
- keyword: 이 음식점의 키워드 배열 (예: ["#한식", "#분위기좋은", "#가성비"])
- overlap_count: 겹치는 키워드 수 (항상 0)
`
          dalleKeyword = '한국 음식'
        }

        const openaiResponse = await callOpenAi(
          promptToUse,
          userLocation.latitude,
          userLocation.longitude,
        )
        if (openaiResponse && openaiResponse.data) {
          let parsedData = openaiResponse.data
          if (typeof openaiResponse.data === 'string') {
            try {
              parsedData = JSON.parse(openaiResponse.data)
            } catch (e) {
              console.error('Client: AI 응답 JSON 파싱 오류 (문자열 -> JSON):', e)
              setOpenAi(['AI 응답 형식이 유효하지 않아 추천을 표시할 수 없습니다.'])
              return
            }
          }

          if (Array.isArray(parsedData) && parsedData.length > 0) {
            // AI 응답에서 다시 한번 #음식점 키워드를 필터링 (방어적 코딩)
            const cleanedData = parsedData.map(item => ({
              ...item,
              keyword: Array.isArray(item.keyword)
                ? item.keyword.filter(k => k.trim() !== '#음식점')
                : item.keyword, // 배열이 아닌 경우 그대로 유지
            }))
            setOpenAi(cleanedData) // 필터링된 데이터로 상태 업데이트

            const imageUrl = await callDalleImage(dalleKeyword)
            if (imageUrl) {
              setDalleImage(imageUrl)
            } else {
              setDalleImage(null)
            }
          } else {
            setOpenAi(['AI 응답이 예상된 형식이 아니거나 비어있습니다.'])
          }
        } else {
          setOpenAi(['AI 추천을 받을 수 없습니다.'])
        }
      } catch (apiError) {
        console.error('OpenAI/DALL-E API 호출 실패:', apiError)
        setOpenAi(['AI 추천을 불러오는 중 오류가 발생했습니다.'])
        setDalleImage(null)
      } finally {
        setLoading(false)
        setHasFetchedAIRecommendations(true) // API 호출 시도 완료 표시
        aiFetchInProgressRef.current = false // API 호출 완료를 Ref에 기록
      }
    }

    fetchAIRecommendations()
  }, [
    active,
    recentStores,
    userBookmark,
    userLocation,
    locationError,
    defaultTags,
    backendBaseUrl,
    extractMostFrequentKeywords,
  ])

  const callDalleImage = async keyword => {
    try {
      const res = await API.post(`/api/azure/dalle`, {
        prompt: `${keyword}에 대한 실제 음식 사진처럼 보이고, 시선을 사로잡는 아름다운 구도와 부드러운 자연광이 돋보이는 초고화질 음식 사진을 생성해주세요. 식욕을 돋우는 선명한 색감과 생생한 질감을 가진, 배경은 단순하게 처리하고 음식에 집중해주세요.`,
      })
      // 이미지 URL이 완전한 URL (http/https)인지 확인하고 반환
      // 백엔드에서 Base64 인코딩된 데이터를 직접 받는 경우, 'data:image/png;base64,...' 형식으로 반환해야 합니다.
      // 현재 이미지 경로가 파일 시스템 경로로 되어 있어 이 부분에 문제가 있을 수 있습니다.
      // 백엔드에서 유효한 URL을 반환한다고 가정하고, 그대로 사용합니다.
      // 만약 백엔드가 Base64 문자열을 준다면, `data:image/png;base64,${res.data.imageUrl}` 과 같이 만들어야 합니다.
      return res?.data?.imageUrl || null // **백엔드 응답이 유효한 이미지 URL이라고 가정**
    } catch (err) {
      console.error(`DALL·E 호출 실패 (${keyword}):`, err.response?.data || err.message)
      return null
    }
  }

  const handleClick = (e, tab) => {
    e.preventDefault()
    setActive(tab)
    if (tab !== '계정 설정') {
      setIsAuthenticatedForSettings(false)
    }
  }

  const handleEditToggle = () => {
    if (!isEditing) {
      setTempNickname(userNickname)
    }
    setIsEditing(prev => !prev)
  }

  const handleSaveChanges = async () => {
    try {
      const response = await API.put(
        `/auth/profile`,
        {
          nickname: tempNickname,
          email: userEmail,
          phone: userPhone,
          name: userName,
        },
        {
          withCredentials: true,
        },
      )

      if (response.status === 200) {
        toast.success('프로필 정보가 성공적으로 업데이트되었습니다.', { position: 'top-center' })
        setUserNickname(tempNickname)
        setIsEditing(false)
        dispatch(restoreLogin())
      } else {
        toast.error(`프로필 정보 업데이트 실패: ${response.data.message || '알 수 없는 오류'}`, {
          position: 'top-center',
        })
      }
    } catch (error) {
      toast.error(
        `프로필 정보 업데이트 중 오류가 발생했습니다: ${error.response?.data?.message || '서버 오류'}`,
        { position: 'top-center' },
      )
    }
  }

  const handleDeleteAccountClick = async () => {
    setShowDeleteConfirmModal(true) // window.confirm 대신 toast 또는 커스텀 모달로 사용자에게 확인 요청
    toast.warn('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.', {
      position: 'top-center',
      autoClose: true, // 사용자가 직접 닫아야 함
      closeButton: true,
      closeOnClick: false,
      draggable: false,
      action: {
        label: '삭제',
        onClick: async () => {
          try {
            const response = await API.delete(`/auth/account`, {
              withCredentials: true,
            })
          } catch (error) {
            console.error('계정 삭제 실패:', error)
            toast.error(
              `계정 삭제 중 오류가 발생했습니다: ${error.response?.data?.message || '서버 오류'}`,
              { position: 'top-center' },
            )
          }
        },
      },
    })
  }

  const confirmDeleteAccount = async () => {
    setShowDeleteConfirmModal(false) // 모달 닫기
    try {
      const response = await API.delete(`/auth/account`, {
        withCredentials: true,
      })

      if (response.status === 200) {
        toast.success('계정이 성공적으로 삭제되었습니다. 로그인 페이지로 이동합니다.', {
          position: 'top-center',
        })
        localStorage.removeItem('accessToken')
        window.location.href = '/login' // 페이지 전체 새로고침 및 로그인 페이지로 이동
      }
    } catch (error) {
      console.error('계정 삭제 실패:', error)
      toast.error(
        `계정 삭제 중 오류가 발생했습니다: ${error.response?.data?.message || '서버 오류'}`,
        { position: 'top-center' },
      )
    }
  }

  const isStoreBookmarked = storeId => {
    const bookmarks = userBookmark || []
    return bookmarks.some(bookmark => bookmark.store?._id === storeId)
  }

  const handleBookmarkToggle = async (e, storeId, storeName, isCurrentlyBookmarked) => {
    e.stopPropagation()

    if (!user?.role) {
      toast.info('로그인이 필요한 기능입니다. 로그인 후 이용해 주세요.', { position: 'top-center' })
      navigate('/login')
      return
    }

    try {
      if (isCurrentlyBookmarked) {
        if (confirm('찜목록에서 삭제하시겠습니까?')) {
          await API.delete(`/bookmark/delete/${storeId}`, {
            headers: { user: userId },
          })
          setUserBookmark(prev => (prev || []).filter(bookmark => bookmark.store?._id !== storeId))
          toast.success(`'${storeName}' 찜 목록에서 삭제되었습니다.`, { position: 'top-center' })
        }
      } else {
        if (confirm('찜목록에 추가하시겠습니까?')) {
          const response = await API.post(`/bookmark/regist/${storeId}`, {
            headers: {
              user: userId,
            },
          })
          setUserBookmark(prev => {
            const currentBookmarks = prev || []
            if (!currentBookmarks.some(b => b.store?._id === response.data.store?._id)) {
              return [...currentBookmarks, response.data]
            }
            return currentBookmarks
          })
          toast.success(`'${storeName}' 찜 목록에 추가되었습니다!`, { position: 'top-center' })
        }
      }
    } catch (error) {
      console.error('북마크 토글 실패:', error.response?.data || error.message)
      toast.error(
        `북마크 처리 중 오류가 발생했습니다: ${error.response?.data?.message || '서버 오류'}`,
        { position: 'top-center' },
      )
    }
  }

  const renderContent = () => {
    // MyPageFormAI 컴포넌트에 aiRecommendationKeyword 상태를 그대로 전달합니다 (이제 배열입니다).
    switch (active) {
      case '최근기록':
        return (
          <MyPageFormRecent
            recentStores={recentStores}
            isStoreBookmarked={isStoreBookmarked}
            API={API}
            handleBookmarkToggle={handleBookmarkToggle}
            setPlaceDetail={setPlaceDetail}
          />
        )

      case '찜':
        return (
          <MyPageFormBookmark
            API={API}
            active={active}
            userId={userId}
            handleBookmarkToggle={handleBookmarkToggle}
            setPlaceDetail={setPlaceDetail}
            recentStores={recentStores} // recentStores prop은 MyPageFormBookmark에서 사용되지 않으므로 제거 가능
          />
        )

      case '리뷰':
        return (
          <div ref={wrapperRefs}>
            <MypageFormReview user={user} currentTab="리뷰" wrappers={wrapperRefs} />
          </div>
        )

      case '음식점 추천(AI)':
        return (
          <MyPageFormAI
            loading={loading}
            dalleImage={dalleImage}
            API={API}
            openai={openai}
            userNickname={userNickname}
            mostFrequentKeywords={aiRecommendationKeyword}
            userLocation={userLocation}
            locationError={locationError}
          />
        )

      case '계정 설정':
        if (!isAuthenticatedForSettings) {
          return (
            <MypagesAuthForm
              onAuthenticated={() => {
                setIsAuthenticatedForSettings(true)
                setActive('계정 설정')
              }}
              onCancel={() => {
                setActive('최근기록')
                setIsAuthenticatedForSettings(false)
              }}
            />
          )
        }
        return (
          <div className="flex justify-center">
            <div className="flex flex-col w-[700px] h-[700px] gap-5 py-5">
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className=" w-[100px] h-[100px] bg-cover mask-radial-fade"
                    onClick={() => setIsOpen(true)}
                    style={{ backgroundImage: `url('${userProfileImage}')` }}
                  />
                  <span
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow hover:bg-opacity-700 cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="py-5">
                <div>
                  <div className="py-3 flex justify-between">
                    <p>이메일</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={userEmail}
                        className="border border-gray-300 rounded px-2 py-1 w-1/2"
                      />
                    ) : (
                      <p>{userEmail}</p>
                    )}
                  </div>
                  <hr className="py-3" />
                  <div className="py-3 flex justify-between">
                    <p>비밀번호</p>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setShowPasswordChangeModal(true)}
                    >
                      비밀번호 변경
                    </button>
                  </div>
                  <hr className="py-3" />
                </div>
                <div className="py-3 flex justify-between">
                  <p>이름</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userName}
                      onChange={e => setUserName(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-1/2"
                    />
                  ) : (
                    <p>{userName}</p>
                  )}
                </div>
                <hr className="py-3" />
                <div className="py-3 flex justify-between">
                  <p>닉네임</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempNickname}
                      onChange={e => setTempNickname(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-1/2"
                    />
                  ) : (
                    <p>{userNickname}</p>
                  )}
                </div>
                <hr className="py-3" />
              </div>
              <div className="flex gap-5 justify-center">
                {!isEditing && ( // 수정 모드가 아닐 때만 회원 탈퇴 버튼 표시
                  <button
                    className="mt-4 px-4 py-2 text-white bg-red-600 rounded cursor-pointer"
                    onClick={handleDeleteAccountClick}
                  >
                    회원 탈퇴
                  </button>
                )}
                {isEditing ? (
                  <>
                    <button
                      className="mt-4 px-4 py-2 text-white bg-red-600 rounded cursor-pointer" // 취소 버튼 스타일
                      onClick={handleEditToggle} // handleEditToggle로 편집 모드 종료 및 초기화
                    >
                      취소
                    </button>

                    <button
                      className="mt-4 px-4 py-2 text-white bg-blue-600 rounded cursor-pointer"
                      onClick={handleSaveChanges}
                    >
                      저장
                    </button>
                  </>
                ) : (
                  // 편집 모드가 아닐 때 수정 버튼 표시
                  <button
                    className="mt-4 px-4 py-2 text-white bg-blue-600 rounded cursor-pointer"
                    onClick={handleEditToggle}
                  >
                    수정
                  </button>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pb-5">
      <div className="max-w-5xl mx-auto">
        <div className="pb-5 flex justify-between items-center ">
          <div className="flex gap-5 items-center ">
            <div
              className="w-[100px] h-[100px] bg-cover mask-radial-fade"
              style={{ backgroundImage: `url('${userProfileImage}')` }}
            />
            <div className="flex-col">
              <p className="text-2xl py-2"> "{userNickname}" 님</p>
              <span className="text-2xl">안녕하세요.</span>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isopen} onClose={() => setIsOpen(false)} />
      <div className="max-w-5xl mx-auto">
        <ul className="py-5 flex gap-5">
          {tabs.map(tab => (
            <li key={tab}>
              <button
                type="button"
                onClick={e => handleClick(e, tab)}
                className={`pb-2 text-gray-600 font-medium border-b-2 transition duration-200 ${
                  active === tab
                    ? 'border-cyan-500 text-blue-500'
                    : 'border-transparent hover:border-gray-300 hover:text-black'
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {showPasswordChangeModal && (
        <PwdChangeModal
          onClose={() => setShowPasswordChangeModal(false)}
          onPasswordChangeSuccess={handlePasswordChangeSuccess}
        />
      )}
      <div className="max-w-5xl mx-auto px-6">{renderContent()}</div>
      {showDeleteConfirmModal && (
        <ConfirmModal
          isOpen={showDeleteConfirmModal}
          onClose={() => setShowDeleteConfirmModal(false)}
          onConfirm={confirmDeleteAccount}
          title="계정 삭제 확인"
          message="정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        />
      )}
    </div>
  )
}

export default MyPageForm
