import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
// 컴포넌트 불러오기 - 경로 업데이트
import TickerSlider from './components/common/TickerSlider';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
// 페이지 불러오기
import Main from './pages/Main';

// 로그인 관련 컴포넌트 경로 업데이트
import Login from './components/login/Login';
import Signup from './components/login/Signup';
import Mypage from './components/login/Mypage';

//채팅 관련 컴포넌트
import AIChat from './components/chat/Aichat';

// 기타 페이지 컴포넌트
import SalonsPage from './pages/SalonsPage';

// 헤더 about 드롭 버튼 페이지들
import About from './components/about/About';
import Reviews from './components/about/Reviews';
import Lookbook from './components/about/Lookbook';

// FlexZone 컴포넌트 추가
import FlexZone from './components/home/services/FlexZone';

// TPO 스타일 관련 컴포넌트들
import HairStyling from './components/home/services/tpo/HairStyling';
import PlaceBased from './components/home/services/tpo/PlaceBased';
import OccasionStyle from './components/home/services/tpo/OccasionStyle';

// 테마 설정
import theme from './theme';

// AuthProvider 불러오기
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
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
                <Route path="/profile" element={<Mypage />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/chat/ai" element={<AIChat />} />
                {/* FlexZone 페이지 추가 - position: fixed로 전체 화면을 덮음 */}
                <Route path="/flex-zone" element={<FlexZone />} />
                {/* TPO 스타일 관련 라우트들 */}
                <Route path="/hair-styling" element={<HairStyling />} />
                <Route path="/place-based" element={<PlaceBased />} />
                <Route path="/occasion-style" element={<OccasionStyle />} />
              </Routes>
            </Box>

            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;