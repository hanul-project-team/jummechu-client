import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Mainlayout from '../layouts/Mainlayout.jsx'
import HomeSearch from '../features/home/HomeSearch.jsx'
import SearchResultPage from '../pages/place/SearchResultPage.jsx'
import { useDispatch } from 'react-redux'
import RegistPage from '../pages/auth/RegistPage'
import LoginPage from '../pages/auth/LoginPage'
import ViewPlace from '../pages/place/ViewPlace.jsx'
import { authCheck } from '../features/auth/slice/authSlice'
import MyPages from '../pages/mypage/MyPage.jsx'
import FindAccountPage from '../pages/auth/FindAccountPage'
import FindAccountResultPage from '../pages/auth/FindAccountResultPage'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(authCheck())
  }, [dispatch])
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        <Route index element={<HomeSearch />}></Route>
        <Route path="search/:query" element={<SearchResultPage />}></Route>
        <Route path="place/:id" element={<ViewPlace />}></Route>
        <Route path="mypage" element={<MyPages />}></Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="regist/:step" element={<RegistPage />} />
        <Route path="find_account" element={<FindAccountPage />} />
        <Route path="find_account/result" element={<FindAccountResultPage />} />
      </Route>
    </Routes>
  )
}

export default App
