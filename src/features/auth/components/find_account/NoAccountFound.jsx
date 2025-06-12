import React from 'react'
import { Link } from 'react-router-dom'

const NoAccountFound = () => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <Link
        to="/find_account?type=id"
        replace
        className="font-semibold outline-hidden border border-color-gray-900 bg-color-gray-900 rounded-lg p-3 text-center text-white"
      >
        아이디 다시 찾기
      </Link>
      <Link
        to="/regist/type"
        replace
        className="font-semibold outline-hidden border border-color-gray-300 rounded-lg p-3 text-center"
      >
        이메일로 가입하기
      </Link>
    </div>
  )
}

export default NoAccountFound
