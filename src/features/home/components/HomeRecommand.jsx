import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Icon from '../../../assets/images/icon.png'
import 'swiper/css'
import { Link } from 'react-router-dom'
import '../../../assets/styles/tailwind.css'

const HomeRecommand = () => {
  return (
    <div className='max-xl:m-3'>
      <Link to="/list">
        <span className='text-xl font-bold font-(family-name:peoplefirst)'>전체보기</span>
      </Link>
      <div className="container shadow-xl/20 max-w-full p-3 my-3 overflow-auto">
        <p className="text-lg font-sans">&#35; 카페</p>
        <Swiper
          spaceBetween={50}
          slidesPerView={3}
          // onSlideChange={() => console.log('slide change')}
          // onSwiper={swiper => console.log(swiper)}
        >
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="container shadow-xl/20 max-w-full p-3 my-3 overflow-auto">
        <p className="text-lg font-sans">&#35; 혼밥</p>
        <Swiper
          spaceBetween={50}
          slidesPerView={3}
          // onSlideChange={() => console.log('slide change')}
          // onSwiper={swiper => console.log(swiper)}
        >
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="container shadow-xl/20 max-w-full p-3 my-3 overflow-auto">
        <p className="text-lg font-sans">&#35; 바</p>
        <Swiper
          spaceBetween={50}
          slidesPerView={3}
          // onSlideChange={() => console.log('slide change')}
          // onSwiper={swiper => console.log(swiper)}
        >
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="min-w-50">
              <img src={Icon} alt="picsum" style={{minHeight: '200px'}} />
              <p className="text-sm">가게명:</p>
              <div className="text-sm flex gap-3 items-center">
                <span>4.3☆</span>
                <span>&#40;{`리뷰수`}&#41;</span>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  )
}

export default HomeRecommand
