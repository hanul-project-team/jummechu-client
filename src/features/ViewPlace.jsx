import React from 'react'
import usePlaceStore from '../store/usePlaceStore'
import GoogleReviews from './googleMapsApi/components/GoogleReviews.jsx'
import KakaoPlace from '../features/googleMapsApi/components/KakaoPlace.jsx'

const ViewPlace = () => {
  const placeDetails = usePlaceStore(state => state.placeDetails)

  return (
    <div className="p-3 m-3">
      {placeDetails !== null && (
        <div className="container max-w-6xl mx-auto text-start">
          <div className="flex gap-4 align-center justify-center">
            {!placeDetails?.photos || placeDetails.photos.length === 0
              ? '사진 정보가 존재하지 않음'
              : placeDetails.photos.slice(0, 4).map((photo, i) => (
                  <div key={i} className="w-64 h-64 overflow-hidden my-2">
                    <img
                      src={photo.getUrl()}
                      alt={`place-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
          </div>
          <div className="text-center">
            <h3 className="text-3xl">{placeDetails.name}</h3>
            <p>{placeDetails?.formatted_address}</p>
            <p>
              문의전화 :{' '}
              {placeDetails?.formatted_phone_number
                ? placeDetails.formatted_phone_number
                : '연락처 미제공'}
            </p>
            <p>평점 : {placeDetails.rating}☆</p>
            <div className='flex'>
              <div className='min-w-2/3'>
                <GoogleReviews reviews={placeDetails?.reviews} />
              </div>
              <div className='min-w-1/3'>
                <KakaoPlace />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewPlace
