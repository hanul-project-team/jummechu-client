import React from 'react'

const SortDropdown = ({ handleSortChange, showSort }) => {
  return (
    <div
      className={`absolute right-[-15px] flex flex-col rounded-xl overflow-hidden z-50
          transform transition-all duration-300 ease-out
          
          ${showSort ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}
          `}
    >
      <button
        className="bg-color-gray-50 p-2 rounded-3xl hover:cursor-pointer hover:bg-gray-200 transition"
        onClick={() => handleSortChange('latest')}
      >
        최신순
      </button>
      <button
        className="bg-color-gray-50 px-2 py-1 rounded-3xl hover:cursor-pointer hover:bg-gray-200 transition"
        onClick={() => handleSortChange('old')}
      >
        오래된순
      </button>
      <button
        className="bg-color-gray-50 p-2 rounded-3xl hover:cursor-pointer hover:bg-gray-200 transition"
        onClick={() => handleSortChange('rating-high')}
      >
        별점높은순
      </button>
      <button
        className="bg-color-gray-50 p-2 rounded-3xl hover:cursor-pointer hover:bg-gray-200 transition"
        onClick={() => handleSortChange('rating-low')}
      >
        별점낮은순
      </button>
    </div>
  )
}

export default SortDropdown
