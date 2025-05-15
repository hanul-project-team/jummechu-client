import React from 'react'
import usePlaceStore from '../store/usePlaceStore'
import { NavLink } from 'react-router-dom'
import GoogleReviews from './googleMapsApi/components/GoogleReviews.jsx'

const ViewPlace = () => {
  const placeDetails = usePlaceStore(state => state.placeDetails)
  return (
    <div className='p-3 m-3'>
      {placeDetails && (
        <div className="container max-w-6xl mx-auto text-start">
          <div className="flex gap-4 align-center justify-center">
            {placeDetails?.photos !== undefined || placeDetails?.photos !== null
              ? placeDetails.photos.slice(0, 4).map((photo, i) => (
                  <div key={i} className="w-64 h-64 overflow-hidden my-2">
                    <img
                      src={photo.getUrl()}
                      alt={`place-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              : '사진 정보가 존재하지 않음'}
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
          </div>
          <GoogleReviews reviews={placeDetails?.reviews} />
        </div>
      )}
    </div>
  )
}

export default ViewPlace
