import Home from './01/Home.js';
import skyImage from './Img/Sky.jpg';
import logoImage from './Img/Logo.png';
import ButtonC from './UI/ButtonC.js';
// import './App.css';


function App() {
  return (
    //   <RecoilRoot> 
    <MainApp />
    //    </RecoilRoot>
  );
}

function MainApp() {
  return (
    <div className="flex flex-col w-full h-screen max-w-screen-lg overflow-y-auto mx-auto bg-slate-900">
      <header className='flex justify-center items-center flex-col'>
        <div className='logo-wrapper'>
          <img src={logoImage} alt="Logo" className="logo-image" />
        </div>
        <div className='image-wrapper'>
          <img src={skyImage} alt="Sky" className="background-image" />
          <div className="text-overlay large-text">
            오래 살수록 인생은 더 아름다워진다.
          </div>
          <div className="text-overlay medium-text">
            "The longer I live, the more beautiful life becomes."
          </div>
          <div className="text-overlay small-text">
            -Frank Lloyd Wright-
          </div>
        </div>
      </header>
      <main className='grow bg-slate-400 flex justify-center items-center'>
        <ButtonC bcolor="teal" caption='SS' />
      </main>
      <footer className='flex justify-center items-center h-20 bg-slate-500 text-purple-50'>
        ⓒ 2024 CAREFINDER, All rights reserved.
      </footer>
    </div>
  );
}

export default App;

//<Routes>
//<Route path='/find' element={<Find />} />
//<Route path='/health' element={<Health />} />
//<Route path='/community' element={<Community />} />
//<Route path='/qna' element={<Qna />} />
//</Routes>
