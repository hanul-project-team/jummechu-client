import React, { useEffect, useState, useRef } from 'react'
import zustandStore from '../../app/zustandStore.js'
import { API } from '../../app/api.js'
import { useLocation, useNavigate } from 'react-router-dom'
import KakaoNearPlace from './KakaoNearPlace.jsx'

const KakaoMaps = () => {
  const setCenter = zustandStore(state => state.setCenter)
  const center = zustandStore(state => state.center)
  const setUserNearPlace = zustandStore(state => state.setUserNearPlace)
  const userNearPlace = zustandStore(state => state.userNearPlace)
  const setSearchData = zustandStore(state => state.setSearchData)
  const isLoading = zustandStore(state => state.isLoading)

  const intervalRef = useRef(null)
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
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
        // console.log('y:'+latitude, 'x:'+longitude)
        setLat(latitude)
        setLng(longitude)
        if (!center || center.lat !== latitude || center.lng !== longitude) {
          setCenter({ lat: latitude, lng: longitude })
        }
        // console.log(center)
      },
      err => {
        console.error('error msg:', err)
        if (retryCountRef.current < 3) {
          retryCountRef.current += 1
          console.log(`위치정보 획득 실패, ${retryCountRef.current}회 째 재시도...`)
          setTimeout(() => getNowLocation(retryCountRef, 1000))
        } else {
          console.log('위치 정보 획득 실패 및 재시도 실패')
          if (err.code === 1) {
            alert('위치 권한이 거부 되었습니다. 사용자 권한을 설정해주세요.')
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
      API
        .post(
          '/api/kakao/user/nearplace',
          {
            location: {
              lat: center.lat,
              lng: center.lng,
            },
          },
        )
        .then(res => {
          const data = res.data
          // console.log(data)
          // setUserNearPlace(data)
          if (data) {
            API
              .post('/store/storeInfo', data)
              .then(res => {
                const existPlaces = res.data
                // console.log(res)
                if (existPlaces) {
                  setUserNearPlace(existPlaces)
                } else if(existPlaces?.length === 0 || !existPlaces){
                  API
                    .post('/store/save', data)
                    .then(res => {
                      const places = res.data
                      if (places) {
                        // console.log('등록완료')
                        if (Array.isArray(places)) {
                          // console.log('배열로 반환', places)
                          setUserNearPlace(places)
                        } else {
                          // console.log('미배열 반환', places)
                          setUserNearPlace(places)
                        }
                      }
                    })
                    .catch(err => {
                      console.log(err)
                    })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
          retryCountRef.current = 0
        })
        .catch(err => {
          // console.error('error msg:', err)
          if (retryCountRef.current < 3) {
            retryCountRef.current += 1
            console.log(`데이터 로딩 실패 ${retryCountRef.current}회 째 재시도...`)
            setTimeout(() => getKakaoData(center), 1000)
          } else {
            console.error('Kakao API 호출 실패:', err.response?.data || err.message)
            console.log('kakao map 데이터 로딩 실패 및 재시도 실패', err)
          }
        })
    }
  }
  const handleSubmit = e => {
    e.preventDefault()
    setSearchData(null)
    if (formData.place.startsWith('#')) {
      const sliced = formData.place.slice(1)
      navigate(`/search/${sliced}`)
      API
        .post(
          '/api/kakao/search',
          {
            place: sliced,
            center: center,
          },
        )
        .then(res => {
          const data = res.data
          // console.log(data)
          setSearchData(data)
          API.post('/store/save', data)
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.error(err)
          })
          setFormData({
            place: '',
          })
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      navigate(`/search/${formData.place}`)
      API
        .post(
          '/api/kakao/search',
          {
            place: formData.place,
            center: center,
          },
        )
        .then(res => {
          const data = res.data
          // console.log(data)
          setSearchData(data)
          setFormData({
            place: '',
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
    // console.log('검색어:', formData.place)
  }
  const handleChange = e => {
    // console.log(e.target.value)
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  // console.log(searchData)
  return (
    <>
      {isRoot === true ? (
        <>
          <div className="md:max-w-1/2 mx-auto">
            <h1 className="text-center text-4xl sm:text-5xl font-bold">오늘 뭐 먹지?</h1>
            <form className="p-3 my-3" onSubmit={handleSubmit} autoComplete="off">
              <fieldset>
                <legend className="hidden">kakao search</legend>
                <div className="flex items-center mx-auto gap-1 border-1 rounded-3xl px-3 py-1">
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
                    <div className="flex-2 sm:flex-1 text-center">
                      <button
                        className="button w-fit px-3 py-2 rounded-3xl sm:px-5 sm:py-2 bg-color-teal-400 hover:bg-teal-400/90 active:bg-teal-500/80 text-white hover:cursor-pointer"
                        type="submit"
                      >
                        <p className="sm:w-max sm:text-sm text-xs">검색</p>
                      </button>
                    </div>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="container mx-auto sm:max-w-5xl max-w-5xl max-sm:p-3">
            <KakaoNearPlace />
          </div>
        </>
      ) : (
        <>
          <div className="container sm:absolute sm:max-w-1/3 sm:left-1/3 top-[9px]">
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
                        className="py-2 indent-5 w-full outline-none"
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
