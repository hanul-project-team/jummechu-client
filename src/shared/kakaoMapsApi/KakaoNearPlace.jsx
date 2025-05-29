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
    // console.log('KakaoNearPlace')
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

  return (
    <>
      <div>
        <h3 className="text-2xl">가까운 장소</h3>
      </div>
      <div className="container max-w-full py-2 px-5 shadow-xl/20">
        <Swiper spaceBetween={50} slidesPerView={3}>
          {userNearPlace &&
            userNearPlace.map((unp, i) => (
              <SwiperSlide key={i} className="md:max-w-full !mr-0 ml-1" style={{ margin: '0px' }}>
                <div onClick={() => handleSaveAndNavigate(unp)} className="hover:cursor-pointer">
                  <img
                    src={`https://picsum.photos/200/150?random=${Math.floor(Math.random() * 1000)}`}
                    alt="lorem picture"
                  />
                </div>
                <div onClick={() => handleSaveAndNavigate(unp)} className="hover:cursor-pointer">
                  <p className="font-bold max-[426px]:text-sm">{unp.place_name}</p>
                </div>
                <p className="max-[426px]:text-sm">소재지:{unp.address_name}</p>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  )
}

export default KakaoNearPlace
