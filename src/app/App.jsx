import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Mainlayout from '../layouts/Mainlayout.jsx'
import HomeSearch from '../features/home/HomeSearch.jsx'
import List from '../features/List.jsx'
import ViewPlace from '../features/ViewPlace.jsx'
import MyPages from '../pages/mypage/MyPage.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        <Route path="/mypage" element={<MyPages />}></Route>
        <Route index element={<HomeSearch />}></Route>
        <Route path="list" element={<List />}></Route>
        <Route path="place/:id" element={<ViewPlace />}></Route>
      </Route>
    </Routes>
  )
}

export default App
