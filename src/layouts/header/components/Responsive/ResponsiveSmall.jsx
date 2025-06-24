import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { toast } from 'react-toastify'

const ResponsiveSmall = ({
  Logo,
  isAuthenticated,
  handleOpen,
  dropdownRef,
  user,
  setLogout,
  open,
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [isShowing, setIsShowing] = useState(false)
  const handleUserMenu = () => {
    if (openModal === false) {
      setOpenModal(true)
      document.body.style.overflow = 'hidden'
      setTimeout(() => setIsShowing(true), 10)
    } else {
      setIsShowing(false)
      setTimeout(() => {
        setOpenModal(false)
      }, 300)
      document.body.style.overflow = ''
    }
  }
  const handleCloseMenu = () => {
    setIsShowing(false)
    setOpenModal(false)
    document.body.style.overflow = ''
  }
  const handleAlert = () => {
    toast.error(<div className="Toastify__toast-body cursor-default">준비중인 기능입니다.</div>, {
      position: 'top-center',
    })
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Link to="/">
          <img src={Logo} alt="logo" />
        </Link>
        <div
          className="transition-all ease-in-out rounded-3xl active:bg-gray-400 p-1"
          onClick={handleUserMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </div>
      </div>
      {openModal === true && (
        <div className="bg-black/70 fixed inset-0 z-50 flex transition-opacity duration-300">
          <div
            className={`ml-auto w-[70vw] max-w-sm h-full bg-white z-50 relative p-4 rounded-l-2xl transform transition-all duration-300 ease-in-out ${isShowing ? 'translate-x-0' : 'translate-x-full'}`}
          >
            {isAuthenticated ? (
              <div className="text-md">
                <p>
                  <span className="font-semibold">{user?.name}</span>님 어서오세요!
                </p>
              </div>
            ) : (
              <div className="text-md">
                <p>
                  <span>환영합니다</span>
                </p>
              </div>
            )}
            <button className="absolute top-4 right-4 z-50" onClick={handleUserMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full items-center my-3">
              <div className="flex flex-col gap-2 items-center">
                <p className="w-full text-center p-2 rounded-xl active:bg-gray-300">
                  <Link to="#" onClick={handleAlert}>
                    공지사항
                  </Link>
                </p>
                <p className="w-full text-center p-2 rounded-xl active:bg-gray-300">
                  <Link to="#" onClick={handleAlert}>
                    자주묻는질문
                  </Link>
                </p>
                <p className="w-full text-center p-2 rounded-xl active:bg-gray-300">
                  <Link to="#" onClick={handleAlert}>
                    점메추 소개
                  </Link>
                </p>
              </div>
            </div>
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                {user.role === 'member' && (
                  <NavLink
                    to={user.isAccountSetting ? '/mypage' : '/account_setting'}
                    state={{ returnUrl: '/mypage' }}
                  >
                    <button
                      className="w-full border border-gray-300 hover:cursor-pointer text-center underline underline-offset-8 p-2 py-3 bg-white hover:bg-gray-200"
                      onClick={handleCloseMenu}
                    >
                      마이페이지
                    </button>
                  </NavLink>
                )}
                {user.role === 'business' && (
                  <NavLink to="/business">
                    <button
                      className="w-full hover:cursor-pointer text-center underline underline-offset-8 p-2 py-3 bg-white hover:bg-gray-200"
                      onClick={handleCloseMenu}
                    >
                      대시보드
                    </button>
                  </NavLink>
                )}
                <button
                  className="w-full hover:cursor-pointer text-center underline underline-offset-8 p-2 py-3 bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
                  onClick={async () => {
                    const userOut = await setLogout()
                    if (userOut) {
                      handleCloseMenu()
                    }
                  }}
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 text-center">
                <Link
                  to="/login"
                  className="font-semibold border text-sm border-color-gray-300 bg-white text-color-gray-800 rounded-2xl p-2"
                >
                  <button type="button" onClick={handleCloseMenu}>
                    로그인
                  </button>
                </Link>
                <Link
                  to="/regist/method"
                  className="font-semibold bg-color-teal-400 text-sm text-white rounded-2xl p-2"
                >
                  <button type="button" onClick={handleCloseMenu}>
                    회원가입
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ResponsiveSmall
