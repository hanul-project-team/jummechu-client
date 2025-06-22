import React from 'react'

const KakaoButton = ({ className, value }) => {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${import.meta.env.VITE_KAKAO_API_KEY}&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}&response_type=code&prompt=login`
  const handleClick = () => {
    window.location.href = KAKAO_AUTH_URL
  }

  return (
    <button
      onClick={handleClick}
      className={`${className} flex items-center justify-center cursor-pointer outline-hidden`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.00039 1.80005C4.52649 1.80005 0.900391 4.63473 0.900391 8.13165C0.900391 10.305 2.30259 12.2229 4.43919 13.3634L3.54009 16.6846C3.46089 16.979 3.79209 17.2128 4.04679 17.0425L7.98609 14.4116C8.31909 14.4442 8.65659 14.4623 9.00039 14.4623C13.4734 14.4623 17.1004 11.6277 17.1004 8.13165C17.1004 4.63473 13.4734 1.80005 9.00039 1.80005Z"
          fill="black"
        ></path>
      </svg>
      {value}
    </button>
  )
}

export default KakaoButton
