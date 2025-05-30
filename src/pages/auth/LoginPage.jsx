import React from 'react'
import LoginForm from '../../features/auth/components/login/LoginForm'
import LoginAction from '../../features/auth/components/login/LoginAction'

const LoginPage = () => {
  return (
    <main className="container mx-auto max-w-5xl flex justify-center px-6 ">
      <section className="max-w-sm w-full flex flex-col">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-1.5 cursor-default">
            <h2 className=" text-color-gray-900 font-semibold text-2xl">로그인</h2>
            <p className="text-sm text-color-gray-800">ai가 당신만의 맛집을 추천해드립니다</p>
          </div>
          <LoginForm />
          <LoginAction />
        </div>
      </section>
    </main>
  )
}

export default LoginPage
