import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import AccountSettingForm from '../../features/auth/components/social/AccountSettingForm'

const SocailSettingPage = () => {
  const user = useSelector(state => state.auth.user)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (user.isAccountSetting === undefined || user.isAccountSetting === true) {
      toast.error(<div className="Toastify__toast-body cursor-default">잘못된 접근입니다</div>, {
        position: 'top-center',
      })
      navigate('/')
    }
  }, [user.isAccountSetting, navigate])
  const returnUrl = location.state?.returnUrl
  if (user.isAccountSetting === undefined || user.isAccountSetting === true)
    return <main className="min-h-[1000px]"></main>
  return (
    <main className="container mx-auto max-w-5xl flex justify-center px-6 ">
      <section className="max-w-sm w-full flex flex-col">
        <div className="flex flex-col gap-10">
          <h2 className="text-center text-2xl font-semibold cursor-default">
            계정 설정을 완료해주세요
          </h2>
          <AccountSettingForm returnUrl={returnUrl} />
        </div>
      </section>
    </main>
  )
}

export default SocailSettingPage