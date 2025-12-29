import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { checkSession } from '../utils/authUtils'; // 세션 확인 유틸리티
import Left from './Left.js';
import { FaHeart } from 'react-icons/fa';
import { PiPhoneCallBold } from "react-icons/pi";

function MyPage({ onClose }) {
  const [userInfo, setUserInfo] = useState({ username: '', email: '' });
  const [qnaPosts, setQnaPosts] = useState([]);
  const [boardPosts, setBoardPosts] = useState([]);
  const [favoriteHospitals, setFavoriteHospitals] = useState([]); // 찜한 병원 상태 추가
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await checkSession();
        if (sessionData.loggedIn) {
          setUserInfo({
            username: sessionData.username,
            email: sessionData.email
          });

          const response = await fetch('http://localhost:8080/checkSession/mypage', {
            method: 'GET',
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json(); // 데이터 응답을 data 변수에 할당
            setQnaPosts(data.qna || []);       // QNA 데이터 설정
            setBoardPosts(data.board || []);   // Board 데이터 설정
          } else {
            console.error('게시글 로딩 실패');
            alert('게시글 로딩에 실패했습니다.');
          }
          fetchFavorites();

        } else {
          navigate('/login'); // 로그인되지 않은 경우 로그인 페이지로 이동
        }
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        alert('데이터 로딩 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:8080/favorites', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const favorites = Object.values(data["1"] || []);
        setFavoriteHospitals(favorites);
      } else {
        console.error('Failed to fetch favorites', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    }
  };

  const handleRemoveFavorite = async (hospitalId) => {
    try {
      const response = await fetch(`http://localhost:8080/favorites/remove?cardId=${hospitalId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        // 찜 목록 업데이트
        await fetchFavorites();
      } else {
        console.error('Failed to remove favorite', response.statusText);
      }
    } catch (error) {
      console.error('Failed to remove favorite', error);
    }
  };


  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) {
      return 'Unknown Date';
    }

    // YYYY.MM.DD 형식으로 포맷팅
    const formattedDate = dateObj.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').slice(0, -1); // 년.월.일 형식으로 변경

    return formattedDate;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed left-0 top-0 w-1/6 h-full" style={{ borderRight: 'none' }}>
        <Left />
      </div>
      <div className="flex-1 ml-[15%] mr-[10%] items-center p-6 z-0 mt-10" style={{ marginLeft: "350px" }}>
        <div className="flex justify-center p-6">
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-md mb-8 w-5/12" >
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              '{userInfo.username}' <span className="text-xl">님의 마이페이지</span>
            </h2>
            <hr className="border-t-2 border-gray-200 mb-4" />
            <div className="flex items-center text-gray-600 mb-3">
              <span className="mr-2">
                <svg className="w-5 h-5 text-sky-800" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 00-1 1v1H2a1 1 0 000 2h1v5H2a1 1 0 000 2h1v2a1 1 0 001 1h12a1 1 0 001-1v-2h1a1 1 0 000-2h-1V6h1a1 1 0 000-2h-3V3a1 1 0 00-1-1H6zM4 6V4h12v2H4zm11 2v6H5V8h10z" />
                </svg>
              </span>
              <span> 닉네임 : {userInfo ? `${userInfo.username}` : 'Loading...'}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-3">
              <span className="mr-2">
                <svg className="w-5 h-5 text-sky-800" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.94 4.94A2.5 2.5 0 015.5 4h9a2.5 2.5 0 012.56 2.5l-.03.26L10 10.38 2.5 6.76l-.03-.26A2.5 2.5 0 012.94 4.94zm.56 2.31l7.12 3.58a.5.5 0 00.76 0l7.12-3.58A2.5 2.5 0 0115.5 14h-9a2.5 2.5 0 01-2.5-2.5v-5a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v5a2.5 2.5 0 01-2.5 2.5h-9a2.5 2.5 0 01-2.5-2.5v-5a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v5z" />
                </svg>
              </span>
              <span> e-mail : {userInfo ? `${userInfo.email}` : 'Loading...'}</span>
            </div>
          </div>
        </div>

        {/* 내가 찜한 병원 보기 섹션 추가 */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h3 className="font-bold mb-5" style={{ fontSize: '1.5rem', color: "rgb(32, 49, 59)" }}>내가 찜한 병원</h3>
          <span className="mb-4 block">하트를 누르면 해당 병원의 찜이 해제됩니다.</span>
          {favoriteHospitals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {favoriteHospitals.map(hospital => (
                <div key={hospital.id} className="relative p-5 bg-gray-100 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-200 transition-colors">
                  <Link to={`/find/card/${hospital.id}`} className="block text-gray-800 font-semibold ">
                    {hospital.name}
                  </Link>
                  <div className="flex items-center mt-2 text-gray-500 text-sm">
                    <PiPhoneCallBold className="mr-2 text-blue-700" />
                    {hospital.phone}
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(hospital.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    {favoriteHospitals.some(h => h.id === hospital.id) && (
                      <FaHeart className="text-lg text-red-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">찜한 병원이 없습니다.</p>
          )}
        </div>

        {/* 내가 작성한 글 보기 섹션 */}
        <div className="bg-white rounded-lg p-6 mb-8">
          <h3 className="font-bold mb-6" style={{ fontSize: '1.5rem', color: "rgb(32, 49, 59)" }}>내가 작성한 글</h3>

          {/* Board Section */}
          <div className="mb-8">
            <h4 className="font-semibold mb-4" style={{ fontSize: '1.1rem', color: "rgb(32, 49, 59)" }}>* 너도 아파? 나도 아파!</h4>
            <ul className="space-y-3">
              {boardPosts.length > 0 ? (
                boardPosts.map(post => (
                  <li key={post.boardId} className="p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-200 transition-colors">
                    <Link to={`/community/${post.boardId}`} className="block  text-gray-800 font-semibold hover:underline">
                      {post.title}
                    </Link>
                    <div className="text-gray-500 text-sm mt-2">
                      {formatDate(post.createDate)}
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500">작성한 Board 게시글이 없습니다.</p>
              )}
            </ul>
          </div>

          {/* QNA Section */}
          <div>
            <h4 className="font-semibold mb-4" style={{ fontSize: '1.1rem', color: "rgb(32, 49, 59)" }}>* QNA</h4>
            <ul className="space-y-3">
              {qnaPosts.length > 0 ? (
                qnaPosts.map(post => (
                  <li key={post.qnaId} className="p-4 bg-gray-100 rounded-lg shadow-sm border border-gray-300 hover:bg-gray-200 transition-colors">
                    <Link to={`/qna/${post.qnaId}`} className="block text-gray-800 font-semibold hover:underline">
                      {post.title}
                    </Link>
                    <div className="text-gray-500 text-sm mt-2">
                      {formatDate(post.createDate)}
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-center text-gray-500">작성한 QNA 게시글이 없습니다.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;