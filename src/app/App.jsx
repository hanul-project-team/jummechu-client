import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Mainlayout from '../layouts/Mainlayout'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}></Route>
    </Routes>
  )
}

export default App
