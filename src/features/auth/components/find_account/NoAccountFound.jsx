import React from 'react'
import { Link } from 'react-router-dom'

const NoAccountFound = () => {
  return (
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
  )
}

export default NoAccountFound
