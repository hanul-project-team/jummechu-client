import React from 'react'
import usePlaceStore from '../../../store/usePlaceStore'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../../assets/images/icon.png'
import StarRatingComponent from 'react-star-rating-component'

const PlaceReview = () => {
  const reviewInfo = usePlaceStore(state => state.reviewInfo)
  const placeDetail = usePlaceStore(state => state.placeDetail)
  const navigate = useNavigate()
  //   console.log(reviewInfo)
  //   console.log(placeDetail)

  const reviews = [
    {
      writer: '홍길동',
      title: '의적활동을 그만두게 만드는 맛',
      content:
        '부모님과 형님을 모시고 첫 월급을 받은 기념으로 다녀오게 되었습니다. 분위기가 좋고 가족끼리 식사하기 좋은 장소입니다. 다만 그만큼 사람이 붐벼 복잡하기도 합니다.',
      rate: 3,
      createdAt: new Date('2025-05-14'),
    },
    {
      writer: '심청',
      title: '공양미 300석만큼 맛있어요',
      content:
        '앞이 안보이시는 아버지를 모시고 식사를 하러 왔습니다. 직원들이 친절하고 빠른 응대를 해준 덕분에 아버지께서도 만족하시고 돌아오셨어요. 정말 추천합니다.',
      rate: 5,
      createdAt: new Date('2025-04-17'),
    },
  ]

  const handleReviewDate = createdAt => {
    const diff = new Date() - createdAt
    const day = Math.round(diff / (1000 * 60 * 60 * 24))
    if (day / 365 >= 1) {
      return <p>{Math.floor(day / 365)}년전 작성</p>
    } else if (day / 30 >= 1) {
      return <p>{Math.floor(day / 30)}달전 작성</p>
    } else {
      return <p>{day}일전 작성</p>
    }
  }
  const handleRateText = reviews => {
    const total = reviews.reduce((acc, cur) => acc + cur.rate, 0) / reviews.length
    if (total > 4) {
      return <p>매우 좋음!</p>
    } else if (total > 3) {
      return <p>좋음!</p>
    } else if (total > 2) {
      return <p>보통</p>
    } else if (total > 1) {
      return <p>그저 그럼</p>
    } else {
      return <p>추천하지 않음</p>
    }
  }
  const handleTotalRate = reviews => {
    return reviews.reduce((acc, cur) => acc + cur.rate, 0) / reviews.length
  }
  const handleReviewWrite = () => {
    console.log('리뷰 작성하러 가기')
    // navigate(``)
  }

  // console.log(reviews)
  return (
    <div>
      <div className="container max-w-full bg-gray-300 py-15">
        <div className="flex justify-between max-w-3/5 mx-auto items-center">
          <div className="text-2xl italic">
            <span>리뷰</span>
          </div>
          <div className="flex gap-3">
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
              <button>리뷰 작성</button>
            </div>
          </div>
        </div>
        <div className="flex justify-between max-w-3/5 mx-auto items-center">
          <div>
            <p className="font-bold text-3xl">{handleTotalRate(reviews)}</p>
            {handleRateText(reviews)}
          </div>
        </div>
      </div>
      <div className="container max-w-3/5 mx-auto">
        {reviews &&
          reviews.map((rv, i) => (
            <div
              key={i}
              className="max-w-4/5 border-1 border-gray-300 rounded-xl p-2 my-3 mx-auto flex items-center"
            >
              <div className="flex-2">
                <img src={Icon} alt="icon" className="md:max-h-[60px] sm:max-h-[40px]" />
                <p>{rv.writer}</p>
                <div>
                  <p>작성일: {rv.createdAt.toLocaleDateString()}</p>
                  {handleReviewDate(rv.createdAt)}
                  <StarRatingComponent name="rate1" starCount={5} value={rv.rate} />
                </div>
              </div>
              <div className="flex-4">
                <p className="text-xl font-bold">{rv.title}</p>
                <p className="indent-2">{rv.content}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default PlaceReview
