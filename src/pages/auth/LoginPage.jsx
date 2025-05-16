import React from 'react'
import LoginForm from '../../features/auth/components/login/LoginForm'
import style from './loginPage.module.css'


const LoginPage = () => {
  return (
    <main className="container mx-auto flex justify-center ">
      <section className={`${style.contentWrapper} flex flex-col`}>
        <div className={`flex justify-center pb-3`}>로그인</div>
        <div className={`flex flex-col gap-6`}>
          <LoginForm />
        </div>
      </section>
    </main>
  )
}

export default LoginPage
