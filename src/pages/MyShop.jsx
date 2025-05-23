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
      <h1 className="w-100 text-center m-auto title-style h1-box ">매장관리</h1>

      <div className="m-auto w-200" >
        <div className='w-50'></div>
        <h2 className="title-style">
          <input type="text" name="shopname" id="shopname" className='w-200 my-2 text-center focus:outline-hidden' placeholder='가게 이름'/>
        </h2>
      </div>
      <div className="m-auto w-200" >
        <img src={banner} alt="banner" />
        <input type="file"  accept='.jpg, .png'/>
      </div>
      <table style={{ width: 800, tableLayout: 'fixed' }} className='table-ih'>
        <caption className="title-style">메뉴</caption>
        <colgroup>
          <col style={{ width: '66.66%' }} />
          <col style={{ width: '33.33%' }} />
        </colgroup>
        <thead>
  <tr className='table-style-ih'>
    <th className='table-style-ih'>메뉴</th>
    <th className='table-style-ih'>가격</th>
  </tr>
</thead>
<tbody>
  {rows.map((row, idx) => (
    <tr key={idx}>
      <td className='table-style-ih'>
        <input
          id={`menu-name-${idx}`}
          className='shop-input focus:outline-hidden'
          type="text"
          placeholder="메뉴 이름"
          value={row.name}
          onChange={e => handleChange(idx, 'name', e.target.value)}
          style={{ width: '90%' }}
        />
      </td>
      <td className='table-style-ih'>
        <input
          id={`menu-price-${idx}`}
          className='shop-input focus:outline-hidden'
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
      <td className='table-style-ih'>
        <button onClick={() => removeRow(idx)} className="delete_b">×</button>
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

      <table className='table-ih'
        style={{
          margin: '20px auto',
        }}
      >
        <caption className="title-style m-3">영업시간</caption>
        <thead>
          <tr className='table-style-ih'>
            <th className='table-style-ih'>요일</th>
            <th className='table-style-ih' colSpan={2}>시간</th>
          </tr>
        </thead>
        <tbody>
          <tr className='table-style-ih'>
            <td className='table-style-ih'>일</td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
          </tr>
          <tr className='table-style-ih'>
            <td className='table-style-ih'>월</td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
          </tr>
          <tr className='table-style-ih'>
            <td className='table-style-ih'>화</td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
          </tr>
          <tr className='table-style-ih'>
            <td className='table-style-ih'>수</td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
          </tr>
          <tr className='table-style-ih'>
            <td className='table-style-ih'>목</td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
          </tr>
          <tr className='table-style-ih'>
            <td className='table-style-ih'>금</td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
          </tr>
          <tr className='table-style-ih'>
            <td className='table-style-ih'>토</td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
            <td className='table-style-ih'><input type="time" className='focus:outline-hidden'/> ~ <input type="time" className='focus:outline-hidden'/></td>
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
