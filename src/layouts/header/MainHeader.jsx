import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from '../../assets/images/logo.png'
import LogoSm from '../../assets/images/logo-small.png'
// import GoogleMaps from '../../features/googleMapsApi/GoogleMaps'
import usePlaceStore from '../../store/usePlaceStore'
import KakaoMaps from '../../features/kakaoMapsApi/KakaoMaps.jsx'

const MainHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isRoot = location.pathname === '/'
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const user = useSelector(state => state.auth.user)
  // console.log(isAuthenticated)
  // console.log(user)

  const setLogout = async () => {
    try {
      if (confirm('로그아웃 하시겠습니까?')) {
        axios.get('http://localhost:3000/auth/logout', { withCredentials: true })
        dispatch(logout())
        navigate('/')
      }
    } catch {
      alert('다시 시도해주세요')
    }
  }
  // const isList = location.pathname.startsWith('/list')
  const setKakaoPlace = usePlaceStore(state => state.setKakaoPlace)
  const navigateLogin = () => {
    navigate('/login')
    console.log('로그인 이동')
  }
  const navigateSignup = () => {
    navigate('/signup')
    console.log('회원가입 이동')
  }
  const navigateHome = () => {
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
              {isAuthenticated ? (
                <div>
                  <button className="border p-2 rounded-xl" onClick={setLogout}>
                    로그아웃
                  </button>
                </div>
              ) : (
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
              )}
            </div>
            <h1 className="text-center text-5xl font-sans font-bold">어디로 가시나요?</h1>
            {/* <GoogleMaps /> */}
            <KakaoMaps />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto md:relative">
            <div className="flex justify-between items-center">
              <div onClick={navigateHome}>
                <img src={LogoSm} alt="logo" className="mouse_pointer" />
              </div>
              {isAuthenticated ? (
                <div>
                  <button className="border p-2 rounded-xl" onClick={setLogout}>
                    로그아웃
                  </button>
                </div>
              ) : (
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
              )}
            </div>
            {/* <GoogleMaps /> */}
            {<KakaoMaps />}
          </div>
        )}
      </div>
    </>
  )
}

export default MainHeader
