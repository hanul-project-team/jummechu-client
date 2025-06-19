import React from 'react'
import { Link } from 'react-router-dom'

const BusinessNav = () => {
  return (
    <nav>
      <Link
        to="/business"
        className="text-white mb-4 block py-2 px-3 rounded-md hover:bg-white hover:text-color-gray-900"
      >
        {' '}
        • 매장 관리
      </Link>
      <Link
        to="/business/reqset"
        className="text-white mb-4 block py-2 px-3 rounded-md hover:bg-white hover:text-color-gray-900"
      >
        {' '}
        • 입점 신청현황
      </Link>
      <Link
        to="/business/request"
        className="text-white mb-4 block py-2 px-3 rounded-md hover:bg-white hover:text-color-gray-900"
      >
        {' '}
        • 입점 신청하기
      </Link>
    </nav>
  )
}

export default BusinessNav
