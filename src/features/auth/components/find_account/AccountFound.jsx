import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import axios from 'axios'

const AccountFound = ({ type }) => {
  const user = useSelector(state => state.findAccount.user)
  const sendLink = async () => {
    try {
      await axios.post('http://localhost:3000/auth/send_link', user)
      toast.success(
        <div className="Toastify__toast-body cursor-default">재설정 링크가 전송 되었습니다</div>,
        {
          position: 'top-center',
        },
      )
    } catch (e) {
      if (e.response.status === 404) {
        toast.error(
          <div className="Toastify__toast-body cursor-default">사용자를 찾을 수 없습니다</div>,
          {
            position: 'top-center',
          },
        )
      } else {
        toast.error(
          <div className="Toastify__toast-body cursor-default">잠시 후 다시 시도해주세요</div>,
          {
            position: 'top-center',
          },
        )
      }
    }
  }
  return (
    <>
      <div className="flex flex-col gap-2 w-full items-center py-8 bg-color-gray-50 rounded-lg cursor-default">
        <p className="font-semibold">{user.email}</p>
        {type === 'id' && <p className="text-sm">{user.createdAt.slice(0, 10)} 가입</p>}
      </div>
      <div className="flex justify-between gap-3 w-full">
        {type === 'id' && (
          <>
            <Link
              to="/find_account?type=password"
              replace
              className="outline-hidden font-semibold grow border border-color-gray-900 rounded-lg p-3 text-center text-white bg-color-gray-900"
            >
              비밀번호 찾기
            </Link>
            <Link
              to="/login"
              replace
              className="outline-hidden font-semibold grow border border-color-gray-300 rounded-lg p-3 text-center "
            >
              로그인 하기
            </Link>
          </>
        )}
        {type === 'password' && (
          <>
            <button
              onClick={sendLink}
              className="outline-hidden font-semibold border border-color-gray-900 rounded-lg bg-color-gray-900 text-white p-3 grow cursor-pointer"
            >
              재설정 링크 보내기
            </button>
          </>
        )}
      </div>
    </>
  )
}

export default AccountFound
