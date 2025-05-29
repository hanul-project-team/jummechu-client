import React from 'react'
import { useLocation } from 'react-router-dom'
import MainHeaderTop from './components/MainHeaderTop.jsx'
import KakaoMaps from '../../features/kakaoMapsApi/KakaoMaps.jsx'

const MainHeader = () => {
  const location = useLocation()
  const isRoot = location.pathname === '/'
  return (
    <header className="pb-5">
      {isRoot === true ? (
        <div className="container max-w-5xl mx-auto px-6">
          <MainHeaderTop />
          <h1 className="text-center text-4xl sm:text-5xl font-bold">오늘 뭐 먹지?</h1>
          <KakaoMaps />
        </div>
      ) : (
        <div className="container max-w-5xl mx-auto md:relative">
          <MainHeaderTop />
          <KakaoMaps />
        </div>
      )}
    </header>
  )
}

export default MainHeader
