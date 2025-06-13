import { useState } from 'react'

const mockData = [
  { id: 1, name: '홍콩반점', status: '접수됨' },
  { id: 2, name: '김밥천국', status: '심사 중' },
  { id: 3, name: '마라탕집', status: '반려됨' },
  { id: 4, name: '한솥도시락', status: '승인 완료' },
]

const statusOptions = ['전체', '접수됨', '심사 중', '반려됨', '승인 완료']

export default function Reqset() {
  const [statusFilter, setStatusFilter] = useState('전체')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredData = mockData.filter(store => {
    const matchesStatus = statusFilter === '전체' || store.status === statusFilter
    const matchesSearch = store.name.includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  return (<>
    
      <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded space-y-6 overflow-x-auto">
        <h2 className="text-xl font-bold">입점 신청 현황</h2>
        {/* 필터 & 검색 */}
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            {statusOptions.map(opt => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="가게명 검색"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded flex-1"
          />
          <button className="bg-cyan-400 text-white px-4 py-2 rounded">검색</button>
        </div>
        {/* 테이블 */}
        <table className="w-full table-fixed text-center border-t table-ih">
          <thead>
            <tr className="bg-gray-100 table-style-ih">
              <th className="py-2  table-style-ih">가게 이름</th>
              <th className=' table-style-ih'>신청 상태</th>
              <th className=' table-style-ih'>보기 / 수정</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map(store => (
                <tr key={store.id} className="border-t">
                  <td className="break-words  table-style-ih">{store.name}</td>
                  <td className=' table-style-ih'>{store.status}</td>
                  <td className=' table-style-ih'>
                    {store.status === '반려됨' ? (
                      <button className="text-yellow-600 underline">수정하기</button>
                    ) : (
                      <button className="text-blue-600 underline">상세 보기</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-gray-500">
                  해당 조건의 신청 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-4 pt-4">
          <button className="px-2">&lt;</button>
          <span>1</span>
          <button className="px-2">&gt;</button>
        </div>
      </div>
  </>
  )
}
