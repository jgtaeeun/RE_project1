import React, { useState, useEffect } from 'react';
import '../NavigationBar.css';
import logo from '../Img/Logo-white.png';
import { useNavigate } from 'react-router-dom';
import { checkSession } from '../utils/authUtils'; // 유틸리티 함수 가져오기
import LoginForm from './LoginForm.js'; // 로그인 폼 컴포넌트
import Signup from './SignUp.js'; // 회원가입 폼 컴포넌트
import MyPage from './MyPage'; // MyPage 모달 컴포넌트 추가

function NavigationBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  // 세션 확인 및 사용자 정보 로딩
  useEffect(() => {
    const checkUserSession = async () => {
      const sessionData = await checkSession();
      setIsLoggedIn(sessionData.loggedIn);
      setUsername(sessionData.username || '');
      setEmail(sessionData.email || '');
      setLoginMessage(sessionData.message || '');
    };

    checkUserSession();
  }, []); // 빈 배열: 컴포넌트 마운트 시에만 실행

  // 로그인 성공 후 사용자 정보 가져오기
  const handleLoginSuccess = async () => {
    const sessionData = await checkSession();
    setIsLoggedIn(sessionData.loggedIn);
    setUsername(sessionData.username || '');
    setEmail(sessionData.email || '');
    setLoginMessage(sessionData.message || '');

    setShowLoginModal(false);
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/signout', {
        method: 'POST',
        credentials: 'include', // 세션 쿠키를 포함
      });

      if (response.ok) {
        sessionStorage.removeItem('user'); // 세션 스토리지에서 사용자 정보 삭제
        setIsLoggedIn(false);
        setUsername('');
        setEmail('');
        setLoginMessage('로그아웃 되었습니다.');

        navigate('/');  // 홈 페이지나 로그인 페이지로 이동

      } else {
        console.error('로그아웃 실패');
        alert('로그아웃에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handleMyPageClick = () => {
    navigate('/mypage'); // '/mypage' 경로로 이동
  };

  return (
    <div style={{ width: '12%', height: '100vh', position: 'fixed', padding: 0 }}>
      <ul className="nav-list">
        <div className="logo">
          <img
            src={logo}
            alt="carefinder-logo"
            onClick={() => navigate('/')} // 메인 화면으로 돌아가기
            style={{
              cursor: 'pointer',
              border: '2px solid #ccc',  // 보더를 2px 회색으로 적용
              borderRadius: '8px',       // 모서리를 둥글게 처리
              padding: '4px',            // 이미지와 보더 사이에 패딩 적용
              height: '68px',            // 이미지의 세로 길이를 80px로 설정
              alignItems: 'center'
            }}
          />
        </div>
        <li onClick={() => navigate('/find')}>
          내 맘에 쏙 병원찾기
        </li>
        <li onClick={() => navigate('/health')}>
          건강백과사전
        </li>
        <li onClick={() => navigate('/community')}>
          너도 아파? 나도 아파!
        </li>
        <li onClick={() => navigate('/qna')}>
          Q & A
        </li>
        {/* 로그인 및 회원가입 버튼 추가 */}
        <div className="buttons">
          {!isLoggedIn ? (
            <>
              <button
                className="left-button"
                onClick={() => setShowLoginModal(true)}
              >
                로그인
              </button>
              <button
                className="left-button"
                onClick={() => setShowSignup(true)}
              >
                회원가입
              </button>
            </>
          ) : (
            <>
              <p2 className="welcome-message">{loginMessage}</p2>
              <button
                className="left-button"
                onClick={handleMyPageClick}
              >
                마이페이지
              </button>
              <button
                className="left-button"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </ul>

      {showLoginModal && <LoginForm onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />}
      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
    </div>
  );
}

export default NavigationBar;