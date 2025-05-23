import React, { useState, useEffect } from 'react'
import '../MyPage.css' // 경로 기준: 현재 컴포넌트 파일 위치 기준

const MyPageForm = () => {
  const [active, setActive] = useState('최근기록')
  const [bookmarked, setBookmarked] = useState([])
  const tabs = ['최근기록', '찜', '공유', '음식점 추천']
  const [isopen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openai, setOpenAi] = useState([])
  const [dalleImage, setDalleImage] = useState(null)

  const callDalleImage = async keywordSummary => {
    try {
      const res = await fetch('http://localhost:3000/api/dalle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `일러스트 스타일로 다음 키워드들을 반영한 음식점 장면을 그려주세요: ${keywordSummary}. 음식이 놓인 테이블, 가게 외관, 손님들, 분위기 등을 포함해 주세요.`,
        }),
      })

      const result = await res.json()
      const imageUrl = result?.result?.data?.[0]?.url // Azure는 `result` 아래에 있을 수 있음
      setDalleImage(imageUrl)
    } catch (err) {
      console.error('DALL·E 호출 실패:', err)
    }
  }

  const example = [
    {
      id: 1,
      title: '맛있다 초밥집',
      image: 'https://picsum.photos/250/250?random=1',
      rating: '4.0',
      description: '맛있다. 이 집 괜찮다.',
      keyword: '초밥, 일식, 스시',
    },
    {
      id: 2,
      title: '매운 떡볶이 전문점',
      image: 'https://picsum.photos/250/250?random=2',
      rating: '4.5',
      description: '맵고 맛있다. 이 집 나쁘지않다.',
      keyword: '떡볶이, 분식, 매운맛',
    },
    {
      id: 3,
      title: '감성 카페',
      image: 'https://picsum.photos/250/250?random=3',
      rating: '4.2',
      description: '좋은 커피와 달달한 디저트 이 집 감성있다. 이 집 괜찮다',
      keyword: '카페, 디저트, 분위기',
    },
    {
      id: 4,
      title: '전통 한식당',
      image: 'https://picsum.photos/250/250?random=4',
      rating: '4.8',
      description: '엄마 손맛이 나는 집밥 느낌 그야말로 맘스터치 이 집 괜찮다.',
      keyword: '한식, 전통, 백반',
    },
    {
      id: 5,
      title: '라멘 맛도 모르면서',
      image: 'https://picsum.photos/250/250?random=5',
      rating: '5',
      description: '맛있다 이 집 좋다. 내일 또 와야겠다.',
      keyword: '일식, 라멘',
    },
    {
      id: 6,
      title: '이것은 덮밥',
      image: 'https://picsum.photos/250/250?random=6',
      rating: '5',
      description: '존맛',
      keyword: '일식, 덮밥, 가츠동',
    },
  ]

  const callOpenAi = async keywords => {
    const prompt = `
      다음은 사용자가 최근 본 음식점의 키워드 목록입니다:
      ${keywords.join(', ')}
  
      다음은 사용자가 최근에 방문한 음식점들의 키워드 목록입니다.  
이 키워드와 2개 이상 겹치는 음식점만 골라 추천해 주세요.

결과는 아래 JSON 형식의 배열로만 출력하세요.  
각 추천 음식점은 다음 필드를 포함해야 합니다:  
- title: 음식점 이름  
- rating: 평점 (0.0 ~ 5.0)  
- description: 음식점 설명 (간단하고 매력적인 한 줄)  
- keyword: 이 음식점의 키워드 배열

JSON 외에는 아무 것도 출력하지 마세요.

[예시 키워드 목록]: #한식, #떡볶이, #매운맛, #분식, #치즈, #일식
    `

    

    const response = await fetch('http://localhost:3000/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI 응답 오류:', errorText)
      return []
    }

    const data = await response.json()
    console.log('OpenAI 응답 raw:', data) // 전체 응답 데이터 로깅
   
    return data;
  }

  useEffect(() => {
    if (active === '음식점 추천') {
      const allkeywords = example.flatMap(item => item.keyword.split(',').map(k => k.trim()))
      setLoading(true)
      callOpenAi(allkeywords).then(data => {
        setOpenAi(data)
        const keywordSummary = Array.from(new Set(allkeywords)).slice(0, 10).join(',')
        callDalleImage(keywordSummary)
        setLoading(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const Modal = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl relative z-10 w-[300px]">
          <h2 className="text-lg font-semibold mb-4">프로필 설정</h2>

          <div className="py-3 flex justify-between">
            <p>프로필 사진</p>
            <div
              className="w-[100px] h-[100px] bg-cover mask-radial-fade"
              style={{ backgroundImage: "url('https://picsum.photos/200')" }}
            />
          </div>
          <hr className="py-3" />
          <div className="py-3 flex justify-between">
            <p>이름</p>
            <p> 사용자 이름 </p>
          </div>
          <hr className="py-3" />
          <div className="py-3 flex justify-between">
            <p>이메일 관리</p>
            <p> 사용자 이메일 </p>
          </div>
          <hr className="py-3" />
          <div className="py-3 flex justify-between">
            <p>비밀번호</p>
            <p> 사용자 비밀번호 </p>
          </div>
          <hr className="py-3" />

          <div className="flex gap-2">
            <button className="mt-4 px-4 py-2 text-black bg-red-600 hover:bg-gray-500 rounded">
              계정 삭제
            </button>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleClick = (e, tab) => {
    e.preventDefault()
    setActive(tab)
  }

  const isBookmarked = item => bookmarked.some(b => b.id === item.id)

  const toggleBookmark = item => {
    if (isBookmarked(item)) {
      setBookmarked(prev => prev.filter(b => b.id !== item.id))
    } else {
      setBookmarked(prev => [...prev, item])
    }
  }

  const renderContent = () => {
    switch (active) {
      case '최근기록':
        return (
          <ul className="flex flex-col gap-9 py-5">
            {example.map(item => (
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
                  <h2 className="text-lg font-SinchonRhapsody">{item.title}</h2>
                  <p>{item.rating} ⭐</p>
                  <p>{item.description}</p>
                  <p className="text-sm text-gray-500">{item.keyword}</p>
                </div>
              </li>
            ))}
          </ul>
        )

      case '찜':
        return (
          <div>
            {bookmarked.length === 0 ? (
              <p>찜한 목록이 없습니다.</p>
            ) : (
              <ul>
                {bookmarked.map(shop => (
                  <li key={shop.id}>
                    <img src={shop.image} alt={shop.title} />
                    <h4 className="font-semibold">{shop.title}</h4>
                    <p>{shop.rating} ⭐</p>
                    <p>{shop.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      case '공유':
        return <p>친구에게 공유한 음식점 기록을 여기에 보여줍니다.</p>

      case '음식점 추천':
        return (
          <div className="flex flex-col gap-5 items-center">
            {dalleImage && (
              <img
                src={dalleImage}
                alt="AI 음식점 이미지"
                className="w-[300px] h-[300px] rounded shadow-md"
              />
            )}
            {openai.length > 2 ? (
              <ul className="flex flex-col gap-9 py-5">
                {openai.map((item, index) => (
                  <li key={index} className="flex gap-4">
                    <img
                      src={`https://picsum.photos/150/150?random=${index + 10}`}
                      alt={item.title}
                      className="w-[150px] h-[150px] object-cover rounded"
                    />
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

      default:
        return null
    }
  }

  return (
    <div className="w-full pb-5">
      <div className="max-w-6xl mx-auto">
        <div className="py-3 flex justify-between items-center ">
          <div
            className="w-[100px] h-[100px] bg-cover mask-radial-fade"
            style={{ backgroundImage: "url('https://picsum.photos/200')" }}
          />
          <div className="flex gap-3 ">
            <p>프로필설정</p>
            <button onClick={() => setIsOpen(true)} className="text-xl cursor-pointer">
              ⚙
            </button>
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
      <hr className=" border-gray-500" />

      <div className="flex justify-center">{renderContent()}</div>
    </div>
  )
}

export default MyPageForm
