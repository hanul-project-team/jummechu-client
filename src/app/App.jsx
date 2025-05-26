import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { authCheck } from '../features/auth/slice/authSlice'
import Mainlayout from '../layouts/Mainlayout'
import HomeSearch from '../features/home/HomeSearch.jsx'
import SearchResult from '../features/search/SearchResult.jsx'
import ViewPlace from '../features/search/place/ViewPlace.jsx'
import MyPages from '../pages/mypage/MyPage.jsx'
import RegistPage from '../pages/auth/RegistPage'
import LoginPage from '../pages/auth/LoginPage'
import FindAccountPage from '../pages/auth/FindAccountPage'
import FindAccountResultPage from '../pages/auth/FindAccountResultPage'
import Dashboard from '../layouts/Dashboardlayout.jsx'
import MyShop from '../features/Dashboard/component/MyShop.jsx'
import Request from '../features/Dashboard/component/Request.jsx'
import ReqSet from '../features/Dashboard/component/Request.jsx'
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(authCheck())
  }, [dispatch])
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        <Route index element={<HomeSearch />}></Route>
        <Route path="search/:query" element={<SearchResult />}></Route>
        <Route path="place/:id" element={<ViewPlace />}></Route>
        <Route path="mypage" element={<MyPages />}></Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="regist/:step" element={<RegistPage />} />
        <Route path="find_account" element={<FindAccountPage />} />
        <Route path="find_account/result" element={<FindAccountResultPage />} />
      </Route>
      <Route element={<Dashboard/>}>
            <Route path="Dashboard/" element={<MyShop />} />
            <Route path="Dashboard/Request" element={<Request />} />
            <Route path="Dashboard/ReqSet" element={<ReqSet />} />
          </Route>
    </Routes>
  )
}

export default App
