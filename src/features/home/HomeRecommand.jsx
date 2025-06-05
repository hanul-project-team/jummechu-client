import React, { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Icon from '../../assets/images/icon.png'
import axios from 'axios'
import 'swiper/css'
import { Link, useNavigate } from 'react-router-dom'
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

  useEffect(() => {
    const fetchReviews = (isFromInterval = false) => {
      // setIsLoading(true) // {/* interval 1번 */}
      if (userNearPlace && userNearPlace.length > 0) {
        const categories = userNearPlace.map(unp => unp.category_name)

        const setCategory = categories.reduce((acc, cts) => {
          const item = cts.split('>')[1].trim()
          if (!acc.includes(item)) {
            acc.push(item)
          }
          return acc
        }, [])

        const places = userNearPlace.map(place => ({
          name: place?.place_name,
          address: place?.address_name,
        }))
        try {
          // {/*interval 2번*/}
          if (isFromInterval || !nearPlaceReviews || isSamePlaces(lastPlacesRef.current, places)) {
            lastPlacesRef.current = places
            axios
              .post('http://localhost:3000/review/readall', {
                places: places,
              })
              .then(res => {
                const data = res.data
                // console.log(data)
                setNearPlaceReviews(data)
                setIsLoading(false)
                setCountDown(60)
              })
          }
          setTag(setCategory)
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

  const handleNavigate = unp => {
    // console.log('HomeRecommand')
    try {
      axios
        .post('http://localhost:3000/store/save', unp)
        .then(res => {
          const place = res.data
          // console.log(place)
          navigate(`/place/${place._id}`, { state: place })
        })
        .catch(err => {
          console.log('axios 요청 실패', err)
        })
    } catch (err) {
      console.log('try 실패', err)
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
      const matchedReviews = reviews.filter(review => review.store?.name === place.place_name)
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
      const matchedReviews = reviews.filter(review => review.store?.name === place.place_name)
      return matchedReviews.length
    } else {
      return 0
    }
  }

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
          <Link to="#" className="flex justify-between">
            <span className="text-xl font-bold">추천 태그</span>
            {/* <span>{countDown > 0 ? `review 최신화까지 ${countDown}초 남음` : `리뷰 정보 갱신 중...`}</span> */}
          </Link>
          {tag.map((t, i) => (
            <div key={i} className="container shadow-lg/20 max-w-full p-3 my-3 overflow-auto">
              <p className="text-lg">&#35; {t}</p>
              <Swiper spaceBetween={50} slidesPerView={3}>
                {userNearPlace &&
                  userNearPlace.length > 0 &&
                  userNearPlace.map((unp, idx) => {
                    if (!unp.category_name.includes(t)) return null
                    return (
                      <SwiperSlide key={idx} className="!mr-0 max-w-full">
                        <img
                          src={Icon}
                          alt="picsum"
                          className="min-h-[200px] hover:cursor-pointer"
                          onClick={() => handleNavigate(unp)}
                        />
                        <p
                          className="text-sm hover:cursor-pointer"
                          onClick={() => handleNavigate(unp)}
                        >
                          가게명: <strong>{unp.place_name}</strong>
                        </p>
                        <div className="text-sm flex gap-3 items-center">
                          {
                            <div className="flex items-center cursor-default">
                              {handleAvgRating(nearPlaceReviews, unp)}
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
                          <span className='cursor-default'>리뷰수&#40;{handleCountReviews(nearPlaceReviews, unp)}&#41;</span>
                        </div>
                      </SwiperSlide>
                    )
                  })}
              </Swiper>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default HomeRecommand
