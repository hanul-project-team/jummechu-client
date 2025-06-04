import React from 'react'
import { Link } from 'react-router-dom'

const RegistAction = () => {
  return (
    <div className='flex justify-center gap-2'>
        <p className='cursor-default text-color-gray-700'>이미 계정이 있으신가요?</p>
        <Link to='/login' className='outline-hidden text-color-teal-400 font-semibold hover:underline'>로그인</Link>
    </div>
  )
}

export default RegistAction