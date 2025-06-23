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
    if (snd && snd._id) {
      navigate(`/place/${snd._id}`, { state: snd })
    } else {
      toast.error(
        <div className="Toastify__toast-body cursor-default">다시 시도해주세요.</div>,
        {
          position: 'top-center',
        },
      )
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
                spaceBetween={0}
                slidesPerView={2}
                breakpoints={{
                  376: {
                    slidesPerView: 3,
                  },
                  426: {
                    slidesPerView: 4,
                  },
                  769: {
                    slidesPerView: 5,
                  },
                }}
                className="border-t-1 border-gray-700"
              >
                {searchNearData
                  .filter(snd => snd._id !== placeDetail?._id)
                  .map((snd, i) => {
                    return (
                      <SwiperSlide
                        key={i}
                        className="gap-3 p-2 sm:max-w-[14rem] max-w-[10rem] text-center !mr-0"
                      >
                        <div key={i}>
                          <div className="hover:cursor-pointer" onClick={() => handleNavigate(snd)}>
                            <img
                              src={
                                `${import.meta.env.VITE_API_BASE_URL + snd?.photos?.[0]}` || Icon
                              }
                              alt="icon"
                              className="sm:w-[150px] sm:h-[150px] h-[80px] w-[80px] mx-auto rounded-xl"
                              onError={e => {
                                e.target.src = Icon
                                e.target.onerror = null
                              }}
                            />
                          </div>
                          <div>
                            <p
                              className="hover:cursor-pointer font-bold"
                              onClick={() => handleNavigate(snd)}
                            >
                              {snd?.place_name ? snd.place_name : snd.name}
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
