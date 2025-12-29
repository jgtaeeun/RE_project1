import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import skyImage from './Img/Sky.jpg';
import logoImage from './Img/Logo.png';
import ButtonC from './UI/ButtonC.js';
import Find from './01/Find.js';
import List from './01/List.js';
import CardDetail from './01/CardDetail.js';
import Health from './02/Health.js';
import Community from './03/Community.js';
import ComWrite from './03/ComWrite.js';
import ComDetail from './03/ComDetail.js';
import Qna from './04/Qna.js';
import QnaWrite from './04/QnaWrite.js';
import QnaDetail from './04/QnaDetail.js';
import Footer from './Compo/Footer.js';
import MyPage from './Compo/MyPage.js';

function App() {
  return (
    <BrowserRouter>
      <div className='app-container'>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/find" element={<Find />} />
          <Route path="/find/list" element={<List />} />
          <Route path="/find/card/:cardId" element={<CardDetail />} />
          <Route path="/health" element={<Health />} />
          <Route path="/community" element={<Community />} />
          <Route path="/community/write" element={<ComWrite />} />
          <Route path="/community/:id" element={<ComDetail />} />
          <Route path="/qna" element={<Qna />} />
          <Route path="/qna/write" element={<QnaWrite />} />
          <Route path="/qna/:id" element={<QnaDetail />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function MainApp() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-screen">
      <header className='header'>
        <div className='logo-wrapper'>
          <img src={logoImage} alt="Logo" className="logo-image" />
        </div>
        <div className='image-wrapper'>
          <img src={skyImage} alt="Sky" className="background-image" />
          <div className="text-overlay large-text" style={{ fontSize: '1.5rem' }}>
            오래 살수록 인생은 더 아름다워진다.
          </div>
          <div className="text-overlay medium-text font-mono" style={{ fontSize: '1.2rem' }}>
            "The longer I live, the more beautiful life becomes."
          </div>
          <div className="text-overlay small-text font-mono" style={{ fontSize: '0.8rem' }}>
            -Frank Lloyd Wright-
          </div>
        </div>
      </header>
      <main className='main-content'>
        <ButtonC bcolor="sky"
          title='요양 병원 찾기'
          text='내가 원하는 전문의가 있는 병원을 찾아보세요.'
          handleClick={() => navigate('/find')} />
        <ButtonC bcolor="purple"
          title='건강백과사전'
          text='아는 만큼 건강해져요.'
          handleClick={() => navigate('/health')} />
        <ButtonC bcolor="blue"
          title='커뮤니티'
          text='너두 아파? 나두 아파! 함께 이야기 나눠요.'
          handleClick={() => navigate('/community')} />
        <ButtonC bcolor="teal"
          title='Q&A'
          text='궁금증 해소하고 한 살 젊어져요.'
          handleClick={() => navigate('/qna')} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
