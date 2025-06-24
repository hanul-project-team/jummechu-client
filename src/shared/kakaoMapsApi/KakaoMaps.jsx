import React, { useEffect, useState, useRef } from 'react'
import zustandStore from '../../app/zustandStore.js'
import { API } from '../../app/api.js'
import { useLocation, useNavigate } from 'react-router-dom'
import KakaoNearPlace from './KakaoNearPlace.jsx'
import { toast } from 'react-toastify'

const KakaoMaps = () => {
  const setCenter = zustandStore(state => state.setCenter)
  const center = zustandStore(state => state.center)
  const setUserNearPlace = zustandStore(state => state.setUserNearPlace)
  const userNearPlace = zustandStore(state => state.userNearPlace)
  const setSearchData = zustandStore(state => state.setSearchData)
  const isLoading = zustandStore(state => state.isLoading)
  const setIsLoading = zustandStore(state => state.setIsLoading)

  const intervalRef = useRef(null)
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const navigate = useNavigate()
  const retryCountRef = useRef(0)
  const [formData, setFormData] = useState({
    place: '',
  })
  const location = useLocation()
  const isRoot = location.pathname === '/'

  useEffect(() => {
    getNowLocation()

    intervalRef.current = setInterval(() => {
      getNowLocation()
    }, 60000)

    try {
      if (isRoot && center && center.lat != null && center.lng != null) {
        if (!center || center.lat !== lat || center.lng !== lng || userNearPlace?.length === 0) {
          getKakaoData(center)
        }
      }
    } catch (err) {
      console.log(err)
    }

    return () => clearInterval(intervalRef.current)
  }, [center])

  const getNowLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        setLat(latitude)
        setLng(longitude)
        if (!center || center.lat !== latitude || center.lng !== longitude) {
          setCenter({ lat: latitude, lng: longitude })
        }
      },
      err => {
        if (retryCountRef.current < 3) {
          retryCountRef.current += 1
          setTimeout(() => getNowLocation(retryCountRef, 1000))
        } else {
          if (err.code === 1) {
            toast.error(
              <div className="Toastify__toast-body cursor-default">위치 권한을 허용해주세요.</div>,
              {
                position: 'top-center',
              },
            )
          }
        }
      },
      { enableHighAccuracy: true },
    )
  }

  const getKakaoData = center => {
    if (!center || center.lat == null || center.lng == null) {
      console.warn('유효하지 않은 center 값으로 getKakaoData 호출됨:', center)
      return
    }
    if (isLoading === false && (userNearPlace?.length === 0 || !userNearPlace)) {
      API.post('/api/kakao/user/nearplace', {
        location: {
          lat: center.lat,
          lng: center.lng,
        },
      })
        .then(res => {
          const data = res.data
          API.post('/store/save', data)
            .then(res => {
              const places = res.data
              if (places) {
                if (Array.isArray(places)) {
                  setUserNearPlace(places)
                } else {
                  setUserNearPlace(places)
                }
              }
            })
            .catch(err => {
              toast.error(
                <div className="Toastify__toast-body cursor-default">
                  잠시 후 다시 시도해주세요.
                </div>,
                {
                  position: 'top-center',
                },
              )
            })
          retryCountRef.current = 0
        })
        .catch(err => {
          if (retryCountRef.current < 3) {
            retryCountRef.current += 1
            setTimeout(() => getKakaoData(center), 1000)
          } else {
            toast.error(
              <div className="Toastify__toast-body cursor-default">
                잠시 후 다시 시도하거나 새로고침을 해주세요.
              </div>,
              {
                position: 'top-center',
              },
            )
          }
        })
    }
  }
  const handleSubmit = e => {
    e.preventDefault()
    setSearchData(null)
    setIsLoading(true)
    if (formData.place.startsWith('#')) {
      const sliced = formData.place.slice(1)
      navigate(`/search/${sliced}`)
      API.post('/api/kakao/search', {
        place: sliced,
        center: center,
      })
        .then(res => {
          if (res.status === 204) {
            setIsLoading(false)
          } else {
            const data = res.data
            setSearchData(data)
            API.post('/store/save', data)
              .then(res => {
                const savedData = res.data
              })
              .catch(err => {
                console.error(err)
              })
            setFormData({
              place: '',
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      navigate(`/search/${formData.place}`)
      API.post('/api/kakao/search', {
        place: formData.place,
        center: center,
      })
        .then(res => {
          if (res.status === 204) {
            setIsLoading(false)
          } else {
            const result = res.data
            setSearchData(result)
            setFormData({
              place: '',
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  return (
    <>
      {isRoot === true ? (
        <>
          <div className='bg-banner py-10 mb-15 relative left-1/2 -translate-x-1/2 w-screen'>
            <div className="md:max-w-1/2 mx-auto relative z-50">
              <h1 className="text-center text-4xl sm:text-5xl text-color-gray-900 font-bold">오늘 뭐 먹지?</h1>
              <form className="p-3 my-3" onSubmit={handleSubmit} autoComplete="off">
                <fieldset>
                  <legend className="hidden">kakao search</legend>
                  <div className="flex items-center bg-color-gray-50 mx-auto gap-1 border-1 rounded-3xl px-3 py-1">
                    <div className="flex gap-1 items-center w-full">
                      <div className="flex-5">
                        <input
                          type="text"
                          name="place"
                          value={formData.place}
                          onChange={handleChange}
                          className="py-3 indent-1 w-full outline-none"
                          placeholder="검색어를 입력해주세요"
                        />
                      </div>
                      <div className="max-w-6">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="sm:size-6 mx-auto size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
          <div className="container mx-auto sm:max-w-5xl max-w-5xl max-sm:p-3">
            <KakaoNearPlace />
          </div>
        </>
      ) : (
        <>
          <div className="container sm:absolute lg:max-w-[480px] sm:max-w-[380px] xl:left-1/3 lg:left-1/4 sm:left-1/4 2xl:left-4/11 top-[9px]">
            <form className="px-3 my-3" onSubmit={handleSubmit} autoComplete="off">
              <fieldset>
                <legend className="hidden">kakao search</legend>
                <div className="flex items-center mx-auto gap-1 border-1 rounded-3xl px-3 py-1">
                  <div className="flex gap-1 items-center w-full">
                    <div className="flex-5">
                      <input
                        type="text"
                        name="place"
                        value={formData.place}
                        onChange={handleChange}
                        className="py-2 min-sm:indent-5 max-sm:indent-1 w-full outline-none"
                        placeholder="검색어를 입력해주세요"
                      />
                    </div>
                    <div className="flex-1 text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 ml-auto"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </>
      )}
    </>
  )
}

export default KakaoMaps
