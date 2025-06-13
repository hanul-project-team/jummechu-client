import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Icon from '../../../assets/images/icon.png'
import axios from 'axios'
import 'swiper/css'
import { toast } from 'react-toastify'
import zustandStore from '../../../app/zustandStore.js'
import { useNavigate } from 'react-router-dom'

const RecommandPlace = ({ placeDetail }) => {
  const setIsLoading = zustandStore(state => state.setIsLoading)
  const userNearPlace = zustandStore(state => state.userNearPlace)
  const searchNearData = zustandStore(state => state.searchNearData)
  const navigate = useNavigate()
  
  const handleNavigate = snd => {
    if (snd) {
      axios
        .post('http://localhost:3000/store/storeInfo', snd)
        .then(res => {
          const data = res.data
          if (data !== null && data._id) {
            console.log('1-2 데이터 있음')
            console.log(data)
            // console.log(data._id)
            try {
              navigate(`/place/${data._id}`, { state: data })
            } catch (err) {
              console.error(`data 아이디 에러 ${data._id}`)
            }
          } else if (data === null) {
            setIsLoading(true)
            window.scrollTo({ top: 0 })
            console.log('2-1 데이터 없음, 등록 실행')
            axios
              .post('http://localhost:3000/store/save', snd)
              .then(res => {
                const place = res.data
                // console.log(place)
                if (Array.isArray(place)) {
                  navigate(`/place/${place[0]._id}`, { state: place[0] })
                } else {
                  navigate(`/place/${place._id}`, { state: place })
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
  }

  return (
    <>
      {searchNearData.filter(snd => snd.id !== placeDetail.id).length > 0 && (
        <div className="max-w-full my-5 min-h-[200px]">
          <div className="text-start">
            <p className="font-bold text-lg">다른 장소도 둘러보세요!</p>
          </div>
          {searchNearData && (
            <Swiper spaceBetween={50} slidesPerView={3} className="border-t-1 border-gray-700 flex">
              {searchNearData
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
