import React, { useState, useEffect } from 'react'
import axios from 'axios'
import zustandStore from '../../../../app/zustandStore'
import Rating from 'react-rating'
import StarGray from '../../../../assets/images/star-gray.png'
import StarYellow from '../../../../assets/images/star-yellow.png'
import { toast } from 'react-toastify'

const ReviewWriteForm = ({ user, placeDetail, setShowReviewForm, setCurrentSort }) => {
  const setReviewInfo = zustandStore(state => state.setReviewInfo)
  let MIN_LENGTH = 6
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    user: '',
    comment: '',
    rating: 0,
    store: '',
  })
  const [starRating, setStarRating] = useState(0)

  const handleRatingChange = rate => {
    setStarRating(rate)
    setFormData({
      ...formData,
      rating: rate,
    })
  }
  const handleSubmit = e => {
    e.preventDefault()
    if (formData.comment.length < MIN_LENGTH) {
      setErrorMessage(`최소 ${MIN_LENGTH}자 이상 입력해주세요. (현재 ${formData.comment.length}자)`)
      return
    } else {
      setErrorMessage('')
    }
    if (formData?.rating < 1) {
      alert('별점을 정확히 입력해주세요')
      return
    }
    if (user?.id && placeDetail?._id) {
      const updatedFormData = {
        ...formData,
        user: user.id,
        store: placeDetail._id,
      }
      // console.log(updatedFormData)
      axios
        .post('http://localhost:3000/review/regist', updatedFormData, {
          withCredentials: true,
        })
        .then(
          /* async */ res => {
            // const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
            if (res.status === 201) {
              toast.success(
                <div className="Toastify__toast-body cursor-default">
                  리뷰가 등록되었습니다.
                </div>,
                {
                  position: 'top-center',
                },
              )
              setShowReviewForm(prev => !prev)
              // await sleep(500)
              setFormData({
                ...formData,
                rating: 0,
                comment: '',
              })
              setStarRating(0)
              setReviewInfo(res.data.data)
              setCurrentSort('latest')
            }
          },
        )
        .catch(err => {
          console.log(err)
        })
    }
  }
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const handleReviewWrite = () => {
    setShowReviewForm(prev => !prev)
    setFormData({
      user: '',
      comment: '',
      rating: 0,
      store: '',
    })
    setStarRating(0)
  }
  return (
    <div className="max-w-3/5 mx-auto">
      <form onSubmit={handleSubmit} className="w-fit mx-auto p-2 text-center">
        <div className="text-start my-2 bg-white p-2 w-fit rounded-3xl pointer-events-none">
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
            ${errorMessage ? 'border-red-500 focus:ring-red-500' : 'border-color-gray-300 focus:ring-blue-500'}
            focus:border-blue-500 focus:outline-none focus:ring-1`}
          />
        </div>
        <div className="flex justify-between my-2">
          {/* 이하 별점 매기기 */}
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
        {errorMessage && <p className="mt-1 text-sm text-red-600">{errorMessage}</p>}
      </form>
    </div>
  )
}

export default ReviewWriteForm
