import React, { useState, useEffect } from 'react'
import zustandStore from '../../../app/zustandStore.js'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Icon from '../../../assets/images/icon.png'
import StarRatingComponent from 'react-star-rating-component'
import ReviewChart from './ReviewChart.jsx'
import axios from 'axios'

const PlaceReview = () => {
  const [showMore, setShowMore] = useState(5)
  const [isUser, setIsUser] = useState(false)
  const [prevResult, setPrevResult] = useState(null)
  const user = useSelector(state => state.auth.user)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  let count = showMore
  let MIN_LENGTH = 10
  const setReviewInfo  = zustandStore(state => state.setReviewInfo)
  const reviewInfo = zustandStore(state => state.reviewInfo)
  const placeDetail = zustandStore(state => state.placeDetail)
  const navigate = useNavigate()
  const [starRating, setStarRating] = useState(0)
  const [formData, setFormData] = useState({
    user: '',
    comment: '',
    rating: 1,
    store: '',
  })

  const [currentSort, setCurrentSort] = useState('none')

  useEffect(() => {
    if (user) {
      setIsUser(true)
    } else {
      setIsUser(false)
    }

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
  }, [currentSort, isUser, placeDetail])

  const handleReviewDate = createdAt => {
    const diff = new Date() - createdAt
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
  const handleReviewWrite = () => {
    if (isUser === false) {
      if (confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니가?')) {
        navigate('/login')
      }
    } else {
      setShowReviewForm(prev => !prev)
      setFormData({
        user: '',
        comment: '',
        rating: 1,
        store: '',
      })
      setStarRating(0)
    }
  }
  const handleReviewShowMore = () => {
    if (reviewInfo.length - showMore > 5) {
      setShowMore(prev => (prev += 5))
      count = count + 5
    } else if (reviewInfo.length - showMore <= 5 && reviewInfo.length - showMore > 0) {
      setShowMore(prev => prev + (reviewInfo.length - prev))
      count = count + showMore
    } else if (reviewInfo.length - showMore === 0) {
      setShowMore(5)
      count = showMore
    }
  }
  const handleSortChange = sort => {
    if (currentSort !== sort) {
      setCurrentSort(sort)
    } else if (currentSort == sort) {
      setCurrentSort('none')
    }
  }
  const handleSubmit = e => {
    e.preventDefault()
    if (user?.id && placeDetail?._id) {
      const updatedFormData = {
        ...formData,
        user: user.id,
        store: placeDetail._id,
      }
      // console.log(updatedFormData)
      try {
        axios
          .post('http://localhost:3000/review/regist', updatedFormData, {
            withCredentials: true,
          })
          .then(res => {
            // console.log(res)
            if (res.status === 201) {
              alert('리뷰가 작성되었습니다.')
              setFormData({
                ...formData,
                rating: 1,
                comment: '',
              })
              setShowReviewForm(prev => !prev)
              setReviewInfo(res.data.data)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } catch (err) {
        console.log(err)
      }
    }
  }
  const handleChange = e => {
    if (e.target.value.length === 0) {
      setErrorMessage('내용을 입력해주세요.')
    } else if (e.target.value.length < MIN_LENGTH) {
      setErrorMessage(`최소 ${MIN_LENGTH}자 이상 입력해주세요. (현재 ${e.target.value.length}자)`)
    } else {
      setErrorMessage('')
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const onStarClick = (nextValue, prevValue, name) => {
    setStarRating(nextValue)
    setFormData({
      ...formData,
      rating: nextValue,
    })
  }
  const handleSeeAllReviews = () => {
    setShowMore(reviewInfo.length)
  }
  // console.log(reviewTrigger)
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
            <StarRatingComponent
              name="rating1"
              starCount={5}
              value={handleTotalRating(reviewInfo)}
            />
            {handleratingText(reviewInfo)}
            <p>
              총 <strong>{reviewInfo.length}</strong>분의 고객님이 리뷰를 남기셨습니다.
            </p>
            {/* 리뷰 작성 토글 버튼 */}
            <div className="flex gap-3 my-2">
              <div className="underline font-bold hover:cursor-pointer" onClick={handleSeeAllReviews}>
                모든 리뷰
              </div>
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
        {showReviewForm === true ? (
          <div className="max-w-3/5 mx-auto">
            <form onSubmit={handleSubmit} className="w-fit mx-auto p-2 text-center">
              <div className="text-start my-1 bg-white p-2 w-fit rounded-3xl">
                <span>작성자:{user.name}</span>
              </div>
              {/* 이하 textarea */}
              <div>
                <textarea
                  type="text"
                  name="comment"
                  onChange={handleChange}
                  value={formData.comment}
                  rows={5}
                  cols={50}
                  className={`bg-white indent-1 max-h-auto max-w-fit min-w-1/5 resize-none mt-1 block w-full border rounded-md shadow-sm p-2 resize-none
            ${errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
            focus:border-blue-500 focus:outline-none focus:ring-1`}
                />
                {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
              </div>
              <div className="flex justify-between my-2">
                {/* 이하 별점 매기기 */}
                <div>
                  <StarRatingComponent
                    name="rating"
                    starCount={5}
                    onStarClick={onStarClick}
                    value={starRating}
                    renderStarIcon={(nextValue, prevValue, name) => {
                      return <span>&#9733;</span>
                    }}
                    starColor="#ffb400"
                    emptyStarColor="gray"
                    className="text-xl"
                  />
                </div>
                {/* 이하 버튼 */}
                <div>
                  <button
                    type="button"
                    className="bg-red-400 hover:cursor-pointer px-2 py-1 rounded-xl text-white mr-2"
                    onClick={handleReviewWrite}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="hover:cursor-pointer border-1 active:bg-gray-500 active:text-white rounded-xl px-2 py-1"
                  >
                    작성
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : null}
      </div>
      {/* 리뷰 보이는곳 */}
      <div className="container max-w-3/5 mx-auto">
        {/* 정렬 버튼 */}
        {reviewInfo.length > 0 && (
          <div className="max-w-4/5 flex gap-3 mx-auto my-3">
            <button
              className="bg-gray-300 p-2 rounded-3xl hover:cursor-pointer"
              onClick={() => handleSortChange('recommand')}
            >
              추천순
            </button>
            <button
              className="bg-gray-300 p-2 rounded-3xl hover:cursor-pointer"
              onClick={() => handleSortChange('latest')}
            >
              최신순
            </button>
            <button
              className="bg-gray-300 p-2 rounded-3xl hover:cursor-pointer"
              onClick={() => handleSortChange('old')}
            >
              오래된순
            </button>
            <button
              className="bg-gray-300 p-2 rounded-3xl hover:cursor-pointer"
              onClick={() => handleSortChange('rating-high')}
            >
              별점높은순
            </button>
            <button
              className="bg-gray-300 p-2 rounded-3xl hover:cursor-pointer"
              onClick={() => handleSortChange('rating-low')}
            >
              별점낮은순
            </button>
          </div>
        )}
        {/* 리뷰 영역 */}
        <div>
          {reviewInfo.length > 0 ? (
            reviewInfo.slice(0, count).map((rv, i) => (
              <div
                key={i}
                className="max-w-4/5 border-1 border-gray-300 rounded-xl p-2 my-3 mx-auto flex items-center"
              >
                <div className="flex-2">
                  <img src={Icon} alt="icon" className="md:max-h-[60px] sm:max-h-[40px]" />
                  <p>{rv.user.name}</p>
                  <div>
                    <p>작성일: {rv.createdAt.split('T')[0]}</p>
                    {handleReviewDate(rv.createdAt)}
                    <StarRatingComponent name="rating1" starCount={5} value={rv.rating} />
                  </div>
                </div>
                <div className="flex-4">
                  <p className="indent-2">{rv.comment}</p>
                  {/* <p className="text-xl">{i + 1}번</p> */}
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
              onClick={handleReviewShowMore}
            >
              {reviewInfo.length - showMore > 5
                ? '5개 더보기'
                : reviewInfo.length - showMore <= 5 && reviewInfo.length - showMore > 0
                  ? reviewInfo.length - count + '개 더보기'
                  : reviewInfo.length > 5 && showMore - reviewInfo.length === 0 && '접기'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlaceReview
