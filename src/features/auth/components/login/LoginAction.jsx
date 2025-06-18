import React from 'react'
import { Link } from 'react-router-dom'

const LoginAction = () => {
  return (
    <div className="flex justify-center items-center gap-2 text-base ">
      <span className="text-color-gray-700 cursor-default">아직 점메추 회원이 아니신가요?</span>
      <Link to="/regist/method" className="text-color-teal-400 font-semibold hover:underline outline-hidden">
        회원가입
      </Link>
    </div>
  )
}

export default LoginAction
