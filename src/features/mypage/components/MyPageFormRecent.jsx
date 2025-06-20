import React, { useEffect, useRef, useState } from 'react'
import defaultfood from '../../../assets/images/default2.png'
import { useNavigate } from 'react-router-dom'

const MyPageFormRecent = ({
  recentStores,
  isStoreBookmarked,
  backendBaseUrl,
  handleBookmarkToggle,
  setPlaceDetail,
}) => {
  const navigate = useNavigate()

  return (
    <div className="flex justify-center ">
      {recentStores.length === 0 ? (
        <p className="py-5 text-gray-600">최근 본 가게 기록이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-9 py-5">
          {recentStores.map(item => {
            const bookmarked = isStoreBookmarked(item._id)
            return (
              <li key={item._id} className="flex gap-4">
                <div
                  className="relative w-[250px] h-[250px] cursor-pointer"
                  onClick={() => navigate(`/place/${item._id}`)}
                >
                  <img
                    src={
                      item.photos && item.photos.length > 0
                        ? item.photos[0].startsWith('http') || item.photos[0].startsWith('https')
                          ? item.photos[0]
                          : `${backendBaseUrl}${item.photos[0]}`
                        : defaultfood
                    } ////
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={e => {
                      e.target.onerror = null
                      e.target.src = defaultfood
                    }}
                  />
                  <button
                    type="button"
                    onClick={e => handleBookmarkToggle(e, item._id, item.name, bookmarked)}
                    className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={bookmarked ? 'red' : 'none'}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`size-6 ${bookmarked ? 'text-red-500' : 'text-black/80'}`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="py-3">
                  <h2 className="text-lg py-1 font-SinchonRhapsody flex">{item.name}</h2>
                  <p className="py-1">⭐{item.rating}</p>
                  <p className="py-1 flex items-center text-sm text-gray-500">
                    <svg
                      fill="#000000"
                      height="25px"
                      width="25px"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 487.379 487.379"
                      xmlSpace="preserve"
                    >
                      <g>
                        <path
                          d="M393.722,438.868L371.37,271.219h0.622c6.564,0,11.885-5.321,11.885-11.885V17.668c0-4.176-2.183-8.03-5.751-10.18
                                c-3.569-2.152-7.998-2.279-11.679-0.335c-46.345,24.454-75.357,72.536-75.357,124.952v101.898
                                c0,20.551,16.665,37.215,37.218,37.215h2.818l-22.352,167.649c-1.625,12.235,2.103,24.599,10.228,33.886
                                c8.142,9.289,19.899,14.625,32.246,14.625c12.346,0,24.104-5.336,32.246-14.625C391.619,463.467,395.347,451.104,393.722,438.868z"
                        />
                        <path
                          d="M207.482,0c-9.017,0-16.314,7.297-16.314,16.313v91.128h-16.314V16.313C174.854,7.297,167.557,0,158.54,0
                                c-9.017,0-16.313,7.297-16.313,16.313v91.128h-16.314V16.313C125.912,7.297,118.615,0,109.599,0
                                c-9.018,0-16.314,7.297-16.314,16.313v91.128v14.913v41.199c0,24.2,19.611,43.811,43.811,43.811h3.616L115,438.74
                                c-1.37,12.378,2.596,24.758,10.896,34.047c8.317,9.287,20.186,14.592,32.645,14.592c12.459,0,24.327-5.305,32.645-14.592
                                c8.301-9.289,12.267-21.669,10.896-34.047l-25.713-231.375h3.617c24.199,0,43.811-19.611,43.811-43.811v-41.199v-14.913V16.313
                                C223.796,7.297,216.499,0,207.482,0z"
                        />
                      </g>
                    </svg>
                    {item.address}
                  </p>
                  {item.keyword && (
                    <p className="py-1 text-sm text-gray-700">
                      #{Array.isArray(item.keyword) ? item.keyword.join(', #') : item.keyword}
                    </p>
                  )}
                  <p className="py-5 text-sm text-black">
                    본 시간: {new Date(item.viewedAt).toLocaleString()}
                  </p>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      console.log(item._id)
                      setPlaceDetail(null)
                      navigate(`/place/${item._id}`, { state: item })
                    }}
                    className="mt-2 text-blue-500 hover:underline text-sm"
                  >
                    상세 보기
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default MyPageFormRecent
