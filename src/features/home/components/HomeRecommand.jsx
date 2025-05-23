import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Icon from '../../../assets/images/icon.png'
import 'swiper/css'
import { Link, useNavigate } from 'react-router-dom'
import usePlaceStore from '../../../store/usePlaceStore.js'
import '../../../assets/styles/tailwind.css'
import '../../../assets/styles/global.css'

const HomeRecommand = () => {
  const [tag, setTag] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  const kakaoPlace = usePlaceStore(state => state.kakaoPlace)

  const navigate = useNavigate();

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
  }, [kakaoPlace])

  const handleNavigate = (kp) => {
    navigate(`/place/${kp.id}`, {state: kp})
  }

  // console.log(tag)
  // console.log(kakaoPlace)
  return (
    <div className="max-xl:m-3">
      {isLoading === true ? (
        <p className="loading-jump">Loading<span className="jump-dots"><span>.</span><span>.</span><span>.</span></span></p>
      ) : (
        <>
          <Link to="/list">
            <span className="text-xl font-bold font-(family-name:peoplefirst)">전체보기</span>
          </Link>
          {tag.map((t, i) => (
            <div key={i} className="container shadow-xl/20 max-w-full p-3 my-3 overflow-auto">
              <p className="text-lg font-sans">&#35; {t}</p>
              <Swiper
                spaceBetween={50}
                slidesPerView={3}
              >
                {kakaoPlace &&
                  kakaoPlace.length > 0 &&
                  kakaoPlace.map((kp, idx) => {
                    if (!kp.category_name.includes(t)) return null
                    return (
                      <SwiperSlide key={idx}>
                        <div className="min-w-50">
                          <img src={Icon} alt="picsum" className='min-h-[200px] mouse_pointer' onClick={() => handleNavigate(kp)} />
                          <p className="text-sm mouse_pointer" onClick={() => handleNavigate(kp)}>가게명:{kp.place_name}</p>
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
          ))}
        </>
      )}
    </div>
  )
}

export default HomeRecommand
