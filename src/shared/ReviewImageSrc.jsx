import React from 'react'

const ReviewImageSrc = ({ src, alt }) => {
  const serverUrl = 'http://localhost:3000'
  const imgUrl = `${serverUrl}/attachments/${src}`
  return (
    <img
      src={imgUrl}
      alt={alt}
      className="sm:w-[100px] sm:h-[100px] w-[60px] h-[60px] max-[325px]:w-[40px] max-[325px]:h-[40px] object-fit rounded"
    />
  )
}

export default ReviewImageSrc
