import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Icon from '../../../assets/images/icon.png'
import 'swiper/css'
import { Link } from 'react-router-dom'
import usePlaceStore from '../../../store/usePlaceStore.js'
import '../../../assets/styles/tailwind.css'

const HomeRecommand = () => {
  const [tag, setTag] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const kakaoPlace = usePlaceStore(state => state.kakaoPlace)
  useEffect(() => {
    // console.log(kakaoPlace)
    if (kakaoPlace && kakaoPlace.length > 0) {
      const categories = kakaoPlace.map(kp => kp.category_name)
      // console.log(categories)
      const setCategory = categories.reduce((acc, cts) => {
        const item = cts.split('>')[1].trim()
        if (!acc.includes(item)) {
          acc.push(item)
        }
        return acc
      }, [])
      // console.log(setCategory)
      setTag(setCategory)
      setIsLoading(false)
    }
  }, [])
  // console.log(tag)
  // console.log(kakaoPlace)
  return (
    <div className="max-xl:m-3">
      {isLoading === true && <p>loading...</p>}
      {isLoading === false && (
        <>
          <Link to="/list">
            <span className="text-xl font-bold font-(family-name:peoplefirst)">전체보기</span>
          </Link>
          <div className="container shadow-xl/20 max-w-full p-3 my-3 overflow-auto">
            <p className="text-lg font-sans">&#35; {tag[0]}</p>
            <Swiper
              spaceBetween={50}
              slidesPerView={3}
              // onSlideChange={() => console.log('slide change')}
              // onSwiper={swiper => console.log(swiper)}
            >
              {kakaoPlace &&
                kakaoPlace.length > 0 &&
                kakaoPlace.map((kp, i) => {
                  if (!kp.category_name.includes(tag[0])) return null
                  return (
                    <SwiperSlide key={i}>
                      <div className="min-w-50">
                        <img src={Icon} alt="picsum" style={{ minHeight: '200px' }} />
                        <p className="text-sm">가게명:{kp.place_name}</p>
                        <div className="text-sm flex gap-3 items-center">
                          <span>4.3☆</span>
                          <span>&#40;{`리뷰수`}&#41;</span>
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                })}
            </Swiper>
          </div>
          <div className="container shadow-xl/20 max-w-full p-3 my-3 overflow-auto">
            <p className="text-lg font-sans">&#35; {tag[1]}</p>
            <Swiper
              spaceBetween={50}
              slidesPerView={3}
              // onSlideChange={() => console.log('slide change')}
              // onSwiper={swiper => console.log(swiper)}
            >
              {kakaoPlace &&
                kakaoPlace.length > 0 &&
                kakaoPlace.map((kp, i) => {
                  if (!kp.category_name.includes(tag[1])) return null
                  return (
                    <SwiperSlide key={i}>
                      <div className="min-w-50">
                        <img src={Icon} alt="picsum" style={{ minHeight: '200px' }} />
                        <p className="text-sm">가게명:{kp.place_name}</p>
                        <div className="text-sm flex gap-3 items-center">
                          <span>4.3☆</span>
                          <span>&#40;{`리뷰수`}&#41;</span>
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                })}
            </Swiper>
          </div>
          <div className="container shadow-xl/20 max-w-full p-3 my-3 overflow-auto">
            <p className="text-lg font-sans">&#35; {tag[2]}</p>
            <Swiper
              spaceBetween={50}
              slidesPerView={3}
              // onSlideChange={() => console.log('slide change')}
              // onSwiper={swiper => console.log(swiper)}
            >
              {kakaoPlace &&
                kakaoPlace.length > 0 &&
                kakaoPlace.map((kp, i) => {
                  if (!kp.category_name.includes(tag[2])) return null
                  return (
                    <SwiperSlide key={i}>
                      <div className="min-w-50">
                        <img src={Icon} alt="picsum" style={{ minHeight: '200px' }} />
                        <p className="text-sm">가게명:{kp.place_name}</p>
                        <div className="text-sm flex gap-3 items-center">
                          <span>4.3☆</span>
                          <span>&#40;{`리뷰수`}&#41;</span>
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                })}
            </Swiper>
          </div>
        </>
      )}
    </div>
  )
}

export default HomeRecommand
