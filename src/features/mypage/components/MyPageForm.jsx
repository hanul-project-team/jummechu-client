// src/pages/mypage/MyPageForm.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Modal from '../components/UserModal.jsx';
import PwdChangeModal from '../components/PwdChangeModal.jsx';
import MypagesAuthForm from '../components/MypagesAuthForm.jsx';
import MypageFromReview from './MyPageFormReviews.jsx'
// import zustandStore from '../../app/zustandStore.js';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../MyPage.css';
import MyPageFormBookmark from './MyPageFormBookmark.jsx'

const MyPageForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.auth.user);
  const userId = user?.id;

  console.log('Redux에서 가져온 전체 user 객체:', user);
  console.log('추출된 userId:', userId);

  const [active, setActive] = useState(() => {
    if (location.state?.fromVerification && location.state?.activeTab) {
      return location.state.activeTab;
    }
    return '최근기록';
  });

  const [isAuthenticatedForSettings, setIsAuthenticatedForSettings] = useState(() => {
    return location.state?.fromVerification && location.state?.activeTab === '계정 설정';
  });

  const tabs = ['최근기록', '찜', '리뷰', '음식점 추천(AI)', '계정 설정'];
  const [isopen, setIsOpen] = useState(false);
  const [openai, setOpenAi] = useState([]); // AI 추천 음식점 목록
  const [dalleImage, setDalleImage] = useState(null);
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [userNickname, setUserNickname] = useState('로딩중');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [userProfileImage, setUserProfileImage] = useState(
    'http://localhost:3000/static/images/defaultProfileImg.jpg',
  );

  const [tempNickname, setTempNickname] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [recentStores, setRecentStores] = useState([]);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);

  const [bookmarkedStoreIds, setBookmarkedStoreIds] = useState(new Set());
  const [bookmarkedStoresData, setBookmarkedStoresData] = useState([]);

  // ★★★ AI 추천이 이미 성공적으로 로드되었는지 추적하는 상태 (중복 호출 방지) ★★★
  const [hasFetchedAIRecommendations, setHasFetchedAIRecommendations] = useState(false);


  // 찜 상태 확인 함수
  const isBookmarked = (item) => {
    return bookmarkedStoreIds.has(item._id);
  };

  // 찜 토글 함수
  const toggleBookmark = async (item) => {
    if (!userId) {
      alert('로그인 후 찜 기능을 이용할 수 있습니다.');
      return;
    }

    const storeId = item._id;
    try {
      if (bookmarkedStoreIds.has(storeId)) {
        await axios.delete(`http://localhost:3000/auth/bookmarks`, {
          data: { storeId: storeId },
          withCredentials: true
        });
        setBookmarkedStoreIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(storeId);
          return newSet;
        });
        setBookmarkedStoresData(prev => prev.filter(store => store._id !== storeId));
        alert('찜이 해제되었습니다.');
      } else {
        await axios.post(`http://localhost:3000/auth/bookmarks`, { storeId: storeId }, {
          withCredentials: true
        });
        setBookmarkedStoreIds(prev => new Set(prev).add(storeId));
        fetchBookmarks();
        alert('찜 목록에 추가되었습니다.');
      }
    } catch (error) {
      console.error('찜 토글 실패:', error);
      alert('찜 기능 처리 중 오류가 발생했습니다.');
    }
  };

  // 찜 목록 불러오기 useEffect
  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`http://localhost:3000/auth/bookmarks`, {
          withCredentials: true
        });
        const fullStores = response.data.bookmarkedStores;
        setBookmarkedStoresData(fullStores);
        setBookmarkedStoreIds(new Set(fullStores.map(store => store._id)));
        console.log("찜 목록 불러오기 성공:", fullStores);
      } catch (error) {
        console.error('찜 목록 불러오기 실패:', error);
        setBookmarkedStoresData([]);
        setBookmarkedStoreIds(new Set());
      }
    };
    if (active === '찜') {
      fetchBookmarks();
    }
  }, [userId, active]);


  const handlePasswordChangeSuccess = () => {
    alert('비밀번호가 성공적으로 변경되었습니다! 다시 로그인 해주세요.');
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  useEffect(() => {
    const fetchRecentStores = async () => {
      if (!userId) {
        console.log('사용자 ID가 없어 최근 기록을 불러올 수 없습니다.');
        setRecentStores([]);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/auth/recent-history?userId=${userId}`,
          {
            withCredentials: true,
          },
        );
        setRecentStores(response.data.recentViewedStores);
        console.log("최근 본 가게 데이터 로드 성공:", response.data.recentViewedStores);
      } catch (error) {
        console.error('최근 기록 불러오기 실패:', error);
        setRecentStores([]);
      }
    };

    if (active === '최근기록') {
      fetchRecentStores();
    }
  }, [active, userId]);

  useEffect(() => {
    if (location.state) {
      if (location.state.fromVerification && location.state.activeTab === '계정 설정') {
        setActive('계정 설정');
        setIsAuthenticatedForSettings(true);
        navigate(location.pathname, { replace: true, state: {} });
      } else if (location.state.fromMyPage) {
        // MyPageForm에서 인증 페이지로 이동했을 때의 처리 (이 경우, isAuthenticatedForSettings는 false 유지)
      }
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/myprofile', {
          withCredentials: true,
        });
        const backendBaseUrl = 'http://localhost:3000';

        const callUserNickname = response.data.nickname;
        setUserNickname(callUserNickname || '익명 사용자');
        setTempNickname(callUserNickname || '익명 사용자');

        const callUserEmail = response.data.email;
        setUserEmail(callUserEmail);

        const callUserPhone = response.data.phone;
        setUserPhone(callUserPhone);

        const callUserName = response.data.name;
        setUserName(callUserName);

        const callUserImage = response.data.profileImage;
        setUserProfileImage(
          callUserImage
            ? `${backendBaseUrl}${callUserImage}`
            : 'http://localhost:3000/static/images/defaultProfileImg.jpg',
        );
      } catch (error) {
        console.error('사용자 프로필 정보를 불러오는데 실패했습니다:', error);
        setUserProfileImage('http://localhost:3000/static/images/defaultProfileImg.jpg');
      }
    };
    fetchUserProfile();
  }, []);

  const callOpenAi = async (promptContent) => {
    try {
      const response = await axios.post('http://localhost:3000/api/azure/openai', {
        prompt: promptContent, // ★★★ 'prompt'를 req.body의 최상위 필드로 직접 보냅니다. ★★★
      });
      return response;
    } catch (error) {
      console.error('OpenAI 호출 실패:', error.response?.data || error.message);
      return { data: null };
    }
  };


  const extractMostFrequentKeywords = data => {
    const allKeywords = {};
    data.forEach(item => {
      const keywordsArray = Array.isArray(item.keyword)
        ? item.keyword
        : item.keyword ? String(item.keyword).split(',').map(k => k.trim()) : [];

      keywordsArray.forEach(keyword => {
        if (keyword) {
          allKeywords[keyword] = (allKeywords[keyword] || 0) + 1;
        }
      });
    });

    let maxCount = 0;
    for (const keyword in allKeywords) {
      if (allKeywords[keyword] > maxCount) {
        maxCount = allKeywords[keyword];
      }
    }

    if (maxCount === 0) return [];
    return Object.keys(allKeywords).filter(keyword => allKeywords[keyword] === maxCount);
  };


  useEffect(() => {
    // '음식점 추천(AI)' 탭이 활성화될 때만 로직 실행
    if (active === '음식점 추천(AI)') {
      // 최근 본 가게 기록이 없으면 추천을 시작하지 않음
      if (recentStores.length === 0) {
        console.log("AI 추천: 최근 본 가게 기록이 없어 추천을 시작할 수 없습니다.");
        setOpenAi(["최근 본 가게 기록에서 추천 키워드를 찾을 수 없습니다."]);
        setLoading(false);
        setHasFetchedAIRecommendations(false); // 재시도 가능하게 플래그 초기화
        return;
      }
      // 이미 AI 추천을 불러왔거나 (hasFetchedAIRecommendations === true), 현재 로딩 중이면 함수를 종료
      if (hasFetchedAIRecommendations || loading) {
        console.log("AI 추천: 이미 불러온 추천이 있거나 로딩 중이므로 다시 불러오지 않습니다.");
        return;
      }

      setLoading(true); // 로딩 시작
      setHasFetchedAIRecommendations(true); // AI 추천 요청 시작 플래그 설정 (중복 호출 방지)
      setOpenAi([]); // 이전 추천 초기화
      setDalleImage(null); // 이전 이미지 초기화


      const keywordsForAI = extractMostFrequentKeywords(recentStores);

      if (keywordsForAI.length === 0) {
        console.log("AI 추천: 최근 본 가게에서 유의미한 키워드를 추출할 수 없습니다.");
        setOpenAi(["최근 본 가게 기록에서 추천 키워드를 찾을 수 없습니다."]);
        setLoading(false);
        return;
      }

      // ★★★ OpenAI 첫 번째 호출 (음식점 추천) 프롬프트 구성 ★★★
      const restaurantRecommendationPrompt = `
        다음은 사용자가 최근 방문한 음식점들의 키워드 목록입니다:
        ${keywordsForAI.join(', ')}
        
        이 키워드들과 **가장 많이** 겹치는 음식점 3곳을 추천해 주세요.
        
        결과는 다음 필드를 포함하는 JSON 형식의 배열로만 출력하세요. JSON 외에는 아무 것도 출력하지 마세요.
        각 추천 음식점은 다음 필드를 포함해야 합니다:
        - title: 음식점 이름
        - rating: 평점 (0.0 ~ 5.0)
        - description: 음식점 설명 (간단하고 매력적인 한 줄)
        - keyword: 이 음식점의 키워드 배열 (예: ["#떡볶이", "#분식", "#매운맛"])
        - overlap_count: 겹치는 키워드 수
      `;

      callOpenAi(restaurantRecommendationPrompt)
        .then(response => {
          if (response && response.data) {
            let parsedData = response.data;
            // axios가 응답을 자동으로 JSON.parse 해주지만, 만약을 대비하여 한번 더 문자열인 경우 파싱 시도
            if (typeof response.data === 'string') {
              try {
                parsedData = JSON.parse(response.data);
              } catch (e) {
                console.error("Client: AI 응답 JSON 파싱 오류 (문자열 -> JSON):", e);
                setOpenAi(["AI 응답 형식이 유효하지 않아 추천을 표시할 수 없습니다."]);
                setLoading(false);
                return; // 여기서 함수 종료
              }
            }

            // 파싱된 데이터가 배열인지 확인
            if (Array.isArray(parsedData) && parsedData.length > 0) {
              setOpenAi(parsedData);
              console.log("AI 추천 음식점 목록 설정:", parsedData);

              // DALL-E 이미지 생성 (대표 키워드를 사용하여)
              const keywordSummary = Array.from(new Set(keywordsForAI)).slice(0, 10).join(',');
              return callDalleImage(keywordSummary); // Promise 반환하여 다음 .then()으로 체인
            } else {
              console.error("AI 응답이 예상된 배열 형태가 아닙니다:", parsedData);
              setOpenAi(["AI 응답이 예상된 형식이 아니거나 비어있습니다."]);
              setLoading(false);
            }
          } else {
            console.error("AI 응답 데이터가 유효하지 않습니다.");
            setOpenAi(["AI 추천을 받을 수 없습니다."]);
            setLoading(false);
          }
        })
        .then(imageUrl => { // DALL-E 이미지 URL을 여기서 받음
          if (imageUrl) {
            setDalleImage(imageUrl);
            console.log("DALL-E 이미지 URL 설정:", imageUrl);
          } else {
            setDalleImage(null);
            console.warn("DALL-E 이미지 생성 실패 또는 URL 없음.");
          }
        })
        .catch(apiError => {
          console.error("OpenAI/DALL-E API 호출 실패:", apiError);
          setOpenAi(["AI 추천을 불러오는 중 오류가 발생했습니다."]);
          setDalleImage(null); // 에러 발생 시 이미지도 초기화
        })
        .finally(() => {
          setLoading(false); // 모든 처리 완료 후 로딩 종료
        });
    } else {
      // 다른 탭으로 이동할 때 AI 관련 상태 초기화
      setDalleImage(null);
      setLoading(false);
      setOpenAi([]);
      setHasFetchedAIRecommendations(false); // 다른 탭으로 가면 플래그 초기화하여 다음에 다시 불러올 수 있도록
    }
  }, [active, recentStores, hasFetchedAIRecommendations]); // ★★★ `loading` 제거 ★★★

  const callDalleImage = async keyword => {
    try {
      const res = await axios.post('http://localhost:3000/api/azure/dalle', {
          prompt: `${keyword}에 대한 실제 음식 사진처럼 보이고, 시선을 사로잡는 아름다운 구도와 부드러운 자연광이 돋보이는 초고화질 음식 사진을 생성해주세요. 식욕을 돋우는 선명한 색감과 생생한 질감을 가진, 배경은 단순하게 처리하고 음식에 집중해주세요.`,
      });
      console.log("DALL-E 응답:", res);
      return res?.data?.imageUrl || null;
    } catch (err) {
      console.error(`DALL·E 호출 실패 (${keyword}):`, err.response?.data || err.message);
      return null;
    }
  };

  const handleClick = (e, tab) => {
    e.preventDefault();
    setActive(tab);
    if (tab !== '계정 설정') {
      setIsAuthenticatedForSettings(false);
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      setTempNickname(userNickname);
    }
    setIsEditing(prev => !prev);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(
        'http://localhost:3000/auth/profile',
        {
          nickname: tempNickname,
          email: userEmail,
          phone: userPhone,
        },
        {
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        alert('프로필 정보가 성공적으로 업데이트되었습니다.');
        setUserNickname(tempNickname);
        setIsEditing(false);
        console.log('프로필 업데이트 성공:', response.data);
      } else {
        alert(`프로필 정보 업데이트 실패: ${response.data.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('프로필 정보 업데이트 실패:', error);
      alert(
        `프로필 정보 업데이트 중 오류가 발생했습니다: ${error.response?.data?.message || '서버 오류'}`,
      );
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        const response = await axios.delete('http://localhost:3000/auth/account', {
          withCredentials: true,
        });

        if (response.status === 200) {
          alert('계정이 성공적으로 삭제되었습니다. 로그인 페이지로 이동합니다.');
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('계정 삭제 실패:', error);
      }
    }
  };

  const renderContent = () => {
    const mostFrequentKeywords = extractMostFrequentKeywords(recentStores);

    switch (active) {
      case '최근기록':
        return (
          <div className="flex justify-center ">
            {recentStores.length === 0 ? (
              <p className="py-5 text-gray-600">최근 본 가게 기록이 없습니다.</p>
            ) : (
              <ul className="flex flex-col gap-9 py-5">
                {recentStores.map(item => (
                  <li key={item._id} className="flex gap-4">
                    <div
                      className="relative w-[250px] h-[250px] cursor-pointer"
                      onClick={() => navigate(`/place/${item._id}`)}
                    >
                      <img
                        src={`https://picsum.photos/250/250?random=${item._id}`}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          toggleBookmark(item);
                        }}
                        className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100"
                      >
                        {isBookmarked(item) ? (
                          <span role="img" aria-label="bookmarked">
                            ❤️
                          </span>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                    <div className="py-3">
                      <h2 className="text-lg py-1 font-SinchonRhapsody flex">{item.name}</h2>
                      {item.rating && <p className="py-1">⭐{item.rating} </p>}
                      <p className="py-1 flex items-center text-sm text-gray-500">
                        <svg
                          fill="#000000"
                          height="25px"
                          width="25px"
                          version="1.1"
                          id="Capa_1"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          viewBox="0 0 487.379 487.379"
                          xmlSpace="preserve"
                        >
                          <g>
                            <path
                              d="M393.722,438.868L371.37,271.219h0.622c6.564,0,11.885-5.321,11.885-11.885V17.668c0-4.176-2.183-8.03-5.751-10.18
                              c-3.569-2.152-7.998-2.279-11.679-0.335c-46.345,24.454-75.357,72.536-75.357,124.952v101.898
                              c0,20.551,16.665,37.215,37.218,37.215h2.818l-22.352,167.649c-1.625,12.235,2.103,24.599,10.228,33.886
                              c8.142,9.289,19.899,14.625,32.246,14.625c12.346,0,24.104-5.336,32.246-14.625C391.619,463.467,395.347,451.104,393.722,438.868z"
                            />
                            <path
                              d="M207.482,0c-9.017,0-16.314,7.297-16.314,16.313v91.128h-16.314V16.313C174.854,7.297,167.557,0,158.54,0
                              c-9.017,0-16.313,7.297-16.313,16.313v91.128h-16.314V16.313C125.912,7.297,118.615,0,109.599,0
                              c-9.018,0-16.314,7.297-16.314,16.313v91.128v14.913v41.199c0,24.2,19.611,43.811,43.811,43.811h3.616L115,438.74
                              c-1.37,12.378,2.596,24.758,10.896,34.047c8.317,9.287,20.186,14.592,32.645,14.592c12.459,0,24.327-5.305,32.645-14.592
                              c8.301-9.289,12.267-21.669,10.896-34.047l-25.713-231.375h3.617c24.199,0,43.811-19.611,43.811-43.811v-41.199v-14.913V16.313
                              C223.796,7.297,216.499,0,207.482,0z"
                            />
                          </g>
                        </svg>
                        {item.address}
                      </p>
                      {item.keyword && (
                        <p className="py-1 text-sm text-gray-700">
                          #{Array.isArray(item.keyword) ? item.keyword.join(', #') : item.keyword}
                        </p>
                      )}
                      <p className="py-5 text-sm text-black">
                        본 시간: {new Date(item.viewedAt).toLocaleString()}
                      </p>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          navigate(`/place/${item._id}`);
                        }}
                        className="mt-2 text-blue-500 hover:underline text-sm"
                      >
                        상세 보기
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case '찜':
        return (
          <MyPageFormBookmark />
          // <div className="flex justify-center">
          //   {bookmarkedStoresData.length === 0 ? (
          //     <p>찜한 목록이 없습니다.</p>
          //   ) : (
          //     <ul className="flex flex-col gap-9 py-5">
          //       {bookmarkedStoresData.map(item => (
          //         <li key={item._id} className="flex gap-4">
          //           <div className="relative w-[250px] h-[250px] cursor-pointer"
          //                onClick={() => navigate(`/place/${item._id}`)}>
          //             <img
          //               src={item.thumbnail || `https://placehold.co/250x250/F0F0F0/6C757D?text=${encodeURIComponent(item.name.substring(0, Math.min(5, item.name.length)))}`}
          //               alt={item.name}
          //               className="w-full h-full object-cover rounded-lg"
          //             />
          //             <button
          //               type="button"
          //               onClick={(e) => { e.stopPropagation(); toggleBookmark(item); }}
          //               className="absolute top-2 right-2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100"
          //             >
          //               {isBookmarked(item) ? (
          //                 <span role="img" aria-label="bookmarked">
          //                   ❤️
          //                 </span>
          //               ) : (
          //                 <svg
          //                   xmlns="http://www.w3.org/2000/svg"
          //                   fill="none"
          //                   viewBox="0 0 24 24"
          //                   strokeWidth={1.5}
          //                   stroke="currentColor"
          //                   className="size-6"
          //                 >
          //                   <path
          //                     strokeLinecap="round"
          //                     strokeLinejoin="round"
          //                     d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          //                   />
          //                 </svg>
          //               )}
          //             </button>
          //           </div>
          //           <div className="py-3">
          //             <h2 className="text-lg py-1 font-SinchonRhapsody flex">{item.name}</h2>
          //             {item.rating && <p className="py-1">⭐{item.rating} </p>}
          //             <p className="py-1 flex items-center text-sm text-gray-500">
          //               <svg
          //                 fill="#000000"
          //                 height="25px"
          //                 width="25px"
          //                 version="1.1"
          //                 id="Capa_1"
          //                 xmlns="http://www.w3.org/2000/svg"
          //                 xmlnsXlink="http://www.w3.org/1999/xlink"
          //                 viewBox="0 0 487.379 487.379"
          //                 xmlSpace="preserve"
          //               >
          //                 <g>
          //                   <path
          //                     d="M393.722,438.868L371.37,271.219h0.622c6.564,0,11.885-5.321,11.885-11.885V17.668c0-4.176-2.183-8.03-5.751-10.18
          //                     c-3.569-2.152-7.998-2.279-11.679-0.335c-46.345,24.454-75.357,72.536-75.357,124.952v101.898
          //                     c0,20.551,16.665,37.215,37.218,37.215h2.818l-22.352,167.649c-1.625,12.235,2.103,24.599,10.228,33.886
          //                     c8.142,9.289,19.899,14.625,32.246,14.625c12.346,0,24.104-5.336,32.246-14.625C391.619,463.467,395.347,451.104,393.722,438.868z"
          //                   />
          //                   <path
          //                     d="M207.482,0c-9.017,0-16.314,7.297-16.314,16.313v91.128h-16.314V16.313C174.854,7.297,167.557,0,158.54,0
          //                     c-9.017,0-16.313,7.297-16.313,16.313v91.128h-16.314V16.313C125.912,7.297,118.615,0,109.599,0
          //                     c-9.018,0-16.314,7.297-16.314,16.313v91.128v14.913v41.199c0,24.2,19.611,43.811,43.811,43.811h3.616L115,438.74
          //                     c-1.37,12.378,2.596,24.758,10.896,34.047c8.317,9.287,20.186,14.592,32.645,14.592c12.459,0,24.327-5.305,32.645-14.592
          //                     c8.301-9.289,12.267-21.669,10.896-34.047l-25.713-231.375h3.617c24.199,0,43.811-19.611,43.811-43.811v-41.199v-14.913V16.313
          //                     C223.796,7.297,216.499,0,207.482,0z"
          //                   />
          //                 </g>
          //               </svg>
          //               {item.address}
          //             </p>
          //             {item.keyword && (
          //               <p className="py-1 text-sm text-gray-700">
          //                 #{Array.isArray(item.keyword) ? item.keyword.join(', #') : item.keyword}
          //               </p>
          //             )}
          //             <button
          //                 onClick={(e) => { e.stopPropagation(); navigate(`/place/${item._id}`); }}
          //                 className="mt-2 text-blue-500 hover:underline text-sm"
          //             >
          //                 상세 보기
          //             </button>
          //           </div>
          //         </li>
          //       ))}
          //     </ul>
          //   )}
          // </div>
        );


      case '리뷰':
        return (
          <MypageFromReview />
        )

      case '음식점 추천(AI)':
        return (
          <div className="flex flex-col gap-5 items-center">
            {loading ? (
              <p className="py-5 text-gray-600">추천 가게를 불러오는 중...</p>
            ) : (
              <>
                {dalleImage && (
                  <img
                    src={dalleImage}
                    alt="AI 음식점 이미지"
                    className="w-[300px] h-[300px] rounded shadow-md py-5"
                  />
                )}
                {openai && openai.length > 0 ? ( // openai가 배열이고 비어있지 않은지 확인
                  <ul className="flex flex-col gap-9 py-5">
                    <p className="py-2 text-center text-lg font-semibold">
                      {userNickname} 님의 취향은 "{mostFrequentKeywords.join(', ')}" 입니다.
                    </p>
                    <h2 className="text-center text-xl font-bold py-3">이 음식점들을 추천해요!</h2>
                    {openai.map((item, index) => (
                      <li key={index} className="flex gap-4 p-4 border rounded-lg shadow-sm w-full max-w-md">
                        <div className="flex-shrink-0">
                           <img
                            src={`https://placehold.co/100x100/F0F0F0/6C757D?text=${encodeURIComponent(item.title.substring(0, Math.min(5, item.title.length)))}`}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                          <p className="text-yellow-500 text-sm">⭐ {item.rating}</p>
                          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                          {item.keyword && Array.isArray(item.keyword) && item.keyword.length > 0 && (
                            <p className="text-blue-500 text-xs mt-2">
                              {item.keyword.map(k => `#${k}`).join(' ')}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="py-5 text-gray-600">AI 추천을 받을 수 없습니다.</p>
                )}
              </>
            )}
          </div>
        );

      case '계정 설정':
        if (!isAuthenticatedForSettings) {
          return (
            <MypagesAuthForm
              onAuthenticated={() => {
                setIsAuthenticatedForSettings(true);
                setActive('계정 설정');
              }}
              onCancel={() => {
                setActive('최근기록');
                setIsAuthenticatedForSettings(false);
              }}
            />
          );
        }
        return (
          <div className="flex justify-center">
            <div className="flex flex-col w-[700px] h-[700px] gap-5 py-5">
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className=" w-[100px] h-[100px] bg-cover mask-radial-fade"
                    onClick={() => setIsOpen(true)}
                    style={{ backgroundImage: `url('${userProfileImage}')` }}
                  />
                  <span
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow hover:bg-opacity-700 cursor-pointer"
                    onClick={() => setIsOpen(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="py-5">
                <div>
                  <div className="py-3 flex justify-between">
                    <p>이메일 관리</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={userEmail}
                        onChange={e => setUserEmail(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-1/2"
                      />
                    ) : (
                      <p>{userEmail}</p>
                    )}
                  </div>
                  <hr className="py-3" />
                  <div className="py-3 flex justify-between">
                    <p>비밀번호</p>
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setShowPasswordChangeModal(true)}
                    >
                      비밀번호 변경
                    </button>
                  </div>
                  <hr className="py-3" />
                </div>

                <div className="py-3 flex justify-between">
                  <p>이름</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userName}
                      onChange={e => setUserName(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-1/2"
                    />
                  ) : (
                    <p>{userName}</p>
                  )}
                </div>

                <hr className="py-3" />
                <div className="py-3 flex justify-between">
                  <p>닉네임</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempNickname}
                      onChange={e => setTempNickname(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-1/2"
                    />
                  ) : (
                    <p>{userNickname}</p>
                  )}
                </div>
                <hr className="py-3" />
                <div className="py-3 flex justify-between">
                  <p>연락처</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={e => setUserPhone(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-1/2"
                    />
                  ) : (
                    <p>{userPhone}</p>
                  )}
                </div>
                <hr className="py-3" />
              </div>
              <div className="flex gap-5 justify-center">
                <button
                  className="mt-4 px-4 py-2 text-white bg-red-600 rounded cursor-pointer"
                  onClick={handleDeleteAccount}
                >
                  계정 삭제
                </button>
                {isEditing ? (
                  <button
                    className="mt-4 px-4 py-2 text-white bg-blue-600 rounded cursor-pointer"
                    onClick={handleSaveChanges}
                  >
                    저장
                  </button>
                ) : (
                  <button
                    className="mt-4 px-4 py-2 text-white bg-blue-600 rounded cursor-pointer"
                    onClick={handleEditToggle}
                  >
                    수정
                  </button>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 pb-5">
      <div className="max-w-5xl mx-auto">
        <div className="pb-5 flex justify-between items-center ">
          <div className="flex gap-5 items-center ">
            <div
              className="w-[100px] h-[100px] bg-cover mask-radial-fade"
              style={{ backgroundImage: `url('${userProfileImage}')` }}
            />
            <div className="flex-col">
              <p className="text-2xl py-2"> "{userNickname}" 님</p>
              <span className="text-2xl">안녕하세요.</span>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isopen} onClose={() => setIsOpen(false)} />

      <div className="max-w-5xl mx-auto">
        <ul className="py-5 flex gap-5">
          {tabs.map(tab => (
            <li key={tab}>
              <button
                type="button"
                onClick={e => handleClick(e, tab)}
                className={`pb-2 text-gray-600 font-medium border-b-2 transition duration-200 ${
                  active === tab
                    ? 'border-cyan-500 text-blue-500'
                    : 'border-transparent hover:border-gray-300 hover:text-black'
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showPasswordChangeModal && (
        <PwdChangeModal
          onClose={() => setShowPasswordChangeModal(false)}
          onPasswordChangeSuccess={handlePasswordChangeSuccess}
        />
      )}

      <div className="max-w-5xl mx-auto px-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default MyPageForm;
