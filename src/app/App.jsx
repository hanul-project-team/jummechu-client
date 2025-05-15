import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Mainlayout from '../layouts/Mainlayout'
import Dashboard from '../layouts/Dashboard_side/Dashboard_Sidebar'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}></Route>
      <Route path='dashboard/*' element={<Dashboard />}/>
    </Routes>
  )
}

export default App
