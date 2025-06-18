import React, { useState } from 'react'
import banner from '../../../assets/images/food-banner.png'

function MyShop() {
  const [rows, setRows] = useState([{ name: '', price: '' }])

  const addRow = () => setRows([...rows, { name: '', price: '' }])

  const removeRow = index => {
    if (rows.length === 1) {
      alert('메뉴는 최소 1개 이상이어야 합니다.')
      return
    }
    setRows(rows.filter((_, i) => i !== index))
  }

  const formatNumber = value => (value ? Number(value).toLocaleString() : '')

  const handleChange = (index, field, value) => {
    const updated = [...rows]
    updated[index][field] = value
    setRows(updated)
  }

  return (
    <div>
      <h1 className="w-full text-center mx-auto text-2xl font-bold p-2.5 border-b border-b-color-gray-300">
        매장관리
      </h1>
      <div className="mx-auto w-200">
        <div className="w-50"></div>
        <h2 className="text-2xl font-bold">
          <input
            type="text"
            name="shopname"
            id="shopname"
            className="w-200 my-2 text-center focus:outline-hidden"
            placeholder="가게 이름"
          />
        </h2>
      </div>
      <div className="m-auto w-200">
        <img src={banner} alt="banner" />
        <label htmlFor="">이미지 변경 | </label>
        <input type="file" accept=".jpg, .png" />
      </div>
      <table
        style={{ width: 800, tableLayout: 'fixed' }}
        className="mx-auto w-[800px] border-collapse mt-5"
      >
        <caption className="text-2xl font-bold">메뉴</caption>
        <colgroup>
          <col style={{ width: '66.66%' }} />
          <col style={{ width: '33.33%' }} />
        </colgroup>
        <thead>
          <tr className="border border-color-gray-300 py-2 px-3 text-center">
            <th className="border border-color-gray-300 py-2 px-3 text-center">메뉴</th>
            <th className="border border-color-gray-300 py-2 px-3 text-center">가격</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td className="border border-color-gray-300 py-2 px-3 text-center">
                <input
                  id={`menu-name-${idx}`}
                  className="text-center focus:outline-hidden"
                  type="text"
                  placeholder="메뉴 이름"
                  value={row.name}
                  onChange={e => handleChange(idx, 'name', e.target.value)}
                  style={{ width: '90%' }}
                />
              </td>
              <td className="border border-color-gray-300 py-2 px-3 text-center">
                <input
                  id={`menu-price-${idx}`}
                  className="text-center focus:outline-hidden"
                  type="text"
                  placeholder="메뉴 가격"
                  value={formatNumber(row.price)}
                  onChange={e => {
                    const raw = e.target.value.replace(/,/g, '')
                    if (/^\d*$/.test(raw)) handleChange(idx, 'price', raw)
                  }}
                  style={{ width: '90%' }}
                />
                원
              </td>
              <td className="border border-color-gray-300 py-2 px-3 text-center">
                <button
                  onClick={() => removeRow(idx)}
                  className="text-white p-1.5 rounded-md bg-color-red-500"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, marginBottom: 20 }}>
        <button onClick={addRow} className="text-2xl hover:text-color-teal-400">
          +
        </button>
      </div>
      <div className="w-[800px] mx-auto flex">
        <span className="grow-1 h-0.25 bg-color-gray-300"></span>
      </div>

      <table
        className="mx-auto w-[800px] border-collapse mt-5"
        style={{
          margin: '20px auto',
        }}
      >
        <caption className="text-2xl font-bold m-3">영업시간</caption>
        <thead>
          <tr className="border border-color-gray-300 py-2 px-3 text-center">
            <th className="border border-color-gray-300 py-2 px-3 text-center">요일</th>
            <th className="border border-color-gray-300 py-2 px-3 text-center" colSpan={2}>
              시간
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border border-color-gray-300 py-2 px-3 text-center">
            <td className="border border-color-gray-300 py-2 px-3 text-center">일</td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
          </tr>
          <tr className="border border-color-gray-300 py-2 px-3 text-center">
            <td className="border border-color-gray-300 py-2 px-3 text-center">월</td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
          </tr>
          <tr className="border border-color-gray-300 py-2 px-3 text-center">
            <td className="border border-color-gray-300 py-2 px-3 text-center">화</td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
          </tr>
          <tr className="border border-color-gray-300 py-2 px-3 text-center">
            <td className="border border-color-gray-300 py-2 px-3 text-center">수</td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
          </tr>
          <tr className="border border-color-gray-300 py-2 px-3 text-center">
            <td className="border border-color-gray-300 py-2 px-3 text-center">목</td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
          </tr>
          <tr className="border border-color-gray-300 py-2 px-3 text-center">
            <td className="border border-color-gray-300 py-2 px-3 text-center">금</td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
          </tr>
          <tr className="border border-color-gray-300 py-2 px-3 text-center">
            <td className="border border-color-gray-300 py-2 px-3 text-center">토</td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
            <td className="border border-color-gray-300 py-2 px-3 text-center">
              <input type="time" className="focus:outline-hidden" /> ~{' '}
              <input type="time" className="focus:outline-hidden" />
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          style={{ color: 'white', backgroundColor: '#39D2D7', borderRadius: '5px' }}
          className="p-2"
        >
          저장
        </button>
      </div>
    </div>
  )
}

export default MyShop
