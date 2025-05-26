import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AccountFound = ({ type }) => {
  const user = useSelector(state => state.findAccount.user)
  return (
    <>
      <div className="flex flex-col gap-1 w-full items-center py-3 bg-gray-200 rounded-sm">
        <p className="font-bold">{user.email}</p>
        {type === 'id' && <p className="text-sm">{user.createdAt.slice(0, 10)} 가입</p>}
      </div>
      <div className="flex justify-between gap-3 w-full">
        {type === 'id' && (
          <>
            <Link
              to="/find_account?type=password"
              className="grow border rounded-sm px-2 py-3 text-center text-white bg-black"
            >
              비밀번호 찾기
            </Link>
            <Link to="/login" className="grow border rounded-sm px-2 py-3 text-center ">
              로그인 하기
            </Link>
          </>
        )}
        {type === 'password' && (
          <>
            <button className="grow border rounded-sm px-2 py-3 text-center text-white bg-black">
              재전송 하기
            </button>
            <Link to="/login" className="grow border rounded-sm px-2 py-3 text-center ">
              로그인 하기
            </Link>
          </>
        )}
      </div>
    </>
  )
}

export default AccountFound
