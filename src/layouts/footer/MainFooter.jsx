import React from 'react'
import { Link } from 'react-router'

const MainFooter = () => {
  return (
    <footer className="bg-color-gray-50 pt-16 pb-12">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="text-color-gray-700 max-w-xl flex flex-wrap items-center gap-2">
          <span>광주광역시 서구 경열로</span>
          <span className="w-0.25 h-3 bg-color-gray-700"></span>
          <span>대표: 문승준</span>
          <span className="hidden sm:block w-0.25 h-3 bg-color-gray-700"></span>
          <span>개인정보관리책임자: 문승준</span>
          <span>사업자등록번호: 000-00-000000 </span>
          <span className="hidden sm:block w-0.25 h-3 bg-color-gray-700"></span>
          <span>통신판매업: 2025-광주서구-0000 </span>
        </div>
        <div className="text-color-gray-700 max-w-sm flex flex-wrap items-center gap-2 mt-6">
          <Link to="#" className="outline-hidden hover:text-color-gray-900 hover:font-bold">
            이용약관
          </Link>
          <span className="w-0.25 h-3 bg-color-gray-700"></span>
          <Link to="#" className="outline-hidden hover:text-color-gray-900 hover:font-bold">
            개인정보처리방침
          </Link>
          <span>&copy; 2025 Jummechu All Right Reserved</span>
        </div>
        <div className="flex mt-6 gap-2">
          <Link
            to="#"
            className="outline-hidden size-9 flex justify-center items-center bg-color-gray-300 rounded-3xl "
          >
            <img
              alt="페이스북"
              className="size-4"
              src="https://static-v2.imweb.me/io/icons/facebook_icon.svg"
            />
          </Link>
          <Link
            to="#"
            className="outline-hidden size-9 flex justify-center items-center bg-color-gray-300 rounded-3xl "
          >
            <img
              alt="인스타그램"
              className="size-4"
              src="https://static-v2.imweb.me/io/icons/instagram_icon.svg"
            />
          </Link>
          <Link
            to="#"
            className="outline-hidden size-9 flex justify-center items-center bg-color-gray-300 rounded-3xl "
          >
            <img
              alt="유투브"
              className="size-4"
              src="https://static-v2.imweb.me/io/icons/youtube_icon.svg"
            />
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default MainFooter
