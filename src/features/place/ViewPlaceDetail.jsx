import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Icon from '../../assets/images/icon.png'
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

  // console.log(placeDetail.keywords)
  /* 정보 호출 및 갱신 */
  useEffect(() => {
    if (placeDetail !== null && placeDetail !== undefined) {
      const storeId = placeDetail._id
      const isDifferentStore = lastStoreRef.current !== placeDetail._id
      if (lastStoreRef.current === storeId) {
        return
      }
      const renewReviewInfo = lastReviewRef.current !== reviewInfo
      if (isDifferentStore || renewReviewInfo) {
        try {
          Promise.all([
            API.get(`/review/read/store/${placeDetail._id}`),
            API.post(`/api/kakao/search/${placeDetail._id}`, {
              headers: {
                lat: placeDetail.latitude,
                lng: placeDetail.longitude,
              },
            }),
          ]).then(([revRes, searchRes]) => {
            if (revRes.statusText === 'OK' || revRes.status === 200) {
              const data = revRes.data
              // console.log(data)
              setReviewInfo(data)
            } else if (revRes.status === 204) {
              setReviewInfo([])
            }
            if (searchRes.statusText === 'OK' || searchRes.status === 200) {
              const data = searchRes.data
              // console.log(data)
              if (data?.length > 0) {
                setRecommandLoading(true)
                API.post('/store/save', data)
                  .then(res => {
                    const nearPlaces = res.data
                    // console.log(nearPlaces)
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

  /* placeDetail이 없을시 불러오는 코드 */
  useEffect(() => {
    if (placeDetail?.length < 1) {
      const placeLink = location.pathname
      const placeId = placeLink.split('/')[2]
      API.get(`/store/read/${placeId}`)
        .then(res => {
          const data = res.data
          setPlaceDetail(data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [location.pathname, placeDetail, setPlaceDetail])
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
      } else {
        console.warn('마커 삭제. setMap이 유효하지 않음.')
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
  // console.log(center.lat, center.lng)
  const handleBookmark = () => {
    if (!user.role) {
      if (confirm('로그인이 필요한 기능입니다. 로그인 하시겠습니까?')) {
        navigate('/login')
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
              setUserBookmark(prev => prev.filter(ubm => ubm?.store._id !== placeDetail._id))
            })
            .catch(err => {
              console.error('북마크 해제 요청 실패!', err)
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
              console.error('북마크 등록 요청 실패!', err)
            })
        }
      }
    }
  }
  const handleTotalRating = data => {
    if (data.length > 0) {
      const result = data.reduce((acc, cur) => acc + cur.rating, 0) / data.length
      const rounded = Math.round(result * 10) / 10
      return rounded
    } else {
      return 0
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
  const totalRate = reviewInfo ? handleTotalRating(reviewInfo) : 0
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
            {/* 타이틀 & 북마크 영역 */}
            <div className="flex items-center justify-between my-2">
              <h1 className="text-3xl font-bold">{placeDetail.name}</h1>
              <div className="flex items-center gap-1">
                {/* 북마크 */}
                <div
                  className="flex border-1 py-2 px-3 rounded-3xl hover:cursor-pointer"
                  onClick={handleBookmark}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill={`${isBookmarked === true ? 'red' : 'none'}`}
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`size-6 transition-all duration-300 ${isBookmarked ? 'text-red-500 scale-120' : 'text-black/80 scale-100'}`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  {/* 북마크 하트 아이콘 */}
                  <p className="font-bold">저장</p>
                </div>
                {/* 링크 공유 */}
                <div
                  className="flex border-1 py-2 px-3 rounded-3xl hover:cursor-pointer"
                  onClick={handleCopyClipBoard}
                >
                  {linkCopied === false ? (
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
                  <p className="font-bold">공유</p>
                </div>
              </div>
            </div>
            <div>
              <img
                src={placeDetail.photos?.length > 0 ? placeDetail.photos[0] : Icon}
                alt={`${placeDetail.photos?.length > 0 ? 'photos' : 'Icon'}`}
                className="w-full h-[300px] rounded-xl"
              />
            </div>
            {/* 가게 정보란 */}
            <div className="flex items-start justify-between">
              {/* 상세정보 */}
              <div>
                {/* 주소지 */}
                <div className="flex gap-2 relative my-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
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
                  <p>{placeDetail.address}</p>
                </div>
                {/* 전화 */}
                <div className="flex gap-2 my-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                  <p>{placeDetail?.phone ? placeDetail.phone : '연락처 미제공'}</p>
                </div>
                {/* 문의? */}
                <div className="flex gap-2 my-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                  <div className="flex gap-2">
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
              {/* 지도 */}
              <div id="map" style={{ width: '500px', height: '400px' }}></div>
            </div>
            {/* 다른 장소 추천 */}
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
