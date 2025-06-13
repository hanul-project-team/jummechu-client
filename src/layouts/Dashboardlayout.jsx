import React from 'react'
import { Outlet } from 'react-router-dom'
import Dashboard from '../features/Dashboard/Dashboard_Sidebar'
function Dashboardlayout() {
  return (<>
  <Dashboard />
          <Outlet />
  </>
  )
}

export default Dashboardlayout