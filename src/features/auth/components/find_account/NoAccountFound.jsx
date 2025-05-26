import React from 'react'
import { Link } from 'react-router-dom'

const NoAccountFound = () => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center w-full gap-3">
        <svg
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28 49C39.598 49 49 39.598 49 28C49 16.402 39.598 7 28 7C16.402 7 7 16.402 7 28C7 39.598 16.402 49 28 49Z"
            fill="#FF4040"
            fillOpacity="0.15"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M29.75 16.9167C29.75 15.9502 28.9665 15.1667 28 15.1667C27.0335 15.1667 26.25 15.9502 26.25 16.9167V31.2408C26.25 32.2073 27.0335 32.9908 28 32.9908C28.9665 32.9908 29.75 32.2073 29.75 31.2408V16.9167ZM30.3333 38.5C30.3333 37.2113 29.2887 36.1667 28 36.1667C26.7113 36.1667 25.6667 37.2113 25.6667 38.5C25.6667 39.7887 26.7113 40.8334 28 40.8334C29.2887 40.8334 30.3333 39.7887 30.3333 38.5Z"
            fill="#FF4040"
          ></path>
        </svg>
        <div className="text-center w-full">
          <h2 className="font-bold text-xl">가입된 정보가 없어요</h2>
          <p className="text-sm">회원가입하고 새로운 맛집을 추천 받아 보세요</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Link
          to="/find_account?type=id"
          className="border rounded-sm px-2 py-3 text-center text-white bg-black"
        >
          아이디 다시 찾기
        </Link>
        <Link to="/regist/type" className="border rounded-sm px-2 py-3 text-center ">
          이메일로 가입하기
        </Link>
      </div>
    </div>
  )
}

export default NoAccountFound
