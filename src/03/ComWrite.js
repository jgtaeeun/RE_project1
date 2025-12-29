import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Left from '../Compo/Left';
import './comwrite.css';
import Footer from '../Compo/Footer.js';
import { checkSession } from '../utils/authUtils'; // 유틸리티 함수 가져오기

function ComWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리하는 상태
  const navigate = useNavigate();

  // 세션 확인 및 로그인 상태 설정
  useEffect(() => {
    const verifySession = async () => {
      const sessionData = await checkSession();
      setIsLoggedIn(sessionData.loggedIn);
      if (!sessionData.loggedIn) {
        alert(sessionData.message || '로그인 후에 게시글을 작성할 수 있습니다.');
        navigate('/'); // 로그인 페이지로 리다이렉트
      }
    };

    verifySession();
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLoggedIn) {
      alert('로그인 후에 게시글을 작성할 수 있습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/community/write', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (response.ok) {
        navigate('/community');
      } else {
        console.error('게시글 등록 실패:', response.status);
        alert('게시글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 등록 실패:', error);
      alert('게시글 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed left-0 top-0 w-1/6 h-full z-10" >
        <Left />
      </div>
      <div className="flex-1 ml-[25%] mr-[15%] p-10 z-0"  style={{ marginLeft: "350px"}}>
        <div className="font-bold text-2xl mt-6" style={{ fontSize: '1.2rem' }}>
          게시글 작성
        </div>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-lg font-medium">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-lg font-medium">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              rows="6"
              required
            />
          </div>
          <div className="form-footer">
              <button type="submit" className="csubmit-button">
                  등록하기
              </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ComWrite;
