import React from 'react'
import Icon from '../assets/images/default2.png'

const ReviewImageSrc = ({ src, alt }) => {
  const serverUrl = import.meta.env.VITE_API_BASE_URL
  const imgUrl = serverUrl+src

  return (
    <img
      src={`${imgUrl}`}
      alt={alt}
      className="sm:w-[100px] sm:h-[100px] w-[60px] h-[60px] max-[325px]:w-[40px] max-[325px]:h-[40px] object-fit rounded"
      onError={e => {
        e.target.src = Icon
        e.target.onerror = null
      }}
    />
  )
}

export default ReviewImageSrc
