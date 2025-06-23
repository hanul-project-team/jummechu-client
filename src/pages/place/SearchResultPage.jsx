import React, { useEffect, useState } from 'react'
import zustandStore from '../../app/zustandStore.js'
import { API } from '../../app/api.js'
import { useNavigate } from 'react-router-dom'
import KakaoMaps from '../../shared/kakaoMapsApi/KakaoMaps.jsx'
import SearchResultPageList from '../../features/search/SearchResultPageList.jsx'

const SearchResult = () => {
  const [tag, setTag] = useState([])
  const searchData = zustandStore(state => state.searchData)
  const isLoading = zustandStore(state => state.isLoading)
  const setIsLoading = zustandStore(state => state.setIsLoading)
  const navigate = useNavigate()
  const [searchReviews, setSearchReviews] = useState([])
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    if (searchData.length === 0) {
      setIsLoading(true)
      return
    }
    if (searchData && searchData.length > 0) {
      const places = searchData.map(place => ({
        place_name: place?.place_name,
        address_name: place?.address_name,
        x: place?.x,
        y: place?.y,
        phone: place?.phone ?? '',
        keyword: place?.summary?.keyword ?? [],
        description: place?.summary?.description ?? '',
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
      if (places && places?.length > 0) {
        API.post('/store/save', places)
          .then(res => {
            const data = res.data
            // console.log(data)
            setSearchResults(data)
            if (data && data.length > 0) {
              API.post('/review/readall', {
                places: data,
              })
                .then(res => {
                  const data = res.data
                  // console.log(data)
                  setSearchReviews(data)
                })
                .catch(err => console.log(err))
            }
          })
          .catch(err => {
            console.error('리뷰 요청 실패', err)
          })
          .finally(() => {
            setIsLoading(false)
          })
      }
    }
  }, [searchData])

  const handleAvgRating = (reviews, place) => {
    if (reviews?.length > 0) {
      const matchedReviews = reviews?.filter(
        review =>
          review.store?.name === place?.place_name && review.store?.address === place?.address_name,
      )
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
    if (reviews?.length > 0) {
      const matchedReviews = reviews?.filter(
        review =>
          review.store?.name === place?.place_name && review.store?.address === place?.address_name,
      )
      return matchedReviews.length
    } else return 0
  }
  const handleNavigate = result => {
    if (result) {
      navigate(`/place/${result._id}`, { state: result })
    }
  }
  const extractCategory = categories => {
    const cutCate = categories?.category_name?.split('>')[1].trim()
    return cutCate
  }
  const filterKeyword = sd => {
    const storeName = sd?.place_name
    const filtered = sd?.summary?.keyword
      .split(',')
      .map(key => key.trim())
      .filter(key => !key.includes('>'))
      .filter(key => !storeName.includes(key))
    return filtered
  }
  // console.log(searchData)
  return (
    <div className="container max-w-5xl px-6 mx-auto">
      <KakaoMaps />
      {isLoading === true && searchData?.length === 0 ? (
        <p className="loading-jump text-center p-3 sm:mb-[1000px]">
          Loading
          <span className="jump-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
      ) : !isLoading && searchData?.length === 0 ? (
        <div className="w-full mx-auto text-center min-h-screen">
          <p className="font-bold text-xl">검색결과 없음</p>
          <p className="text-color-gray-700 text-md">더 정확한 검색어를 입력해주세요!</p>
        </div>
      ) : (
        <div>
          <SearchResultPageList
            reviews={searchReviews}
            filter={filterKeyword}
            tag={tag}
            extract={extractCategory}
            count={handleCountReviews}
            searchData={searchData}
            searchResults={searchResults}
            navi={handleNavigate}
            avg={handleAvgRating}
          />
        </div>
      )}
    </div>
  )
}

export default SearchResult
