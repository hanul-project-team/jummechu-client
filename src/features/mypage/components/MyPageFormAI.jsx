// src/pages/mypage/MyPageFormAI.jsx
import React from 'react'

const MyPageFormAI = ({
  loading,
  dalleImage,
  openai,
  userNickname,
  mostFrequentKeywords,
  userLocation,
  locationError,
  API, // backendBaseUrl을 props로 받도록 추가
}) => {
  const displayKeywords =
    mostFrequentKeywords && mostFrequentKeywords.length > 0
      ? mostFrequentKeywords.join(', ')
      : '다양한 음식'

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-4 bg-white rounded-lg shadow-md">
      {loading ? (
        <div className="flex flex-col items-center">
          <p className="text-xl font-semibold text-gray-700 mb-4">
            {userNickname}님을 위한 음식점 추천을 생성 중입니다...
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          {/* <img src="/loading.gif" alt="Loading..." className="w-24 h-24" /> 예시 로딩 GIF */}
        </div>
      ) : (
        <div className="w-full">
          {/* {locationError ? (
            <p className="text-red-500 text-lg text-center mb-4">{locationError}</p>
          ) : (
            userLocation && (
              <p className="text-gray-600 text-center text-sm mb-4">
                현재 위치: 위도 {userLocation.latitude.toFixed(5)}, 경도 {userLocation.longitude.toFixed(5)}
              </p>
            )
          )} */}

          <p className="text-xl font-semibold text-gray-700 mb-4 text-center">
            "{userNickname}"님이 가장 좋아하는 음식은 "{displayKeywords}" 입니다.
          </p>

          {dalleImage && (
            <div className="mt-8 text-center">
              {/* 이미지 URL이 절대 경로가 아닌 경우, backendBaseUrl을 앞에 붙여줍니다. */}
              {/* 이미지가 백엔드에서 생성된 URL을 그대로 사용한다고 가정합니다. */}
              <img
                src={dalleImage.startsWith('http') ? dalleImage : `${API}${dalleImage}`} // **수정된 부분**
                alt="AI Generated Food"
                className="w-full max-w-md mx-auto rounded-lg shadow-md object-cover"
                style={{ aspectRatio: '16/9' }}
                onError={e => {
                  e.target.onerror = null // Prevent infinite loop
                  e.target.src = 'https://placehold.co/600x400/CCCCCC/FFFFFF?text=Image+Load+Error' // Fallback image
                  console.error('DALL-E 이미지 로드 실패, 대체 이미지 표시:', e.target.src)
                }}
              />
            </div>
          )}

          <h2 className="text-lg text-center font-semibold text-gray-700 mb-4 py-3">
            이런 음식점을 추천해요!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {openai.length > 0 ? (
              openai.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                  <p className="text-yellow-500 font-semibold mb-2">⭐ {item.rating.toFixed(1)}</p>
                  <p className="text-gray-700 mb-2">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(item.keyword) &&
                      item.keyword.map((kw, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full"
                        >
                          {kw}
                        </span>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                AI 추천 데이터를 불러올 수 없습니다.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyPageFormAI
