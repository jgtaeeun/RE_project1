import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Left from '../Compo/Left';
import './qnawrite.css';
import Footer from '../Compo/Footer';
import { checkSession } from '../utils/authUtils'; // checkSession 가져오기

function QnaWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sessionData = await checkSession();
    if (!sessionData.loggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await fetch('http://localhost:8080/qna/write', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          content: content,
        }),
      });
      navigate('/qna');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed left-0 top-0 w-1/6 h-full z-10">
        <Left />
      </div>
      <div className="flex-1 ml-[25%] mr-[15%] p-10 z-0"  style={{ marginLeft: "350px"}}>
        <div className="font-bold text-2xl mt-6" style={{ fontSize: '1.2rem' }}>
          질문 작성
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
              <button type="submit" className="qsubmit-button">
                  등록하기
              </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default QnaWrite;
