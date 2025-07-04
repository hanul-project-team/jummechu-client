import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../slice/authSlice'
import { API } from '../../../../app/api'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import GoogleButton from '../../../../shared/GoogleButton'
import KakaoButton from '../../../../shared/KakaoButton'

const LoginAction = ({ returnUrl }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onLogin = async response => {
    const idToken = response.credential
    try {
      const response = await API.post('/auth/google_verify', { token: idToken })
      dispatch(login(response.data))
      if (response.data.user.isAccountSetting === false) {
        return navigate('/account_setting', { state: { returnUrl, from: 'google' } })
      }
      if (returnUrl) {
        return navigate(returnUrl)
      }
      navigate('/')
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
      <div className="flex items-center justify-center gap-2">
        <span className="bg-color-gray-300 h-0.25 grow-1"></span>
        <span className="grow-0">또는</span>
        <span className="bg-color-gray-300 h-0.25 grow-1"></span>
      </div>
      <div className="flex gap-4 justify-center">
        <GoogleButton
          className="p-2 gap-2 font-semibold border border-color-gray-300 rounded-full"
          onLogin={onLogin}
        />
        <KakaoButton className="p-2 gap-2 font-semibold border border-color-yellow-500 bg-color-yellow-500 rounded-full" />
      </div>
      <div className="flex justify-center items-center gap-2 text-base ">
        <span className="text-color-gray-700 cursor-default">아직 점메추 회원이 아니신가요?</span>
        <Link
          to="/regist/method"
          className="text-color-teal-400 font-semibold hover:underline outline-hidden"
          state={{ returnUrl }}
        >
          회원가입
        </Link>
      </div>
    </>
  )
}

export default LoginAction
