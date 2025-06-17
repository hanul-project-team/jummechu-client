import React from 'react'
import { useLocation } from 'react-router-dom'
import AccountSettingForm from '../../features/auth/components/social/AccountSettingForm'

const SocailSettingPage = () => {
  const location = useLocation()
  const returnUrl = location.state?.returnUrl
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