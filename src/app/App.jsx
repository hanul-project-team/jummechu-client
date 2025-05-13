import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Mainlayout from '../layouts/Mainlayout.jsx'
import HomeSearch from '../features/home/HomeSearch.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        <Route index element={<HomeSearch />}></Route>
      </Route>
    </Routes>
  )
}

export default App
