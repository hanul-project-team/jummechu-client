import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import Logo from '../../assets/images/logo.png'

const MainHeader = () => {
  const navigate = useNavigate()

  const navigateLogin = () => {
    // navigate('/login')
    console.log('로그인 이동')
  }
  const navigateSignup = () => {
    // navigate('/signup')
    console.log('회원가입 이동')
  }
  return (
    <div className='w-full pb-5'>
      <div className='max-w-7xl mx-auto'>
        <div className="flex justify-between items-center">
          <Link to='/'><img src={Logo} alt="logo" /></Link>
          <div className="flex gap-3">
            <button
              type="button"
              className="border bg-teal-400 text-white border-black rounded-3xl p-2 font-sans mouse_pointer"
              onClick={navigateLogin}
            >
              로그인
            </button>
            <button
              type="button"
              className="border bg-white text-teal-400 border-black rounded-3xl p-2 font-sans mouse_pointer"
              onClick={navigateSignup}
            >
              회원가입
            </button>
          </div>
        </div>
        <h1 className="text-center text-5xl font-sans font-bold">어디로 가시나요?</h1>
        <nav></nav>
      </div>
    </div>
  )
}

export default MainHeader
