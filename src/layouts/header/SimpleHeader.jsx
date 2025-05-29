import React from 'react'
import { Link } from 'react-router-dom'
import LogoBig from '../../assets/images/logo-big.png'

const SimpleHeader = () => {
  return (
    <header className='py-10'>
      <div className="container mx-auto max-w-5xl px-6">
        <div className='flex justify-center'>
            <Link to='/'>
              <img src={LogoBig} alt="점메추 로고" />
            </Link>
        </div>
      </div>
    </header>
  )
}

export default SimpleHeader
