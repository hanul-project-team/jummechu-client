// src/components/Modal.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 클라이언트 assets/images 폴더의 기본 프로필 이미지 임포트
import defaultProfileImg from '../../../assets/images/defaultProfileImg.jpg'; 

// axios.defaults.withCredentials는 앱의 가장 상위 컴포넌트나
// 별도의 설정 파일에서 한 번만 해주는 것이 좋습니다.
// 컴포넌트 내부에서 이 줄은 제거되어야 합니다.
// axios.defaults.withCredentials = true; 

const Modal = ({ isOpen, onClose }) => {
    const [userName, setUserName] = useState('로딩중');
    const [userPhone, setUserPhone] = useState('');
    const [userProfileImage, setUserProfileImage] = useState(defaultProfileImg); 
    const fileInputRef = useRef(null);
    const [showConfirmReset, setShowConfirmReset] = useState(false); 

    // 사용자 프로필 정보를 불러오는 함수
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3000/auth/myprofile', {
                    withCredentials: true, 
                });

                const callUserName = response.data.name || '이름 없음';
                setUserName(callUserName);

                const callUserPhone = response.data.phone || '연락처 없음';
                setUserPhone(callUserPhone);

                const backendBaseUrl = 'http://localhost:3000'; 
                const profileImagePath = response.data.profileImage; 

                setUserProfileImage(
                    profileImagePath && profileImagePath !== "" // 빈 문자열이 아닐 때만 사용
                        ? `${backendBaseUrl}${profileImagePath}`
                        : defaultProfileImg
                );
            } catch (error) {
                console.error('Frontend: 사용자 프로필 정보를 불러오는데 실패했습니다:', error.response?.data || error.message);
                toast.error('프로필 정보를 불러오는 데 실패했습니다.');
                setUserProfileImage(defaultProfileImg); 
            }
        };

        if (isOpen) {
            fetchUserProfile();
        }
    }, [isOpen]); 

    const handleImageChangeClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) {
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', selectedFile); 

        try {
            const response = await axios.post('http://localhost:3000/auth/upload/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            console.log('Frontend: 프로필 이미지 업로드 성공:', response.data);
            const backendBaseUrl = 'http://localhost:3000';
            const newProfileImagePath = response.data.user?.profileImage; 

            setUserProfileImage(
                newProfileImagePath
                    ? `${backendBaseUrl}${newProfileImagePath}`
                    : defaultProfileImg 
            );
            toast.success('프로필 이미지가 성공적으로 변경되었습니다!');
        } catch (error) {
            console.error('Frontend: 프로필 이미지 업로드 실패:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || '프로필 이미지 업로드 중 오류가 발생했습니다.');
            setUserProfileImage(defaultProfileImg); 
        }
    };

    const handleResetImageConfirm = () => {
        setShowConfirmReset(true); 
    };

    const handleResetImage = async () => {
        setShowConfirmReset(false); 

        try {
            const response = await axios.put('http://localhost:3000/auth/profile-image/reset', {}, { 
                withCredentials: true,
            });
            console.log('Frontend: 프로필 이미지 기본 상태로 변경 성공:', response.data);
            setUserProfileImage(defaultProfileImg);
            toast.success('프로필 이미지가 기본 상태로 변경되었습니다!');

        } catch (error) {
            console.error('Frontend: 프로필 이미지 기본 상태로 변경 실패:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || '프로필 이미지를 기본 상태로 변경하는 데 실패했습니다.');
        }
    };

    const profileUpdate = () => {
        onClose();
        window.location.reload(); 
    };

    if (!isOpen) return null;

    return (
        <>
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl relative z-10 w-[300px]">
                    <h2 className="text-lg font-semibold mb-4 text-center">프로필 설정</h2>

                    <div className="py-3 flex items-center justify-between">
                        <p>프로필 사진</p>
                        <div
                            className="relative w-[100px] h-[100px] rounded-full overflow-hidden group cursor-pointer border-2 border-gray-300"
                            onClick={handleImageChangeClick}
                        >
                            <img
                                src={userProfileImage}
                                alt="프로필 이미지"
                                className="w-full h-full object-cover transition-opacity duration-300"
                                onError={(e) => { 
                                    e.target.onerror = null;
                                    e.target.src = defaultProfileImg; 
                                    console.error("Frontend: 프로필 이미지 로드 실패. 기본 이미지로 대체됨.");
                                }}
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 flex items-center justify-center">
                                <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    이미지 변경
                                </p>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
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

                    {/* ★★★ '기본 이미지로 변경' 버튼 (조건부 렌더링) ★★★ */}
                    {/* 현재 userProfileImage가 로컬 기본 이미지(defaultProfileImg)와 다를 때만 이 버튼을 표시합니다. */}
                    {userProfileImage !== defaultProfileImg && (
                        <button
                            className="mt-2 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors shadow w-full" /* 버튼 너비 100% 추가 */
                            onClick={handleResetImageConfirm} 
                        >
                            기본 이미지로 변경
                        </button>
                    )}

                    <div className="flex gap-2 mt-4 justify-end"> 
                        <button
                            className="px-4 py-2 text-white bg-green-600 rounded cursor-pointer hover:bg-green-700 transition-colors shadow"
                            onClick={profileUpdate}
                        >
                            확인/저장
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-gray-800 hover:bg-gray-400 rounded cursor-pointer shadow"
                        >
                            닫기
                        </button>
                    </div>

                    {/* 프로필 이미지 초기화 확인 모달 (조건부 렌더링) */}
                    {showConfirmReset && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-xl text-center">
                                <p className="mb-4">프로필 이미지를 기본 이미지로 되돌리시겠습니까?</p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={handleResetImage} 
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow"
                                    >
                                        예
                                    </button>
                                    <button
                                        onClick={() => setShowConfirmReset(false)} 
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors shadow"
                                    >
                                        아니오
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Modal;
