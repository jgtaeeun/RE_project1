import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Left from '../Compo/Left';
import Footer from '../Compo/Footer.js';
import './comdetail.css';
import { checkSession } from '../utils/authUtils'; // 유틸리티 함수 가져오기

function ComDetail() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [boardRe, setBoardRe] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [author, setAuthor] = useState(""); // 게시글 작성자 정보
  const [user, setUser] = useState(null); // 로그인된 사용자 정보
  const navigate = useNavigate();
  const textareaRef = useRef(null); // 수정 시 커서 위치 조정

  // 날짜 포맷팅 함수
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

  // 데이터 가져오기 함수
  const fetchData = async () => {
    try {
      const sessionData = await checkSession();
      setUser(sessionData.loggedIn ? sessionData.username : null);

      const boardResponse = await fetch(`http://localhost:8080/community/${id}`);
      if (!boardResponse.ok) {
        throw new Error('게시글 데이터 가져오기 실패');
      }
      const boardData = await boardResponse.json();
      setBoard(boardData);
      setEditedContent(boardData.content);

      // member 안의 username에 접근
      if (boardData.member && boardData.member.username) {
        setAuthor(boardData.member.username);
      } else {
        console.error('작성자 정보가 없습니다.');
      }

      const commentsResponse = await fetch(`http://localhost:8080/community/reply/${id}`);
      if (!commentsResponse.ok) {
        throw new Error('댓글 데이터 가져오기 실패');
      }
      const commentsData = await commentsResponse.json();
      if (Array.isArray(commentsData)) {
        setBoardRe(commentsData.map(comment => ({
          boardReId: comment.boardReId,
          content: comment.content,
          createDate: comment.createDate,
          username: comment.member.username
        })));
      } else {
        console.error('댓글 데이터 형식 오류');
      }
    } catch (error) {
      console.error('게시글 및 댓글 데이터 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // 댓글 작성 함수
const handleCommentSubmit = async () => {
  const sessionData = await checkSession(); // 최신 로그인 정보 가져오기
  setUser(sessionData.loggedIn ? sessionData.username : null);

  if (!sessionData.loggedIn) {
    alert("로그인이 필요합니다.");
    return;
  }

  if (newComment.trim() === "") {
    alert("댓글 내용을 입력해주세요.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/community/reply/write/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment }),
      credentials: 'include',
    });

    if (response.ok) {
      setNewComment("");
      await fetchData(); // 최신 상태를 가져오기 위해 전체 데이터 갱신
    } else {
      console.error('댓글 작성 실패');
    }
  } catch (error) {
    console.error('댓글 작성 중 오류 발생:', error);
  }
};

// 수정 모드 토글 함수
const handleEditToggle = async () => {
  const sessionData = await checkSession(); // 최신 로그인 정보 가져오기
  setUser(sessionData.loggedIn ? sessionData.username : null);

  if (!sessionData.loggedIn) {
    alert("로그인이 필요합니다.");
    return;
  }

  if (sessionData.username === author) {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  } else {
    alert("해당 게시글의 작성자만 게시글 수정이 가능합니다.");
  }
};

// 게시글 수정 함수
const handleEditSubmit = async () => {
  const sessionData = await checkSession(); // 최신 로그인 정보 가져오기
  setUser(sessionData.loggedIn ? sessionData.username : null);

  if (!sessionData.loggedIn) {
    alert("로그인이 필요합니다.");
    return;
  }

  if (sessionData.username !== author) {
    alert("해당 게시글의 작성자만 게시글 수정이 가능합니다.");
    return;
  }

  if (editedContent.trim() === "") {
    alert("내용을 입력해주세요.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/community/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editedContent }),
      credentials: 'include',
    });
    if (response.ok) {
      setIsEditing(false);
      setBoard(prevBoard => ({ ...prevBoard, content: editedContent }));
    } else {
      console.error('게시글 수정 실패');
    }
  } catch (error) {
    console.error('게시글 수정 중 오류 발생:', error);
  }
};

// 게시글 삭제 함수
const handleDelete = async () => {
  const sessionData = await checkSession(); // 최신 로그인 정보 가져오기
  setUser(sessionData.loggedIn ? sessionData.username : null);

  if (!sessionData.loggedIn) {
    alert("로그인이 필요합니다.");
    return;
  }

  if (sessionData.username !== author) {
    alert("해당 게시글의 작성자만 게시글 삭제가 가능합니다.");
    return;
  }

  // 삭제 확인 메시지 띄우기
  const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
  if (!isConfirmed) {
    // 사용자가 '아니오'를 선택한 경우
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/community/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (response.ok) {
      navigate('/community');
    } else {
      console.error('게시글 삭제 실패');
      const errorText = await response.text();
      console.error('서버 응답:', errorText);
    }
  } catch (error) {
    console.error('게시글 삭제 중 오류 발생:', error);
  }
};



  if (!board) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed left-0 top-0 w-1/6 h-full z-10">
        <Left />
      </div>
      <div className="flex-1 ml-[15%] mr-[10%] p-10 z-0"  style={{ marginLeft: "350px"}}>
        <div className="mt-6">
          <table className="w-full text-base text-left rtl:text-right text-gray-700 dark:text-gray-400">
            <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="bg-[#f2f2f2] font-bold p-4" style={{ fontSize: '1.0rem' }}>{board.title}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bg-white p-4">
                  {isEditing ? (
                    <textarea
                      ref={textareaRef}
                      className="w-full p-2 border border-gray-300"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                  ) : (
                    board.content
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="comment-header m-3 mt-10 font-bold" style={{ fontSize: '1.2rem' }}> 댓글</div>
        <div className="comment-section">
          <table className="w-full text-base text-left rtl:text-right text-gray-700 dark:text-gray-400">
            <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="text-center px-6 py-3">작성자</th>
                <th scope="col" className="text-center px-6 py-3">내용</th>
                <th scope="col" className="text-center px-6 py-3">작성 날짜</th>
              </tr>
            </thead>
            <tbody>
              {boardRe.length > 0 ? (
                boardRe.map(comment => {
                  const date = formatDate(comment.createDate);
                  return (
                    <tr key={comment.boardReId}>
                      <td className="reply text-center">{comment.username}</td>
                      <td className="pl-3 pr-3">{comment.content}</td>
                      <td className="text-center">
                        <div>{date}</div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td colSpan="3" className="text-center">댓글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6 comment-section">
          <textarea
            className="w-full p-2 border border-gray-300"
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성하세요."
          />
        </div>
        <div className="flex justify-end mt-6 gap-2">
          <button className="cdetail-button" onClick={handleCommentSubmit}>
            댓글 등록
          </button>
          <button className="cdetail-button" onClick={isEditing ? handleEditSubmit : handleEditToggle}>
            {isEditing ? '수정 완료' : '글 수정하기'}
          </button>
          <button className="cdetail-button" onClick={handleDelete}>
            글 삭제
          </button>
          <button className="cdetail-button" onClick={() => navigate("/community")}>
            목록으로
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ComDetail;
