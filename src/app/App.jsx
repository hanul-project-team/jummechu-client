import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Mainlayout from '../layouts/Mainlayout'
import Dashboard from '../layouts/Dashboard_side/Dashboard_Sidebar'
import MyShop from '../pages/MyShop'
import Request from '../pages/Request'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}></Route>
      <Route path='dashboard/' element={<Dashboard />}>
        <Route path='MyShop/' element={<MyShop/>} />
        <Route path='Request/' element={<Request/>} />
      </Route>
    </Routes>
  )
}

export default App
