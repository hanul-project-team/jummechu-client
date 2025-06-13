import React, { useEffect, useState } from 'react'
import zustandStore from '../../app/zustandStore.js'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import KakaoMaps from '../../shared/kakaoMapsApi/KakaoMaps.jsx'
import SearchResultPageList from '../../features/search/SearchResultPageList.jsx'
import SearchResultPageFilter from '../../features/search/SearchResultPageFilter.jsx'

const SearchResult = () => {
  const [tag, setTag] = useState([])
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

    if (searchData && searchData.length > 0) {
      const places = searchData.map(place => ({
        name: place?.place_name,
        address: place?.address_name,
      }))
      const categories = searchData.map(sd => sd.category_name)
      const visualCategories = categories.reduce((acc, cts) => {
        const item = cts.split('>')[1].trim()
        if (!acc.includes(item)) {
          acc.push(item)
        }
        return acc
      }, [])
      setTag(visualCategories)
      try {
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
            console.error('리뷰 요청 실패', err)
          })
          .finally(() => {
            setIsLoading(false)
          })
      } catch (err) {
        console.error('try 에러', err)
      }
    }
  }, [searchData])

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
    } else return 0
  }
  const handleNavigate = sd => {
    if (sd) {
      axios
        .post('http://localhost:3000/store/storeInfo', sd)
        .then(res => {
          const data = res.data
          if (data !== null && data._id) {
            console.log('1-2 데이터 있음')
            console.log(data)
            // console.log(data._id)
            try {
              navigate(`/place/${data._id}`, { state: data })
            } catch (err) {
              console.error(`data 아이디 에러 ${data._id}`)
            }
          } else if (data === null) {
            setIsLoading(true)
            window.scrollTo({ top: 0 })
            console.log('2-1 데이터 없음, 등록 실행')
            axios
              .post('http://localhost:3000/store/save', sd)
              .then(res => {
                const place = res.data
                // console.log(place)
                if (Array.isArray(place)) {
                  navigate(`/place/${place[0]._id}`, { state: place[0] })
                } else {
                  navigate(`/place/${place._id}`, { state: place })
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
  const extractCategory = categories => {
    const cutCate = categories?.category_name.split('>')[1].trim()
    return cutCate
  }
  const filterKeyword = sd => {
    const filtered = sd?.summary.keyword
      .split(',')
      .map(key => key.trim())
      .filter(
        key => key !== sd.place_name && key !== tag.filter(tg => tg === extractCategory(sd))[0],
      )
      .filter(key => !key.includes('>'))
    return filtered
  }
  // console.log(searchData)
  return (
    <div className="container max-w-3/5 mx-auto">
      <KakaoMaps />
      {isLoading || searchData.length === 0 ? (
        <p className="loading-jump text-center p-3 sm:mb-[1000px]">
          Loading
          <span className="jump-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      ) : (
        <div className="flex">
          {/* <div className='flex-1'>
            <SearchResultPageFilter search={searchData} />
          </div> */}
          <div className="flex-4">
            <SearchResultPageList
              npr={nearPlaceReviews}
              filter={filterKeyword}
              tag={tag}
              extract={extractCategory}
              count={handleCountReviews}
              search={searchData}
              navi={handleNavigate}
              avg={handleAvgRating}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchResult
