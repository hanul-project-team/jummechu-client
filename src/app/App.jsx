import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authCheck } from '../features/auth/slice/authSlice'
import Mainlayout from '../layouts/Mainlayout'
import RegistPage from '../pages/auth/RegistPage'
import LoginPage from '../pages/auth/LoginPage'
import HelpPage from '../pages/auth/HelpPage'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(authCheck())
  }, [dispatch])
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        <Route path="regist/:step" element={<RegistPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>
    </Routes>
  )
}

export default App
