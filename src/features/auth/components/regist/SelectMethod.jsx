import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../slice/authSlice'
import { API } from '../../../../app/api'
import { toast } from 'react-toastify'
import GoogleButton from '../../../../shared/GoogleButton'

const SelectMethod = ({ returnUrl }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onLogin = async response => {
    const idToken = response.credential
    try {
      const response = await API.post('/auth/google_verify', { token: idToken })
      dispatch(login(response.data))
      if (response.data.user.isAccountSetting === false) {
        return navigate('/account_setting')
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
        onLogin={onLogin}
      />
    </>
  )
}

export default SelectMethod
