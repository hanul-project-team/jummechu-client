import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import axios from 'axios'

const MainHeader = () => {
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const user = useSelector(state => state.auth.user)
  console.log(isAuthenticated)
  console.log(user)
  const setLogout = async () => {
    try {
      axios.get('http://localhost:3000/auth/logout',{withCredentials: true})
      dispatch(logout())
    } catch {
      alert('다시 시도해주세요')
    }
  }
  return (
    <div>
      <button className='border' onClick={setLogout}>로그아웃</button>
    </div>
  )
}

export default MainHeader