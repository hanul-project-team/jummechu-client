import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../../features/auth/slice/authSlice'
import axios from 'axios'
import Logo from '../../../assets/images/logo.png'

const MainHeaderTop = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
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

  const handleOpen = () => {
    setOpen(prev => !prev)
  }
  if (isAuthenticated === undefined) return null
  const setLogout = async () => {
    try {
      if (confirm('로그아웃 하시겠습니까?')) {
        axios.get('http://localhost:3000/auth/logout', { withCredentials: true })
        dispatch(logout())
        localStorage.removeItem('place-storage')
        navigate('/')
      }
    } catch {
      alert('다시 시도해주세요')
    }
  }
  return (
    <div className="flex justify-between sm:items-center items-end pt-4 pb-8">
      <Link to="/">
        <img src={Logo} alt="logo" />
      </Link>
      {isAuthenticated ? (
        <div className="flex gap-2 items-center relative hover:cursor-pointer">
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
          ${open ? 'max-h-60 opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'}`}
          >
            {user.role === 'member' && <NavLink to="/mypage">
              <button className="w-full hover:cursor-pointer text-center underline underline-offset-8 p-2 py-3 bg-white hover:bg-gray-200">
                마이페이지
              </button>
            </NavLink>}
            {user.role === 'business' && <NavLink to="/business">
              <button className="w-full hover:cursor-pointer text-center underline underline-offset-8 p-2 py-3 bg-white hover:bg-gray-200">
                대시보드
              </button>
            </NavLink>}
            <button
              className="w-full hover:cursor-pointer text-center underline underline-offset-8 p-2 py-3 bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
              onClick={setLogout}
            >
              로그아웃
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <Link
            to="/login"
            className="font-semibold border text-sm sm:text-base border-color-gray-300 bg-white text-color-gray-800 rounded-2xl p-2"
          >
            로그인
          </Link>
          <Link to="/regist/method" className="font-semibold bg-color-teal-400 text-sm sm:text-base text-white  rounded-2xl p-2">
            회원가입
          </Link>
        </div>
      )}
    </div>
  )
}

export default MainHeaderTop
