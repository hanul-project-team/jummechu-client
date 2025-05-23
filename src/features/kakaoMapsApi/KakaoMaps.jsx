import React, { useEffect, useState, useRef } from 'react'
import usePlaceStore from '../../store/usePlaceStore'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import KakaoNearPlace from './KakaoNearPlace.jsx'

const KakaoMaps = () => {
  const setCenter = usePlaceStore(state => state.setCenter)
  const center = usePlaceStore(state => state.center)
  const setKakaoPlace = usePlaceStore(state => state.setKakaoPlace)
  const kakaoPlace = usePlaceStore(state => state.kakaoPlace)
  const setSearchData = usePlaceStore(state => state.setSearchData)

  const intervalRef = useRef(null)
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const navigate = useNavigate()
  const retryCountRef = useRef(0);
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
      if (isRoot) {
        // console.log(isRoot)
        if (!center || center.lat !== lat || center.lng !== lng || kakaoPlace?.length === 0) {
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
        }
      },
    )
  }

  const getKakaoData = center => {
    // console.log('재시도 횟수', retryCountRef.current)
    if(kakaoPlace?.length === 0 || !kakaoPlace) {
      // console.log(kakaoPlace?.length)
      axios
      .post(
        'http://localhost:3000/api/nearplace',
        { location: center },
        {
          withCredentials: true,
        },
      )
      .then(res => {
        const data = res.data
        // console.log(data)
        setKakaoPlace(data)
        retryCountRef.current == 0;
      })
      .catch(err => {
        // console.error('error msg:', err)
        if (retryCountRef.current < 3) {
          retryCountRef.current += 1
          console.log(`데이터 로딩 실패 ${retryCountRef.current}회 째 재시도...`)
          setTimeout(() => getKakaoData(center, 1000))
        } else {
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
      axios
        .post(
          'http://localhost:3000/api/search',
          {
            place: sliced,
            center: center,
          },
          {
            withCredentials: true,
          },
        )
        .then(res => {
          const data = res.data
          // console.log(data)
          setSearchData(data)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      navigate(`/search/${formData.place}`)
      axios
        .post(
          'http://localhost:3000/api/search',
          {
            place: formData.place,
            center: center,
          },
          {
            withCredentials: true,
          },
        )
        .then(res => {
          const data = res.data
          // console.log(data)
          setSearchData(data)
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
                      className="size-6 mx-auto"
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
                    <div className="flex-1 text-center">
                      <button
                        className="button w-fit rounded-3xl px-5 py-2 bg-teal-200 focus:bg-teal-500 text-gray-700"
                        type="submit"
                      >
                        <span className="max-[426px]:text-sm mouse_pointer">검색</span>
                      </button>
                    </div>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
          <div className="container mx-auto max-w-5xl max-xl:m-3">
            <KakaoNearPlace />
          </div>
        </>
      ) : (
        <>
          <div className="container md:max-w-1/2 md:absolute md:top-px xl:top-px xl:left-2/8 md:left-2/8 mx-auto max-w-5xl max-xl:mx-3">
            <form className="px-3 my-3" onSubmit={handleSubmit} autoComplete="off">
              <fieldset>
                <legend className="hidden">kakao search</legend>
                <div className="flex items-center mx-auto gap-1 border-1 rounded-3xl px-3 py-1 bg-gray-200">
                  {/* <div className="max-w-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 mx-auto"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  </div> */}
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
                      {/* <button
                        className="button mouse_pointer w-full rounded-3xl px-2 py-2 bg-teal-200 focus:bg-teal-500 text-gray-700"
                        type="submit"
                      >
                        <span className="max-[426px]:text-sm">검색</span>
                      </button> */}
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
