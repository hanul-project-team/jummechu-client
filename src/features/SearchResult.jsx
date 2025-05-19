import React, { useEffect, useState } from 'react'
import usePlaceStore from '../store/usePlaceStore'
import { Link } from 'react-router-dom'

const SearchResult = () => {
  const [isLoading, setIsLoading] = useState(true)
  const searchData = usePlaceStore(state => state.searchData)

  useEffect(() => {
    if (searchData && searchData.length > 0) {
      setIsLoading(false)
    }
  }, [searchData])
  // console.log(isLoading)
  // console.log(searchData)
  return (
    <div className="container max-w-3/5 mx-auto">
      {isLoading === true ? (
        <p>loading...</p>
      ) : (
        <>
          <span>{searchData.length} 개의 검색 결과</span>
          {searchData.map((sd, i) => {
            return (
              <div key={i} className="flex gap-2 p-2 my-3">
                <div className="md:min-w-[200px]">
                  <Link to={`/place/${sd.id}`}>
                    <img
                      src={`https://picsum.photos/200/200?random=${Math.floor(Math.random() * 1000)}`}
                      alt="picsum"
                      className="md:w-[200px] md:h-[200px] sm:w-[150px] sm:h-[150px] object-cover rounded-lg"
                    />
                  </Link>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl">
                    <Link to={`/place/${sd.id}`}>
                      <strong>
                        {i + 1}. {sd.place_name}
                      </strong>
                    </Link>
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
                  <div>
                    <div className="flex gap-2">
                      <p>
                        <strong>태그: </strong>
                        {sd.summary.keyword}
                      </p>
                      {/* {sd.summary.keyword.split(',').map((kw, i) => (
                        <p key={i}>{kw}</p>
                      ))} */}
                    </div>
                    <p>
                      <strong>개요</strong>: {sd.summary.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

export default SearchResult
