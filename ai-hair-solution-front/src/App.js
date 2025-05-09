// App.js - 최종 수정 버전
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Mypage from './pages/Mypage';
// import Home from './pages/Home'; // 필요 없다면 제거
// 티커슬라이더 직접 임포트
import TickerSlider from './components/common/TickerSlider';
// 테마 설정
import theme from './theme';
// 컴포넌트 불러오기
import Header from './components/common/Header';
import Footer from './components/common/Footer';
// 페이지 불러오기
import Main from './pages/Main';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SalonsPage from './pages/SalonsPage';

//헤더 about 드롭 버튼 페이지들
import About from './components/about/About';
import Reviews from './components/about/Reviews';
import Lookbook from './components/about/Lookbook';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh'
          }}
        >
          {/* 티커슬라이더를 모든 페이지에서 표시 */}
          <TickerSlider />

          {/* 헤더 컴포넌트 */}
          <Header />

          {/* 메인 콘텐츠 영역 - 티커슬라이더(45px)와 헤더(72px) 높이를 고려한 패딩 */}
          <Box component="main" sx={{
            flexGrow: 1,
            pt: '117px', // 45px + 72px
            position: 'relative',
            zIndex: 900 // 헤더와 티커보다 낮은 zIndex
          }}>
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Mypage />} />
              <Route path="/nearby-salons" element={<SalonsPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/about/reviews" element={<Reviews />} />
              <Route path="/about/lookbook" element={<Lookbook />} />
            </Routes>
          </Box>

          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;