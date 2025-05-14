import React, { useState } from 'react'

const MyPageForm = () => {
  const [active, setActive] = useState('최근기록')
  const tabs = ['최근기록', '찜', '공유', '음식점 추천']

  const handleClick = (e, tab) => {
    e.preventDefault()
    setActive(tab)
  }

  return (
    <div>
      <ul className="flex ">
        {tabs.map(tab => (
          <button
          type="button"
            onClick={e => handleClick(e, tab)}
            className={`pb-2 text-gray-600 font-medium border-b-2 transition duration-200 ${
              active === tab
                ? 'border-blue-500 text-blue-500'
                : 'border-transparent hover:border-gray-300 hover:text-black'
            }`}
          >{tab}</button>
        ))}
      </ul>
      <div>
        <p><strong>{active}</strong></p>
      </div>
    </div>
  )
}

export default MyPageForm
