import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Modal from '../components/UserModal.jsx'
import PwdChangeModal from '../components/PwdChangeModal.jsx'
import MypagesAuthForm from '../components/MypagesAuthForm.jsx'
import MyPageFormReviews from './MyPageFormReviews.jsx'
import axios from 'axios'
import { useSelector } from 'react-redux'
import '../MyPage.css'

const MyPageForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(state => state.auth.user)
  const userId = user?.id
  const wrapperRefs = useRef({})
  // console.log('Redux에서 가져온 전체 user 객체:', user);
  // console.log('추출된 userId:', userId);

  const [active, setActive] = useState(() => {
    if (location.state?.fromVerification && location.state?.activeTab) {
      return location.state.activeTab
    }
    return '최근기록'
  })

  const [isAuthenticatedForSettings, setIsAuthenticatedForSettings] = useState(() => {
    return location.state?.fromVerification && location.state?.activeTab === '계정 설정'
  })

  const [bookmarkedStoreIds, setBookmarkedStoreIds] = useState(new Set())
  const [bookmarkedStoresForDisplay, setBookmarkedStoresForDisplay] = useState([])

  const tabs = ['최근기록', '찜', '리뷰', '음식점 추천(AI)', '계정 설정']
  const [isopen, setIsOpen] = useState(false)
  const [openai, setOpenAi] = useState([]) // AI 추천 음식점 목록
  const [dalleImage, setDalleImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [userNickname, setUserNickname] = useState('로딩중')
  const [userEmail, setUserEmail] = useState('')
  const [userPhone, setUserPhone] = useState('') // ★★★ 수정: useState('')으로 초기화 ★★★
  const [userName, setUserName] = useState('')
  const [userProfileImage, setUserProfileImage] = useState(
    'http://localhost:3000/static/images/defaultProfileImg.jpg',
  )

  // AI에 의해 변경된 키워드를 저장
  // ★★★ aiModifiedKeywords를 이제 단일 키워드 (문자열)로 관리합니다. ★★★
  const [aiModifiedKeywords, setAiModifiedKeywords] = useState('')

  const [tempNickname, setTempNickname] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [recentStores, setRecentStores] = useState([])
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false)

  const handlePasswordChangeSuccess = () => {
    alert('비밀번호가 성공적으로 변경되었습니다! 다시 로그인 해주세요.') // 사용자에게 알림

    // ★★★ 가장 중요한 부분: 기존 토큰 및 인증 상태 제거 ★★★
    // 1. 로컬 스토리지에서 JWT 토큰 삭제 (혹은 쿠키)
    localStorage.removeItem('accessToken') // 'accessToken'은 예시. 실제 토큰 저장 키에 맞게 수정
    // localStorage.removeItem('refreshToken'); // Refresh Token도 있다면 함께 삭제

    // 2. Redux (또는 다른 전역 상태 관리)에서 사용자 인증 정보 초기화
    //    이 부분은 프로젝트의 Redux 설정에 따라 달라집니다.
    //    예: dispatch(logoutUser()); // 인증 상태를 '로그아웃'으로 변경하는 Redux 액션 디스패치

    // 3. 로그인 페이지로 리다이렉트 (강제 이동)
    navigate('/login')
  }

  useEffect(() => {
    const fetchRecentStores = async () => {
      if (!userId) {
        // console.log('사용자 ID가 없어 최근 기록을 불러올 수 없습니다.')
        setRecentStores([])
        return
      }

      try {
        // const response = await axios.get(`http://localhost:3000/auth/recent-history?userId=${userId}`, {
        //   withCredentials: true, // 세션 쿠키 등을 함께 전송해야 할 경우
        // })
        // setRecentStores(response.data.recentViewedStores)
        // console.log('최근 본 가게 데이터:', response.data.recentViewedStores)
      } catch (error) {
        // console.error('최근 기록 불러오기 실패:', error)
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
        // ...
      }
    }
  }, [location.state, navigate, location.pathname])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/myprofile', {
          withCredentials: true,
        })
        const backendBaseUrl = 'http://localhost:3000'

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
        setUserProfileImage(
          callUserImage
            ? `${backendBaseUrl}${callUserImage}`
            : 'http://localhost:3000/static/images/defaultProfileImg.jpg',
        )
      } catch (error) {
        console.error('사용자 프로필 정보를 불러오는데 실패했습니다:', error)
        setUserProfileImage('http://localhost:3000/static/images/defaultProfileImg.jpg')
      }
    }
    fetchUserProfile()
  }, [])

  const callOpenAi = async prompt => {
    try {
      const response = await axios.post('http://localhost:3000/api/azure/openai', {
        headers: {
          prompt: prompt, // 받은 prompt를 그대로 전달
        },
      })
      return response
    } catch (error) {
      console.error('OpenAI 호출 실패:', error)
      return { data: null } // 오류 발생 시 빈 데이터 반환
    }
  }

  const extractMostFrequentKeywords = data => {
    const allKeywords = {}
    data.forEach(item => {
      const keywordsArray = Array.isArray(item.keyword)
        ? item.keyword
        : item.keyword
          ? item.keyword.split(',').map(k => k.trim())
          : []

      keywordsArray.forEach(keyword => {
        if (keyword) {
          allKeywords[keyword] = (allKeywords[keyword] || 0) + 1
        }
      })
    })

    let maxCount = 0
    for (const keyword in allKeywords) {
      if (allKeywords[keyword] > maxCount) {
        maxCount = allKeywords[keyword]
      }
    }

    if (maxCount === 0) return '' // ★★★ 키워드가 없으면 빈 문자열 반환 ★★★

    // ★★★ 가장 빈번한 키워드 중 하나만 반환하도록 수정 ★★★
    const mostFrequent = Object.keys(allKeywords).filter(
      keyword => allKeywords[keyword] === maxCount,
    )
    return mostFrequent.length > 0 ? mostFrequent[0] : '' // 첫 번째 가장 빈번한 키워드 반환
  }

  // '음식점 추천(AI)' 탭 로직 수정
  useEffect(() => {
    const fetchAIRecommendations = async () => {
      if (active === '음식점 추천(AI)') {
        if (recentStores.length === 0) {
          console.log('AI 추천: 최근 본 가게 기록이 없어 추천을 시작할 수 없습니다.')
          setOpenAi(['최근 본 가게 기록에서 추천 키워드를 찾을 수 없습니다.'])
          setLoading(false)
          setAiModifiedKeywords('') // 상태 초기화
          return
        }

        setLoading(true)
        setOpenAi([])
        setAiModifiedKeywords('') // 상태 초기화

        try {
          // ★★★ 가장 빈번한 키워드 (단일 문자열)를 가져옵니다. ★★★
          const singleMostFrequentKeyword = extractMostFrequentKeywords(recentStores)

          if (!singleMostFrequentKeyword) {
            // 키워드가 없으면
            console.log('AI 추천: 최근 본 가게에서 유의미한 키워드를 추출할 수 없습니다.')
            setOpenAi(['최근 본 가게 기록에서 추천 키워드를 찾을 수 없습니다.'])
            setLoading(false)
            return
          }

          // ★★★ 2단계: 추출된 단일 키워드를 기반으로 OpenAI에게 음식 유형 카테고리화를 요청합니다. ★★★
          const keywordRefinementPrompt = `
            다음은 사용자가 최근 방문한 음식점의 가장 대표적인 키워드입니다: "${singleMostFrequentKeyword}"
            이 키워드를 분석하여 다음 음식 유형 카테고리 중 사용자의 선호도를 가장 잘 나타내는 하나의 키워드를 JSON 형식의 문자열로 추출해주세요: "한식", "일식", "양식", "중식", "야식", "간식", "카페/디저트".
            만약 주어진 키워드가 위의 카테고리 중 어떤 것에도 명확하게 속하지 않는다고 판단되면, 원래 키워드 "${singleMostFrequentKeyword}"를 JSON 형식의 문자열로 그대로 반환하세요.
            결과는 반드시 JSON 형식의 문자열로만 출력해야 합니다. JSON 외에는 아무 것도 출력하지 마세요.
            예시 1 (카테고리 분류 가능): "한식"
            예시 2 (카테고리 분류 불가능, 원본 키워드 사용): "곱창"
          `
          console.log('OpenAI 키워드 정제 요청 프롬프트:', keywordRefinementPrompt)
          const keywordResponse = await callOpenAi(keywordRefinementPrompt)

          let refinedKeyword = '' // 단일 키워드이므로 문자열로 선언
          if (keywordResponse.data && typeof keywordResponse.data === 'string') {
            try {
              const parsedResult = JSON.parse(keywordResponse.data) // 일단 파싱

              // 파싱 결과가 문자열이라면 그대로 사용
              if (typeof parsedResult === 'string') {
                refinedKeyword = parsedResult
              }
              // 파싱 결과가 배열이라면 첫 번째 요소를 사용
              else if (Array.isArray(parsedResult) && parsedResult.length > 0) {
                refinedKeyword = parsedResult[0]
              }
              // 파싱 결과가 객체이고 'category' 또는 'keyword' 키를 가지고 있다면 그 값을 사용
              // OpenAI가 `{ "category": "한식" }` 또는 `{ "keyword": "한식" }` 등으로 응답할 수 있으므로
              else if (typeof parsedResult === 'object' && parsedResult !== null) {
                if ('category' in parsedResult && typeof parsedResult.category === 'string') {
                  refinedKeyword = parsedResult.category
                } else if ('keyword' in parsedResult && typeof parsedResult.keyword === 'string') {
                  refinedKeyword = parsedResult.keyword
                } else {
                  refinedKeyword = singleMostFrequentKeyword // 예상치 못한 객체 형태면 원본 사용
                }
              }
              // 위의 모든 경우가 아니라면 원래 키워드 사용
              else {
                refinedKeyword = singleMostFrequentKeyword
              }

              console.log('OpenAI로부터 정제된 키워드:', refinedKeyword)
              setAiModifiedKeywords(refinedKeyword) // 상태에 저장
            } catch (parseErr) {
              console.error('키워드 정제 OpenAI 응답 JSON 파싱 오류:', parseErr)
              refinedKeyword = singleMostFrequentKeyword // 파싱 실패 시 원본 키워드 사용
              setAiModifiedKeywords(singleMostFrequentKeyword)
            }
          } else {
            console.warn(
              '키워드 정제 OpenAI 응답이 유효하지 않거나 문자열이 아닙니다. 원본 키워드 사용.',
            )
            refinedKeyword = singleMostFrequentKeyword // 응답 실패 시 원본 키워드 사용
            setAiModifiedKeywords(singleMostFrequentKeyword)
          }

          // ★★★ 3단계: 정제된 단일 키워드를 기반으로 OpenAI에게 음식점 추천을 요청합니다. ★★★
          const restaurantRecommendationPrompt = `
            다음은 사용자가 선호하는 음식점의 대표 키워드입니다: "${refinedKeyword}"
            이 키워드와 **가장 관련이 깊은** 음식점 3곳을 추천해 주세요.
            각 추천 음식점은 다음 필드를 포함하는 JSON 형식의 배열로만 출력하세요:
            - title: 음식점 이름 (예: "행복한 분식집")
            - rating: 평점 (0.0 ~ 5.0, 예: 4.5)
            - description: 음식점 설명 (간단하고 매력적인 한 줄, 예: "매콤한 떡볶이가 일품인 곳")
            - keyword: 이 음식점의 키워드 배열 (예: ["#떡볶이", "#분식", "#매운맛"])
            JSON 외에는 아무 것도 출력하지 마세요.
          `
          console.log('OpenAI 음식점 추천 요청 프롬프트:', restaurantRecommendationPrompt)
          const restaurantResponse = await callOpenAi(restaurantRecommendationPrompt)

          if (restaurantResponse.data && typeof restaurantResponse.data === 'string') {
            try {
              const parsedRecommendations = JSON.parse(restaurantResponse.data)
              setOpenAi(parsedRecommendations)
            } catch (parseErr) {
              console.error('음식점 추천 OpenAI 응답 JSON 파싱 오류:', parseErr)
              setOpenAi(['추천을 처리하는 중 오류가 발생했습니다.'])
            }
          } else {
            console.error('음식점 추천 OpenAI 응답 데이터가 유효하지 않습니다.')
            setOpenAi(['AI 추천을 받을 수 없습니다.'])
          }

          // DALL-E 이미지 생성 (대표 키워드를 사용하여)
          if (refinedKeyword) {
            // refinedKeyword가 비어있지 않을 때만 이미지 생성
            const imageUrl = await callDalleImage(refinedKeyword)
            setDalleImage(imageUrl)
          } else {
            setDalleImage(null)
          }
        } catch (apiError) {
          console.error('AI 추천 전체 프로세스 실패:', apiError)
          setOpenAi(['AI 추천을 불러오는 중 오류가 발생했습니다.'])
        } finally {
          setLoading(false)
        }
      } else {
        setDalleImage(null)
        setLoading(false)
        setOpenAi([]) // 탭 변경 시 추천 목록 초기화
        setAiModifiedKeywords('') // 탭 변경 시 AI 변경 키워드 초기화
      }
    }
    fetchAIRecommendations()
  }, [active, recentStores, userId]) // ★★★ 의존성 배열에서 openai?.length, aiModifiedKeywords 제거 ★★★

  const callDalleImage = async keyword => {
    try {
      const res = await axios
        .post('http://localhost:3000/api/azure/dalle', {
          prompt: `한종류의 완성된 음식을 해당 키워드 집중하여 관련된 식욕을 돋우는 선명한 색감과 생생한 질감 많은 채소나 재료보다는 **완성된 음식을 표현해주세요**, 그리고 따뜻하고 편안한 분위기가 느껴지도록 다음 키워드를 가지고 이미지를 생성해주세요. 키워드:${keyword}.`,
        })
        .catch(err => {
          console.error(`DALL·E 호출 실패 (${keyword}):`, err)
          return null
        })
      console.log(res)
      return res?.data?.imageUrl || null
    } catch (err) {
      console.error(`DALL·E 호출 실패 (${keyword}):`, err)
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
        { nickname: tempNickname, email: userEmail, phone: userPhone },
        { withCredentials: true },
      )
      if (response.status === 200) {
        alert('프로필 정보가 성공적으로 업데이트되었습니다.')
        setUserNickname(tempNickname)
        setIsEditing(false)
      } else {
        alert(`프로필 정보 업데이트 실패: ${response.data.message || '알 수 없는 오류'}`)
      }
    } catch (error) {
      console.error('프로필 정보 업데이트 실패:', error)
      alert(
        `프로필 정보 업데이트 중 오류가 발생했습니다: ${error.response?.data?.message || '서버 오류'}`,
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
          alert('계정이 성공적으로 삭제되었습니다. 로그인 페이지로 이동합니다.')
          localStorage.removeItem('accessToken')
          window.location.href = '/login'
        }
      } catch (error) {
        console.error('계정 삭제 실패:', error)
      }
    }
  }

  const renderContent = () => {
    switch (active) {
      case '최근기록':
        return (
          <div className="flex justify-center ">
            {recentStores.length === 0 ? (
              <p className="py-5 text-gray-600">최근 본 가게 기록이 없습니다.</p>
            ) : (
              <ul className="flex flex-col gap-9 py-5">
                {recentStores.map(item => (
                  <li key={item._id} className="flex gap-4">
                    <div
                      className="relative w-[250px] h-[250px] cursor-pointer"
                      onClick={() => navigate(`/place/${item._id}`)}
                    >
                      <img
                        src={`https://picsum.photos/250/250?random=${item._id}`}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation()
                          toggleBookmark(item)
                        }}
                        className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100"
                      >
                        {isBookmarked(item) ? (
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
                      <h2 className="text-lg py-1 font-SinchonRhapsody flex">{item.name}</h2>
                      {item.rating && <p className="py-1">⭐{item.rating} </p>}
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
                        {item.address}
                      </p>
                      {item.keyword && (
                        <p className="py-1 text-sm text-gray-700">
                          #{Array.isArray(item.keyword) ? item.keyword.join(', #') : item.keyword}
                        </p>
                      )}
                      <p className="py-5 text-sm text-black">
                        본 시간: {new Date(item.viewedAt).toLocaleString()}
                      </p>
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          navigate(`/place/${item._id}`)
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
        )

      case '찜':
        return (
          <div className="flex justify-center">
            {bookmarkedStoresForDisplay.length === 0 ? (
              <p className="py-5 text-gray-600">찜한 목록이 없습니다.</p>
            ) : (
              <ul className="flex flex-col gap-9 py-5">
                {bookmarkedStoresForDisplay.map(shop => (
                  <li key={shop._id} className="flex gap-4">
                    <div
                      className="relative w-[250px] h-[250px] cursor-pointer"
                      onClick={() => navigate(`/place/${shop._id}`)}
                    >
                      <img
                        src={shop.thumbnail || `https://picsum.photos/250/250?random=${shop._id}`}
                        alt={shop.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation()
                          toggleBookmark(shop)
                        }}
                        className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100"
                      >
                        {isBookmarked(shop) ? (
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
                      <h4 className="text-lg font-semibold">{shop.name}</h4>
                      {shop.rating && <p>{shop.rating} ⭐</p>}
                      <p className="text-sm text-gray-500">{shop.address}</p>
                      {shop.keywords && (
                        <p className="text-sm text-gray-700">
                          #
                          {Array.isArray(shop.keywords) ? shop.keywords.join(', #') : shop.keywords}
                        </p>
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation()
                          navigate(`/place/${shop._id}`)
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
        )
      case '리뷰':
        return (
          <div ref={wrapperRefs}>
            <MyPageFormReviews user={user} currentTab="리뷰" wrappers={wrapperRefs} />
          </div>
        )

      case '음식점 추천(AI)':
        return (
          <div className="flex flex-col gap-5 items-center">
            {loading ? (
              <p className="py-5 text-gray-600">AI 추천을 준비 중입니다...</p>
            ) : (
              <>
                {dalleImage && (
                  <img
                    src={dalleImage}
                    alt="AI 음식점 이미지"
                    className="w-[300px] h-[300px] rounded shadow-md py-5"
                  />
                )}
                {openai?.length > 0 ? (
                  <ul className="flex flex-col gap-9 py-5">
                    {/* ★★★ 변경된 키워드 표시: 이제 단일 키워드를 직접 표시 ★★★ */}
                    {aiModifiedKeywords && (
                      <p className="py-2 text-center text-lg font-semibold">
                        {userNickname} 님의 취향은 "{aiModifiedKeywords}" 입니다!
                      </p>
                    )}
                    <h2 className="text-center text-xl font-bold py-3">이 음식점들을 추천해요!</h2>
                    {openai.map((item, index) => (
                      <li
                        key={index}
                        className="flex gap-4 p-4 border rounded-lg shadow-sm w-full max-w-md"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={`https://placehold.co/100x100/F0F0F0/6C757D?text=${encodeURIComponent(item.title.substring(0, 5))}`}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                          <p className="text-yellow-500 text-sm">⭐ {item.rating}</p>
                          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                          {item.keyword &&
                            Array.isArray(item.keyword) &&
                            item.keyword.length > 0 && (
                              <p className="text-blue-500 text-xs mt-2">
                                {item.keyword.map(k => `#${k}`).join(' ')}
                              </p>
                            )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="py-5 text-gray-600">AI 추천을 받을 수 없습니다.</p>
                )}
              </>
            )}
          </div>
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
                    className="absolute bottom-0 right-0 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100 cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  >
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
      {/* <hr className="border-gray-500 hr-line !important" /> */}

      {showPasswordChangeModal && ( // 이 조건이 핵심입니다!
        <PwdChangeModal
          onClose={() => setShowPasswordChangeModal(false)}
          onPasswordChangeSuccess={handlePasswordChangeSuccess}
        />
      )}

      <div className="max-w-5xl mx-auto px-6">
        {renderContent()} {/* 이제 active 탭에 따라 renderContent가 내부적으로 인증을 확인 */}
      </div>
    </div>
  )
}

export default MyPageForm
