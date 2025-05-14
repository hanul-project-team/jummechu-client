import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Mainlayout from '../layouts/Mainlayout'
import MyPage from '../pages/mypage/MyPage'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}></Route>
      <Route path="/mypage" element={<MyPage />}></Route>
    </Routes>
  )
}

export default App
