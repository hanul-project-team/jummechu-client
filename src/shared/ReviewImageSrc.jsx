import React from 'react'

const ReviewImageSrc = ({ src, alt }) => {
  const serverUrl = 'http://localhost:3000'
  const imgUrl = `${serverUrl}/attachments/${src}`
  return <img src={imgUrl} alt={alt} className="w-24 h-24 object-fit rounded" />
}

export default ReviewImageSrc
