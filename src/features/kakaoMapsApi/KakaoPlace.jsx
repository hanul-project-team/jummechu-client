import React from 'react'
import usePlaceStore from '../../store/usePlaceStore.js'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

const KakaoPlace = () => {
  const kakaoPlace = usePlaceStore(state => state.kakaoPlace)
  // console.log(kakaoPlace)
  return (
    <>
      <div>
        <h3 className="text-2xl">가까운 장소</h3>
      </div>
      <div className="container w-full py-2 px-5 shadow-xl/20">
        <Swiper
          spaceBetween={50}
          slidesPerView={3}
          // onSlideChange={() => console.log('slide change')}
          // onSwiper={(swiper) => console.log(swiper)}
        >
          {kakaoPlace &&
            kakaoPlace.map((kp, i) => (
              <SwiperSlide key={i} className='md:max-w-full' style={{margin: '0px'}}>
                <img src="https://picsum.photos/200/150" alt="lorem picture" />
                <p className='font-bold font-sans max-[426px]:text-sm'>{kp.place_name}</p>
                <p className='max-[426px]:text-sm'>소재지:{kp.address_name}</p>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  )
}

export default KakaoPlace
