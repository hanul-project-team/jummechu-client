// src/components/SettingsModal.js
import React from 'react'

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl relative z-10 w-[300px]">
        <h2 className="text-lg font-semibold mb-4">프로필 설정</h2>
        <p>여기에 설정 내용을 작성하세요.</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        >
          닫기
        </button>
      </div>
    </div>
  )
}

export default Modal
