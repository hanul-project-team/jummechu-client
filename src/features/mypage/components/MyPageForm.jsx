import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Modal from '../components/UserModal.jsx'
import PwdChangeModal from '../components/PwdChangeModal.jsx'
import MypagesAuthForm from '../components/MypagesAuthForm.jsx'
import axios from 'axios'
import { useSelector } from 'react-redux'
import '../MyPage.css' // 경로 기준: 현재 컴포넌트 파일 위치 기준

// 와이드 1024 py 6 //
const MyPageForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(state => state.auth.user)
  const userId = user?.id

  console.log('Redux에서 가져온 전체 user 객체:', user);
  console.log('추출된 userId:', userId);

  const [active, setActive] = useState(() => {
    if (location.state?.fromVerification && location.state?.activeTab) {
      return location.state.activeTab
    }
    return '최근기록'
  })

  const [isAuthenticatedForSettings, setIsAuthenticatedForSettings] = useState(() => {
    // fromVerification이 true이고, activeTab이 '계정 설정'이라면 인증된 것으로 간주
    return location.state?.fromVerification && location.state?.activeTab === '계정 설정'
  })

  const [bookmarked, setBookmarked] = useState(() => {
    const savedBookmarks = localStorage.getItem('bookmarkedItems')
    return savedBookmarks ? JSON.parse(savedBookmarks) : []
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
  const [userProfileImage, setUserProfileImage] = useState(
    'http://localhost:3000/static/images/defaultProfileImg.jpg',
  )
  // const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const [tempNickname, setTempNickname] = useState('')

  const [isEditing, setIsEditing] = useState(false)

  const [recentStores, setRecentStores] = useState([])
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);


  const handlePasswordChangeSuccess = () => {
    alert('비밀번호가 성공적으로 변경되었습니다! 다시 로그인 해주세요.'); // 사용자에게 알림

    // ★★★ 가장 중요한 부분: 기존 토큰 및 인증 상태 제거 ★★★
    // 1. 로컬 스토리지에서 JWT 토큰 삭제 (혹은 쿠키)
    localStorage.removeItem('accessToken'); // 'accessToken'은 예시. 실제 토큰 저장 키에 맞게 수정
    // localStorage.removeItem('refreshToken'); // Refresh Token도 있다면 함께 삭제

    // 2. Redux (또는 다른 전역 상태 관리)에서 사용자 인증 정보 초기화
    //    이 부분은 프로젝트의 Redux 설정에 따라 달라집니다.
    //    예: dispatch(logoutUser()); // 인증 상태를 '로그아웃'으로 변경하는 Redux 액션 디스패치

    // 3. 로그인 페이지로 리다이렉트 (강제 이동)
    navigate('/login');
  };



  useEffect(() => {
    const fetchRecentStores = async () => {
      // 로그인된 사용자 ID가 없으면 API 호출하지 않음
      if (!userId) {
        console.log('사용자 ID가 없어 최근 기록을 불러올 수 없습니다.')
        setRecentStores([]) // 사용자 ID 없으면 빈 배열로 설정
        return
      }

      try {
        // 백엔드 API 엔드포인트에 userId를 쿼리 파라미터로 전송
        const response = await axios.get(`http://localhost:3000/auth/recent-history?userId=${userId}`, {
          withCredentials: true, // 세션 쿠키 등을 함께 전송해야 할 경우
        })
        setRecentStores(response.data.recentViewedStores)
        console.log('최근 본 가게 데이터:', response.data.recentViewedStores)
      } catch (error) {
        console.error('최근 기록 불러오기 실패:', error)
        setRecentStores([]) // 오류 발생 시 빈 배열로 설정
      }
    }

    // '최근기록' 탭이 활성화되었을 때만 데이터를 불러옵니다.
    // 또한, userId가 변경될 때도 다시 불러오도록 의존성 배열에 userId를 추가합니다.
    if (active === '최근기록') {
      fetchRecentStores()
    }
  }, [active, userId]) // active 탭과 userId가 변경될 때마다 실행

  useEffect(() => {
    if (location.state) {
      if (location.state.fromVerification && location.state.activeTab === '계정 설정') {
        setActive('계정 설정') // '계정 설정' 탭 활성화
        setIsAuthenticatedForSettings(true) // 인증 상태를 true로 설정
        // 한 번 사용한 state는 지워주는 것이 좋습니다.
        navigate(location.pathname, { replace: true, state: {} })
      } else if (location.state.fromMyPage) {
        // MyPageForm에서 인증 페이지로 이동했을 때의 처리 (이 경우, isAuthenticatedForSettings는 false 유지)
        // 여기서는 특별히 할 일이 없습니다.
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
  const example = [
    {
      id: 1,
      title: '맛있다 백반',
      image: 'https://picsum.photos/250/250?random=1',
      rating: '4.0',
      description: '맛있다. 이 집 괜찮다.',
      keyword: '백반, 한식',
    },
    {
      id: 2,
      title: '감성 카페',
      image: 'https://picsum.photos/250/250?random=3',
      rating: '4.2',
      description: '좋은 커피와 달달한 디저트 이 집 감성있다. 이 집 괜찮다',
      keyword: '카페, 디저트, 분위기',
    },
    {
      id: 3,
      title: '전통 한식당',
      image: 'https://picsum.photos/250/250?random=4',
      rating: '4.8',
      description: '엄마 손맛이 나는 집밥 느낌 그야말로 맘스터치 이 집 괜찮다.',
      keyword: '한식, 전통, 백반',
    },
    {
      id: 4,
      title: '이것은 덮밥',
      image: 'https://picsum.photos/250/250?random=6',
      rating: '5',
      description: '존맛',
      keyword: '일식, 덮밥, 가츠동',
    },
    {
      id: 5,
      title: '왕뼈사랑',
      image: 'https://picsum.photos/250/250?random=8',
      rating: '4.3',
      description: '맛 굿',
      keyword: '한식, 뼈해장국,',
    },
  ]

  const callOpenAi = async keywordsWithThreshold => {
    try {
      const response = await axios.post('http://localhost:3000/api/azure/openai', {
        headers: {
          prompt: `
      다음은 사용자가 최근 본 음식점의 키워드 목록입니다:
      ${keywordsWithThreshold.join(', ')}
  
      다음은 사용자가 최근에 방문한 음식점들의 키워드 목록입니다.
  이 키워드들과 **가장 많이** 겹치는 음식점만 골라 추천해 주세요.
  
  결과는 아래 JSON 형식의 배열로만 출력하세요.
  각 추천 음식점은 다음 필드를 포함해야 합니다:
  - title: 음식점 이름
  - rating: 평점 (0.0 ~ 5.0)
  - description: 음식점 설명 (간단하고 매력적인 한 줄)
  - keyword: 이 음식점의 키워드 배열
  - overlap_count: 겹치는 키워드 수
  
  JSON 외에는 아무 것도 출력하지 마세요.
  
  [예시 키워드 목록]: #한식, #떡볶이, #매운맛, #분식, #치즈, #일식
    `,
        },
      })

      return response
    } catch (error) {
      console.error('JSON 파싱 오류 또는 OpenAI 호출 실패:', error)
      return []
    }
  }

  // ====키워드 2개 이상===
  // const extractKeywordsWithThreshold = (data, threshold = 2) => {
  //   const allKeywords = {}
  //   data.forEach(item => {
  //     item.keyword
  //       .split(',')
  //       .map(k => k.trim())
  //       .forEach(keyword => {
  //         allKeywords[keyword] = (allKeywords[keyword] || 0) + 1
  //       })
  //   })

  //   return Object.keys(allKeywords).filter(keyword => allKeywords[keyword] >= threshold)
  // }
  // =========

  const extractMostFrequentKeywords = data => {
    const allKeywords = {}
    data.forEach(item => {
      item.keyword
        .split(',')
        .map(k => k.trim())
        .forEach(keyword => {
          allKeywords[keyword] = (allKeywords[keyword] || 0) + 1
        })
    })

    let maxCount = 0
    for (const keyword in allKeywords) {
      if (allKeywords[keyword] > maxCount) {
        maxCount = allKeywords[keyword]
      }
    }

    // maxCount가 0일 경우 빈 배열 반환하여 오류 방지
    if (maxCount === 0) return []

    return Object.keys(allKeywords).filter(keyword => allKeywords[keyword] === maxCount)
  }

  // // 2개 이상 등장하는 키워드 추출
  // const keywordsWithThreshold = extractKeywordsWithThreshold(example)

  // 가장 많이 등장하는 키워드 추출
  const mostFrequentKeywords = extractMostFrequentKeywords(example)

  useEffect(() => {
    if (active === '음식점 추천(AI)') {
      if (openai?.length > 0 || loading) {
        return
      }

      const keywordsForAI = extractMostFrequentKeywords(example)
      setLoading(true)
      callOpenAi(keywordsForAI).then(data => {
        const parsedData = JSON.parse(data.data)
        setOpenAi(parsedData)
        // 대표 키워드를 추출하여 DALL-E 이미지 생성 (음식점 추천 탭 대표 이미지)
        const keywordSummary = Array.from(new Set(keywordsForAI)).slice(0, 10).join(',')
        callDalleImage(keywordSummary).then(imageUrl => {
          setDalleImage(imageUrl)
          setLoading(false)
        })
      })
    } else {
      setDalleImage(null) // 다른 탭에서는 DALL-E 이미지 초기화
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  useEffect(() => {
    localStorage.setItem('bookmarkedItems', JSON.stringify(bookmarked))
  }, [bookmarked]) // bookmarked 배열이 변경될 때마다 이 훅이 실행됩니다.

  const callDalleImage = async keyword => {
    try {
      const res = await axios
        .post('http://localhost:3000/api/azure/dalle', {
          prompt: `실제 사진처럼 다음 키워드를 가지고 이미지를 그려주세요: ${mostFrequentKeywords}.`,
        })
        .catch(err => {
          console.error(`DALL·E 호출 실패 (${keyword}):`, err)
        })
      console.log(res)
      // const result = await res.json()
      return res
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

  const isBookmarked = item => bookmarked.some(b => b.id === item.id)

  const toggleBookmark = item => {
    if (isBookmarked(item)) {
      setBookmarked(prev => prev.filter(b => b.id !== item.id))
    } else {
      setBookmarked(prev => [...prev, item])
    }
  }

  // ★★★ 편집 모드 토글 함수
  const handleEditToggle = () => {
    if (!isEditing) {
      // 수정 모드 진입 시, 현재 실제 값을 임시 상태로 복사
      setTempNickname(userNickname)
    }
    setIsEditing(prev => !prev)
  }

  //사용자 정보 저장 함수
  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        'http://localhost:3000/auth/profile',
        {
          nickname: tempNickname,
          email: userEmail,
          phone: userPhone,
        },
        {
          withCredentials: true,
        },
      )

      if (response.status === 200) {
        alert('프로필 정보가 성공적으로 업데이트되었습니다.')
        setUserNickname(tempNickname)
        setIsEditing(false) // 저장 후 편집 모드 종료
        // 업데이트된 정보로 상태를 다시 설정 (선택 사항, 서버 응답에 따라)
        // setUserNickname(response.data.user.nickname);
        // setUserEmail(response.data.user.email);
        // setUserPhone(response.data.user.phone);
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
  ///계정 삭제 함수
  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        const response = await axios.delete('http://localhost:3000/auth/account', {
          withCredentials: true,
        })

        if (response.status === 200) {
          alert('계정이 성공적으로 삭제되었습니다. 로그인 페이지로 이동합니다.')
          // 계정 삭제 성공 시 로그아웃 처리
          // 1. 로컬 스토리지/세션 스토리지 등 저장된 토큰이나 사용자 정보 삭제
          localStorage.removeItem('accessToken') // 예시: 실제 사용하는 토큰 이름
          // 2. 페이지 리디렉션 (로그인 페이지 등으로)
          window.location.href = '/login' // 로그인 페이지 URL로 변경
        }
      } catch (error) {
        console.error('계정 삭제 실패:', error)
      }
    }
  }

  // const openPasswordModal = () => setIsPasswordModalOpen(true)
  // const closePasswordModal = () => setIsPasswordModalOpen(false)

  const renderContent = () => {
    switch (active) {
      case '최근기록':
        return (
          <div className="flex justify-center ">
            <ul className="flex flex-col gap-9 py-5">
              {recentStores.map(item => (
                <li key={item.id} className="flex gap-4">
                  <div className="relative w-[250px] h-[250px]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => toggleBookmark(item)}
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
                    <h2 className="text-lg py-1 font-SinchonRhapsody flex">{item.title}</h2>
                    <p className="py-1">⭐{item.rating} </p>
                    <p className="py-1 flex items-center text-sm text-gray-500">
                      <svg
                        fill="#000000"
                        height="25px"
                        width="25px"
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 487.379 487.379"
                        xml:space="preserve"
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
                      {item.keyword}
                    </p>
                    <p className="py-5 text-sm text-black">"{item.description}"</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )

      case '찜':
        return (
          <div className="flex justify-center">
            {bookmarked.length === 0 ? (
              <p>찜한 목록이 없습니다.</p>
            ) : (
              // 찜한 목록을 렌더링할 때도 북마크 버튼을 포함하여 찜 해제 기능을 제공할 수 있습니다.
              <ul className="flex flex-col gap-9 py-5">
                {bookmarked.map(shop => (
                  <li key={shop.id} className="flex gap-4">
                    <div className="relative w-[250px] h-[250px]">
                      <img
                        src={shop.image}
                        alt={shop.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => toggleBookmark(shop)} // 찜 해제 기능
                        className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100"
                      >
                        <span role="img" aria-label="bookmarked">
                          ❤️
                        </span>
                      </button>
                    </div>
                    <div className="py-3">
                      <h4 className="text-lg font-semibold">{shop.title}</h4>
                      <p>{shop.rating} ⭐</p>
                      <p>{shop.description}</p>
                      <p className="text-sm text-gray-500">{shop.keyword}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      case '리뷰':
        return <p> 작성한 리뷰가 없습니다. </p>

      case '음식점 추천(AI)':
        return (
          <div className="flex flex-col gap-5 items-center">
            {dalleImage && (
              <img
                src={dalleImage.data.imageUrl}
                alt="AI 음식점 이미지"
                className="w-[300px] h-[300px] rounded shadow-md py-5"
              />
            )}
            {openai?.length > 0 ? (
              <ul className="flex flex-col gap-9 py-5">
                <p className="py-2">
                  {userNickname} 님이 가장 좋아하시는 음식은 "{mostFrequentKeywords}" 입니다.
                </p>
                <h2>이 음식점들을 추천해요!</h2>
                {openai.map((item, index) => (
                  <li key={index} className="flex gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">{item.title}</h2>
                      <p>{item.rating} ⭐</p>
                      <p>{item.description}</p>
                      <p className="text-sm text-gray-500">{item.keyword}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>추천 가게를 불러오는 중...</p>
            )}
          </div>
        )

      case '계정 설정':
        // 인증 상태에 따라 다른 내용 렌더링
        if (!isAuthenticatedForSettings) {
          return (
            // ★★★ 비밀번호 인증 폼을 직접 렌더링 ★★★
            <MypagesAuthForm
              onAuthenticated={() => {
                setIsAuthenticatedForSettings(true) // 인증 성공 시 상태 변경
                setActive('계정 설정') // 혹시 모를 경우를 대비하여 탭 활성화 재확인
              }}
              onCancel={() => {
                setActive('최근기록') // 취소 시 다른 탭으로 이동 (예: 최근기록)
                setIsAuthenticatedForSettings(false) // 인증 상태 초기화
              }}
            />
          )
        }
        // 인증되었다면 원래 계정 설정 내용을 렌더링
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
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow hover:bg-opacity-100 cursor-pointer"
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
                    <button className="text-blue-500 hover:underline" onClick={() => setShowPasswordChangeModal(true)}>
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
