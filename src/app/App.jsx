import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { restoreLogin } from '../features/auth/slice/authSlice'
import Mainlayout from '../layouts/Mainlayout'
import HomeSearch from '../pages/home/HomeSearch.jsx'
import SearchResultPage from '../pages/place/SearchResultPage.jsx'
import ViewPlace from '../pages/place/ViewPlace.jsx'
import MyPages from '../pages/mypage/MyPage.jsx'
import Simplelayout from '../layouts/Simplelayout.jsx'
import RegistPage from '../pages/auth/RegistPage'
import LoginPage from '../pages/auth/LoginPage'
import FindAccountPage from '../pages/auth/FindAccountPage'
import FindAccountResultPage from '../pages/auth/FindAccountResultPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage.jsx'
import SocailSettingPage from '../pages/auth/SocailSettingPage.jsx'
import Dashboardlayout from '../layouts/Dashboardlayout.jsx'
import MyjobPage from '../pages/business/MyjobPage.jsx'
import MyRequestPage from '../pages/business/MyRequestPage.jsx'
import ReqsetPage from '../pages/business/ReqsetPage.jsx'


const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(restoreLogin())
  }, [dispatch])
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        <Route index element={<HomeSearch />}></Route>
        <Route path="search/:query" element={<SearchResultPage />}></Route>
        <Route path="place/:id" element={<ViewPlace />}></Route>
        <Route path="mypage" element={<MyPages />}></Route>
      </Route>
      <Route element={<Simplelayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="regist" element={<Navigate to="/regist/method" replace />} />
        <Route path="regist/:step" element={<RegistPage />} />
        <Route path="find_account" element={<FindAccountPage />} />
        <Route path="find_account/result" element={<FindAccountResultPage />} />
        <Route path="find_account/reset" element={<ResetPasswordPage />} />
        <Route path="social_setting" element={<SocailSettingPage />} />
      </Route>
      <Route element={<Dashboardlayout />}>
        <Route path="business" element={<MyjobPage />} />
        <Route path="business/request" element={<MyRequestPage />} />
        <Route path="business/reqset" element={<ReqsetPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
