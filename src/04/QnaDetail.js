import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Left from '../Compo/Left';
import Footer from '../Compo/Footer';
import './qnadetail.css';
import { checkSession } from '../utils/authUtils'; // checkSession 가져오기

function QnaDetail() {
  const { id } = useParams();
  const [qna, setQna] = useState(null);
  const [qnaReplies, setQnaReplies] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const textareaRef = useRef(null);

  // 날짜 포맷팅 함수
  const formatDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) {
      return {
        date: '알 수 없는 날짜',
        time: '알 수 없는 시간'
      };
    }

    const formattedDate = dateObj.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = dateObj.toLocaleTimeString('ko-KR');

    return {
      date: formattedDate,
      time: formattedTime
    };
  };

  // 데이터 가져오기 함수
  const fetchData = async () => {
    setLoading(true); // 로딩 시작

    const sessionData = await checkSession();
    if (sessionData.loggedIn) {
      setUser(sessionData.username);
      setUserRole(sessionData.role);
    } else {
      setUser(null);
      setUserRole(null);
    }

    try {
      const qnaResponse = await fetch(`http://localhost:8080/qna/${id}`);
      if (!qnaResponse.ok) {
        throw new Error('질문 데이터 가져오기 실패');
      }
      const qnaData = await qnaResponse.json();
      setQna(qnaData);

      const repliesResponse = await fetch(`http://localhost:8080/qna/reply/${id}`);
      if (!repliesResponse.ok) {
        throw new Error('답변 데이터 가져오기 실패');
      }
      const repliesData = await repliesResponse.json();
      if (Array.isArray(repliesData)) {
        setQnaReplies(repliesData.map(reply => ({
          qnaReplyId: reply.qnaReplyId,
          content: reply.content,
          createDate: reply.createDate,
          username: reply.member.username
        })));
      } else {
        console.error('답변 데이터 형식 오류');
      }
    } catch (error) {
      console.error('질문 및 답변 데이터 가져오기 실패:', error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // 질문 삭제 함수
  const handleDelete = async () => {
    const sessionData = await checkSession(); // 최신 로그인 정보 가져오기
    setUser(sessionData.loggedIn ? sessionData.username : null);
    setUserRole(sessionData.loggedIn ? sessionData.role : null);
  
    if (!sessionData.loggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    if (sessionData.role !== "admin") {
      alert("관리자만 게시글을 삭제할 수 있습니다.");
      return;
    }
  
    // 삭제 확인 메시지 띄우기
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (!isConfirmed) {
      // 사용자가 '아니오'를 선택한 경우
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/qna/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        navigate('/qna');
      } else {
        console.error('질문 삭제 실패');
      }
    } catch (error) {
      console.error('질문 삭제 중 오류 발생:', error);
    }
  };
  
  // 답변 작성 함수
  const handleReplySubmit = async () => {
    const sessionData = await checkSession(); // 최신 로그인 정보 가져오기
    setUser(sessionData.loggedIn ? sessionData.username : null);
    setUserRole(sessionData.loggedIn ? sessionData.role : null);

    if (!sessionData.loggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (sessionData.role !== "admin") {
      alert("관리자만 질문에 답변할 수 있습니다.");
      return;
    }

    if (newReply.trim() === "") {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/qna/reply/write/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newReply }),
        credentials: 'include',
      });

      if (response.ok) {
        setNewReply("");
        await fetchData(); // 답변 작성 후 데이터 갱신
        textareaRef.current?.focus(); // 답변 작성 후 텍스트 영역 포커스
      } else {
        console.error('답변 작성 실패');
      }
    } catch (error) {
      console.error('답변 작성 중 오류 발생:', error);
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!qna) {
    return <div>질문을 찾을 수 없습니다.</div>;
  }


  return (
    <div className="flex flex-col h-screen">
      {/* Left 컴포넌트가 화면의 왼쪽에 고정 */}
      <div className="fixed left-0 top-0 w-1/6 h-full z-10">
        <Left />
      </div>
      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 ml-[15%] mr-[10%] p-10 z-0" style={{ marginLeft: "350px" }}>
        {/* QnA 제목과 내용 표시 */}
        <div className="mt-6">
          <table className="w-full text-base text-left rtl:text-right text-gray-700 dark:text-gray-400">
            <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="bg-[#f2f2f2] font-bold p-4" style={{ fontSize: '1.0rem' }}>{qna.title}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="bg-white p-4">
                  {qna.content}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 답변 섹션 */}
        <div className="m-3 mt-10 font-bold" style={{ fontSize: '1.2rem' }}> 답변</div>
        <div className="space-y-4">
          {qnaReplies.length > 0 ? (
            qnaReplies.map(reply => {
              const { date, time } = formatDate(reply.createDate);
              return (
                <div key={reply.qnaReplyId} className="p-4 border border-gray-300 rounded-md bg-gray-50 shadow-sm">
                  <div className="font-bold text-sm text-gray-700">{reply.username}</div>
                  <div className="mt-2 text-gray-600">{reply.content}</div>
                  <div className="mt-2 text-xs text-gray-500">{date} {time}</div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-4 border border-gray-300 rounded-md shadow-sm text-center">
              답변이 없습니다.
            </div>
          )}
        </div>
        {/* 답변 작성 및 관리 버튼들 */}
        <div className="mt-6">
        {userRole === "admin" && (
          <textarea
            ref={textareaRef}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="답변을 작성하세요."
          />)}
        </div>
        <div className="flex justify-end mt-6 gap-2">
          {userRole === "admin" && (
          <button className="qdetail-button" onClick={handleReplySubmit} style={{ fontSize: '0.9rem' }}>
            답변 등록하기
          </button>
          )}
            <button className="qdetail-button" onClick={handleDelete} style={{ fontSize: '0.9rem' }}>
              글삭제
            </button>
          <button className="qdetail-button" onClick={() => navigate("/qna")} style={{ fontSize: '0.9rem' }}>
            목록으로
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default QnaDetail;