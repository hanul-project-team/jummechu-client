import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AccountFound = () => {
  const user = useSelector(state => state.findAccountId.user)
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center w-full gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="56"
          height="56"
          viewBox="0 0 56 56"
          fill="none"
        >
          <path
            d="M49 28C49 39.5979 39.5979 49 28 49C16.402 49 7 39.5979 7 28C7 16.402 16.402 7 28 7C39.5979 7 49 16.402 49 28Z"
            fill="#00E600"
            fillOpacity="0.15"
          ></path>
          <path
            d="M49 28C49 39.5979 39.5979 49 28 49C16.402 49 7 39.5979 7 28C7 16.402 16.402 7 28 7C39.5979 7 49 16.402 49 28Z"
            fill="#00E600"
            fillOpacity="0.15"
          ></path>
          <path
            d="M19.8335 27.825L25.4723 32.9L36.7502 22.75"
            stroke="#00E600"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </svg>
        <div className="text-center w-full">
          <h2 className="font-bold text-xl">가입된 아이디를 찾았어요</h2>
          <p className="text-sm">가입된 정보가 맞다면 아래 계정으로 로그인하세요</p>
        </div>
        <div className="flex flex-col gap-1 w-full items-center py-3 bg-gray-200 rounded-sm">
          <p className='font-bold'>{user.email}</p>
          <p className='text-sm'>{user.createdAt.slice(0,10)} 가입</p>
        </div>
      </div>
      <div className="flex justify-between gap-3 w-full">
        <Link
          to="/find_account?type=password"
          className="grow border rounded-sm px-2 py-3 text-center text-white bg-black"
        >
          비밀번호 찾기
        </Link>
        <Link to="/login" className="grow border rounded-sm px-2 py-3 text-center ">
          로그인 하기
        </Link>
      </div>
    </div>
  )
}

export default AccountFound
