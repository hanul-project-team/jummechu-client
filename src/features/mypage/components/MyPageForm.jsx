// src/pages/mypage/MyPageForm.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react' // useCallback 추가
import { useNavigate, useLocation } from 'react-router-dom'
import { restoreLogin } from '../../auth/slice/authSlice.js'
import Modal from '../components/UserModal.jsx'
import PwdChangeModal from '../components/PwdChangeModal.jsx'
import MypagesAuthForm from '../components/MypagesAuthForm.jsx'
import MypageFormReview from './MyPageFormReviews.jsx'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import '../MyPage.css'
import MyPageFormBookmark from '../components/MyPageFormBookmark.jsx' // MyPageFormBookmark 경로 확인 (components 폴더에 있다고 가정)
import MyPageFormRecent from '../components/MyPageFormRecent.jsx'
import MyPageFormAI from '../components/MyPageFormAI.jsx'
import zustandUser from '../../../app/zustandUser.js'
import { toast } from 'react-toastify'
import defaultProfileImg from '../../../assets/images/defaultProfileImg.jpg'
import { shallow } from 'zustand/shallow' // shallow 임포트
import zustandStore from '../../../app/zustandStore.js'

const MyPageForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(state => state.auth.user)
  const userId = user?.id
  const wrapperRefs = useRef({})
  const backendBaseUrl = import.meta.env.VITE_API_BASE_URL
  const setPlaceDetail = zustandStore(state => state.setPlaceDetail)

  // zustandUser에서 userBookmark 상태와 setUserBookmark 액션 가져오기
  // shallow를 사용하여 userBookmark가 변경될 때만 리렌더링되도록 최적화
  const userBookmark = zustandUser(state => state.userBookmark, shallow)
  const setUserBookmark = zustandUser(state => state.setUserBookmark)

  // MyPageFormBookmark에서 로딩 상태를 받아서 zustandUser 스토어에 연결
  // const isBookmarksLoading = zustandUser(state => state.isLoading) // isLoading 상태가 찜 목록 로딩으로 사용된다고 가정
  const setIsLoading = zustandUser(state => state.setIsLoading) // setIsLoading 액션 가져오기

  // MyPageForm에서 찜 목록을 불러오는 로컬 함수
  const fetchUserBookmarks = useCallback(async () => {
    if (!userId) {
      console.log('MyPageForm: 사용자 ID가 없어 찜 목록을 불러올 수 없습니다. userBookmark 초기화.')
      setIsLoading(false) // 로딩 종료
      setUserBookmark([])
      return
    }

    setIsLoading(true) // 로딩 시작
    try {
      console.log(`MyPageForm: 찜 목록 불러오는 중... (userId: ${userId})`)
      const response = await axios.get(`http://localhost:3000/bookmark/read/${userId}`, {
        withCredentials: true,
      })

      if (Array.isArray(response.data)) {
        const newBookmarks = response.data
        // Zustand 스토어 업데이트
        setUserBookmark(newBookmarks)
        console.log('MyPageForm: 찜 목록 새로고침 성공:', newBookmarks)
      } else {
        console.warn('MyPageForm: 찜 목록 응답 형식이 배열이 아닙니다:', response.data)
        setUserBookmark([])
        toast.error('찜 목록 데이터를 처리할 수 없습니다.')
      }
    } catch (error) {
      console.error('MyPageForm: 찜 목록 불러오기 실패:', error.response?.data || error.message)
      setUserBookmark([])
      toast.error('찜 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false) // 로딩 종료
    }
  }, [userId, setUserBookmark, setIsLoading]) // userId, setUserBookmark, setIsLoading가 변경될 때만 재생성

  // 컴포넌트 마운트 시 (또는 userId 변경 시) 찜 목록 초기 로드
  useEffect(() => {
    fetchUserBookmarks()
  }, [fetchUserBookmarks]) // fetchUserBookmarks 함수가 변경될 때마다 실행 (useCallback으로 최적화됨)

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

  const [hasFetchedAIRecommendations, setHasFetchedAIRecommendations] = useState(false)
  const [aiRecommendationKeyword, setAiRecommendationKeyword] = useState('')
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
  // 사용자 위치 정보 상태
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState('')

  const handlePasswordChangeSuccess = () => {
    toast.success('비밀번호가 성공적으로 변경되었습니다! 다시 로그인 해주세요.', {
      position: 'top-center',
    })
    localStorage.removeItem('accessToken')
    navigate('/login')
  }

  // 사용자 위치 정보 가져오기 useEffect
  useEffect(() => {
    if (active === '음식점 추천(AI)' && !userLocation && !locationError) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
            setLocationError('')
            console.log('사용자 위치 획득:', position.coords.latitude, position.coords.longitude)
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
    }
  }, [active, userLocation, locationError])

  useEffect(() => {
    const fetchRecentStores = async () => {
      if (!userId) {
        setRecentStores([])
        return
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/auth/recent-history?userId=${userId}`,
          {
            withCredentials: true,
          },
        )
        // console.log(response.data.recentViewedStores)
        const fetchedRecentStores = response.data.recentViewedStores
        setRecentStores(fetchedRecentStores)
        if (fetchedRecentStores && fetchedRecentStores.length > 0) {
          fetchedRecentStores.forEach(item => {})
        }
      } catch (error) {
        console.error('MyPageForm: 최근 기록 불러오기 실패:', error)
        setRecentStores([])
      }
    }

    if (active === '최근기록') {
      fetchRecentStores()
    }
  }, [active, userId])

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
        const response = await axios.get('http://localhost:3000/auth/myprofile', {
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
        setUserProfileImage(callUserImage ? `${backendBaseUrl}${callUserImage}` : defaultProfileImg)
      } catch (error) {
        console.error('사용자 프로필 정보를 불러오는데 실패했습니다:', error)
        setUserProfileImage(defaultProfileImg)
      }
    }
    fetchUserProfile()
  }, [])

  // AI 추천 호출 함수 (위치 정보 인자 추가)
  const callOpenAi = async (promptContent, lat = null, lon = null) => {
    try {
      const payload = { prompt: promptContent }
      if (lat !== null && lon !== null) {
        payload.latitude = lat
        payload.longitude = lon
      }
      const response = await axios.post('http://localhost:3000/api/azure/openai', payload)
      return response
    } catch (error) {
      console.error('OpenAI 호출 실패:', error.response?.data || error.message)
      return { data: null }
    }
  }

  const extractMostFrequentKeywords = (data, defaultKeys) => {
    if (!data || !defaultKeys) return []

    // 1. 모든 키워드들을 flat하게 수집
    const rawStoreKeywords = data.flatMap(store => store.keyword || [])

    // 2. defaultKeys 중 하나라도 포함된 키워드만 필터링
    const filtered = rawStoreKeywords.filter(keyword =>
      defaultKeys.some(defaultKey => keyword.includes(defaultKey)),
    )

    // 3. 빈도수 계산
    const freqMap = {}
    for (const keyword of filtered) {
      freqMap[keyword] = (freqMap[keyword] || 0) + 1
    }

    // 4. 가장 많이 등장한 키워드만 반환 (예: 상위 1개만)
    const sorted = Object.entries(freqMap).sort((a, b) => b[1] - a[1])
    const mostFrequent = sorted.length > 0 ? sorted[0][0] : null

    return mostFrequent
  }

  useEffect(() => {
    if (active === '음식점 추천(AI)') {
      if (recentStores.length === 0) {
        console.log('AI 추천: 최근 본 가게 기록이 없어 추천을 시작할 수 없습니다.')
        setOpenAi(['최근 본 가게 기록에서 추천 키워드를 찾을 수 없습니다.'])
        setLoading(false)
        setHasFetchedAIRecommendations(false)
        return
      }
      // if (hasFetchedAIRecommendations || loading) {
      //   console.log("AI 추천: 이미 불러온 추천이 있거나 로딩 중이므로 다시 불러오지 않습니다.");
      //   return;
      // }

      // 위치 정보 로딩 대기 또는 오류 처리
      if (!userLocation && !locationError) {
        console.log('AI 추천: 사용자 위치 정보를 기다리는 중...')
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
      setHasFetchedAIRecommendations(true)
      setOpenAi([])
      setDalleImage(null)

      const keywordsForAI = extractMostFrequentKeywords(recentStores)

      if (keywordsForAI?.length === 0) {
        console.log('AI 추천: 최근 본 가게에서 유의미한 키워드를 추출할 수 없습니다.')
        setOpenAi(['최근 본 가게 기록에서 추천 키워드를 찾을 수 없습니다.'])
        setLoading(false)
        return
      }

      const restaurantRecommendationPrompt = `
        다음은 사용자가 최근 방문한 음식점들의 키워드 목록입니다:
        ${keywordsForAI?.join(', ')}
        
        이 키워드들과 **가장 많이** 겹치는 음식점 3곳을 추천해 주세요.
        
        결과는 다음 필드를 포함하는 JSON 형식의 배열로만 출력하세요. JSON 외에는 아무 것도 출력하지 마세요.
        각 추천 음식점은 다음 필드를 포함해야 합니다:
        - title: 음식점 이름
        - rating: 평점 (0.0 ~ 5.0)
        - description: 음식점 설명 (간단하고 매력적인 한 줄)
        - keyword: 이 음식점의 키워드 배열 (예: ["#떡볶이", "#분식", "#매운맛"])
        - overlap_count: 겹치는 키워드 수
      `

      // callOpenAi 호출 시 위치 정보 전달
      callOpenAi(restaurantRecommendationPrompt, userLocation.latitude, userLocation.longitude)
        .then(response => {
          if (response && response.data) {
            let parsedData = response.data
            if (typeof response.data === 'string') {
              try {
                parsedData = JSON.parse(response.data)
              } catch (e) {
                console.error('Client: AI 응답 JSON 파싱 오류 (문자열 -> JSON):', e)
                setOpenAi(['AI 응답 형식이 유효하지 않아 추천을 표시할 수 없습니다.'])
                setLoading(false)
                return
              }
            }

            if (Array.isArray(parsedData) && parsedData.length > 0) {
              setOpenAi(parsedData)
              console.log('AI 추천 음식점 목록 설정:', parsedData)

              const keywordSummary = Array.from(new Set(keywordsForAI)).slice(0, 10).join(',')
              return callDalleImage(keywordSummary)
            } else {
              console.error('AI 응답이 예상된 배열 형태가 아닙니다:', parsedData)
              setOpenAi(['AI 응답이 예상된 형식이 아니거나 비어있습니다.'])
              setLoading(false)
            }
          } else {
            console.error('AI 응답 데이터가 유효하지 않습니다.')
            setOpenAi(['AI 추천을 받을 수 없습니다.'])
            setLoading(false)
          }
        })
        .then(imageUrl => {
          if (imageUrl) {
            setDalleImage(imageUrl)
            console.log('DALL-E 이미지 URL 설정:', imageUrl)
          } else {
            setDalleImage(null)
            console.warn('DALL-E 이미지 생성 실패 또는 URL 없음.')
          }
        })
        .catch(apiError => {
          console.error('OpenAI/DALL-E API 호출 실패:', apiError)
          setOpenAi(['AI 추천을 불러오는 중 오류가 발생했습니다.'])
          setDalleImage(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setDalleImage(null)
      setLoading(false)
      setOpenAi([])
      setHasFetchedAIRecommendations(false)
    }
  }, [active, recentStores, hasFetchedAIRecommendations, userLocation, locationError])

  const callDalleImage = async keyword => {
    try {
      const res = await axios.post('http://localhost:3000/api/azure/dalle', {
        prompt: `${keyword}에 대한 실제 음식 사진처럼 보이고, 시선을 사로잡는 아름다운 구도와 부드러운 자연광이 돋보이는 초고화질 음식 사진을 생성해주세요. 식욕을 돋우는 선명한 색감과 생생한 질감을 가진, 배경은 단순하게 처리하고 음식에 집중해주세요.`,
      })
      console.log('DALL-E 응답:', res)
      return res?.data?.imageUrl || null
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
      const response = await axios.put(
        'http://localhost:3000/auth/profile',
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
      console.error('프로필 정보 업데이트 실패:', error)
      toast.error(
        `프로필 정보 업데이트 중 오류가 발생했습니다: ${error.response?.data?.message || '서버 오류'}`,
        { position: 'top-center' },
      )
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        const response = await axios.delete('http://localhost:3000/auth/account', {
          withCredentials: true,
        })

        if (response.status === 200) {
          toast.success('계정이 성공적으로 삭제되었습니다. 로그인 페이지로 이동합니다.', {
            position: 'top-center',
          })
          localStorage.removeItem('accessToken')
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('계정 삭제 실패:', error)
        toast.error(
          `계정 삭제 중 오류가 발생했습니다: ${error.response?.data?.message || '서버 오류'}`,
          { position: 'top-center' },
        )
      }
    }
  }

  // 가게가 찜 목록에 있는지 확인하는 헬퍼 함수
  const isStoreBookmarked = storeId => {
    // userBookmark가 null일 경우 빈 배열로 처리하여 에러 방지
    const bookmarks = userBookmark || []
    return bookmarks.some(bookmark => bookmark.store?._id === storeId)
  }

  // 북마크 토글 핸들러 (MyPageForm 내부에서 처리)
  const handleBookmarkToggle = async (e, storeId, storeName, isCurrentlyBookmarked) => {
    e.stopPropagation()

    if (!user?.role) {
      toast.info('로그인이 필요한 기능입니다. 로그인 후 이용해 주세요.', { position: 'top-center' })
      navigate('/login')
      return
    }

    try {
      if (isCurrentlyBookmarked) {
        // 북마크 삭제
        await axios.delete(`http://localhost:3000/bookmark/delete/${storeId}`, {
          withCredentials: true,
          data: { headers: { user: userId } },
        })
        // Zustand 스토어 업데이트
        setUserBookmark(prev => (prev || []).filter(bookmark => bookmark.store?._id !== storeId))
        toast.success(`'${storeName}' 찜 목록에서 삭제되었습니다.`, { position: 'top-center' })
      } else {
        // 북마크 추가
        const response = await axios.post(
          `http://localhost:3000/bookmark/regist/${storeId}`,
          { headers: { user: userId } },
          {
            withCredentials: true,
          },
        )
        // Zustand 스토어 업데이트 (새로 추가된 북마크 객체 포함)
        setUserBookmark(prev => {
          const currentBookmarks = prev || []
          // 중복 추가 방지 로직 (혹시 모를 경우를 대비)
          if (!currentBookmarks.some(b => b.store?._id === response.data.store?._id)) {
            return [...currentBookmarks, response.data]
          }
          return currentBookmarks
        })
        toast.success(`'${storeName}' 찜 목록에 추가되었습니다!`, { position: 'top-center' })
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
    const mostFrequentKeywords = extractMostFrequentKeywords(recentStores, defaultTags)

    // recentStores, isStoreBookmarked, backendBaseUrl, handleBookmarkToggle, setPlaceDetail
    switch (active) {
      case '최근기록':
        return (
          <MyPageFormRecent
            recentStores={recentStores}
            isStoreBookmarked={isStoreBookmarked}
            backendBaseUrl={backendBaseUrl}
            handleBookmarkToggle={handleBookmarkToggle}
            setPlaceDetail={setPlaceDetail}
          />
        )

      case '찜':
        return (
          <MyPageFormBookmark
            recentStores={recentStores}
            active={active} // MyPageFormBookmark에 active prop 전달
            userId={userId} // MyPageFormBookmark에 userId prop 전달
            handleBookmarkToggle={handleBookmarkToggle} // 찜 토글 함수 전달
            backendBaseUrl={backendBaseUrl}
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
            backendBaseUrl={backendBaseUrl}
            openai={openai}
            userNickname={userNickname}
            mostFrequentKeywords={mostFrequentKeywords}
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
                    <p>이메일 관리</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={userEmail}
                        onChange={e => setUserEmail(e.target.value)}
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
                <div className="py-3 flex justify-between">
                  <p>연락처</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={e => setUserPhone(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-1/2"
                    />
                  ) : (
                    <p>{userPhone}</p>
                  )}
                </div>
                <hr className="py-3" />
              </div>
              <div className="flex gap-5 justify-center">
                <button
                  className="mt-4 px-4 py-2 text-white bg-red-600 rounded cursor-pointer"
                  onClick={handleDeleteAccount}
                >
                  계정 삭제
                </button>
                {isEditing ? (
                  <button
                    className="mt-4 px-4 py-2 text-white bg-blue-600 rounded cursor-pointer"
                    onClick={handleSaveChanges}
                  >
                    저장
                  </button>
                ) : (
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
    </div>
  )
}

export default MyPageForm
