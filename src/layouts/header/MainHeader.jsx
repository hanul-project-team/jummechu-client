import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/slice/authSlice'
import axios from 'axios'
import zustandStore from '../../app/zustandStore.js'
import '../../assets/styles/global.css'
import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import Logo from '../../assets/images/logo.png'
import LogoSm from '../../assets/images/logo-small.png'
import KakaoMaps from '../../shared/kakaoMapsApi/KakaoMaps.jsx'

const MainHeader = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const isRoot = location.pathname === '/'
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const user = useSelector(state => state.auth.user)
  const dropdownRef = useRef()

  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const setLogout = async () => {
    try {
      if (confirm('로그아웃 하시겠습니까?')) {
        axios.get('http://localhost:3000/auth/logout', { withCredentials: true })
        dispatch(logout())
        zustandStore.persist.clearStorage()
        localStorage.removeItem('place-storage')
        navigate('/')
      }
    } catch {
      alert('다시 시도해주세요')
    }
  }

  const navigateLogin = () => {
    navigate('/login')
  }
  const navigateRegist = () => {
    navigate('/regist/type')
  }
  const navigateHome = () => {
    navigate('/')
  }
  const handleOpen = () => {
    setOpen(prev => !prev)
  }
  return (
    <>
      <div className="w-full pb-5">
        {isRoot === true ? (
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
              <div onClick={navigateHome}>
                <img src={Logo} alt="logo" className="mouse_pointer" />
              </div>
              {isAuthenticated ? (
                <div className="flex gap-2 items-center relative mouse_pointer">
                  <div className="flex gap-1 p-2" onClick={handleOpen} ref={dropdownRef}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                    <p>{user.name}님</p>
                  </div>
                  <div
                    className={`absolute left-0 top-11 w-fit z-10 bg-gray-100 rounded-b-xl overflow-hidden transition-all duration-300 ease-in-out shadow-lg
          ${open ? 'max-h-60 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}
        `}
                  >
                    {user && user.role === 'member' && (
                      <NavLink to="/mypage">
                        <button className="w-full mouse_pointer text-center underline underline-offset-8 p-2 py-3 bg-white hover:bg-gray-200">
                          마이페이지
                        </button>
                      </NavLink>
                    )}
                    {user && user.role === 'business' && (
                      <NavLink to="#">
                        <button className="w-full mouse_pointer text-center underline underline-offset-8 p-2 py-3 bg-white hover:bg-gray-200">
                          대시보드
                        </button>
                      </NavLink>
                    )}
                    <button
                      className="w-full mouse_pointer text-center underline underline-offset-8 p-2 py-3 bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
                      onClick={setLogout}
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="border bg-teal-400 text-white border-black rounded-3xl p-2 mouse_pointer"
                    onClick={navigateLogin}
                  >
                    로그인
                  </button>
                  <button
                    type="button"
                    className="border bg-white text-teal-400 border-black rounded-3xl p-2 mouse_pointer"
                    onClick={navigateRegist}
                  >
                    회원가입
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-center text-5xl font-bold">어디로 가시나요?</h1>
            <KakaoMaps />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto md:relative">
            <div className="flex justify-between items-center">
              <div onClick={navigateHome}>
                <img src={LogoSm} alt="logo" className="mouse_pointer" />
              </div>
              {isAuthenticated ? (
                <div className="flex gap-2 items-center relative mouse_pointer">
                  <div className="flex gap-1 p-2" onClick={handleOpen} ref={dropdownRef}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-7"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                    <p>{user.name}님</p>
                  </div>
                  <div
                    className={`absolute left-0 top-11 w-fit z-10 bg-gray-100 rounded-b-xl overflow-hidden transition-all duration-300 ease-in-out shadow-lg
          ${open ? 'max-h-60 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}
        `}
                  >
                    {user && user.role === 'member' && (
                      <NavLink to="/mypage">
                        <button className="w-full mouse_pointer text-center underline underline-offset-8 p-2 py-3 bg-white hover:bg-gray-200">
                          마이페이지
                        </button>
                      </NavLink>
                    )}
                    {user && user.role === 'business' && (
                      <NavLink to="#">
                        <button className="w-full mouse_pointer text-center underline underline-offset-8 p-2 py-3 bg-white hover:bg-gray-200">
                          대시보드
                        </button>
                      </NavLink>
                    )}
                    <button
                      className="w-full mouse_pointer text-center underline underline-offset-8 p-2 py-3 bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
                      onClick={setLogout}
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="border bg-teal-400 text-white border-black rounded-3xl p-2 mouse_pointer"
                    onClick={navigateLogin}
                  >
                    로그인
                  </button>
                  <button
                    type="button"
                    className="border bg-white text-teal-400 border-black rounded-3xl p-2 mouse_pointer"
                    onClick={navigateRegist}
                  >
                    회원가입
                  </button>
                </div>
              )}
            </div>
            {<KakaoMaps />}
          </div>
        )}
      </div>
    </>
  )
}

export default MainHeader
