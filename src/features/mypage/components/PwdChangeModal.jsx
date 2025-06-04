// src/components/PwdChangeModal.jsx

import React, { useState } from 'react';
import axios from 'axios';
// ... 다른 임포트

const PwdChangeModal = ({ onClose, onPasswordChangeSuccess }) => {
  // ★★★ oldPassword 상태 제거 ★★★
  // const [oldPassword, setOldPassword] = useState(''); // 이 줄 제거
  const [newPassword, setNewPassword] = useState(''); // 새 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(''); // 새 비밀번호 확인

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // ★★★ 유효성 검사에서 oldPassword 관련 조건 제거 ★★★
    if (!newPassword || !confirmPassword) {
      setError('새 비밀번호와 확인 비밀번호를 모두 입력해주세요.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 6) { // 최소 길이 유효성 검사 추가 (권장)
      setError('새 비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    try {
      // API 호출 시 oldPassword 제거
      const response = await axios.put(
        'http://localhost:3000/auth/change-password', // API 주소 확인 (auth/change-password)
        { newPassword, confirmPassword: newPassword }, // ★★★ oldPassword 제거 및 confirmPassword 통일 ★★★
        { withCredentials: true }
      );

      setMessage(response.data.message || '비밀번호가 성공적으로 변경되었습니다.');
      // 변경 성공 후 모달 닫기 및 부모 컴포넌트에 알림
      setTimeout(() => {
        onClose();
        if (onPasswordChangeSuccess) {
          onPasswordChangeSuccess();
        }
      }, 1500); // 1.5초 후 모달 닫기
    } catch (err) {
      console.error('비밀번호 변경 오류:', err.response?.data || err.message);
      setError(err.response?.data?.message || '비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">비밀번호 변경</h2>
        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">새 비밀번호</label>
            <input
              type="password"
              id="newPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">새 비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-color-teal-400 text-color-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              비밀번호 변경
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PwdChangeModal;