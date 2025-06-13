import React from 'react'
import { Outlet } from 'react-router-dom'
import Dashboard from './sidebar/Sidebar'
function Dashboardlayout() {
  return (
    <>
      <Dashboard />
      <Outlet />
    </>
  )
}

export default Dashboardlayout
