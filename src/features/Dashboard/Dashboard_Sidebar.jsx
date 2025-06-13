// App.js 또는 DashboardLayout.js
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import '../../assets/styles/App.css'
import MyShop from './component/MyShop'
import Request from './component/Request'
import ReqSet from './component/ReqSet'

function Dashboard_Sidebar() {
  return (
    <div className="app-container">
      <aside className="sidebar fixed">
        <div className="sidebar-header">000 님의 대시보드</div>
        <nav className="sidebar-menu">
          <Link id='Dashboard_Link_Var' to="/Dashboard"> •  매장 관리</Link>
          <Link id='Dashboard_Link_Var' to="/Dashboard/ReqSet" className="active"> •  입점 신청현황</Link>
          <Link id='Dashboard_Link_Var' to="/Dashboard/Request" className="active"> •  입점 신청하기</Link>
        </nav>
      </aside>
    </div>
  )
}

export default Dashboard_Sidebar
