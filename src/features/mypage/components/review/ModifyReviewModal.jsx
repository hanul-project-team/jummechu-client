import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Icon from '../../../../assets/images/icon.png'
import StarGray from '../../../../assets/images/star-gray.png'
import StarYellow from '../../../../assets/images/star-yellow.png'
import { toast } from 'react-toastify'
import Rating from 'react-rating'

const ModifyReviewModal = ({ user, review, setModifyReviewId, setMyReviews }) => {
  const [formData, setFormData] = useState({
    comment: review?.comment,
    rating: review?.rating,
  })
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const reviewRef = useRef({
    comment: review?.comment,
    rating: review?.rating,
  })
  /* 리뷰 수정 최소 제한 */
  useEffect(() => {
    if (formData.comment?.length > 6 && formData.rating > 0) {
      setReadyToSubmit(true)
    } else {
      setReadyToSubmit(false)
    }
  }, [formData.comment?.length, formData.rating])
  const cancelModifyReview = () => {
    setModifyReviewId(null)
  }
  const handleChangeModifyReview = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const handleRatingChange = rate => {
    setFormData({
      ...formData,
      rating: rate,
    })
  }
  const handleSubmitModifiedReview = (e, rv) => {
    e.preventDefault()
    if (
      formData.comment === reviewRef.current?.comment &&
      formData.rating === reviewRef.current?.rating
    ) {
      toast.error(
        <div className="Toastify__toast-body cursor-default">리뷰가 수정되지 않았습니다.</div>,
        {
          position: 'top-center',
        },
      )
      return
    }
    if (confirm('리뷰를 수정하시겠습니까?')) {
      axios
        .put(`http://localhost:3000/review/${rv._id}`, formData, {
          withCredentials: true,
        })
        .then(res => {
          const data = res.data
          // console.log(data)
          if (res.status === 200) {
            toast.success(
              <div className="Toastify__toast-body cursor-default">리뷰가 수정되었습니다.</div>,
              {
                position: 'top-center',
              },
            )
            setMyReviews(prev => {
              prev.map(rv => (rv._id === data._id ? data : rv))
            })
            setFormData({
              user: user.id,
              comment: review?.comment,
              rating: review?.rating,
              store: review.store._id,
            })
            setModifyReviewId(null)
          }
        })
        .catch(err => {
          toast.error(
            <div className="Toastify__toast-body cursor-default">다시 시도해 주세요.</div>,
            {
              position: 'top-center',
            },
          )
          console.error(err)
        })
    }
  }

  return (
    <div className="sm:w-3/7 w-4/7 h-3/4 bg-white py-2 px-[1px] rounded-2xl mb-30 text-center">
      <div className="mx-auto h-full overflow-auto custom-scrollbar">
        {/* 기타 정보 */}
        <div className="w-full flex items-center justify-center">
          <img src={Icon} alt="가게 아이콘" className="sm:w-25 w-20" />
          <div>
            <div className="text-center text-xl">
              <p>{review.store.name}</p>
            </div>
            <div className="flex items-center justify-center">
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
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <p>{review.store.address}</p>
            </div>
            <div className="flex items-center justify-center">
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
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              <p>{review.store.phone}</p>
            </div>
          </div>
        </div>
        <form
          key={review._id}
          className="sm:max-w-fit mx-auto px-3"
          onSubmit={e => handleSubmitModifiedReview(e, review)}
        >
          <p className="text-2xl mt-5">만족도가 바뀌셨나요?</p>
          <div className="flex justify-center">
            <Rating
              name="rating"
              start={0}
              stop={5}
              emptySymbol={<img src={StarGray} alt="star-gray" className="w-10 h-10" />}
              fullSymbol={<img src={StarYellow} alt="star-yellow" className="w-10 h-10" />}
              onChange={handleRatingChange}
              initialRating={formData.rating}
            />
          </div>
          <p className="text-md opacity-50">선택해주세요</p>
          {/* textarea */}
          <div className="w-full">
            <p className="text-2xl mt-5">수정할 내용을 적어주세요</p>
            <textarea
              type="text"
              name="comment"
              onChange={e => handleChangeModifyReview(e, review)}
              value={formData.comment}
              rows={5}
              cols={60}
              spellCheck={false}
              placeholder="방문 후기를 남겨주세요! (최소 6자 이상)"
              className={`bg-color-gray-50 indent-1 max-h-auto max-w-fit min-w-1/5 resize-none mt-1 block w-full border-1 rounded-md shadow-sm p-2 resize-none
                    focus:border-blue-500 focus:outline-none focus:ring-1`}
            />
          </div>
          <p className="text-color-red-500 my-1">리뷰 이미지의 수정은 불가능합니다.</p>
          {/* 버튼 */}
          <div className="flex justify-around gap-2 mt-5 w-full">
            <button
              type="button"
              className="flex-1 sm:h-10 bg-red-400 hover:bg-red-500 active:bg-red-700 hover:cursor-pointer transition-all ease-in-out px-2 py-1 rounded-xl text-white"
              onClick={cancelModifyReview}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={readyToSubmit === false}
              className={`flex-1 sm:h-10 hover:cursor-pointer transition-all ease-in-out rounded-xl px-2 py-1
                ${readyToSubmit === true ? 'bg-color-gray-700 hover:bg-color-gray-900 text-white' : 'disabled:bg-color-gray-300 text-color-gray-700 pointer-events-none select-none'}
                `}
            >
              완료
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModifyReviewModal
