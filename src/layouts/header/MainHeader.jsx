import React from 'react'
import { useLocation } from 'react-router-dom'
import MainHeaderTop from './components/MainHeaderTop.jsx'
import CheckBookmarks from './components/CheckBookmarks.jsx'

const MainHeader = () => {
  const location = useLocation()
  const isRoot = location.pathname === '/'
  return (
    <>
      <header>
        {isRoot === true ? (
          <div className="container max-w-5xl mx-auto px-6">
            <MainHeaderTop />
          </div>
        ) : (
          <div className="container max-w-5xl mx-auto px-6 md:relative">
            <MainHeaderTop />
          </div>
        )}
      </header>
      <CheckBookmarks />
    </>
  )
}

export default MainHeader
