import React, { useEffect, useState, useRef } from 'react'
import { API } from '../../../app/api.js'
import Icon from '../../../assets/images/default2.png'
import StarGray from '../../../assets/images/star-gray.png'
import StarYellow from '../../../assets/images/star-yellow.png'
import { toast } from 'react-toastify'
import Rating from 'react-rating'
import SortDropdown from '../../../features/place/components/reviews/sortButton/SortDropdown.jsx'
import ModifyReviewModal from './review/ModifyReviewModal.jsx'
import ReviewImageSrc from '../../../shared/ReviewImageSrc.jsx'
import { useNavigate } from 'react-router-dom'

const MyPageFormReviews = ({ user, currentTab, wrappers }) => {
  const [showReviewMore, setShowReviewMore] = useState(5)
  let count = showReviewMore
  const [openTabId, setOpenTabId] = useState(null)
  const [showSort, setShowSort] = useState(false)
  const [myReviews, setMyReviews] = useState([])
  const [sortedReviews, setSortedReviews] = useState([])
  const [currentSort, setCurrentSort] = useState('none')
  const [modifyReviewId, setModifyReviewId] = useState(null)

  const navigate = useNavigate()
  const userReviewRef = useRef(null)
  const dropdownRef = useRef(null)

  const initialFetchFromDB = () => {
    API.get(`/review/read/user/${user.id}`)
      .then(res => {
        const data = res.data
        if (data.length < 1 && userReviewRef.current) {
          setMyReviews([])
          userReviewRef.current = []
          return
        } else {
          const sorted = data.sort((a, b) => a.createdAt - b.createdAt)
          setMyReviews(sorted)
          userReviewRef.current = sorted
          return
        }
      })
      .catch(err => {
        toast.error(<div className="Toastify__toast-body cursor-default">다시 시도해주세요.</div>, {
          position: 'top-center',
        })
        console.log(err)
      })
  }
  // 리뷰 정보 불러오기
  useEffect(() => {
    if (currentTab === '리뷰' && myReviews !== userReviewRef.current) {
      initialFetchFromDB()
    }
  }, [currentTab, myReviews])
  // 리뷰 드랍다운 메뉴 바깥클릭 시 접기
  useEffect(() => {
    const handleClickOutside = e => {
      const isOutside = Object.values(wrappers.current || {}).some(ref => {
        return ref instanceof HTMLElement && ref.contains(e.target)
      })
      if (!isOutside) {
        setOpenTabId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  // 리뷰 정렬 기능
  useEffect(() => {
    let sorted = Array.isArray(myReviews) ? [...myReviews] : []
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
    setSortedReviews(sorted)

    const handleClickOutside = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSort(false)
      }
    }
    if (showSort) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [currentSort, showSort, myReviews])
  // 리뷰 수정중 모달 이외 접근 금지
  useEffect(() => {
    if (modifyReviewId !== null) {
      document.body.style.overflow = 'hidden'
    } else if (modifyReviewId === null) {
      document.body.style.overflow = 'auto'
    }
  }, [modifyReviewId])

  const handleShowUserTap = rv => {
    setOpenTabId(prev => (prev === rv._id ? null : rv._id))
  }
  const handleDeleteMyReview = rv => {
    const userId = user.id
    if (userId) {
      if (confirm('리뷰를 삭제하시겠습니까?')) {
        API.delete(`/review/delete/${rv._id}`, {
          headers: {
            user: userId,
          },
        })
          .then(res => {
            if (res.status === 200) {
              //   console.log('리뷰 삭제 정보', res)
              setSortedReviews(prev => {
                const updated = prev.filter(review => review._id !== rv._id)
                if (updated?.length <= 5) {
                  setShowReviewMore(5)
                  count = 5
                } else {
                  setShowReviewMore(5)
                  count = 5
                }
                return updated
              })
              toast.success(
                <div className="Toastify__toast-body cursor-default">리뷰가 삭제되었습니다.</div>,
                {
                  position: 'top-center',
                },
              )
            }
          })
          .catch(err => {
            toast.error(
              <div className="Toastify__toast-body cursor-default">다시 시도해주세요.</div>,
              {
                position: 'top-center',
              },
            )
          })
      }
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
  const handleReviewshowReviewMore = () => {
    if (sortedReviews?.length > 5) {
      if (sortedReviews?.length - showReviewMore > 5) {
        setShowReviewMore(prev => (prev += 5))
        count = count + 5
      } else if (
        sortedReviews?.length - showReviewMore <= 5 &&
        sortedReviews?.length - showReviewMore > 0
      ) {
        setShowReviewMore(sortedReviews?.length)
        count = sortedReviews?.length
      } else if (sortedReviews?.length === showReviewMore) {
        setShowReviewMore(5)
        count = 5
      }
    }
  }
  const handleModifyMyReview = rv => {
    setModifyReviewId(rv?._id)
    setOpenTabId(null)
  }
  const handleNavigateStore = rv => {
    if (rv.store) {
      API.post('/store/storeInfo', rv.store)
        .then(res => {
          const data = res.data
          // console.log(data)
          navigate(`/place/${data._id}`, { state: data })
        })
        .catch(err => {
          toast.error(
            <div className="Toastify__toast-body cursor-default">다시 시도해주세요.</div>,
            {
              position: 'top-center',
            },
          )
        })
    }
  }
  const total = sortedReviews?.length || 0
  const remains = total - count
  const isButtonHidden = total <= 5
  let buttonText = ''
  if (remains > 5) {
    buttonText = '5개 더보기'
  } else if (remains > 0) {
    buttonText = `${remains}개 더보기`
  } else if (remains === 0 && total === count) {
    buttonText = '접기'
  }
  return (
    <div className="h-full">
      <div className="h-full">
        {/* 정렬 버튼 */}
        <div>
          {sortedReviews?.length > 0 && (
            <div
              className="sm:max-w-4/5 max-w-full text-end mx-auto my-3 relative"
              ref={dropdownRef}
            >
              <button
                className="bg-blue-500 text-white sm:px-4 sm:py-2 px-2 py-1 sm:text-md text-sm rounded-full shadow hover:bg-blue-600 transition"
                onClick={() => setShowSort(!showSort)}
              >
                정렬
              </button>
              <SortDropdown handleSortChange={handleSortChange} showSort={showSort} />
            </div>
          )}
        </div>
        {/* 리뷰 영역 */}
        <div>
          {total > 0 ? (
            sortedReviews.slice(0, count).map((rv, i) => (
              <div
                key={i}
                className="sm:max-w-4/5 max-w-full sm:pl-5 border-1 border-gray-300 rounded-xl p-2 my-3 mx-auto h-full"
              >
                <div className="w-full h-full flex justify-between items-start">
                  <div className="flex items-start sm:gap-3 gap-1">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL+rv?.store?.photos?.[0]}` || Icon}
                      alt="icon"
                      className="sm:h-[80px] h-[40px] rounded-xl"
                      onError={e => {
                        e.target.src = Icon
                        e.target.onerror = null
                      }}
                    />
                    {/* 가게명, 별점 */}
                    <div>
                      <p className="hover:cursor-pointer sm:text-lg text-sm max-[325px]:text-xs">
                        <strong onClick={() => handleNavigateStore(rv)}>{rv?.store?.name}</strong>
                      </p>
                      <Rating
                        initialRating={rv.rating}
                        emptySymbol={
                          <img src={StarGray} alt="gray-star" className="sm:w-6 sm:h-6 w-3 h-3" />
                        }
                        fullSymbol={
                          <img
                            src={StarYellow}
                            alt="yellow-star"
                            className="sm:w-6 sm:h-6 w-3 h-3"
                          />
                        }
                        readonly={true}
                      />
                    </div>
                  </div>
                  {/* 작성일, 더보기 메뉴 */}
                  <div
                    className="flex items-center sm:gap-3 gap-1 top-0 relative"
                    ref={el => {
                      if (el) {
                        wrappers.current[rv._id] = el
                      } else if (wrappers.current) {
                        delete wrappers.current[rv._id]
                      }
                    }}
                  >
                    <p className="min-sm:text-md max-sm:text-xs">{rv?.createdAt?.split('T')[0]}</p>
                    {/* 드랍다운 아이콘 / 버튼 */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      onClick={() => handleShowUserTap(rv)}
                      className={`sm:size-8 size-6 relative sm:p-[2px] active:bg-gray-300 sm:hover:bg-color-gray-300 rounded-3xl`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
                    <div
                      className={`absolute right-[-1.5rem] top-9 flex flex-col max-w-fit p-3 bg-white transition-all duration-200 ease-in-out z-50 border-1 border-gray-300 rounded-xl ${openTabId === rv._id ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                    >
                      <button
                        className="hover:cursor-pointer transition ease-in-out sm:px-3 sm:text-sm text-xs px-2 py-1 border-1 rounded-2xl bg-color-gray-700 sm:bg-gray-600 sm:hover:bg-gray-400 text-white"
                        onClick={() => handleModifyMyReview(rv)}
                      >
                        수정
                      </button>
                      <button
                        className="hover:cursor-pointer transition ease-in-out sm:px-3 sm:text-sm text-xs px-2 py-1 border-1 rounded-2xl bg-color-red-700 sm:bg-red-600 sm:hover:bg-red-400 text-white"
                        onClick={e => {
                          e.stopPropagation()
                          handleDeleteMyReview(rv)
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
                {/* 리뷰 내용 */}
                <div className="h-full">
                  <div className="flex items-end my-1">
                    <p className={`indent-2 max-w-9/10 sm:text-md text-sm break-all`}>
                      {rv?.comment}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {rv.attachments?.length > 0 &&
                      rv.attachments.map((src, i) => (
                        <div key={`image-${src}`}>
                          <ReviewImageSrc src={src} alt={`image-${i}`} />
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-end min-sm:text-md max-sm:text-xs">
                    {handleReviewDate(rv?.createdAt)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-2">
              <p className="loading-jump text-center p-3 sm:mb-[1000px]">
                Loading
                <span className="jump-dots">
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </span>
              </p>
            </div>
          )}
        </div>
        {/* 더보기 버튼 */}
        {total > 0 && (
          <div className="mx-auto max-w-fit my-2 min-sm:text-md max-sm:text-sm">
            <button
              type="button"
              className={`${total <= 5 ? 'hidden' : 'hover:cursor-pointer active:bg-gray-400 bg-gray-300 rounded-3xl p-2 my-1'}`}
              onClick={handleReviewshowReviewMore}
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
      {/* 리뷰 수정 모달 */}
      {modifyReviewId && (
        <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center text-color-gray-900">
          <ModifyReviewModal
            user={user}
            review={sortedReviews.find(rv => rv?._id === modifyReviewId)}
            setModifyReviewId={setModifyReviewId}
            setMyReviews={setMyReviews}
          />
        </div>
      )}
    </div>
  )
}

export default MyPageFormReviews
