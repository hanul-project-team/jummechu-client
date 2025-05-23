import React from 'react'
import { Link } from 'react-router-dom'
import style from './loginAction.module.css'

const LoginAction = () => {
  return (
    <div className='flex justify-center items-center gap-2 '>
      <Link to="/find_account?type=id">아이디 찾기</Link>
      <span className={style.verticalBar}></span>
      <Link to="/find_account?type=password">비밀번호 찾기</Link>
      <span className={style.verticalBar}></span>
      <Link to="/regist/type">회원가입</Link>
    </div>
  )
}

export default LoginAction
