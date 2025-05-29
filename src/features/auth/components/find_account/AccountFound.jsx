import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios'
import style from './accountFound.module.css'

const AccountFound = ({ type }) => {
  const [isRequested, setIsRequested] = useState(false)
  const user = useSelector(state => state.findAccount.user)
  const sendLink = async () => {
    try {
      await axios.post('http://localhost:3000/auth/send_link', user)
      setIsRequested(true)
    } catch {
      toast.error(
        <div>
          서버 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </div>,
        { autoClose: 3000 },
      )
    }
  }
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
            <button onClick={sendLink} disabled={isRequested} className={`${style.sendBtn}`}>
              재설정 링크 보내기
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default AccountFound
