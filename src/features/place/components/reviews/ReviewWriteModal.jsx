import React, { useState, useEffect, useRef } from 'react'
import { API } from '../../../../app/api'
import zustandStore from '../../../../app/zustandStore'
import Rating from 'react-rating'
import StarGray from '../../../../assets/images/star-gray.png'
import StarYellow from '../../../../assets/images/star-yellow.png'
import Icon from '../../../../assets/images/default2.png'
import { toast } from 'react-toastify'

const ReviewWriteModal = ({ user, placeDetail, setShowReviewModal, setCurrentSort }) => {
  const setReviewInfo = zustandStore(state => state.setReviewInfo)
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const [formData, setFormData] = useState({
    user: '',
    comment: '',
    rating: 0,
    store: '',
  })
  const [fileData, setFileData] = useState([])

  useEffect(() => {
    if (formData.comment?.length > 6 && formData.rating > 0) {
      setReadyToSubmit(true)
    } else {
      setReadyToSubmit(false)
    }
  }, [fileData?.length, formData.rating, formData.comment?.length])
  useEffect(() => {
    return () => {
      fileData.forEach(data => URL.revokeObjectURL(data.previewURL))
    }
  }, [fileData])
  const handleRatingChange = rate => {
    setFormData({
      ...formData,
      rating: rate,
    })
  }
  const handleSubmit = e => {
    e.preventDefault()
    if (user?.id && placeDetail?._id) {
      const newFormData = new FormData()
      newFormData.append('user', user.id)
      newFormData.append('store', placeDetail._id)
      newFormData.append('comment', formData.comment)
      newFormData.append('rating', formData.rating)
      fileData.forEach(file => {
        newFormData.append('id', file.id)
        newFormData.append('attachments', file.attachments)
        newFormData.append('previewURL', file.previewURL)
      })
      if (confirm('리뷰 등록을 완료하시겠습니까?')) {
        API.post('/review/regist', newFormData)
          .then(res => {
            if (res.status === 201) {
              toast.success(
                <div className="Toastify__toast-body cursor-default">리뷰가 등록되었습니다.</div>,
                {
                  position: 'top-center',
                },
              )
              setShowReviewModal(prev => !prev)
              setFormData({
                ...formData,
                rating: 0,
                comment: '',
              })
              setFileData([])
              setReviewInfo(res.data.data)
              setCurrentSort('latest')
            }
          })
          .catch(err => {
            toast.error(
              <div className="Toastify__toast-body cursor-default">다시 시도해주세요.</div>,
              {
                position: 'top-center',
              },
            )
            console.log(err)
          })
      }
    }
  }
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }
  const handleFileChange = e => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    if (files?.length + fileData?.length > 5) {
      toast.error(
        <div className="Toastify__toast-body cursor-default">5장까지만 첨부하실수 있습니다.</div>,
        {
          position: 'top-center',
        },
      )
      return
    }
    const newData = files.map(file => ({
      id: crypto.randomUUID(),
      attachments: file,
      previewURL: URL.createObjectURL(file),
    }))
    setFileData(prev => [...prev, ...newData])
  }
  const handleReviewWrite = () => {
    setShowReviewModal(prev => !prev)
    setFormData({
      user: '',
      comment: '',
      rating: 0,
      store: '',
    })
    resetFiles()
  }
  const resetFiles = () => {
    setFileData([])
  }
  const handleDeleteOneImage = id => {
    const target = fileData.find(file => file.id === id)
    if (!target) return
    if (confirm('선택한 이미지를 등록 취소하시겠습니까?')) {
      URL.revokeObjectURL(target.previewURL)
      setFileData(prev => prev.filter(file => file.id !== id))
    }
    setTimeout(() => {
      setFileData(prev => [...prev])
    }, 500)
  }
  return (
    <div className="min-xl:w-3/7 max-xl:w-4/7 max-lg:w-5/7 max-[321px]:w-5/7 h-3/4 bg-white sm:pt-5 pt-10 py-2 px-[1px] rounded-2xl sm:mb-30 mb-10">
      <div className="mx-auto h-full overflow-auto custom-scrollbar">
        <div className="flex flex-col p-2">
          <div className="w-full flex items-center justify-center">
            <img src={Icon} alt="가게 아이콘" className="sm:w-25 w-20 mr-1" />
            <div>
              <div className="text-center sm:text-xl text-sm">
                <p>{placeDetail?.name}</p>
              </div>
              <div className="flex items-center justify-center sm:text-md text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="sm:size-5 size-4"
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
                <p>{placeDetail?.address}</p>
              </div>
              <div className="flex items-center justify-center sm:text-md text-xs">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="sm:size-5 size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                <p>{placeDetail?.phone ? placeDetail?.phone : '미제공'}</p>
              </div>
            </div>
          </div>
          <div className="w-full">
            <form
              onSubmit={handleSubmit}
              className="w-fit mx-auto p-2 text-center"
              encType="multipart/form-data"
            >
              <fieldset>
                <legend className="hidden">리뷰 작성폼</legend>
                <p className="sm:text-2xl text-lg sm:mt-10 mt-3">얼마나 만족스러우셨나요?</p>
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
                <p className="sm:text-md text-sm opacity-50">선택해주세요</p>
                <p className="sm:text-2xl text-xl mt-10">좋았던 점을 알려주세요!</p>
                <div>
                  <textarea
                    type="text"
                    name="comment"
                    onChange={handleChange}
                    value={formData.comment}
                    rows={5}
                    cols={60}
                    spellCheck={false}
                    placeholder="방문 후기를 남겨주세요! (최소 6자 이상)"
                    className={`bg-color-gray-50 indent-1 max-h-auto max-w-fit min-w-1/5 resize-none mt-1 block w-full border-1 rounded-md shadow-sm p-2 resize-none
                    focus:border-blue-500 focus:outline-none focus:ring-1`}
                  />
                </div>
                <div className="mt-10">
                  <label htmlFor="attachments">
                    <div className="border-1 flex justify-center items-center border-dashed bg-color-gray-50 mt-1 hover:cursor-pointer w-full sm:h-[60px] h-[40px]">
                      <p className="pointer-events-none cursor-not-allowed font-bold flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="sm:size-6 size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                          />
                        </svg>
                        <span className="sm:text-md text-sm">사진 첨부하기 &#40;최대 5장&#41;</span>
                      </p>
                    </div>
                  </label>
                  <input
                    type="file"
                    name="attachments"
                    id="attachments"
                    className="hidden"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    multiple
                  />
                  <p className="font-bold sm:text-md text-xs sm:mt-0 mt-1 text-color-gray-700">
                    리뷰와 관련없는 이미지를 업로드시 삭제 될 수 있습니다.
                  </p>
                </div>
                {fileData && fileData?.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {fileData.map((file, i) => {
                      return (
                        <div className="relative" key={file.id}>
                          <button type="button" onClick={() => handleDeleteOneImage(file.id)}>
                            <img
                              src={file.previewURL}
                              alt={`prev-${i}`}
                              className="w-24 h-24 object-cover rounded"
                            />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="red"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6 text-white hover:cursor-pointer absolute top-0 right-0"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                              />
                            </svg>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
                {fileData?.length > 0 && (
                  <div className="text-start mt-2">
                    <button
                      type="button"
                      className="hover:cursor-pointer border-1 border-color-gray-700 py-4 px-8 rounded-lg mt-1 text-md w-full"
                      onClick={resetFiles}
                    >
                      비우기
                    </button>
                  </div>
                )}
                <div className="flex justify-around gap-2 mt-5 w-full">
                  <button
                    type="button"
                    className="flex-1 sm:h-10 bg-red-400 hover:bg-red-500 active:bg-red-700 hover:cursor-pointer transition-all ease-in-out px-2 py-1 rounded-xl text-white"
                    onClick={handleReviewWrite}
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
                    등록
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewWriteModal
