import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../../assets/images/logo.png'
import LogoSm from '../../assets/images/logo-small.png'
import GoogleMaps from '../../features/googleMapsApi/GoogleMaps'
import usePlaceStore from '../../store/usePlaceStore'

const MainHeader = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const isRoot = location.pathname === '/'
  // const isList = location.pathname.startsWith('/list')
  const setPlaceDetails = usePlaceStore(state => state.setPlaceDetails)
  const navigateLogin = () => {
    // navigate('/login')
    console.log('로그인 이동')
  }
  const navigateSignup = () => {
    // navigate('/signup')
    console.log('회원가입 이동')
  }
  const navigateHome = () => {
    setPlaceDetails(null)
    navigate('/')
  }
  return (
    <>
      <div className="w-full pb-5">
        {isRoot === true ? (
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <div onClick={navigateHome}>
                <img src={Logo} alt="logo" className="mouse_pointer" />
              </div>
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
            <GoogleMaps />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <div onClick={navigateHome}>
                <img src={LogoSm} alt="logo" className="mouse_pointer" />
              </div>
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
            <GoogleMaps />
          </div>
        )}
      </div>
    </>
  )
}

export default MainHeader
