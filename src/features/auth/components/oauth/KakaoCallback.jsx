import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../../slice/authSlice'
import { API } from '../../../../app/api'
import { toast } from 'react-toastify'

const KakaoCallback = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams, _setSearchParams] = useSearchParams()
  useEffect(() => {
    (async () => {
      const code = searchParams.get('code')
      if (code) {
        try {
          const response = await API.post('/auth/kakao_verify', { code })
          dispatch(login(response.data))
          if (response.data.user.isAccountSetting === false) {
            navigate('/account_setting', { state: { from: 'kakao' } })
          } else {
            navigate('/')
          }
        } catch {
          toast.error(
            <div className="Toastify__toast-body cursor-default">잠시 후 다시 시도해주세요</div>,
            {
              position: 'top-center',
            },
          )
          navigate('/')
        }
      }
    })()
  }, [dispatch, navigate, searchParams])
  return null
}

export default KakaoCallback
