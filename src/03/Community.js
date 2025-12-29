import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Left from '../Compo/Left';
import './community.css';
import Footer from '../Compo/Footer.js';
import { checkSession } from '../utils/authUtils'; // 유틸리티 함수 가져오기
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

function Community() {
  const [boards, setBoards] = useState([]);

  const [filteredBoards, setFilteredBoards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("title"); // 검색 카테고리 상태 추가

  const [user, setUser] = useState(null); // 로그인된 사용자 정보를 상태로 저장
  const [loading, setLoading] = useState(true);
  const [loginMessage, setLoginMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태 추가
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 10; // 페이지당 항목 수

  const navigate = useNavigate();

  const fetchBoards = async () => {
    try {
      const response = await fetch('http://localhost:8080/community');

      if (response.ok) {
        const data = await response.json();
        setBoards(data);
      } else {
        console.error('게시글 데이터 가져오기 실패:', response.status);
        setErrorMessage('게시글 데이터 가져오기 실패');
      }
    } catch (error) {
      console.error('게시글 데이터 가져오기 실패:', error);
      setErrorMessage('게시글 데이터 가져오기 실패');
    }
  };

  const fetchData = async () => {
    setLoading(true); // 로딩 상태 시작
    const sessionData = await checkSession();
    setUser(sessionData.loggedIn ? sessionData.username : null);
    setLoginMessage(sessionData.message || '');
    await fetchBoards();
    setLoading(false); // 로딩 상태 종료
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // 검색어와 검색 카테고리에 따라 필터링
    const filtered = boards.filter(board => {
      switch (searchCategory) {
        case "title":
          return board.title.toLowerCase().includes(searchTerm.toLowerCase());
        case "author":
          return board.member.username.toLowerCase().includes(searchTerm.toLowerCase());
        case "content":
          return board.content.toLowerCase().includes(searchTerm.toLowerCase());
        default:
          return board.title.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
    setFilteredBoards(filtered);
    setCurrentPage(1);
  }, [searchTerm, searchCategory, boards]);

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

  const handleBoardClick = (boardId) => {
    if (boardId) {
      navigate(`/community/${boardId}`);
    } else {
      console.error('Invalid board ID');
    }
  };

  const handleWriteClick = async () => {
    if (user) {
      navigate("/community/write");
    } else {
      const sessionData = await checkSession(); // 로그인 상태를 다시 확인
      if (sessionData.loggedIn) {
        setUser(sessionData.username);
        navigate("/community/write"); // 세션 확인 후 바로 글쓰기 페이지로 이동
      } else {
        alert("로그인 후에 게시글을 작성할 수 있습니다.");
      }
    }
  };

  //보드들을 역순으로 정렬하고 정렬된걸 페이징함
  const sortedBoards = [...filteredBoards].sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
  const totalPages = Math.ceil(sortedBoards.length / itemsPerPage);
  const paginatedBoards = sortedBoards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="fixed left-0 top-0 w-1/6 h-full z-10">
        <Left />
      </div>
      <div className="flex-1 ml-[15%] mr-[10%] p-10 z-0" style={{ marginLeft: "350px" }}>
        <div className="font-bold text-2xl mt-6" style={{ fontSize: '2rem' }}>
          너도 아파? 나도 아파!
        </div>
        <div className='mt-6'>
          <h1 style={{ fontSize: '0.9rem' }}>- 게시글의 제목을 선택하면 상세정보를 확인하실 수 있습니다.</h1>
          <h1 style={{ fontSize: '0.9rem' }}>- 로그인 후, 게시글을 작성할 수 있습니다.</h1>
          <h1 style={{ fontSize: '0.9rem' }}>- 게시글의 작성자 본인 및 관리자만 해당 게시글을 수정 및 삭제할 수 있습니다.</h1>
        </div>
        <div className="border-b border-gray-300 mt-5"></div>


        {/* 검색 카테고리 셀렉트 박스 추가 */}
        <div className="mb-4 flex justify-end space-x-2 items-center">
          <select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            className="p-1 text-sm border border-gray-300 rounded-md"
            style={{ width: '120px',
                    marginTop : '2rem'
             }} 
          >
            <option value="title">제목</option>
            <option value="author">작성자</option>
            <option value="content">내용</option>
          </select>

          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-1 text-sm border border-gray-300 rounded-md"
            style={{ width: '200px',
              marginTop : '2rem'

             }} 
          />
        </div>

        <table className="w-full text-base text-left rtl:text-right text-gray-700 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="text-center px-6 py-3">번호</th>
              <th scope="col" className="text-center px-6 py-3">제목</th>
              <th scope="col" className="text-center px-6 py-3">작성자</th>
              <th scope="col" className="text-center px-6 py-3">작성일</th>
              <th scope="col" className="text-center px-6 py-3">조회수</th> 
            </tr>
          </thead>
          <tbody>
            {paginatedBoards.map((board, index) => {
              const date = formatDate(board.createDate);
              // 게시글의 번호를 전체 게시글에서의 순서로 계산
              const boardNumber = sortedBoards.length - (currentPage - 1) * itemsPerPage - index;
              return (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={board.boardId}>
                  <td className="text-center">{boardNumber}</td>
                  <td className="cursor-pointer" onClick={() => handleBoardClick(board.boardId)}>
                    {board.title}
                  </td>
                  <td className="text-center">{board.member.username}</td>
                  <td className="text-center">
                    <div>{date}</div>
                  </td>
                  <td className="text-center">{board.cnt}</td> 
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-10 mb-5 flex justify-end w-full">
          <button
            onClick={handleWriteClick}
            className="cwrite-button"
          >
            글쓰기
          </button>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium ${currentPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-sky-700 hover:underline'}`}
          >
            <MdOutlineKeyboardDoubleArrowLeft />
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 text-sm font-medium ${currentPage === index + 1 ? 'text-sky-700 underline' : 'text-gray-600 hover:underline'}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium ${currentPage === totalPages ? 'text-gray-600 cursor-not-allowed' : 'text-sky-700 hover:underline'}`}
          >
            <MdOutlineKeyboardDoubleArrowRight />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Community;