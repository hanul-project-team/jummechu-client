import React, {useEffect} from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authCheck } from '../features/auth/authSlice'
import Mainlayout from '../layouts/Mainlayout'
import LoginPage from '../pages/auth/LoginPage'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(authCheck())
  },[dispatch])
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  )
}

export default App
