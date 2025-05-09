import React from 'react'
import { Outlet } from 'react-router-dom'
import MainHeader from './header/MainHeader'
import MainFooter from './footer/MainFooter'

const Mainlayout = () => {
  return (
    <>
      <MainHeader />
      <Outlet />
      <MainFooter />
    </>
  )
}

export default Mainlayout
