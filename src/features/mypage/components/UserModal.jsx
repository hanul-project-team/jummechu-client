import { useState, useEffect  } from 'react'



const Modal = ({ isOpen, onClose }) => {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl relative z-10 w-[300px]">
        <h2 className="text-lg font-semibold mb-4">프로필 설정</h2>

        <div className="py-3 flex items-center justify-between">
          <p>프로필 사진</p>
          <div className="relative w-[100px] h-[100px] bg-cover mask-radial-fade group cursor-pointer">
            <div
              className="absolute inset-0 bg-cover mask-radial-fade transition-opacity duration-300"
              style={{ backgroundImage: "url('https://picsum.photos/200')" }}
            >
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              <p className="absolute text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                이미지 변경
              </p>
            </div>
          </div>
        </div>
        <hr className="py-3" />
        <div className="py-3 flex justify-between">
          <p>이름</p>
          <p> 사용자 이름 </p>
        </div>
        <hr className="py-3" />
      
        <div className="flex gap-2">
          <button
            className="mt-4 px-4 py-2 text-black bg-green-600 rounded cursor-pointer"
            onClick={onClose}
          >
            확인/저장
          </button>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}



export default Modal
