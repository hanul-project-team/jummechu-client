import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Mainlayout from '../layouts/Mainlayout'
import Request from '../layouts/Requestlayout/Request'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}></Route>
      <Route path="/Request" element={<Request />}></Route>
    </Routes>
  )
}

export default App
