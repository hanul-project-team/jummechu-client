import React from 'react'
import usePlaceStore from '../../../store/usePlaceStore.js'

const KakaoPlace = () => {
  const kakaoPlace = usePlaceStore(state => state.kakaoPlace)
  const placeDetails = usePlaceStore(state => state.placeDetails)
//   console.log(kakaoPlace)
//   console.log(placeDetails)
  return (
    <>
      <h3 className="text-2xl">관련 장소 &#40;아닐 수 있음&#41;</h3>
      <div className="container w-full">
        {kakaoPlace !== null && kakaoPlace !== '' && (
          <div>
            {kakaoPlace.map((kp, i) => (
              <div key={i} className="flex gap-2">
                <div>
                  {!placeDetails?.photos || placeDetails.photos.length === 0
                    ? '사진 정보가 존재하지 않음'
                    : placeDetails.photos.slice(i, i + 1).map((photo, i) => (
                        <div
                          key={i}
                          className="w-64 h-64 overflow-hidden my-2"
                          style={{ height: '80%' }}
                        >
                          <img
                            src={photo.getUrl()}
                            alt={`place-${i}`}
                            className="max-w-full max-h-full object-cover"
                          />
                        </div>
                      ))}
                </div>
                <div className='font-sans md:font-mono sm:font-serif'>
                  <p><strong>상호명</strong>:{kp.place_name}</p>
                  <p><strong>소재지</strong>:{kp.address_name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default KakaoPlace
