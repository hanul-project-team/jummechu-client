import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Mainlayout from '../layouts/Mainlayout'
import LoginPage from '../pages/login/LoginPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  )
}

export default App
