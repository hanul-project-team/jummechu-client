import React from 'react'
import AccountSettingForm from '../../features/auth/components/social/AccountSettingForm'

const SocailSettingPage = () => {
  return (
    <main className="container mx-auto max-w-5xl flex justify-center px-6 ">
      <section className="max-w-sm w-full flex flex-col">
        <div className="flex flex-col gap-10">
          <h2 className="text-center text-2xl font-semibold cursor-default">
            계정 설정을 완료해주세요
          </h2>
          <AccountSettingForm />
        </div>
      </section>
    </main>
  )
}

export default SocailSettingPage