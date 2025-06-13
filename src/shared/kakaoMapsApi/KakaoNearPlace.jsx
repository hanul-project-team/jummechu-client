import usePlaceStore from '../../app/zustandStore.js'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import '../../assets/styles/global.css'
import { useNavigate } from 'react-router-dom'

const KakaoNearPlace = () => {
  const userNearPlace = usePlaceStore(state => state.userNearPlace)
  const navigate = useNavigate()

  const handleSaveAndNavigate = unp => {
    if (unp) {
      axios.post('http://localhost:3000/store/storeInfo', unp).then(res => {
        const data = res.data
        if (data) {
          navigate(`/place/${data._id}`, { state: data })
        }
      })
    }
  }

  return (
    <>
      <div>
        <h3 className="text-2xl">가까운 장소</h3>
      </div>
      <div className="container max-w-full py-2 px-5 shadow-lg/20">
        <Swiper spaceBetween={50} slidesPerView={3}>
          {userNearPlace &&
            userNearPlace.map((unp, i) => (
              <SwiperSlide
                key={`place-${i}`}
                className="md:max-w-full !mr-0 ml-1"
                style={{ margin: '0px' }}
              >
                <div onClick={() => handleSaveAndNavigate(unp)} className="hover:cursor-pointer">
                  <img
                    src={
                      unp.photos?.length > 0
                        ? unp.photos
                        : `https://picsum.photos/200/150?random=${Math.floor(Math.random() * 1000)}`
                    }
                    alt="lorem picture"
                    className="sm:w-[200px] sm:h-[150px]"
                  />
                </div>
                <div onClick={() => handleSaveAndNavigate(unp)} className="hover:cursor-pointer">
                  <p className="font-bold max-[426px]:text-sm">{unp.name}</p>
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
