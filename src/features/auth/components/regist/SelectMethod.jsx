import React from 'react'
import { Link } from 'react-router-dom'
import { API } from '../../../../app/api'
import { toast } from 'react-toastify'
import GoogleButton from '../../../../shared/GoogleButton'

const SelectMethod = () => {
  const onClick = async response => {
    const idToken = response.credential
    console.log('받은 ID 토큰:', idToken)
    try {
      const res = await API.post('/auth/google_verify', { token: idToken })
      console.log('로그인 성공:', res.data)
    } catch {
      toast.error(
        <div className="Toastify__toast-body cursor-default">잠시 후 다시 시도해주세요</div>,
        {
          position: 'top-center',
        },
      )
    }
  }
  return (
    <>
      <Link
        to="/regist/type"
        className="text-center font-semibold border p-3 bg-color-gray-900 border-color-gray-900 text-white rounded-lg outline-hidden"
      >
        이메일로 가입
      </Link>
      <div className="flex items-center justify-center gap-2">
        <span className="bg-color-gray-300 h-0.25 grow-1"></span>
        <span className="grow-0">또는</span>
        <span className="bg-color-gray-300 h-0.25 grow-1"></span>
      </div>
      <GoogleButton
        className="p-3 gap-2 font-semibold border border-color-gray-300 rounded-lg"
        value="Google로 가입"
        onClick={onClick}
      />
    </>
  )
}

export default SelectMethod
