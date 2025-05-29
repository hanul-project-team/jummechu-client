import React, { useEffect, useState } from 'react'
import zustandStore from '../../app/zustandStore.js'
import axios from 'axios'
import StarRatingComponent from 'react-star-rating-component'
import { useNavigate } from 'react-router-dom'
import '../../assets/styles/global.css'

const SearchResult = () => {
  const searchData = zustandStore(state => state.searchData)
  const isLoading = zustandStore(state => state.isLoading)
  const setIsLoading = zustandStore(state => state.setIsLoading)
  const nearPlaceReviews = zustandStore(state => state.nearPlaceReviews)
  const setNearPlaceReviews = zustandStore(state => state.setNearPlaceReviews)
  const navigate = useNavigate()

  useEffect(() => {
    
    if (searchData.length === 0) {
      setIsLoading(true)
      return
    }
    // const unsub = zustandStore.persist.onFinishHydration(() => {
    //   const data = zustandStore.getState().searchData
    //   console.log(data)
    // })

    if (searchData && searchData.length > 0) {
      const places = searchData.map(place => ({
        name: place?.place_name,
        address: place?.address_name,
      }))

      try {
        // console.log(places)
        axios
          .post('http://localhost:3000/review/readall', {
            places: places,
          })
          .then(res => {
            const data = res.data
            // console.log(data)
            setNearPlaceReviews(data)
          })
          .catch(err => {
            console.error('리뷰 요청 실패',err)
          })
          .finally(() => {
            setIsLoading(false)
          })
      } catch (err) {
        console.error('try 에러', err)
      }
    }

    // return () => unsub?.()
  }, [searchData])

  if (isLoading || searchData.length === 0) {
    return (
      <p className="loading-jump text-center p-3">
        Loading
        <span className="jump-dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </p>
    )
  }
  const handleAvgRating = (reviews, place) => {
    if (reviews.length > 0) {
      const matchedReviews = reviews?.filter(review => review.store?.name === place.place_name)
      const avgRating =
        matchedReviews?.length > 0
          ? matchedReviews.reduce((acc, cur) => acc + cur.rating, 0) / matchedReviews.length
          : null
      const rounded = Math.floor(avgRating * 10) / 10
      return rounded
    } else {
      return 0
    }
  }
  const handleCountReviews = (reviews, place) => {
    if (reviews.length > 0) {
      const matchedReviews = reviews?.filter(review => review.store?.name === place.place_name)
      return matchedReviews.length
    } else 
    return 0
  }
  const handleNavigate = sd => {
    // console.log(sd)
    try {
      axios
        .post('http://localhost:3000/store/save', sd)
        .then(res => {
          const place = res.data
          // console.log(place)
          navigate(`/place/${place._id}`, { state: place })
        })
        .catch(err => {
          console.log('axios 요청 실패', err)
        })
    } catch (err) {
      console.log('try 실패', err)
    }
  }
  // console.log(searchData)
  return (
    <div className="container max-w-3/5 mx-auto">
      <span className="ml-3">{searchData.length} 개의 검색 결과</span>
      {searchData.map((sd, i) => {
        return (
          <div key={i} className="flex gap-2 p-2 my-3">
            <div className="md:min-w-[200px]">
              <img
                src={`https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`}
                alt="picsum"
                className="md:w-[200px] md:h-[200px] sm:w-[150px] sm:h-[150px] hover:cursor-pointer object-cover rounded-lg"
                onClick={() => handleNavigate(sd)}
              />
            </div>
            <div className="md:max-h-[200px] overflow-y-auto">
              <span className="hover:cursor-pointer text-2xl" onClick={() => handleNavigate(sd)}>
                <strong>{sd.place_name}</strong>
              </span>
              <p>
                <strong>주소지</strong>:{sd.address_name}
              </p>
              <p>
                {sd.phone ? (
                  <>
                    <strong>연락처: </strong>
                    <span>{sd.phone}</span>
                  </>
                ) : (
                  '연락처 미공개'
                )}
              </p>
              <div className="flex">
                <span>
                  <strong>사용자 평점</strong>:{' '}
                </span>
                <span className="flex items-end">
                  <StarRatingComponent name="rate2" value={1} starCount={1} />
                  <span>{handleAvgRating(nearPlaceReviews, sd)}</span>&nbsp;
                </span>
                <span>&#40;{handleCountReviews(nearPlaceReviews, sd)}&#41;</span>
              </div>
              <div>
                <div className="flex gap-2">
                  <p>
                    <strong>태그: </strong>
                    {sd.summary.keyword}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SearchResult
