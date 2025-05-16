import React, {useEffect} from 'react'
import { Routes, Route } from 'react-router-dom'
import Mainlayout from '../layouts/Mainlayout.jsx'
import HomeSearch from '../features/home/HomeSearch.jsx'
import List from '../features/List.jsx'
// import ViewPlace from '../features/ViewPlace.jsx'
import ViewResult from '../features/ViewResult.jsx'
import { useDispatch } from 'react-redux'
import { authCheck } from '../features/auth/authSlice'
import LoginPage from '../pages/auth/LoginPage'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(authCheck())
  },[dispatch])
  return (
    <Routes>
      <Route path="/" element={<Mainlayout />}>
        <Route index element={<HomeSearch />}></Route>
        <Route path='list' element={<List />}></Route>
        {/* <Route path='place/:id' element={<ViewPlace />}></Route> */}
        <Route path='search/:query' element={<ViewResult />}></Route>
        <Route path="login" element={<LoginPage />} />
      </Route>
    </Routes>
  )
}

export default App
