import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../assets/images/icon.png'
import '../../assets/styles/global.css'
import axios from 'axios'
import zustandStore from '../../app/zustandStore.js'
import zustandUser from '../../app/zustandUser.js'
import { useSelector } from 'react-redux'
import PlaceReview from './components/reviews/PlaceReview.jsx'
import KakaoMaps from '../../shared/kakaoMapsApi/KakaoMaps.jsx'
import RecommandPlace from './components/RecommandPlace.jsx'

const ViewPlaceDetail = ({ defaultBoomarked = false }) => {
  const [isBookmarked, setIsBookmarked] = useState(defaultBoomarked)
  const setReviewInfo = zustandStore(state => state.setReviewInfo)
  const reviewInfo = zustandStore(state => state.reviewInfo)
  const placeDetail = zustandStore(state => state.placeDetail)
  const navigate = useNavigate()

  const setSearchNearData = zustandStore(state => state.setSearchNearData)
  const searchNearData = zustandStore(state => state.searchNearData)
  const lastStoreRef = useRef(placeDetail?._id)
  const user = useSelector(state => state.auth.user)
  const userBookmark = zustandUser(state => state.userBookmark)
  // console.log(user)
  // console.log(placeDetail)

  useEffect(() => {
    if (placeDetail !== null || placeDetail !== undefined) {
      const storeId = placeDetail._id
      const isDifferentStore = lastStoreRef.current !== placeDetail._id
      if (lastStoreRef.current === storeId) {
        return
      }
      if (isDifferentStore) {
        try {
          Promise.all([
            axios.get(`http://localhost:3000/review/read/${placeDetail._id}`),
            // axios.post(`http://localhost:3000/api/kakao/search/${placeDetail._id}`, {
            //   headers: {
            //     lat: placeDetail.latitude,
            //     lng: placeDetail.longitude,
            //   },
            // }),
          ]).then(([revRes /* , searchRes */]) => {
            if (revRes.statusText === 'OK' || revRes.status === 200) {
              const data = revRes.data
              // console.log(data)
              setReviewInfo(data)
            } else if (revRes.status === 204) {
              setReviewInfo([])
            }
            // if (searchRes.statusText === 'OK' || searchRes.status === 200) {
            //   const data = searchRes.data
            //   // console.log(data)
            //   setSearchNearData(data)
            // }
            lastStoreRef.current = storeId
          })
        } catch (err) {
          console.log(err)
        }
      }
    }
  }, [isBookmarked, placeDetail])

  const handleBookmark = () => {
    if (user.role === 'guest') {
      if (confirm('로그인이 필요한 기능입니다. 로그인 하시겠습니까?')) {
        navigate('/login')
      }
    } else if (user?.role === 'member') {
      const userId = user?.id
      const storeId = placeDetail?._id
      if (isBookmarked === true) {
        if (confirm('북마크를 해제하시겠습니까?')) {
          axios
            .delete(`http://localhost:3000/bookmark/delete/${storeId}`, {
              withCredentials: true,
              headers: {
                user: userId,
              },
            })
            .then(res => {
              const data = res
              // console.log(data)
              setIsBookmarked(prev => !prev)
            })
            .catch(err => {
              console.error('북마크 해제 요청 실패!', err)
            })
        }
      } else {
        if (confirm('북마크에 추가하시겠습니까?')) {
          axios
            .post(`http://localhost:3000/bookmark/regist/${storeId}`, {
              withCredentials: true,
              headers: {
                user: userId,
              },
            })
            .then(res => {
              const data = res
              // console.log(data)
              setIsBookmarked(prev => !prev)
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
  const totalRate = reviewInfo ? handleTotalRating(reviewInfo) : 0
  return (
    <div>
      <KakaoMaps />
      <div className="container md:max-w-3/5 mx-auto p-3 m-3">
        {/* 타이틀 & 북마크 영역 */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{placeDetail.name}</h1>
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
        </div>
        <div>
          <img src={Icon} alt="place_image" className="w-full h-[300px]" />
        </div>
        {/* 별점 */}
        <div className="flex items-center">
          <div className="relative w-fit text-2xl leading-none my-2">
            <div className="text-gray-300">★★★★★</div>
            <div
              className="absolute top-0 left-0 overflow-hidden text-yellow-400"
              style={{ width: `${(totalRate / 5) * 100 + '%'}` }}
            >
              ★★★★★
            </div>
          </div>
          <p className="ml-1 pt-1 text-xl text-gray-700 leading-tight">{totalRate}</p>
        </div>
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
          {/* 지도pin 아이콘 */}
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
        {/* 다른 장소 추천 */}
        <RecommandPlace placeDetail={placeDetail} />
      </div>
      <PlaceReview />
    </div>
  )
}

export default ViewPlaceDetail
