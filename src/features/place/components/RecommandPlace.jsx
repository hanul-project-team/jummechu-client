import { Swiper, SwiperSlide } from 'swiper/react'
import Icon from '../../../assets/images/default2.png'
import { API } from '../../../app/api.js'
import 'swiper/css'
import { toast } from 'react-toastify'
import zustandStore from '../../../app/zustandStore.js'
import { useNavigate } from 'react-router-dom'

const RecommandPlace = ({ placeDetail, setLoading, loading }) => {
  const searchNearData = zustandStore(state => state.searchNearData)
  const navigate = useNavigate()

  const handleNavigate = snd => {
    if (snd) {
      API
        .post('/store/storeInfo', snd)
        .then(res => {
          const data = res.data
          if (data !== null && data._id) {
            // console.log('1-2 데이터 있음')
            try {
              navigate(`/place/${data._id}`, { state: data })
            } catch (err) {
              console.error(`data 아이디 에러 ${data._id}`)
            }
          } else if (data === null) {
            setLoading(true)
            window.scrollTo({ top: 0 })
            console.log('2-1 데이터 없음, 등록 실행')
            API
              .post('/store/save', snd)
              .then(res => {
                const place = res.data
                // console.log(place)
                if (Array.isArray(place)) {
                  navigate(`/place/${place[0]._id}`, { state: place[0] })
                  setLoading(false)
                } else {
                  navigate(`/place/${place._id}`, { state: place })
                  setLoading(false)
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
      {loading === true ? (
        <div>
          <div className="container max-w-full mx-auto text-center sm:min-h-[200px]">
            <p className="loading-jump">
              Loading
              <span className="jump-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </p>
          </div>
        </div>
      ) : (
        searchNearData?.length > 0 && (
          <div className="max-w-full my-5 min-h-[200px]">
            <div className="text-start">
              <p className="font-bold text-lg">다른 장소도 둘러보세요!</p>
            </div>
            {searchNearData && (
              <Swiper
                spaceBetween={50}
                slidesPerView={3}
                className="border-t-1 border-gray-700 flex"
              >
                {searchNearData
                  .filter(snd => snd._id !== placeDetail._id)
                  .map((snd, i) => {
                    return (
                      <SwiperSlide key={i} className="gap-3 p-2 sm:max-w-[14rem] text-center !mr-0">
                        <div key={i}>
                          <div className="hover:cursor-pointer" onClick={() => handleNavigate(snd)}>
                            <img
                              src={snd.photos[0] ? snd.photos[0] : Icon}
                              alt="icon"
                              className="sm:w-[150px] sm:h-[150px] mx-auto rounded-xl"
                            />
                          </div>
                          <div>
                            <p
                              className="hover:cursor-pointer font-bold"
                              onClick={() => handleNavigate(snd)}
                            >
                              {snd.place_name ? snd.place_name : snd.name}
                            </p>
                          </div>
                        </div>
                      </SwiperSlide>
                    )
                  })}
              </Swiper>
            )}
          </div>
        )
      )}
    </>
  )
}

export default RecommandPlace
