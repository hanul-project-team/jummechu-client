import Rating from 'react-rating'
import StarYellow from '../../assets/images/star-yellow.png'
import Icon from '../../assets/images/default2.png'

const SearchResultPageList = ({ searchData, searchResults, navi, avg, reviews, count, extract, tag, filter }) => {
  return (
    <>
      <span className="ml-3 pointer-events-none select-none">{searchData?.length} 개의 검색 결과</span>
      {searchData.map((sd, i) => {
        return (
          <div key={`${sd._id}-${i}`} className="flex gap-2 p-2 my-3 max-sm:flex-col">
            <div className="md:min-w-[200px]">
              <img
                src={`${searchResults[i]?.photos?.[0] ? import.meta.env.VITE_API_BASE_URL+searchResults[i]?.photos?.[0] : Icon}`}
                alt="picsum"
                onError={e => {
                  e.target.src = Icon
                  e.target.onerror = null
                }}
                className="md:w-[200px] md:h-[200px] sm:w-[150px] sm:h-[150px] hover:cursor-pointer object-cover rounded-lg"
                onClick={() => navi(searchResults[i])}
              />
            </div>
            <div className="md:max-h-[200px] overflow-y-auto">
              <span className="hover:cursor-pointer text-2xl" onClick={() => navi(searchResults[i])}>
                <strong>{sd?.place_name}</strong>
              </span>
              <p>
                <strong>주소지</strong>:{sd?.address_name}
              </p>
              <p>
                {sd.phone ? (
                  <>
                    <strong>연락처: </strong>
                    <span>{sd?.phone}</span>
                  </>
                ) : (
                  '연락처 미공개'
                )}
              </p>
              <div className="flex items-center">
                <p>
                  <strong>사용자 평점</strong>:{' '}
                </p>
                <span className="flex">
                  <Rating
                    initialRating={1}
                    fullSymbol={<img src={StarYellow} className="w-4 h-4" />}
                    emptySymbol={<img src={StarYellow} className="w-4 h-4" />}
                    stop={1}
                    readonly
                  />
                  <p>{avg(reviews, sd)}</p>&nbsp;
                </span>
                <span>&#40;{count(reviews, sd)}&#41;</span>
              </div>
              <div className="flex gap-1 py-1 items-center">
                {filter(sd).map((key, i) => (
                  <p
                    key={i}
                    className={`${key ? 'text-color-gray-700' : null}`}
                  >
                    &#35;{key}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default SearchResultPageList
