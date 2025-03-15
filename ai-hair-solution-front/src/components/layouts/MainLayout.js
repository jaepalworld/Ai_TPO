// import React from 'react';
// import { Box } from '@mui/material';
// import { useLocation } from 'react-router-dom';
// import Header from '../common/Header';

// // 메뉴 항목 경로 배열 (Header.js의 menuItems와 동일한 로직)
// const isMenuPath = (pathname) => {
//     if (pathname === '/') return false;

//     const menuPaths = [
//         '/about', '/about/story', '/about/history', '/about/notice',
//         '/styles', '/styles/haircut', '/styles/perm', '/styles/color', '/styles/care',
//         '/nearby-salons', '/nearby-salons/find', '/nearby-salons/reservation', '/nearby-salons/stylists'
//     ];

//     return menuPaths.includes(pathname);
// };

// const MainLayout = ({ children }) => {
//     const location = useLocation();
//     const isMenu = isMenuPath(location.pathname);

//     return (
//         <Box>
//             <Header />
//             <Box
//                 component="main"
//                 sx={{
//                     width: '100%',
//                     // 홈페이지에서는 처음에는 여백이 없다가 스크롤 시 여백 생성
//                     // 다른 페이지에서는 항상 여백 유지
//                     paddingTop: location.pathname === '/' ? { xs: 0, sm: 0 } : { xs: '64px', sm: '64px' },
//                     minHeight: '100vh',
//                     transition: 'padding-top 0.3s ease',
//                 }}
//             >
//                 {children}
//             </Box>
//         </Box>
//     );
// };

// export default MainLayout; 