import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Icon from '../../../assets/images/icon.png'
import axios from 'axios'
import 'swiper/css'
import zustandStore from '../../../app/zustandStore.js'
import { useNavigate } from 'react-router-dom'

const RecommandPlace = ({ placeDetail }) => {
  const userNearPlace = zustandStore(state => state.userNearPlace)
  const searchNearData = zustandStore(state => state.searchNearData)
  const navigate = useNavigate()
  const handleNavigate = snd => {
    try {
      axios
        .post('http://localhost:3000/store/save', snd)
        .then(res => {
          const place = res.data
          navigate(`/place/${place._id}`, { state: place })
        })
        .catch(err => {
          console.log('axios 요청 실패', err)
        })
    } catch (err) {
      console.log('try 실패', err)
    }
  }

  return (
    <>
      {userNearPlace.filter(snd => snd.id !== placeDetail.id).length > 0 && (
        <div className="max-w-full my-5 min-h-[200px]">
          <div className="text-start">
            <p className="font-bold text-lg">다른 장소도 둘러보세요!</p>
          </div>
          {userNearPlace && (
            <Swiper spaceBetween={50} slidesPerView={3} className="border-t-1 border-gray-700 flex">
              {userNearPlace
                // .filter(snd => snd.id !== placeDetail._id)
                .map((snd, i) => {
                  return (
                    <SwiperSlide key={i} className="gap-3 p-2 sm:max-w-[14rem] text-center !mr-0">
                      <div key={i}>
                        <div className="hover:cursor-pointer" onClick={() => handleNavigate(snd)}>
                          <img src={Icon} alt="icon" className="w-[100px] h-[100px] mx-auto" />
                        </div>
                        <div>
                          <p className="hover:cursor-pointer" onClick={() => handleNavigate(snd)}>
                            {snd.place_name}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  )
                })}
            </Swiper>
          )}
        </div>
      )}
    </>
  )
}

export default RecommandPlace
