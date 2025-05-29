// components/PasswordChangeModal.jsx
import React, { useState } from 'react'
import axios from 'axios'

const PwdChangeModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async e => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (newPassword !== confirmNewPassword) {
      setError('새 비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const response = await axios.put(
        'http://localhost:3000/auth/change-password',
        {
          currentPassword,
          newPassword,
        },
        {
          withCredentials: true,
        },
      )

      if (response.status === 200) {
        setMessage(response.data.message)
        alert('비밀번호가 변경되었습니다. 다시 로그인 해주세요.')
        // 비밀번호 변경 성공 후 모든 로그인 세션 무효화
        // 클라이언트에서 토큰 삭제 및 로그인 페이지로 리디렉션
        localStorage.removeItem('accessToken') // 예시: 실제 사용하는 토큰 이름
        onClose() // 모달 닫기
        window.location.href = '/login' // 로그인 페이지로 이동
      } else {
        setError(response.data.message || '비밀번호 변경에 실패했습니다.')
      }
    } catch (err) {
      console.error('비밀번호 변경 오류:', err)
      setError(err.response?.data?.message || '서버 오류가 발생했습니다.')
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">비밀번호 변경</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
              현재 비밀번호
            </label>
            <input
              type="password"
              id="currentPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
              새 비밀번호
            </label>
            <span className="text-gray-500 text-sm ">
              영문/숫자/특수문자(~!@#^*_=+-) 포함 8자 이상
            </span>
            <input
              type="password"
              id="newPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmNewPassword"
            >
              새 비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              required
            />
          </div>
          {message && <p className="text-green-500 text-center mb-4">{message}</p>}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              비밀번호 변경
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PwdChangeModal
