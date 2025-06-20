import usePlaceStore from '../../app/zustandStore.js'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import '../../assets/styles/global.css'
import { useNavigate } from 'react-router-dom'
import { API } from '../../app/api.js'
import Icon from '../../assets/images/default2.png'

const KakaoNearPlace = () => {
  const userNearPlace = usePlaceStore(state => state.userNearPlace)
  const navigate = useNavigate()

  const handleSaveAndNavigate = unp => {
    if (unp) {
      API.post('/store/storeInfo', unp)
        .then(res => {
          const data = res.data
          if (data) {
            navigate(`/place/${data._id}`, { state: data })
          }
        })
        .catch(err => {
          console.error('navigate 에러', err)
        })
    }
  }

  return (
    <>
      <div>
        <h3 className="text-2xl">가까운 장소</h3>
      </div>
      <div className="container max-w-full py-2 px-5 shadow-lg/20">
        <Swiper
          spaceBetween={0}
          slidesPerView={2}
          breakpoints={{
            426: {
              slidesPerView: 4,
            },
          }}
        >
          {userNearPlace &&
            userNearPlace.map((unp, i) => (
              <SwiperSlide
                key={`place-${i}`}
                className="md:max-w-full sm:mr-1 sm:ml-1 mr-2 ml-2"
                style={{ margin: '0px' }}
              >
                <div onClick={() => handleSaveAndNavigate(unp)} className="hover:cursor-pointer">
                  <img
                    src={import.meta.env.VITE_API_BASE_URL+unp?.photos?.[0] || Icon}
                    alt="lorem picture"
                    className="sm:w-[200px] sm:h-[150px] rounded-xl"
                    onError={e => {
                      e.target.src = Icon
                      e.target.onerror = null
                    }}
                  />
                </div>
                <div>
                  <p className="font-bold max-[426px]:text-sm">
                    <span
                      onClick={() => handleSaveAndNavigate(unp)}
                      className="hover:cursor-pointer"
                    >
                      {unp.name}
                    </span>
                  </p>
                </div>
                <p className="max-[426px]:text-sm">소재지:{unp.address}</p>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  )
}

export default KakaoNearPlace
