import { useState } from 'react'

export default function StoreEntryForm() {
  const [entryType, setEntryType] = useState('individual')
  const [bizNumber, setBizNumber] = useState('')
  const [lookupSuccess, setLookupSuccess] = useState(false)
  const [postcode, setPostcode] = useState("")
  const [address, setAddress] = useState("")

  const handleLookup = () => {
    if (!bizNumber.trim()) return alert('사업자등록번호를 입력해주세요.')
    setLookupSuccess(true) // API 연동 시 수정
  }

  const openPostcodePopup = () => {
    new window.daum.Postcode({
      oncomplete: data => {
        setPostcode(data.zonecode)
        setAddress(data.roadAddress)
      }
    }).open()
  }

  return (
    <form className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <header>
        <h2 className="text-xl font-bold">온라인 입점신청서</h2>
        <p className="text-sm text-gray-600">
          아래 양식을 입력하고 파일을 첨부해주세요. <br />
          제출 후 영업일 기준 3일 내로 연락드리겠습니다.
        </p>
      </header>

      {/* 입점 형태 */}
      <div>
        <label className="block font-medium mb-2">입점 형태</label>
        <div className="flex gap-4">
          {['개인사업자', '법인사업자'].map((label, idx) => {
            const value = idx === 0 ? 'individual' : 'corporate'
            return (
              <label key={value}>
                <input
                  type="radio"
                  value={value}
                  checked={entryType === value}
                  onChange={() => setEntryType(value)}
                />
                <span className="ml-1">{label}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 사업자등록번호 */}
      <div>
        <label className="block font-medium mb-1">사업자등록번호</label>
        <div className="flex gap-2">
          <input
            type="text"
            className="border rounded p-2 flex-1"
            placeholder="사업자번호 입력"
            value={bizNumber}
            onChange={e => {
              setBizNumber(e.target.value)
              setLookupSuccess(false)
            }}
          />
          <button type="button" onClick={handleLookup} className="bg-gray-100 px-4 rounded border">
            번호 조회
          </button>
        </div>
        {lookupSuccess && (
          <p className="text-green-600 text-sm mt-2">✅ 조회가 성공적으로 완료되었습니다.</p>
        )}
      </div>

      {/* 입력 필드 리스트 */}
      {[
        { label: '대표자명', placeholder: '', name: 'owner' },
        { label: '대표자 생년월일', placeholder: '예: 19900101', name: 'birth' },
        { label: '전화번호', placeholder: '', name: 'phone' }
      ].map(field => (
        <div key={field.label}>
          <label className="block font-medium mb-1">{field.label}</label>
          <input
            type="text"
            name={field.name}
            className="border rounded w-full p-2"
            placeholder={field.placeholder}
          />
        </div>
      ))}

      {/* 주소 */}
      <div>
        <label className="block font-medium mb-1">주소</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={postcode}
            placeholder="우편번호"
            readOnly
            className="border rounded flex-1 p-2"
          />
          <button
            type="button"
            className="bg-gray-100 px-4 rounded border"
            onClick={openPostcodePopup}
          >
            주소 조회
          </button>
        </div>
        <input
          type="text"
          value={address}
          placeholder="기본 주소"
          readOnly
          className="border rounded w-full p-2 mb-1"
        />
        <input
          type="text"
          placeholder="상세 주소 입력"
          className="border rounded w-full p-2"
        />
      </div>

      {/* 파일 업로드 */}
      {['사업자등록증 첨부', '통장사본 첨부'].map(label => (
        <div key={label}>
          <label className="block font-medium mb-1">{label}</label>
          <input type="file" className="border rounded p-2 w-full" />
        </div>
      ))}

      {/* 개인정보 동의 */}
      <div>
        <label className="block font-medium mb-2">개인정보 수집 및 이용 동의</label>
        <div className="border rounded p-4 h-48 overflow-y-scroll bg-gray-50 text-sm mb-3">
          <p>
            본인은 귀사가 수집하는 개인정보(성명, 연락처, 주소 등)를 본 서비스 제공을 위한 목적으로
            수집 및 이용하는 데 동의합니다. 수집된 정보는 본 목적 외에는 사용되지 않으며, 관련 법령에 따라 보호됩니다.
          </p>
          <p className="mt-2">
            동의하지 않으실 경우 서비스 이용이 제한될 수 있습니다. 자세한 사항은 개인정보처리방침을 확인해주세요.
          </p>
        </div>
        <label className="inline-flex items-center">
          <input type="checkbox" className="form-checkbox text-blue-600 mr-2" required />
          위 내용에 동의합니다.
        </label>
      </div>

      {/* 제출 */}
      <div className="text-center pt-4">
        <button type="submit" className="bg-cyan-400 text-white px-6 py-2 rounded font-semibold">
          입점 신청하기
        </button>
      </div>
    </form>
  )
}
