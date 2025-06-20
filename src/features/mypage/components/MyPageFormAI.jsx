import React from 'react'

const MyPageFormAI = ({
  loading,
  dalleImage,
  backendBaseUrl,
  openai,
  userNickname,
  mostFrequentKeywords,
  userLocation,
  locationError,
}) => {

  return (
    <div className="flex flex-col gap-5 items-center justify-center">
      {loading ? (
        <p className="py-5 text-gray-600">추천 가게를 불러오는 중...</p>
      ) : (
        <>
          {dalleImage && (
            <img
              src={
                dalleImage.startsWith('data:image/')
                  ? dalleImage
                  : dalleImage.startsWith('http') || dalleImage.startsWith('https')
                    ? dalleImage
                    : `${backendBaseUrl}${dalleImage}`
              }
              alt="AI 음식점 이미지"
              className="w-[300px] h-[300px] rounded shadow-md py-5"
              onError={e => {
                e.target.onerror = null
                e.target.src = `https://placehold.co/300x300/F0F0F0/6C757D?text=${encodeURIComponent('AI 이미지 오류')}`
              }}
            />
          )}
          {openai && openai.length > 0 ? (
            <ul className="flex flex-col gap-9 py-5 justify-center max-w-md w-full mx-auto">
              <p className="py-2 text-center text-lg font-semibold">
                {userNickname} 님의 취향은 "{mostFrequentKeywords}" 입니다.
              </p>
              {userLocation && (
                <p className="py-1 text-center text-sm text-gray-600">
                  현재 위치: 위도 {userLocation.latitude.toFixed(4)}, 경도{' '}
                  {userLocation.longitude.toFixed(4)}
                </p>
              )}
              {locationError && (
                <p className="py-1 text-center text-sm text-red-500">
                  위치 정보 오류: {locationError}
                </p>
              )}
              <h2 className="text-center text-xl font-bold py-3">이 음식점들을 추천해요!</h2>
              {openai.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-center items-center gap-4 p-4 border rounded-lg shadow-sm w-full max-w-md"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={
                        item.photos && item.photos.length > 0
                          ? item.photos[0].startsWith('http') || item.photos[0].startsWith('https')
                            ? item.photos[0]
                            : `${backendBaseUrl}${item.photos[0]}`
                          : `https://placehold.co/250x250/F0F0F0/6C757D?text=${encodeURIComponent(item.name ? item.name.substring(0, Math.min(5, item.name.length)) : 'No Image')}`
                      }
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={e => {
                        e.target.onerror = null
                        e.target.src = `https://placehold.co/250x250/F0F0F0/6C757D?text=${encodeURIComponent(item.name ? item.name.substring(0, Math.min(5, item.name.length)) : 'No Image')}`
                      }}
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-yellow-500 text-sm">⭐ {item.rating}</p>
                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                    {item.keyword && Array.isArray(item.keyword) && item.keyword.length > 0 && (
                      <p className="text-blue-500 text-xs mt-2">
                        {item.keyword.map(k => `#${k}`).join(' ')}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-5 text-gray-600">AI 추천을 받을 수 없습니다.</p>
          )}
        </>
      )}
    </div>
  )
}

export default MyPageFormAI
