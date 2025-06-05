// src/components/PasswordVerificationPage.jsx (MypagesAuthForm 컴포넌트)
import React, { useState } from 'react'
import axios from 'axios'
import '../../../assets/styles/tailwind.css'
// import { useNavigate } from 'react-router-dom';

const MypagesAuthForm = ({ onAuthenticated, onCancel }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  // const navigate = useNavigate();

  // ★★★ 디버깅 로그 추가 시작 ★★★
  // console.log('MypagesAuthForm 컴포넌트 렌더링됨')
  // ★★★ 디버깅 로그 추가 끝 ★★★

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setMessage('')

    console.log('handleSubmit 함수 호출됨')

    if (!password) {
      setError('비밀번호를 입력해주세요.')
      return
    }

    try {
      console.log('비밀번호 인증 API 호출 시도 중...')
      const response = await axios.post(
        'http://localhost:3000/auth/verify-password',
        { password: password },
        { withCredentials: true },
      )

      console.log('API 응답 수신:', response)

      if (response.status === 200 && response.data.success) {
        setMessage('비밀번호 인증에 성공했습니다.')
        console.log('비밀번호 인증 성공! 부모 컴포넌트에 알림...')
        if (onAuthenticated) {
          onAuthenticated()
        }
      } else {
        setError(response.data.message || '비밀번호가 일치하지 않습니다.')
        console.log('비밀번호 인증 실패:', response.data.message)
      }
    } catch (err) {
      console.error('비밀번호 인증 실패 (catch 블록):', err.response?.data || err.message)
      setError(
        err.response?.data?.message || '비밀번호 인증 중 오류가 발생했습니다. 다시 시도해주세요.',
      )
    }
  }

  return (
    // ★★★ 이 부분을 수정합니다. ★★★
    // 1. max-w-5xl (최대 너비)와 px-6 (패딩)은 유지합니다.
    // 2. h-full 또는 특정 높이를 주어 부모가 제공하는 공간을 꽉 채우도록 합니다.
    // 3. min-h-screen (화면 전체 높이)을 제거합니다.
    // 4. justify-center와 items-center를 사용하여 내부 요소를 중앙에 정렬합니다.
    <div className="flex bg-gray-200 justify-center items-center w-full h-[700px] p-6">
      {' '}
      {/* p-6 추가로 전체 패딩 적용 */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">비밀번호 확인</h2>
        <p className="mb-6 text-gray-600 text-center">현재 비밀번호를 입력해주세요.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="bg-color-teal-400 text-color-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              확인
            </button>
          </div>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              취소하고 돌아가기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MypagesAuthForm
