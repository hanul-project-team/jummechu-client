import React, {useEffect} from 'react'
import { Routes, Route } from 'react-router-dom'
import Mainlayout from '../layouts/Mainlayout.jsx'
import HomeSearch from '../features/home/HomeSearch.jsx'
import List from '../features/List.jsx'
import SearchResult from '../features/SearchResult.jsx'
import { useDispatch } from 'react-redux'
import { authCheck } from '../features/auth/authSlice'
import LoginPage from '../pages/auth/LoginPage'
// import ViewPlace from '../features/ViewPlace.jsx'
import MyPages from '../pages/mypage/MyPage.jsx'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(authCheck())
  },[dispatch])
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        <Route path="/mypage" element={<MyPages />}></Route>
        <Route index element={<HomeSearch />}></Route>
        <Route path='list' element={<List />}></Route>
        <Route path='search/:query' element={<SearchResult />}></Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="list" element={<List />}></Route>
        {/* <Route path="place/:id" element={<ViewPlace />}></Route> */}
      </Route>
    </Routes>
  )
}

export default App
