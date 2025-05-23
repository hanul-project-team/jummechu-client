import React from 'react'
import { Link } from 'react-router'

const MainFooter = () => {
  return (
    <div className='w-full bg-gray-300'>
      <div className='font-sans max-w-3xl mx-auto p-3'>
        <div className='flex gap-1 my-1 py-1'>
          <Link to='#'>
            <p>데이터 제휴 문의</p>
          </Link>
          <span>|</span>
          <Link to='#'>
            <p>개인정보처리방침</p>
          </Link>
          <span>|</span>
          <Link to='#'>
            <p>이용약관</p>
          </Link>
          <span>|</span>
          <Link to='#'>
            <p>위치기반 서비스 이용약관</p>
          </Link>
          <span>|</span>
          <Link to='#'>
            <p>입점 신청하기</p>
          </Link>
        </div>
        <div className='flex gap-1 my-1 py-1'>
          <p>㈜점메추</p>
          <span>|</span>
          <p>소재지 : 한울직업전문학교</p>
          <span>|</span>
          <p>사업자번호 : 123-45-67890</p>
        </div>
        <div className='my-1 py-1'>
          <p>이메일문의 : contact.lunchmenu@korea.com</p>
        </div>
        <div className='my-1 py-1'>
          copyrights&copy; all rights reserved by 점메추
        </div>
      </div>
    </div>
  )
}

export default MainFooter