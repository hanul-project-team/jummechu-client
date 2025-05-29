import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

// axios.defaults.withCredentials는 앱의 가장 상위 컴포넌트나
// 별도의 설정 파일에서 한 번만 해주는 것이 좋습니다.
axios.defaults.withCredentials = true

const Modal = ({ isOpen, onClose }) => {
  const [userName, setUserName] = useState('로딩중')
  const [userPhone, setUserPhone] = useState('')
  // ★★★ userProfileImage 상태 추가
  const [userProfileImage, setUserProfileImage] = useState(
    'http://localhost:3000/static/images/defaultProfileImg.jpg'
  ) // 기본 이미지 또는 로딩 중 이미지
  const fileInputRef = useRef(null)

  // 사용자 프로필 정보를 불러오는 함수
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/myprofile', {
          withCredentials: true,
        })

        const callUserName = response.data.name || response.data.name
        setUserName(callUserName)

        const callUserPhone = response.data.phone
        setUserPhone(callUserPhone)

        const backendBaseUrl = 'http://localhost:3000' // 백엔드 서버 주소
        const profileImagePath = response.data.profileImage // 백엔드에서 받은 상대 경로
        setUserProfileImage(
          profileImagePath
            ? `${backendBaseUrl}${profileImagePath}`
            : 'http://localhost:3000/static/images/defaultProfileImg.jpg',
        )
      } catch (error) {
        console.error('사용자 프로필 정보를 불러오는데 실패했습니다:', error)
      }
    }

    if (isOpen) {
      fetchUserProfile()
    }
  }, [isOpen]) // isOpen이 변경될 때마다 useEffect를 다시 실행합니다.

  // "이미지 변경" 클릭 시 숨겨진 파일 input을 트리거
  const handleImageChangeClick = () => {
    fileInputRef.current.click()
  }

  // 파일이 선택되었을 때 실행되는 함수
  const handleFileChange = async event => {
    const selectedFile = event.target.files?.[0] // 선택된 파일 가져오기
    if (selectedFile) {
      const formData = new FormData()
      formData.append('profileImage', selectedFile) // 'profileImage'는 백엔드 Multer 설정의 필드 이름과 일치해야 합니다.

      try {
        // 백엔드의 이미지 업로드 API로 요청
        const response = await axios.post('http://localhost:3000/auth/upload/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // 파일 업로드 시 필수 헤더
          },
          withCredentials: true, // 쿠키 포함
        })

        console.log('프로필 이미지 업로드 성공:', response.data)
        const backendBaseUrl = 'http://localhost:3000' // 백엔드 서버 주소
        const newProfileImagePath = response.data.profileImage // 백엔드에서 받은 상대 경로
        setUserProfileImage(
          newProfileImagePath
          ?`${backendBaseUrl}${newProfileImagePath}`
        :'../image/mainprofile.jpg'
        ) // 완전한 URL로 상태 업데이트

        alert('프로필 이미지가 성공적으로 변경되었습니다!') // 사용자에게 알림
      } catch (error) {
        console.error('프로필 이미지 업로드 실패:', error)
        setUserProfileImage('https://picsum.photos/250/250?random=mypage_error');
      }
    }
  }

  
  const handleResetImage = async () => {
    if (!window.confirm('프로필 이미지를 기본 이미지로 되돌리시겠습니까?')) {
      return;
    }
    try {
      const response = await axios.put('http://localhost:3000/auth/profile-image/reset', {}, { // PUT 요청, 본문은 비워둠
        withCredentials: true,
      }
    );
      console.log('프로필 이미지 기본 상태로 변경 성공:', response.data);
      // 상태를 기본 이미지 URL로 업데이트
    setUserProfileImage('http://localhost:3000/static/images/defaultProfileImg.jpg');
    alert('프로필 이미지가 기본 상태로 변경되었습니다!');

  } catch (error) {
    console.error('프로필 이미지 기본 상태로 변경 실패:', error);
    alert('프로필 이미지를 기본 상태로 변경하는 데 실패했습니다.');
  }
};

const profileUpdate = () => {
  onClose()
  window.location.reload()
}


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl relative z-10 w-[300px]">
        <h2 className="text-lg font-semibold mb-4">프로필 설정</h2>

        <div className="py-3 flex items-center justify-between">
          <p>프로필 사진</p>
          <div
            className="relative w-[100px] h-[100px] bg-cover mask-radial-fade group cursor-pointer"
            onClick={handleImageChangeClick} // 이미지 변경 클릭 이벤트
          >
            <div
              className="absolute inset-0 bg-cover mask-radial-fade transition-opacity duration-300"
              style={{ backgroundImage: `url('${userProfileImage}')` }}
            >
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              <p className="absolute text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                이미지 변경
              </p>
            </div>
            {/* ★★★ 숨겨진 파일 입력 필드 */}
            <input
              type="file"
              accept="image/*" // 이미지 파일만 선택 가능
              className="hidden" // 숨김 처리
              ref={fileInputRef} // useRef로 참조
              onChange={handleFileChange} // 파일 변경 이벤트 핸들러
            />
          </div>
        </div>
        <div className="py-3 flex justify-between">
          <p>이름</p>
          <p> {userName} </p>
        </div>
        <hr className="py-3" />
        <div className="py-3 flex justify-between">
          <p>연락처</p>
          <p> {userPhone} </p>
        </div>
        <hr className="py-3" />

        <button
          className="mt-2 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
          onClick={handleResetImage}
        >
          기본 이미지로 변경
        </button>

        <div className="flex gap-2">
          <button
            className="mt-4 px-4 py-2 text-black bg-green-600 rounded cursor-pointer"
            onClick={profileUpdate}
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
