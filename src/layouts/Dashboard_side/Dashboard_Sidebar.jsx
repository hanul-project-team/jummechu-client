// App.js 또는 DashboardLayout.js
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import '../../assets/styles/App.css'

import MyShop from '../../pages/MyShop'
import Request from '../../pages/Request'
import ReqSet from '../../pages/ReqSet'

function Dashboard_Sidebar() {
  return (
    <div className="app-container">
      <aside className="sidebar fixed">
        <div className="sidebar-header">000 님의 대시보드</div>
        <nav className="sidebar-menu">
          <Link to="/Dashboard"> •  매장 관리</Link>
          <Link to="/Dashboard/ReqSet" className="active"> •  입점 신청현황</Link>
          <Link to="/Dashboard/Request" className="active"> •  입점 신청하기</Link>
        </nav>
      </aside>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<MyShop />} />
            <Route path="/Request" element={<Request />} />
            <Route path="/ReqSet" element={<ReqSet />} />
          </Routes>
        </main>
    </div>
  )
}

export default Dashboard_Sidebar
