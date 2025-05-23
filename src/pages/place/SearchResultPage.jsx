import React, { useEffect, useState } from 'react'
import zustandStore from '../../app/zustandStore.js'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../../assets/styles/global.css'

const SearchResult = () => {
  const searchData = zustandStore(state => state.searchData)
  const isLoading = zustandStore(state => state.isLoading)
  const setIsLoading = zustandStore(state => state.setIsLoading)
  const navigate = useNavigate()

  useEffect(() => {
    if (searchData.length === 0) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
    const unsub = zustandStore.persist.onFinishHydration(() => {
      const data = zustandStore.getState().searchData
      setIsLoading(false)
    })
    return () => unsub?.()
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
  // console.log(searchData)

  const handleNavigate = sd => {
    // console.log(sd)
    try {
      axios
        .post('http://localhost:3000/store/regist', sd)
        .then(res => {
          console.log(res)
          // navigate(`/place/${sd.id}`, { state: sd })
        })
        .catch(err => {
          console.log('axios 요청 실패', err)
        })
    } catch (err) {
      console.log('try 실패', err)
    }
  }

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
                className="md:w-[200px] md:h-[200px] sm:w-[150px] sm:h-[150px] mouse_pointer object-cover rounded-lg"
                onClick={() => handleNavigate(sd)}
              />
            </div>
            <div className="md:max-h-[200px] overflow-y-auto">
              <span className="mouse_pointer text-2xl" onClick={() => handleNavigate(sd)}>
                <strong>
                  {i + 1}. {sd.place_name}
                </strong>
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
                <span>⭐{sd.rate ? sd.rate : '0'}&nbsp;</span>
                <span>({sd?.review?.length ? sd.review.length : '0'})</span>
              </div>
              <div>
                <div className="flex gap-2">
                  <p>
                    <strong>태그: </strong>
                    {sd.summary.keyword}
                  </p>
                </div>
                <p>
                  <strong>개요</strong>: {sd.summary.description}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SearchResult
