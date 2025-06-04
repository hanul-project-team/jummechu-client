import React from 'react'
import { Outlet } from 'react-router-dom'
import SimpleHeader from './header/SimpleHeader'
import SimpleFooter from './footer/SimpleFooter'

const Simplelayout = () => {
  return (
    <>
      <SimpleHeader />
      <Outlet />
      <SimpleFooter />
    </>
  )
}

export default Simplelayout
