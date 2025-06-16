import React from 'react'
import { useSelector } from 'react-redux'
import BusinessNav from './components/BusinessNav'

function Dashboard_Sidebar() {
  const user = useSelector(state => state.auth.user)
  return (
    <div className="flex">
      <aside className="w-sm h-full flex flex-col text-white p-5 bg-color-teal-400 fixed">
        <div className="font-bold text-xl mb-8">{user.name} 님의 대시보드</div>
        <BusinessNav />
      </aside>
    </div>
  )
}

export default Dashboard_Sidebar
