import React, { useState } from 'react'
import '../assets/styles/App.css'
import banner from '../assets/images/food-banner.png'

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
      <h1 className="w-100 text-center m-auto title h1-box">매장관리</h1>

      <div className="m-auto w-200" >
        <div className='w-50'></div>
        <h2 className="title">
          <input type="text" name="shopname" id="shopname" className='w-200 m-auto text-center' placeholder='가게 이름'/>
        </h2>
      </div>
      <div className="m-auto w-200" >
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
                className='shop-input'
                  type="text"
                  placeholder="메뉴 이름"
                  value={row.name}
                  onChange={e => handleChange(idx, 'name', e.target.value)}
                  style={{ width: '90%' }}
                />
              </td>
              <td>
                <input
                className='shop-input'
                  type="text"
                  placeholder="메뉴 가격"
                  value={formatNumber(row.price)}
                  onChange={e => {
                    const raw = e.target.value.replace(/,/g, '')
                    if (/^\d*$/.test(raw)) handleChange(idx, 'price', raw)
                  }}
                  style={{ width: '90%' }}
                />원
              </td>
              <td>
                <button onClick={() => removeRow(idx)} className="delete_b">
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 , marginBottom: 20 }}>
        <button onClick={addRow} className="plus-b">
          +
        </button>
      </div>
      <div className='Separation'></div>

      <table
        style={{
          margin: '20px auto',
        }}
      >
        <caption className="title m-3">영업시간</caption>
        <thead>
          <tr>
            <th>요일</th>
            <th colSpan={2}>시간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>일</td>
            <td><input type="time"/> ~ <input type="time"/></td>
            <td><input type="time"/> ~ <input type="time"/></td>
          </tr>
          <tr>
            <td>월</td>
            <td><input type="time"/> ~ <input type="time"/></td>
            <td><input type="time"/> ~ <input type="time"/></td>
          </tr>
          <tr>
            <td>화</td>
            <td><input type="time"/> ~ <input type="time"/></td>
            <td><input type="time"/> ~ <input type="time"/></td>
          </tr>
          <tr>
            <td>수</td>
            <td><input type="time"/> ~ <input type="time"/></td>
            <td><input type="time"/> ~ <input type="time"/></td>
          </tr>
          <tr>
            <td>목</td>
            <td><input type="time"/> ~ <input type="time"/></td>
            <td><input type="time"/> ~ <input type="time"/></td>
          </tr>
          <tr>
            <td>금</td>
            <td><input type="time"/> ~ <input type="time"/></td>
            <td><input type="time"/> ~ <input type="time"/></td>
          </tr>
          <tr>
            <td>토</td>
            <td><input type="time"/> ~ <input type="time"/></td>
            <td><input type="time"/> ~ <input type="time"/></td>
          </tr>
        </tbody>
      </table>
      <div style={{display: "flex", justifyContent: 'center'}}>
        <button style={{color: "white", backgroundColor: "#39D2D7", borderRadius: "5px"}} className='p-2'>저장</button>
      </div>
    </div>
  )
}

export default MyShop
