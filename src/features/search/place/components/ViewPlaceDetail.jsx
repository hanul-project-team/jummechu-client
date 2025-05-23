import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../../../assets/images/icon.png'
import '../../../../assets/styles/global.css'
import usePlaceStore from '../../../../store/usePlaceStore.js'
import 'swiper/css'
import PlaceReview from './reviews/PlaceReview.jsx'

const ViewPlaceDetail = ({ defaultBoomarked }) => {
  const [isBookmarked, setIsBookmarked] = useState(defaultBoomarked)
  const [childRate, setChildRate] = useState(0)
  const [category, setCategory] = useState([])
  const [showAddress, setShowAddress] = useState(false)
  const setReviewInfo = usePlaceStore(state => state.setReviewInfo)
  const placeDetail = usePlaceStore(state => state.placeDetail)
  const [score, setScore] = useState(null)

  const searchData = usePlaceStore(state => state.searchData)

  const rateRef = useRef()
  // console.log(score)
  const toggleAddress = () => {
    setShowAddress(prev => !prev)
  }

  useEffect(() => {
    let cate
    if ((placeDetail !== null) | (placeDetail !== undefined)) {
      const categories = placeDetail?.category_name?.split('>')
      if (categories?.length > 0) {
        cate = categories.slice(1)
      }
      setCategory(cate)
      if (placeDetail?.reivew) {
        setReviewInfo(placeDetail.review ?? [])
      }
    }
    const preScore = rateRef.current.dataset.score
    setScore(preScore)
  }, [isBookmarked, placeDetail, rateRef])

  const handleBookmark = () => {
    if (isBookmarked === true) {
      if (confirm('북마크를 해제하시겠습니까?')) {
        setIsBookmarked(prev => !prev)
      }
    } else {
      if (confirm('북마크에 추가하시겠습니까?')) {
        setIsBookmarked(prev => !prev)
      }
    }
  }
  // console.log(searchData)
  // console.log(placeDetail)
  return (
    <div>
      <div className="container md:max-w-3/5 mx-auto p-3 m-3">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{placeDetail.place_name}</h1>
          {/* 북마크 */}
          <div
            className="flex border-1 py-2 px-3 rounded-3xl mouse_pointer"
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
          <div
            className="relative w-fit text-2xl leading-none my-2"
            data-score={placeDetail.rate ? placeDetail.rate : childRate}
            ref={rateRef}
          >
            <div className="text-gray-300">★★★★★</div>
            <div
              className="absolute top-0 left-0 overflow-hidden text-yellow-400"
              style={{ width: `${(score / 5) * 100 + '%'}` }}
            >
              ★★★★★
            </div>
          </div>
          <p className="ml-1 pt-1 text-xl text-gray-700 leading-tight">{score}</p>
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
          <p>{placeDetail.road_address_name}</p>
          <div className="ml-2">
            <button
              type="button"
              className="mouse_pointer text-gray-400 flex"
              onClick={toggleAddress}
            >
              지번
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
              {/* 아랫 꺽쇠 아이콘 */}
            </button>
            {showAddress === true && (
              <div className="absolute z-20 md:min-w-fit left-40 mt-2 px-3 py-2 rounded-md bg-gray-100 text-sm text-gray-700 shadow transition-all duration-300">
                {placeDetail.address_name}
              </div>
            )}
          </div>
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
        {/* 다른 장소 추천(현재: 검색 결과중 해당 장소 이외의 장소들) */}
        <div className="max-w-full my-5 min-h-[200px]">
          <div className="flex justify-between">
            <p className="font-bold text-lg font-serif">다른 장소도 둘러보세요!</p>
            <Link to="#">
              <span>더보기</span>
            </Link>
          </div>
          {searchData && (
            <div className="border-t-1 border-gray-700 flex">
              {searchData
                .filter(sd => sd.id !== placeDetail.id)
                .slice(0, 4)
                .map((sd, i) => {
                  return (
                    <div key={i} className="flex-1 gap-3 p-2 text-center">
                      <Link to={`/place/${sd.id}`} state={sd}>
                        <img src={Icon} alt="icon" className="w-[100px] h-[100px] mx-auto" />
                      </Link>
                      <div>
                        <Link to={`/place/${sd.id}`} state={sd}>
                          <p>{sd.place_name}</p>
                        </Link>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>
      <PlaceReview reportRate={setChildRate} />
    </div>
  )
}

export default ViewPlaceDetail
