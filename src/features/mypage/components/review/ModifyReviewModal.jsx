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
  let MIN_LENGTH = 6
  const [errorText, setErrorText] = useState('')
  const [isRequested, setIsRequested] = useState(false)
  useEffect(() => {
    if (isRequested === true) {
      if (formData.comment.length < MIN_LENGTH) {
        setErrorText(`최소 ${MIN_LENGTH}자 이상 입력해주세요. (현재 ${formData.comment.length}자)`)
        return
      } else {
        setErrorText('')
      }
    }
  }, [errorText.length, MIN_LENGTH, formData.comment?.length, formData?.rating, isRequested])
  const cancelModifyReview = () => {
    setModifyReviewId(null)
    setIsRequested(false)
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
    setIsRequested(true)
    if (formData.comment.length > 6 && formData.rating > 0) {
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
              setIsRequested(false)
              setModifyReviewId(null)
              setErrorText('')
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
            setIsRequested(false)
            setErrorText('')
          })
      }
    }
  }
  return (
    <form
      key={review._id}
      className="sm:max-w-2/3 sm:min-w-1/3 bg-color-gray-300 p-3 text-color-gray-900 rounded-[15px] sm:min-h-1/3"
      onSubmit={e => handleSubmitModifiedReview(e, review)}
    >
      {/* 기타 정보 */}
      <div>
        <p>
          <strong>작성자</strong> : {user.name}
        </p>
        <p>
          <strong>점포명</strong> : {review.store.name}
        </p>
        <p>
          <strong>작성일</strong> : {review.createdAt.split('T')[0]}
        </p>
      </div>
      <textarea
        name="comment"
        rows={10}
        cols={60}
        spellCheck={false}
        id={`comment-${review?._id}`}
        value={formData?.comment ?? review?.comment}
        onChange={e => handleChangeModifyReview(e, review)}
        className={`resize-none focus:outline-none indent-2 border-gray-400/30 outline-none border-1 rounded-xl px-1 my-2
        ${
          isRequested === true && formData.comment.length < MIN_LENGTH
            ? 'border-red-500 focus:ring-red-500'
            : isRequested === true && formData.comment.length >= MIN_LENGTH
              ? 'border-green-400/80 focus:ring-blue-500'
              : 'border-gray-400/30'
        }`}
      ></textarea>
      <div className="flex gap-2 justify-between">
        {/* 별점 */}
        <div>
          <Rating
            name="rating"
            start={0}
            stop={5}
            emptySymbol={<img src={StarGray} alt="star-gray" className="w-6 h-6" />}
            fullSymbol={<img src={StarYellow} alt="star-yellow" className="w-6 h-6" />}
            onChange={handleRatingChange}
            initialRating={formData.rating}
          />
        </div>
        {errorText && <p className="mt-1 text-sm text-red-600">{errorText}</p>}
        {/* 버튼 */}
        <div>
          <button
            type="submit"
            className="hover:cursor-pointer transition ease-in-out sm:px-3 sm:text-sm text-xs px-2 py-1 border-1 rounded-2xl bg-color-gray-700 sm:bg-gray-600 sm:hover:bg-gray-400 text-white"
          >
            완료
          </button>
          <button
            type="button"
            className="hover:cursor-pointer transition ease-in-out sm:px-3 sm:text-sm text-xs px-2 py-1 border-1 rounded-2xl bg-color-red-700 sm:bg-red-600 sm:hover:bg-red-400 text-white"
            onClick={cancelModifyReview}
          >
            취소
          </button>
        </div>
      </div>
    </form>
  )
}

export default ModifyReviewModal
