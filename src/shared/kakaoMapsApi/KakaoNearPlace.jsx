import usePlaceStore from '../../app/zustandStore.js'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import '../../assets/styles/global.css'
import { useNavigate } from 'react-router-dom'

const KakaoNearPlace = () => {
  const kakaoPlace = usePlaceStore(state => state.kakaoPlace)
  const navigate = useNavigate()


  const handleSaveAndNavigate = kp => {
    // console.log('KakaoNearPlace')
    try {
      axios
        .post('http://localhost:3000/store/save', kp)
        .then(res => {
          const place = res.data
          // console.log(place)
          navigate(`/place/${place._id}`, { state: kp })
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
      <div className="container w-full py-2 px-5 shadow-xl/20">
        <Swiper spaceBetween={50} slidesPerView={3}>
          {kakaoPlace &&
            kakaoPlace.map((kp, i) => (
              <SwiperSlide key={i} className="md:max-w-full" style={{ margin: '0px' }}>
                <div onClick={() => handleSaveAndNavigate(kp)} className="mouse_pointer">
                  <img
                    src={`https://picsum.photos/200/150?random=${Math.floor(Math.random() * 1000)}`}
                    alt="lorem picture"
                  />
                </div>
                <div onClick={() => handleSaveAndNavigate(kp)} className="mouse_pointer">
                  <p className="font-bold font-sans max-[426px]:text-sm">{kp.place_name}</p>
                </div>
                <p className="max-[426px]:text-sm">소재지:{kp.address_name}</p>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  )
}

export default KakaoNearPlace
