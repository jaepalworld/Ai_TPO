// import React from 'react';
// import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
// import { styled, keyframes } from '@mui/material/styles';
// import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// // 필요한 경우 TrendCollectionSection을 import
// // import { TrendCollectionSection } from './TrendCollectionSection';

// // ================ 공통 스타일 및 애니메이션 ================
// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//     transform: translateY(20px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

// const TextHighlight = styled('span')(({ theme }) => ({
//     color: theme.palette.primary.main,
//     position: 'relative',
//     '&::after': {
//         content: '""',
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         width: '100%',
//         height: '30%',
//         background: 'rgba(156, 39, 176, 0.15)',
//         zIndex: -1,
//         borderRadius: 4,
//     },
// }));

// const ActionButton = styled(Button)(({ theme }) => ({
//     minWidth: 180,
//     height: 56,
//     fontSize: '1.1rem',
//     marginTop: theme.spacing(4),
//     marginRight: theme.spacing(2),
//     boxShadow: '0 10px 20px rgba(156, 39, 176, 0.2)',
// }));

// // ================ HeroSection 컴포넌트 ================
// const HeroWrapper = styled(Box)(({ theme }) => ({
//     position: 'relative',
//     overflow: 'hidden',
//     padding: theme.spacing(10, 0, 8),
//     background: 'linear-gradient(135deg, #f5f7fa 0%, #fcfcfc 100%)',
//     '&::before': {
//         content: '""',
//         position: 'absolute',
//         top: 0,
//         right: 0,
//         width: '50%',
//         height: '100%',
//         background: 'radial-gradient(circle, rgba(156, 39, 176, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
//         zIndex: 0,
//     },
//     '&::after': {
//         content: '""',
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         width: '60%',
//         height: '60%',
//         background: 'radial-gradient(circle, rgba(255, 64, 129, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
//         zIndex: 0,
//     },
// }));

// const ImageContainer = styled(Box)(({ theme }) => ({
//     position: 'relative',
//     height: '100%',
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
// }));

// const StyledImagePlaceholder = styled(Paper)(({ theme }) => ({
//     height: 420,
//     width: '100%',
//     borderRadius: 24,
//     overflow: 'hidden',
//     position: 'relative',
//     backgroundImage: 'linear-gradient(45deg, #9c27b0 0%, #ff4081 100%)',
//     boxShadow: '0 20px 40px rgba(156, 39, 176, 0.2)',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
// }));

// export const HeroSection = () => {
//     return (
//         <HeroWrapper>
//             <Container maxWidth="lg">
//                 <Grid container spacing={6} alignItems="center">
//                     <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
//                         <Typography
//                             component="h1"
//                             variant="h2"
//                             gutterBottom
//                             sx={{
//                                 fontWeight: 700,
//                                 lineHeight: 1.2
//                             }}
//                         >
//                             당신의 스타일을
//                             <br />
//                             <TextHighlight>AI 헤어 디자인</TextHighlight>으로
//                             <br />
//                             완성하세요
//                         </Typography>
//                         <Typography
//                             variant="h6"
//                             sx={{
//                                 color: 'text.secondary',
//                                 lineHeight: 1.6,
//                                 mb: 3,
//                                 maxWidth: 500
//                             }}
//                         >
//                             미용실 방문 전, 다양한 헤어스타일을 가상으로 경험해보세요.
//                             인공지능 기술로 당신의 얼굴형에 맞는 최적의 스타일을 찾아드립니다.
//                         </Typography>
//                         <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
//                             <ActionButton
//                                 variant="contained"
//                                 color="primary"
//                                 size="large"
//                                 endIcon={<ArrowForwardIcon />}
//                             >
//                                 무료로 시작하기
//                             </ActionButton>
//                             <Button
//                                 variant="outlined"
//                                 color="primary"
//                                 size="large"
//                                 sx={{
//                                     minWidth: 180,
//                                     height: 56,
//                                     fontSize: '1.1rem',
//                                     marginTop: 4,
//                                     border: `2px solid`,
//                                     '&:hover': {
//                                         border: `2px solid`,
//                                         background: 'rgba(156, 39, 176, 0.05)',
//                                     },
//                                 }}
//                             >
//                                 더 알아보기
//                             </Button>
//                         </Box>
//                         <Box sx={{ display: 'flex', mt: 6, alignItems: 'center' }}>
//                             <Box sx={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 mr: 4
//                             }}>
//                                 <Box sx={{
//                                     width: 48,
//                                     height: 48,
//                                     borderRadius: '50%',
//                                     bgcolor: 'success.light',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                     color: 'white',
//                                     fontWeight: 'bold',
//                                     mr: 1.5
//                                 }}>
//                                     5K+
//                                 </Box>
//                                 <Typography variant="body1" fontWeight={500}>
//                                     행복한 사용자
//                                 </Typography>
//                             </Box>
//                             <Box sx={{
//                                 display: 'flex',
//                                 alignItems: 'center'
//                             }}>
//                                 <Box sx={{
//                                     width: 48,
//                                     height: 48,
//                                     borderRadius: '50%',
//                                     bgcolor: 'secondary.light',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                     color: 'white',
//                                     fontWeight: 'bold',
//                                     mr: 1.5
//                                 }}>
//                                     1K+
//                                 </Box>
//                                 <Typography variant="body1" fontWeight={500}>
//                                     헤어스타일
//                                 </Typography>
//                             </Box>
//                         </Box>
//                     </Grid>
//                     <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
//                         <ImageContainer>
//                             <StyledImagePlaceholder elevation={10}>
//                                 <Typography
//                                     variant="h5"
//                                     color="white"
//                                     fontWeight={600}
//                                     sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
//                                 >
//                                     AI 헤어스타일 시뮬레이션
//                                 </Typography>
//                             </StyledImagePlaceholder>
//                         </ImageContainer>
//                     </Grid>
//                 </Grid>
//             </Container>
//         </HeroWrapper>
//     );
// };