import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../../features/auth/slice/authSlice.js'
import zustandStore from '../../../app/zustandStore.js'
import zustandUser from '../../../app/zustandUser.js'
import { toast } from 'react-toastify'
import { API } from '../../../app/api.js'
import Logo from '../../../assets/images/logo.png'
import ResponsiveBig from './Responsive/ResponsiveBig.jsx'
import ResponsiveSmall from './Responsive/ResponsiveSmall.jsx'

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
        API.get('/auth/logout')
        dispatch(logout())
        zustandStore.getState().reset()
        zustandUser.getState().reset()
        try {
          zustandStore.persist?.clearStorage()
          zustandUser.persist?.clearStorage()
        } catch (error) {
          console.log('zustand persist 제거 실패', error)
        }
        toast.success(
          <div className="Toastify__toast-body cursor-default">
            로그아웃 되셨습니다. 안녕히 가십시오.
          </div>,
          {
            position: 'top-center',
          },
        )
        navigate('/')
        return true
      } else {
        return false
      }
    } catch (err) {
      console.error(err)
      alert('다시 시도해주세요')
      navigate('/')
    }
  }
  return (
    <>
      <div className="min-sm:block max-sm:hidden max-sm:pointer-events-none">
        <ResponsiveBig
          Logo={Logo}
          isAuthenticated={isAuthenticated}
          handleOpen={handleOpen}
          dropdownRef={dropdownRef}
          user={user}
          setLogout={setLogout}
          open={open}
        />
      </div>
      <div className="min-sm:hidden min-sm:pointer-events-none max-sm:block">
        <ResponsiveSmall
          Logo={Logo}
          isAuthenticated={isAuthenticated}
          handleOpen={handleOpen}
          dropdownRef={dropdownRef}
          user={user}
          setLogout={setLogout}
          open={open}
        />
      </div>
    </>
  )
}

export default MainHeaderTop
