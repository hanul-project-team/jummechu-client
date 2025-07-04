import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Icon from '../../assets/images/default2.png'
import '../../assets/styles/global.css'
import { API } from '../../app/api.js'
import zustandStore from '../../app/zustandStore.js'
import zustandUser from '../../app/zustandUser.js'
import { useSelector } from 'react-redux'
import PlaceReview from './components/reviews/PlaceReview.jsx'
import KakaoMaps from '../../shared/kakaoMapsApi/KakaoMaps.jsx'
import RecommandPlace from './components/RecommandPlace.jsx'
import { toast } from 'react-toastify'

const ViewPlaceDetail = () => {
  const setReviewInfo = zustandStore(state => state.setReviewInfo)
  const reviewInfo = zustandStore(state => state.reviewInfo)
  const isLoading = zustandStore(state => state.isLoading)
  const placeDetail = zustandStore(state => state.placeDetail)
  const setPlaceDetail = zustandStore(state => state.setPlaceDetail)
  const navigate = useNavigate()
  const setSearchNearData = zustandStore(state => state.setSearchNearData)
  const lastStoreRef = useRef(placeDetail?._id)
  const lastReviewRef = useRef(reviewInfo)
  const user = useSelector(state => state.auth.user)
  const setUserBookmark = zustandUser(state => state.setUserBookmark)
  const userBookmark = zustandUser(state => state.userBookmark)
  const isBookmarked = zustandUser(state => state.isBookmarked)
  const [linkCopied, setLinkCopied] = useState(false)
  const rootLocation = `${window.location.origin}`
  const location = useLocation()
  const returnUrl = location.pathname + location?.search
  const [recommandLoading, setRecommandLoading] = useState(false)
  const [center, setCenter] = useState({
    lat: 37.3946622,
    lng: 127.1026676,
  })
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState({
    lat: 37.3946622,
    lng: 127.1026676,
  })
  useEffect(() => {
    if (placeDetail && placeDetail?._id) {
      const storeId = placeDetail._id
      const isDifferentStore = lastStoreRef.current !== placeDetail._id
      if (lastStoreRef.current === storeId) {
        return
      }
      const renewReviewInfo = lastReviewRef.current !== reviewInfo
      if (isDifferentStore || renewReviewInfo) {
        try {
          Promise.all([
            API.get(`/review/read/store/${storeId}`),
            API.post(`/api/kakao/search/${storeId}`, {
              headers: {
                lat: placeDetail.latitude,
                lng: placeDetail.longitude,
              },
            }),
          ]).then(([revRes, searchRes]) => {
            if (revRes.statusText === 'OK' || revRes.status === 200) {
              const data = revRes.data
              setReviewInfo(data)
            } else if (revRes.status === 204) {
              setReviewInfo([])
            }
            if (searchRes.statusText === 'OK' || searchRes.status === 200) {
              const data = searchRes.data
              if (data?.length > 0) {
                setRecommandLoading(true)
                API.post('/store/save', data)
                  .then(res => {
                    const nearPlaces = res.data
                    setSearchNearData(nearPlaces)
                    setRecommandLoading(false)
                  })
                  .catch(err => {
                    toast.error(
                      <div className="Toastify__toast-body cursor-default">
                        주변 정보를 불러오지 못했습니다.
                      </div>,
                      {
                        position: 'top-center',
                      },
                    )
                  })
              }
            }
            lastStoreRef.current = storeId
          })
        } catch (err) {
          console.log(err)
        }
      }
    }
  }, [isBookmarked, placeDetail, userBookmark])

  useEffect(() => {
    const placeLink = location.pathname
    const placeId = placeLink.split('/')[2]
    if (!placeId || placeId === 'undefined') {
      console.warn('잘못된 URL입니다. placeId:', placeId)
      return
    }
    if (!placeDetail || Object.keys(placeDetail).length === 0) {
      API.get(`/store/read/${placeId}`)
        .then(res => {
          const data = res.data
          setPlaceDetail(data)
        })
        .catch(err => {
          toast.error(
            <div className="Toastify__toast-body cursor-default">잠시 후 다시 시도해주세요.</div>,
            {
              position: 'top-center',
            },
          )
        })
    }
  }, [location.pathname, placeDetail])
  useEffect(() => {
    const script = document.createElement('script')
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_KEY}&autoload=false`
    script.async = true
    document.head.appendChild(script)
    let isMounted = true

    script.onload = () => {
      if (!isMounted) return
      window.kakao.maps.load(() => {
        if (!isMounted) return
        const container = document.getElementById('map')
        if (container) {
          const options = {
            center: new window.kakao.maps.LatLng(center.lat, center.lng),
            level: 3,
          }
          const kakaoMap = new window.kakao.maps.Map(container, options)
          setMap(kakaoMap)
          const initialMarkerPosition = new window.kakao.maps.LatLng(center.lat, center.lng)
          const newMarker = new window.kakao.maps.Marker({
            position: initialMarkerPosition,
            map: kakaoMap,
          })
          setMarker(newMarker)
        } else {
          console.error('Error: Map container #map not found!')
        }
      })
    }

    return () => {
      isMounted = false
      document.head.removeChild(script)
      if (marker && typeof marker === 'function') {
        marker?.setMap(null)
      }
    }
  }, [])
  useEffect(() => {
    if (placeDetail) {
      setCenter({
        lat: placeDetail?.latitude,
        lng: placeDetail?.longitude,
      })
    }
  }, [placeDetail])
  useEffect(() => {
    if (map && center) {
      const moveLatLon = new window.kakao.maps.LatLng(center.lat, center.lng)
      map.setCenter(moveLatLon)
      if (marker) {
        marker.setPosition(moveLatLon)
      } else {
        const newMarker = new window.kakao.map.Marker({
          position: moveLatLon,
          map: map,
        })
        setMarker(newMarker)
      }
    }
  }, [map, center, marker])
  const handleBookmark = () => {
    if (!user.id) {
      if (confirm('로그인이 필요한 기능입니다. 로그인 하시겠습니까?')) {
        navigate('/login', { state: { returnUrl } })
      }
    } else {
      if (user.isAccountSetting === false) {
        if (confirm('계정 설정을 완료해야합니다. 설정 페이지로 이동하시겠습니까?')) {
          navigate(`/account_setting`, { state: { returnUrl } })
        } else {
          return
        }
      } else {
        const userId = user?.id
        const storeId = placeDetail?._id
        if (isBookmarked === true) {
          if (confirm('북마크를 해제하시겠습니까?')) {
            API.delete(`/bookmark/delete/${storeId}`, {
              headers: {
                user: userId,
              },
            })
              .then(res => {
                const data = res.data
                // console.log(data)
                setUserBookmark(prev => prev.filter(ubm => ubm?.store._id !== placeDetail?._id))
              })
              .catch(err => {
                toast.error(
                  <div className="Toastify__toast-body cursor-default">북마크 삭제 에러</div>,
                  {
                    position: 'top-center',
                  },
                )
              })
          }
        } else {
          if (confirm('북마크에 추가하시겠습니까?')) {
            API.post(`/bookmark/regist/${storeId}`, {
              headers: {
                user: userId,
              },
            })
              .then(res => {
                const data = res.data
                // console.log(data)
                setUserBookmark(prev => [...prev, data])
              })
              .catch(err => {
                toast.error(
                  <div className="Toastify__toast-body cursor-default">북마크 등록 에러</div>,
                  {
                    position: 'top-center',
                  },
                )
              })
          }
        }
      }
    }
  }
  const handleCopyClipBoard = async () => {
    let shareLink = rootLocation + `${location.pathname}`
    try {
      await navigator.clipboard.writeText(shareLink)
      toast.success(
        <div className="Toastify__toast-body cursor-default">링크를 복사했습니다.</div>,
        {
          position: 'top-center',
        },
      )
    } catch (err) {
      toast.error(<div className="Toastify__toast-body cursor-default">다시 시도해 주세요.</div>, {
        position: 'top-center',
      })
    }
  }

  return (
    <div>
      {isLoading === true ? (
        <div className="container max-w-5xl mx-auto text-center sm:min-h-screen">
          <p className="loading-jump">
            Loading
            <span className="jump-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </p>
        </div>
      ) : (
        <>
          <KakaoMaps />
          <div className="container md:max-w-5xl px-6 mx-auto p-3 m-3">
            <div className="flex items-center justify-between my-2">
              <h1 className="sm:text-3xl text-xl font-bold max-w-1/2">{placeDetail?.name}</h1>
              <div className="flex items-center gap-1">
                <div
                  className="flex items-center border-1 sm:py-2 sm:px-3 py-1 px-2 rounded-3xl hover:cursor-pointer"
                  onClick={handleBookmark}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={`${isBookmarked === true ? 'red' : 'none'}`}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`sm:size-5 size-4 transition-all duration-300 ${isBookmarked ? 'text-red-500 scale-120' : 'text-black/80 scale-100'}`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  <p className="font-bold sm:text-md text-sm">저장</p>
                </div>
                <div
                  className="flex items-center border-1 sm:py-2 sm:px-3 py-1 px-2 rounded-3xl hover:cursor-pointer"
                  onClick={handleCopyClipBoard}
                >
                  {linkCopied === false ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="sm:size-5 size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                  )}
                  <p className="font-bold sm:text-md text-sm">공유</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 max-sm:auto-rows-auto items-start justify-center mt-5">
              <div className="min-lg:pl-3 min-sm:aspect-[3/2] max-sm:aspect-[1/1] max-sm:pb-3">
                <div
                  id="map"
                  className="w-full h-full"
                ></div>
              </div>
              <div className="min-sm:row-span-2 px-2">
                <img
                  src={`${placeDetail?.photos?.[0] ? import.meta.env.VITE_API_BASE_URL + placeDetail?.photos?.[0] : Icon}`}
                  alt={`${placeDetail?.photos?.[0] ? 'photos' : 'Icon'}`}
                  className="sm:h-auto w-fit rounded-xl max-sm:mx-auto"
                  onError={e => {
                    e.target.src = Icon
                    e.target.onerror = null
                  }}
                />
              </div>
              <div className="sm:w-full my-2 max-sm:col-span-2 min-lg:ml-3">
                <div className="flex items-center gap-2 relative sm:text-md max-sm:text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="sm:size-6 size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                  <p>{placeDetail?.address}</p>
                </div>
                <div className="flex items-center gap-2 my-2 sm:text-md max-sm:text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="sm:size-6 size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                  <p>{placeDetail?.phone ? placeDetail.phone : '연락처 미제공'}</p>
                </div>
                <div className="flex items-center gap-2 my-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="sm:size-6 size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                  <div className="flex gap-2 sm:text-md max-sm:text-sm">
                    <Link>
                      <p>폐업 신고</p>
                    </Link>
                    <span>&#183;</span>
                    <Link>
                      <p>정보수정 제안</p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <RecommandPlace
              placeDetail={placeDetail}
              setLoading={setRecommandLoading}
              loading={recommandLoading}
            />
          </div>
          <PlaceReview />
        </>
      )}
    </div>
  )
}

export default ViewPlaceDetail