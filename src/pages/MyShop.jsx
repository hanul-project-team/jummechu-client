import React, { useState } from 'react'
import '../assets/styles/App.css'
import banner from '../assets/images/food-banner.png'

function MyShop() {
  const [rows, setRows] = useState([{ name: '', price: '' }])

  const addRow = () => setRows([...rows, { name: '', price: '' }])

  const formatNumber = value => (value ? Number(value).toLocaleString() : '')

  const handleChange = (index, field, value) => {
    const updated = [...rows]
    updated[index][field] = value
    setRows(updated)
  }

  return (
    <div>
      <h1 className="w-100 text-center m-auto title h1-box">매장관리</h1>

      <div className="m-auto w-200">
        <h2 className="title">매장이름</h2>
        <img src={banner} alt="banner" />
      </div>

      <table style={{ width: 800, tableLayout: 'fixed' }}>
        <caption className="title">메뉴</caption>
        <colgroup>
          <col style={{ width: '66.66%' }} />
          <col style={{ width: '33.33%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>메뉴</th>
            <th>가격</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td>
                <input
                  type="text"
                  placeholder="메뉴 이름"
                  value={row.name}
                  onChange={e => handleChange(idx, 'name', e.target.value)}
                  style={{ width: '90%' }}
                />
              </td>
              <td>
                <input
                  type="text"
                  placeholder="메뉴 가격"
                  value={formatNumber(row.price)}
                  onChange={e => {
                    const raw = e.target.value.replace(/,/g, '')
                    if (/^\d*$/.test(raw)) handleChange(idx, 'price', raw)
                  }}
                  style={{ width: '90%' }}
                />
              </td>
              <td>
                <button className="delete_b">
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
        <button onClick={addRow} className="plus-b">
          +
        </button>
      </div>
      <div className='Separation'></div>

    </div>
  )
}

export default MyShop
