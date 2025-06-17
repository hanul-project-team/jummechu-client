import React, { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Icon from '../../assets/images/default2.png'
import { API } from '../../app/api.js'
import 'swiper/css'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import zustandStore from '../../app/zustandStore.js'

const HomeRecommand = () => {
  const [tag, setTag] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const userNearPlace = zustandStore(state => state.userNearPlace)
  const nearPlaceReviews = zustandStore(state => state.nearPlaceReviews)
  const setNearPlaceReviews = zustandStore(state => state.setNearPlaceReviews)
  const navigate = useNavigate()
  const lastPlacesRef = useRef([])
  const intervalRef = useRef(null)
  const [countDown, setCountDown] = useState(60)
  const [otherPlaces, setOtherPlaces] = useState([])

  const defaultCategories = [
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
  useEffect(() => {
    const fetchReviews = (isFromInterval = false) => {
      setIsLoading(true) // {/* interval 1번 */}
      if (userNearPlace && userNearPlace.length > 0) {
        const categories = userNearPlace.map(unp => {
          return unp.keywords[0]
        })
        const reducedCategories = categories.reduce((acc, cts) => {
          const item1 = cts.split(',')[0]?.trim()
          if (!acc.includes(item1)) {
            acc.push(item1)
          }
          const item2 = cts.split(',')[1]?.trim()
          if (!acc.includes(item2)) {
            acc.push(item2)
          }
          const item3 = cts.split(',')[2]?.trim()
          if (!acc.includes(item3)) {
            acc.push(item3)
          }
          return acc
        }, [])

        const filteredCategories = reducedCategories?.filter(tag => tag?.length > 0)

        try {
          // console.log(filteredCategories)
          const results = matchingCategories(defaultCategories, filteredCategories)
          const center = {
            latitude: userNearPlace[0].latitude,
            longitude: userNearPlace[0].longitude,
          }
          // console.log(center)
          // console.log(results)
          if (results) {
            API.post('/store/tag/match', {
              results: results,
              center: center,
            })
              .then(res => {
                const data = res.data
                if (data?.length > 0) {
                  setOtherPlaces(data)
                  const places = data.map(list => list.stores)
                  handleHomeReviews(places)
                }
              })
              .catch(err => {
                toast.error(
                  <div className="Toastify__toast-body cursor-default">다시 시도해주세요.</div>,
                  {
                    position: 'top-center',
                  },
                )
              })
          }
          setTag(results)
          // {/*interval 2번*/}
          if (otherPlaces?.length > 0 && lastPlacesRef.current) {
            if (isFromInterval || isSamePlaces(lastPlacesRef.current, otherPlaces)) {
              const places = otherPlaces.map(place => place.stores)
              handleHomeReviews(places)
            }
          }
        } catch (err) {
          console.log(err)
        }
      }
    }

    fetchReviews(true)
    // {/* interval 3번 : 개발모드 해제해야함 */}
    if (!import.meta.env.DEV) {
      intervalRef.current = setInterval(() => {
        fetchReviews(true)
      }, 1000 * 60)

      const countTimer = setInterval(() => {
        setCountDown(prev => (prev > 0 ? prev - 1 : 0))
      }, 1000)

      return () => {
        clearInterval(intervalRef.current)
        clearInterval(countTimer)
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [userNearPlace])
  const matchingCategories = (def, user) => {
    const filtered = user?.filter(use => {
      return def?.some(de => use.includes(de))
    })
    // console.log(filtered)
    return filtered
  }
  const handleNavigate = fps => {
    // console.log(fps)
    if (fps) {
      API.post('/store/storeInfo', fps).then(res => {
        const data = res.data
        if (data) {
          navigate(`/place/${data._id}`, { state: data })
        }
      })
    }
  }
  const handleHomeReviews = places => {
    if (places?.length > 0) {
      API.post('/review/readall', {
        places: places,
      })
        .then(res => {
          const data = res.data
          const reviews = data
          // console.log(data)
          // console.log(reviews)
          setNearPlaceReviews(reviews?.length > 0 ? reviews : [])
          setIsLoading(false)
          setCountDown(60)
        })
        .catch(err => {
          toast.error(
            <div className="Toastify__toast-body cursor-default">
              리뷰 정보를 불러올 수 없습니다.
            </div>,
            {
              position: 'top-center',
            },
          )
        })
    } else {
      return toast.error(
        <div className="Toastify__toast-body cursor-default">위치 정보를 갱신해주세요.</div>,
        {
          position: 'top-center',
        },
      )
    }
  }
  const isSamePlaces = (prevPlaces, newPlaces) => {
    if (!prevPlaces || !newPlaces) return false
    if (prevPlaces?.length !== newPlaces?.length) return false

    const reviewPlaces = prevPlaces.map(rv => ({
      name: rv?.store.place_name,
      address: rv?.store.address_name,
    }))

    const sorted1 = reviewPlaces?.map(p => p.name + p.address).sort()
    const sorted2 = newPlaces?.map(p => p.name + p.address).sort()

    return sorted1.every((val, idx) => val === sorted2[idx])
  }
  const handleAvgRating = (reviews, place) => {
    if (reviews?.length > 0) {
      const matchedReviews = reviews.filter(review => review.store?._id === place._id)
      const avgRating =
        matchedReviews?.length > 0
          ? matchedReviews.reduce((acc, cur) => acc + cur.rating, 0) / matchedReviews.length
          : null
      const rounded = Math.round(avgRating * 10) / 10
      return rounded
    } else {
      return 0
    }
  }
  const handleCountReviews = (reviews, place) => {
    if (reviews?.length > 0) {
      const matchedReviews = reviews.filter(review => review.store?._id === place._id)
      return matchedReviews.length
    } else {
      return 0
    }
  }
  // console.log(tag)
  // console.log(userNearPlace)
  return (
    <div className="max-xl:m-3">
      {isLoading === true ? (
        <p className="loading-jump">
          Loading
          <span className="jump-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      ) : (
        <>
          <div className="flex justify-between">
            <span className="text-xl font-bold">추천 태그</span>
            {/* <span>
              {countDown > 0 ? `review 갱신까지 ${countDown}초 남음` : `리뷰 정보 갱신 중...`}
            </span> */}
          </div>
          {otherPlaces?.length > 0 ? (
            otherPlaces.map((group, i) => {
              const { tag, stores } = group
              const filteredPlaces = stores.filter(store => {
                return !store.name.includes(tag)
              })
              if (!filteredPlaces || filteredPlaces?.length === 0) return null
              return (
                <div
                  key={`tag-${i}`}
                  className="container shadow-lg/20 max-w-full p-3 my-3 overflow-auto"
                >
                  <p className="text-lg font-bold">&#35; {tag}</p>
                  <Swiper
                    spaceBetween={0}
                    slidesPerView={2}
                    breakpoints={{
                      426: {
                        slidesPerView: 4,
                      },
                    }}
                  >
                    {filteredPlaces.map((fps, idx) => {
                      return (
                        <SwiperSlide key={idx} className="max-w-full mr-3">
                          <img
                            src={fps.photos.length > 0 ? fps.photos : Icon}
                            alt="picsum"
                            className="max-[376px]:h-[110px] max-[426px]:h-[150px] max-[769px]:h-[150px] min-[769px]:h-[200px] hover:cursor-pointer rounded-xl"
                            onClick={() => handleNavigate(fps)}
                          />
                          <div className="flex flex-col">
                            <p className="sm:text-md text-sm">
                              <strong
                                onClick={() => handleNavigate(fps)}
                                className="hover:cursor-pointer"
                              >
                                {fps.name}
                              </strong>
                            </p>
                            <div className="sm:flex sm:flex-justify gap-1 items-center">
                              {
                                <div className="flex items-center cursor-default">
                                  {handleAvgRating(nearPlaceReviews, fps)}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-4"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                    />
                                  </svg>
                                </div>
                              }
                              <span className="cursor-default sm:text-md text-sm">
                                리뷰수&#40;{handleCountReviews(nearPlaceReviews, fps)}&#41;
                              </span>
                            </div>
                          </div>
                          <span className="cursor-default sm:text-md text-sm">{fps.address}</span>
                        </SwiperSlide>
                      )
                    })}
                  </Swiper>
                </div>
              )
            })
          ) : (
            <p>점검중</p>
          )}
        </>
      )}
    </div>
  )
}

export default HomeRecommand
