import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Mainlayout from '../layouts/Mainlayout.jsx'
import HomeSearch from '../features/home/HomeSearch.jsx'
import SearchResultPage from '../pages/place/SearchResultPage.jsx'
import { useDispatch } from 'react-redux'
import { authCheck } from '../features/auth/authSlice'
import RegistPage from '../pages/auth/RegistPage'
import LoginPage from '../pages/auth/LoginPage'
import ViewPlace from '../pages/place/ViewPlace.jsx'
import MyPages from '../pages/mypage/MyPage.jsx'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(authCheck())
  }, [dispatch])
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        <Route index element={<HomeSearch />}></Route>
        <Route path="mypage" element={<MyPages />}></Route>
        <Route path="search/:query" element={<SearchResultPage />}></Route>
        <Route path="regist/:step" element={<RegistPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="place/:id" element={<ViewPlace />}></Route>
      </Route>
    </Routes>
  )
}

export default App
