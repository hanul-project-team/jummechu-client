import React from 'react'
import { Link } from 'react-router-dom'
import style from './registAction.module.css'

const RegistAction = () => {
  return (
    <div className='flex justify-center gap-2'>
        <p>이미 계정이 있으신가요?</p>
        <Link className={style.redirectBtn} to='/login'>로그인</Link>
    </div>
  )
}

export default RegistAction