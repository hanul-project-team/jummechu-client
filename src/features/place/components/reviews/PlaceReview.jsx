import React, { useState, useEffect, useRef } from 'react'
import zustandStore from '../../../../app/zustandStore.js'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import Icon from '../../../../assets/images/icon.png'
import StarYellow from '../../../../assets/images/star-yellow.png'
import StarGray from '../../../../assets/images/star-gray.png'
import Rating from 'react-rating'
import ReviewChart from './ReviewChart.jsx'
import ReviewWriteForm from './ReviewWriteForm.jsx'
import SortDropdown from './sortButton/SortDropdown.jsx'

const PlaceReview = () => {
  const [showReviewMore, setShowReviewMore] = useState(5)
  const [openTabId, setOpenTabId] = useState(null)
  const [showSort, setShowSort] = useState(false)
  const [prevResult, setPrevResult] = useState(null)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const user = useSelector(state => state.auth.user)
  let count = showReviewMore
  const setReviewInfo = zustandStore(state => state.setReviewInfo)
  const reviewInfo = zustandStore(state => state.reviewInfo)
  const placeDetail = zustandStore(state => state.placeDetail)
  const navigate = useNavigate()
  const location = useLocation();
  const returnUrl = location.pathname + location?.search
  const [currentSort, setCurrentSort] = useState('none')

  const tabRefs = useRef([])

  useEffect(() => {
    const handleClickOutside = e => {
      const isOutside = tabRefs.current.every(ref => {
        return ref && !ref.contains(e.target)
      })
      if (isOutside) {
        setOpenTabId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    let sorted = [...reviewInfo]
    // console.log(sorted)
    switch (currentSort) {
      case 'none':
      default:
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'rating-high':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'rating-low':
        sorted.sort((a, b) => a.rating - b.rating)
        break
      case 'latest':
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'old':
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
    }
    setReviewInfo(sorted)

    const result = handleTotalRating(reviewInfo)
    if (typeof result == 'number' && prevResult !== result) {
      setPrevResult(result)
    }
  }, [currentSort, placeDetail])

  const handleReviewDate = createdAt => {
    const diff = new Date() - new Date(createdAt)
    const day = Math.round(diff / (1000 * 60 * 60 * 24))
    const minutes = Math.round(diff / (1000 * 60))
    if (day / 365 >= 1) {
      return <p>{Math.floor(day / 365)}년전</p>
    } else if (day / 30 >= 1) {
      return <p>{Math.floor(day / 30)}달전</p>
    } else if (day / 30 < 1) {
      if (day < 1) {
        if (minutes < 60) {
          return <p>{minutes}분 전</p>
        }
        return <p>{Math.floor(minutes / 60)}시간 전</p>
      }
      return <p>{day}일전</p>
    }
  }
  const handleratingText = reviews => {
    if (reviews.length < 1) {
      return <p>리뷰 데이터 없음</p>
    } else if (reviews.length > 0) {
      const total = reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length
      if (total > 4) {
        return <p>매우 만족!</p>
      } else if (total > 3) {
        return <p>만족</p>
      } else if (total > 2) {
        return <p>보통</p>
      } else if (total > 1) {
        return <p>불만족</p>
      } else if (total < 1) {
        return <p>매우 불만족</p>
      }
    }
  }
  const handleTotalRating = reviews => {
    if (reviews?.length > 0) {
      const result = reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length
      // console.log(result)
      const rounded = Math.round(result * 10) / 10
      return rounded
    } else {
      return 0
    }
  }
  const handleReviewshowReviewMore = () => {
    if (reviewInfo.length - showReviewMore > 5) {
      setShowReviewMore(prev => (prev += 5))
      count = count + 5
    } else if (reviewInfo.length - showReviewMore <= 5 && reviewInfo.length - showReviewMore > 0) {
      setShowReviewMore(prev => prev + (reviewInfo.length - prev))
      count = count + showReviewMore
    } else if (reviewInfo.length - showReviewMore === 0) {
      setShowReviewMore(5)
      count = showReviewMore
    }
  }
  const handleSortChange = sort => {
    if (currentSort !== sort) {
      setCurrentSort(sort)
      setShowSort(!showSort)
    } else if (currentSort == sort) {
      setCurrentSort('none')
      setShowSort(!showSort)
    }
  }
  const handleReviewWrite = () => {
    if (user.name?.length === 0) {
      if (confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니가?')) {
        navigate('/login', {state: {returnUrl}})
      }
    } else {
      setShowReviewForm(prev => !prev)
    }
  }
  const handleDeleteMyReview = rv => {
    const userId = user.id
    if (userId) {
      if (confirm('리뷰를 삭제하시겠습니까?')) {
        axios
          .delete(`http://localhost:3000/review/delete/${rv._id}`, {
            withCredentials: true,
            headers: {
              user: userId,
            },
          })
          .then(res => {
            // console.log('리뷰 삭제 정보', res)
            setReviewInfo(prev => prev.filter(review => review._id !== rv?._id))
          })
          .catch(err => {
            console.error('리뷰 삭제 실패 에러 발생', err)
          })
      }
    }
  }
  const handleShowUserTap = rv => {
    setOpenTabId(prev => (prev === rv._id ? null : rv._id))
  }
  // console.log(reviewInfo)
  return (
    <div>
      {/* 리뷰 헤더 영역 */}
      <div className="container max-w-full bg-gray-300 py-15">
        <div className="max-w-3/5 mx-auto text-center">
          <span className="text-2xl italic">고객 리뷰</span>
        </div>
        {/* 리뷰 통계 */}
        <div className="flex justify-between max-w-3/5 mx-auto items-center">
          <div>
            <p className="font-bold text-3xl">{handleTotalRating(reviewInfo)}</p>
            <div className="flex items-center">
              <div className="relative w-fit text-2xl leading-none my-2">
                <div className="text-color-gray-700">★★★★★</div>
                <div
                  className="absolute top-0 left-0 overflow-hidden text-yellow-400"
                  style={{ width: `${(handleTotalRating(reviewInfo) / 5) * 100 + '%'}` }}
                >
                  ★★★★★
                </div>
              </div>
            </div>
            {handleratingText(reviewInfo)}
            <p>
              총 <strong>{reviewInfo.length}</strong>분의 고객님이 리뷰를 남기셨습니다.
            </p>
            {/* 리뷰 작성 토글 버튼 */}
            <div className="flex gap-3 my-2">
              {/* <div
                className="underline font-bold hover:cursor-pointer"
                onClick={handleSeeAllReviews}
              >
                모든 리뷰
              </div> */}
              <div className="flex hover:cursor-pointer" onClick={handleReviewWrite}>
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
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
                <span>리뷰 작성</span>
              </div>
            </div>
          </div>
          <div className="w-1/3 h-fit">
            <ReviewChart reviews={reviewInfo} />
          </div>
        </div>
        {/* 리뷰 작성 폼 */}
        <div
          className={`transition transition-all duration-500 ease-in-out ${showReviewForm ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
        >
          <ReviewWriteForm
            user={user}
            placeDetail={placeDetail}
            setShowReviewForm={setShowReviewForm}
            setCurrentSort={setCurrentSort}
          />
        </div>
      </div>
      {/* 리뷰 보이는곳 */}
      <div className="container sm:max-w-3/5 max-w-5/6 mx-auto">
        {/* 정렬 버튼 */}
        {reviewInfo.length > 0 && (
          <div className="sm:max-w-4/5 max-w-full text-end mx-auto my-3 relative">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-full shadow hover:bg-blue-600 transition"
              onClick={() => setShowSort(!showSort)}
            >
              정렬
            </button>
            <SortDropdown handleSortChange={handleSortChange} showSort={showSort} />
          </div>
        )}
        {/* 리뷰 영역 */}
        <div>
          {reviewInfo.length > 0 ? (
            reviewInfo.slice(0, count).map((rv, i) => (
              <div
                key={i}
                className="sm:max-w-4/5 max-w-full border-1 border-gray-300 rounded-xl p-2 my-3 mx-auto flex items-center relative"
              >
                <div className="flex-2">
                  <img src={Icon} alt="icon" className="sm:max-h-[80px] max-h-[40px]" />
                  <p>{rv?.user.name}</p>
                  <div>
                    {/* <StarRatingComponent name="rating1" starCount={5} value={rv.rating} /> */}
                    <Rating
                      initialRating={rv.rating}
                      emptySymbol={<img src={StarGray} alt="gray-star" className="w-6 h-6" />}
                      fullSymbol={<img src={StarYellow} alt="yellow-star" className="w-6 h-6" />}
                      readonly={true}
                    />
                  </div>
                </div>
                <div className="flex-4">
                  {/* 날짜, 더보기 메뉴 */}
                  <div
                    className="text-end absolute right-2 flex items-center gap-3 top-0"
                    ref={el => (tabRefs.current[i] = el)}
                  >
                    <p>{rv?.createdAt.split('T')[0]}</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      onClick={() => handleShowUserTap(rv)}
                      className={`size-8 mt-1 relative sm:p-[2px] active:bg-gray-300 sm:hover:bg-color-gray-300 rounded-3xl`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
                    <div
                      className={`absolute top-10 flex flex-col gap-2 max-w-fit p-3 bg-white transition-all duration-200 ease-in-out z-50 border-1 border-gray-300 rounded-xl ${openTabId === rv._id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                    >
                      <button className="hover:cursor-pointer transition ease-in-out sm:text-sm text-xs rounded-2xl active:bg-gray-300 sm:active:bg-gray-500 sm:active:text-white sm:hover:bg-gray-300 p-2">
                        리뷰 신고하기
                      </button>
                      {rv?.user._id === user.id && (
                        <button
                          className="hover:cursor-pointer transition ease-in-out sm:px-3 sm:text-sm text-xs px-2 py-1 border-1 rounded-2xl sm:bg-red-600 sm:active:bg-red-700 text-white"
                          onClick={e => {
                            e.stopPropagation()
                            handleDeleteMyReview(rv)
                          }}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="indent-2">{rv.comment}</p>
                  </div>
                  <div className="absolute right-2 bottom-0 pb-1">
                    {handleReviewDate(rv?.createdAt)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-2">
              <p>리뷰 정보가 존재하지 않습니다. 첫 리뷰를 작성해보세요!</p>
            </div>
          )}
        </div>
        {/* 더보기 버튼 */}
        {reviewInfo.length > 0 && (
          <div className="mx-auto max-w-fit my-2">
            <button
              type="button"
              className={`${reviewInfo.length <= 5 ? 'hidden' : 'hover:cursor-pointer active:bg-gray-400 bg-gray-300 rounded-3xl p-2 my-1'}`}
              onClick={handleReviewshowReviewMore}
            >
              {reviewInfo.length - showReviewMore > 5
                ? '5개 더보기'
                : reviewInfo.length - showReviewMore <= 5 && reviewInfo.length - showReviewMore > 0
                  ? reviewInfo.length - count + '개 더보기'
                  : reviewInfo.length > 5 && showReviewMore - reviewInfo.length === 0 && '접기'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaceReview
