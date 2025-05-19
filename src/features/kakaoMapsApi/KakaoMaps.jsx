import React, { useEffect, useState } from 'react'
import usePlaceStore from '../../store/usePlaceStore'
import axios from 'axios'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import KakaoPlace from './KakaoPlace.jsx'

const KakaoMaps = () => {
  const setCenter = usePlaceStore(state => state.setCenter)
  const center = usePlaceStore(state => state.center)
  const setKakaoPlace = usePlaceStore(state => state.setKakaoPlace)
  const kakaoPlace = usePlaceStore(state => state.kakaoPlace)
  const setSearchData = usePlaceStore(state => state.setSearchData)

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [retryCount, setRetryCount] = useState(0)
  const [formData, setFormData] = useState({
    place: '',
  })
  const location = useLocation()
  const isRoot = location.pathname === '/'

  useEffect(() => {
    const getNowLocation = () => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          // console.log('y:'+latitude, 'x:'+longitude)
          if (!center || center.lat !== latitude || center.lng !== longitude) {
            setCenter({ lat: latitude, lng: longitude })
            setRetryCount(0)
          }
        },
        err => {
          console.error('error msg:', err)
          if (retryCount < 3) {
            console.log(`위치정보 획득 실패, ${retryCount + 1}회 째 재시도...`)
            setRetryCount(prevCount => prevCount + 1)
            setTimeout(() => getNowLocation(retryCount, 1000))
          } else {
            console.log('위치 정보 획득 실패 및 재시도 실패')
          }
        },
      )
    }
    getNowLocation()

    try {
      if (isRoot) {
        if (center !== null && !kakaoPlace) {
          getKakaoData(center)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }, [center])

  const getKakaoData = center => {
    // console.log('재시도 횟수', retryCount)
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
        setRetryCount(0)
      })
      .catch(err => {
        console.error('error msg:', err)
        if (retryCount < 3) {
          console.log(`데이터 로딩 실패 ${retryCount + 1}회 째 재시도...`)
          setRetryCount(prevCount => prevCount + 1)
          setTimeout(() => getKakaoData(center, retryCount, 1000))
        } else {
          console.log('kakao map 데이터 로딩 실패 및 재시도 실패')
        }
      })
  }
  const handleSubmit = e => {
    e.preventDefault()
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
          const data = res
          console.log(data)
          // setSearchData(data)
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
          const data = res
          console.log(data)
          // setSearchData(data)
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
                        className="py-1 indent-1 w-full"
                        placeholder="검색어를 입력해주세요"
                      />
                    </div>
                    <div className="flex-1">
                      <button
                        className="button w-full rounded-3xl px-2 py-2 bg-teal-400 focus:bg-teal-700 text-yellow-300"
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
            <KakaoPlace />
          </div>
        </>
      ) : (
        <>
          <div className="container md:max-w-1/2 md:absolute md:top-px xl:top-px xl:left-2/8 md:left-2/8 mx-auto max-w-5xl max-xl:mx-3">
            <form className="px-3 my-3" onSubmit={handleSubmit} autoComplete="off">
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
                        className="py-1 indent-1 w-full"
                        placeholder="검색어를 입력해주세요"
                      />
                    </div>
                    <div className="flex-1">
                      <button
                        className="button mouse_pointer w-full rounded-3xl px-2 py-2 bg-teal-400 focus:bg-teal-700 text-yellow-300"
                        type="submit"
                      >
                        <span className="max-[426px]:text-sm">검색</span>
                      </button>
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
