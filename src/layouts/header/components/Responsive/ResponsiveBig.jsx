import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const ResponsiveBig = ({
  Logo,
  isAuthenticated,
  handleOpen,
  dropdownRef,
  user,
  setLogout,
  open,
}) => {
  return (
    <div className="grid min-sm:grid-cols-3 sm:items-center items-end pt-4 min-sm:pb-8">
      <div className="justify-self-start min-sm:order-1">
        <Link to="/">
          <img src={Logo} alt="logo" />
        </Link>
      </div>
      <div className="justify-self-center min-sm:order-2">
        <ul className="flex items-center gap-2 min-sm:text-md font-semibold">
          <Link to="#">
            <li>공지사항</li>
          </Link>
          <Link to="#">
            <li>자주묻는질문</li>
          </Link>
          <Link to="#">
            <li>점메추 소개</li>
          </Link>
        </ul>
      </div>
      <div className="justify-self-end min-sm:order-3">
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
              {user.role === 'member' && (
                <NavLink
                  to={user.isAccountSetting ? '/mypage' : '/account_setting'}
                  state={{ returnUrl: '/mypage' }}
                >
                  <button className="w-full hover:cursor-pointer text-center underline underline-offset-8 p-2 py-3 bg-white hover:bg-gray-200">
                    마이페이지
                  </button>
                </NavLink>
              )}
              {user.role === 'business' && (
                <NavLink to="/business">
                  <button className="w-full hover:cursor-pointer text-center underline underline-offset-8 p-2 py-3 bg-white hover:bg-gray-200">
                    대시보드
                  </button>
                </NavLink>
              )}
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
            <Link
              to="/regist/method"
              className="font-semibold bg-color-teal-400 text-sm sm:text-base text-white  rounded-2xl p-2"
            >
              회원가입
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResponsiveBig
