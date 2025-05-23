import React, { useState, useEffect } from 'react'
import usePlaceStore from '../../../../../store/usePlaceStore.js'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../../../../assets/images/icon.png'
import StarRatingComponent from 'react-star-rating-component'
import ReviewChart from './ReviewChart.jsx'

const PlaceReview = ({ reportRate }) => {
  const [showMore, setShowMore] = useState(5)
  const [isUser, setIsUser] = useState(false)
  const [prevResult, setPrevResult] = useState(null);
  const user = useSelector(state => state.auth.user)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  let count = showMore
  let MIN_LENGTH = 10
  const reviewInfo = usePlaceStore(state => state.reviewInfo)
  const placeDetail = usePlaceStore(state => state.placeDetail)
  const navigate = useNavigate()
  const [starRating, setStarRating] = useState(0)
  const [formData, setFormData] = useState({
    user: user?.id,
    comment: '',
    rating: 0,
  })

  // console.log(placeDetail)
  // model에 review 추천 시스템 추가 필요

  {
    /* 임시데이터 */
  }
  const reviews = [
    {
      user: '홍길동',
      comment:
        '부모님과 형님을 모시고 첫 월급을 받은 기념으로 다녀오게 되었습니다. 분위기가 좋고 가족끼리 식사하기 좋은 장소입니다. 다만 그만큼 사람이 붐벼 복잡하기도 합니다.',
      rating: 5,
      createdAt: new Date('2025-05-14'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '심청',
      comment:
        '앞이 안보이시는 아버지를 모시고 식사를 하러 왔습니다. 직원들이 친절하고 빠른 응대를 해준 덕분에 아버지께서도 만족하시고 돌아오셨어요. 정말 추천합니다.',
      rating: 5,
      createdAt: new Date('2025-04-17'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 1,
      createdAt: new Date('2025-03-02'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 4,
      createdAt: new Date('2025-02-24'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 5,
      createdAt: new Date('2025-04-09'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 2,
      createdAt: new Date('2024-11-16'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 5,
      createdAt: new Date('2025-01-13'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 3,
      createdAt: new Date('2025-05-05'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 2,
      createdAt: new Date('2025-03-27'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 4,
      createdAt: new Date('2025-05-19'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 2,
      createdAt: new Date('2025-02-14'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 4,
      createdAt: new Date('2025-02-13'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 4,
      createdAt: new Date('2024-12-04'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 5,
      createdAt: new Date('2024-12-19'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 5,
      createdAt: new Date('2025-04-07'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 4,
      createdAt: new Date('2025-1-30'),
      store: placeDetail.place_name,
      isExternal: false,
    },
    {
      user: '신사임당',
      comment:
        '아이들이 소란스러워 걱정이었는데 작은 객실 형태의 식사공간이 따로 준비되어 있어 그곳을 이용했습니다. 다만 이용하려면 예약이 필수라서 사전에 동행인들과 상의를 해야하겠습니다.',
      rating: 3,
      createdAt: new Date('2025-03-03'),
      store: placeDetail.place_name,
      isExternal: false,
    },
  ]

  const [initialItems, setInitialItems] = useState(reviews)
  const [currentSort, setCurrentSort] = useState('none')

  useEffect(() => {
    if (user) {
      setIsUser(true)
    } else {
      setIsUser(false)
    }

    let sorted = [...initialItems]
    // console.log(sorted)
    switch (currentSort) {
      case 'none':
      default:
        sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      // case 'recommand':
      //   sorted.sort((a, b) => a.recommand - b.recommand)
      //   break
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
    setInitialItems(sorted)

    const result = handleTotalRating(reviews)
    if(typeof result == 'number' && prevResult !== result) {
      setPrevResult(result)
      reportRate(result)
    }
  }, [currentSort, isUser])

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
    const total = reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length
    if (total > 4) {
      return <p>매우 만족!</p>
    } else if (total > 3) {
      return <p>만족</p>
    } else if (total > 2) {
      return <p>보통</p>
    } else if (total > 1) {
      return <p>불만족</p>
    } else {
      return <p>매우 불만족</p>
    }
  }
  const handleTotalRating = reviews => {
    const result = reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length
    const rounded = Math.round(result * 10) / 10
    return rounded
  }
  const handleReviewWrite = () => {
    if (isUser === false) {
      if (confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니가?')) {
        navigate('/login')
      }
    } else {
      setShowReviewForm(prev => !prev)
      setStarRating(0)
    }
  }
  const handleReviewShowMore = () => {
    if (reviews.length - showMore > 5) {
      setShowMore(prev => (prev += 5))
      count = count + 5
    } else if (reviews.length - showMore <= 5 && reviews.length - showMore > 0) {
      setShowMore(prev => prev + (reviews.length - prev))
      count = count + showMore
    } else if (reviews.length - showMore === 0) {
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
    console.log('리뷰 남기기')
    console.log(formData)
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

  return (
    <div>
      <div className="container max-w-full bg-gray-300 py-15">
        <div className="max-w-3/5 mx-auto text-center">
          <span className="text-2xl italic">고객 리뷰</span>
        </div>
        <div className="flex justify-between max-w-3/5 mx-auto items-center">
          <div>
            <p className="font-bold text-3xl">{handleTotalRating(reviews)}</p>
            <StarRatingComponent name="rating1" starCount={5} value={handleTotalRating(reviews)} />
            {handleratingText(reviews)}
            <p>
              총 <strong>{reviews.length}</strong>분의 고객님이 리뷰를 남기셨습니다.
            </p>
            <div className="flex gap-3 my-2">
              <Link to="#" className="underline font-bold">
                모든 리뷰
              </Link>
              <div className="flex mouse_pointer" onClick={handleReviewWrite}>
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
            <ReviewChart reviews={reviews} />
          </div>
        </div>
        {showReviewForm === true ? (
          <div className="max-w-3/5 mx-auto">
            <form onSubmit={handleSubmit} className="w-fit mx-auto p-2 text-center">
              <div className="text-start my-1 bg-white p-2 w-fit rounded-3xl">
                <span>작성자:</span>
                <span>{user.name}</span>
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
              <div className="flex justify-between">
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
                    className="bg-red-400 mouse_pointer px-2 py-1 rounded-xl text-white mr-2"
                    onClick={handleReviewWrite}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="mouse_pointer border-1 active:bg-gray-500 active:text-white rounded-xl px-2 py-1"
                  >
                    작성
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : null}
      </div>
      <div className="container max-w-3/5 mx-auto">
        {/* 정렬 버튼 */}
        <div className="max-w-4/5 flex gap-3 mx-auto my-3">
          <button
            className="bg-gray-300 p-2 rounded-3xl mouse_pointer"
            onClick={() => handleSortChange('recommand')}
          >
            추천순
          </button>
          <button
            className="bg-gray-300 p-2 rounded-3xl mouse_pointer"
            onClick={() => handleSortChange('latest')}
          >
            최신순
          </button>
          <button
            className="bg-gray-300 p-2 rounded-3xl mouse_pointer"
            onClick={() => handleSortChange('old')}
          >
            오래된순
          </button>
          <button
            className="bg-gray-300 p-2 rounded-3xl mouse_pointer"
            onClick={() => handleSortChange('rating-high')}
          >
            별점높은순
          </button>
          <button
            className="bg-gray-300 p-2 rounded-3xl mouse_pointer"
            onClick={() => handleSortChange('rating-low')}
          >
            별점낮은순
          </button>
        </div>
        <div>
          {initialItems &&
            showMore &&
            initialItems.slice(0, count).map((rv, i) => (
              <div
                key={i}
                className="max-w-4/5 border-1 border-gray-300 rounded-xl p-2 my-3 mx-auto flex items-center"
              >
                <div className="flex-2">
                  <img src={Icon} alt="icon" className="md:max-h-[60px] sm:max-h-[40px]" />
                  <p>{rv.user}</p>
                  <div>
                    <p>작성일: {rv.createdAt.toLocaleDateString()}</p>
                    {handleReviewDate(rv.createdAt)}
                    <StarRatingComponent name="rating1" starCount={5} value={rv.rating} />
                  </div>
                </div>
                <div className="flex-4">
                  <p className="indent-2">{rv.comment}</p>
                  <p className="text-xl">{i + 1}번</p>
                </div>
              </div>
            ))}
        </div>
        <div className="mx-auto max-w-fit my-2">
          <button
            type="button"
            className="mouse_pointer active:bg-gray-400 bg-gray-300 rounded-3xl p-2 my-1"
            onClick={handleReviewShowMore}
          >
            {reviews.length - showMore > 5
              ? '5개 더보기'
              : reviews.length - showMore <= 5 && reviews.length - showMore > 0
                ? reviews.length - count + '개 더보기'
                : showMore - reviews.length === 0 && '접기'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaceReview
