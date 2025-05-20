//아직 사용 안함 대기.
// import React from 'react';
// import { Box, Container, Typography, Button, Grid, Card, CardContent, Avatar, Divider, Paper } from '@mui/material';
// import ChatIcon from '@mui/icons-material/Chat';
// import VideocamIcon from '@mui/icons-material/Videocam';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import StarIcon from '@mui/icons-material/Star';

// // 스타일리스트 데이터 (실제 앱에서는 API에서 가져올 수 있음)
// const stylists = [
//     {
//         id: 1,
//         name: '김민지',
//         role: '수석 스타일리스트',
//         experience: '10년',
//         specialty: '펌, 컬러링',
//         avatar: '/images/stylists/stylist1.jpg',
//         rating: 4.9,
//         reviewCount: 152
//     },
//     {
//         id: 2,
//         name: '박준호',
//         role: '헤어 디자이너',
//         experience: '8년',
//         specialty: '남성 커트, 스타일링',
//         avatar: '/images/stylists/stylist2.jpg',
//         rating: 4.8,
//         reviewCount: 127
//     },
//     {
//         id: 3,
//         name: '이수연',
//         role: '컬러 스페셜리스트',
//         experience: '12년',
//         specialty: '염색, 발레아쥬',
//         avatar: '/images/stylists/stylist3.jpg',
//         rating: 4.9,
//         reviewCount: 198
//     }
// ];

// const StylistConsultationSection = () => {
//     return (
//         <Box sx={{ py: 8, bgcolor: '#f9f9f9' }}>
//             <Container maxWidth="lg">
//                 <Typography
//                     variant="h4"
//                     component="h2"
//                     align="center"
//                     gutterBottom
//                     sx={{
//                         fontWeight: 700,
//                         mb: 1,
//                         background: 'linear-gradient(45deg, #9c27b0 30%, #f50057 90%)',
//                         WebkitBackgroundClip: 'text',
//                         WebkitTextFillColor: 'transparent',
//                     }}
//                 >
//                     전문 스타일리스트 1:1 상담  잠시 대기 잠시 대기 사용 XXXXX
//                 </Typography>

//                 <Typography
//                     variant="h6"
//                     component="h3"
//                     align="center"
//                     color="text.secondary"
//                     sx={{ mb: 6, maxWidth: '700px', mx: 'auto' }}
//                 >
//                     당신의 얼굴형, 헤어 상태, 라이프스타일에 맞는 최적의 헤어스타일을 전문가와 함께 찾아보세요
//                 </Typography>

//                 <Grid container spacing={4} alignItems="stretch">
//                     {stylists.map((stylist) => (
//                         <Grid item xs={12} md={4} key={stylist.id}>
//                             <Card
//                                 sx={{
//                                     height: '100%',
//                                     display: 'flex',
//                                     flexDirection: 'column',
//                                     transition: 'transform 0.3s, box-shadow 0.3s',
//                                     '&:hover': {
//                                         transform: 'translateY(-8px)',
//                                         boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
//                                     }
//                                 }}
//                                 elevation={2}
//                             >
//                                 <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
//                                     <Avatar
//                                         src={stylist.avatar}
//                                         alt={stylist.name}
//                                         sx={{ width: 80, height: 80, mr: 2, border: '3px solid #f50057' }}
//                                     />
//                                     <Box>
//                                         <Typography variant="h6" component="h3" gutterBottom>
//                                             {stylist.name}
//                                         </Typography>
//                                         <Typography variant="body2" color="text.secondary" gutterBottom>
//                                             {stylist.role} · 경력 {stylist.experience}
//                                         </Typography>
//                                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                                             <StarIcon sx={{ color: '#FFD700', fontSize: '1rem', mr: 0.5 }} />
//                                             <Typography variant="body2" fontWeight={500}>
//                                                 {stylist.rating} ({stylist.reviewCount}개 리뷰)
//                                             </Typography>
//                                         </Box>
//                                     </Box>
//                                 </Box>

//                                 <Divider />

//                                 <CardContent sx={{ flexGrow: 1 }}>
//                                     <Typography variant="body2" color="text.secondary" paragraph>
//                                         <strong>전문 분야:</strong> {stylist.specialty}
//                                     </Typography>

//                                     <Paper
//                                         variant="outlined"
//                                         sx={{
//                                             p: 2,
//                                             bgcolor: 'rgba(156, 39, 176, 0.05)',
//                                             borderRadius: 2,
//                                             border: '1px solid rgba(156, 39, 176, 0.2)'
//                                         }}
//                                     >
//                                         <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
//                                             "고객님의 라이프스타일과 얼굴형을 고려한 맞춤형 스타일링을 제안해 드립니다. 부담 없이 상담 신청해 주세요."
//                                         </Typography>
//                                     </Paper>
//                                 </CardContent>

//                                 <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
//                                     <Button
//                                         variant="outlined"
//                                         startIcon={<ChatIcon />}
//                                         sx={{ borderRadius: 4, flex: 1, mr: 1 }}
//                                     >
//                                         채팅 상담
//                                     </Button>
//                                     <Button
//                                         variant="contained"
//                                         startIcon={<VideocamIcon />}
//                                         sx={{
//                                             borderRadius: 4,
//                                             flex: 1,
//                                             background: 'linear-gradient(45deg, #9c27b0 30%, #f50057 90%)',
//                                             boxShadow: '0 3px 5px 2px rgba(156, 39, 176, .2)'
//                                         }}
//                                     >
//                                         영상 상담
//                                     </Button>
//                                 </Box>
//                             </Card>
//                         </Grid>
//                     ))}
//                 </Grid>

//                 <Box
//                     sx={{
//                         mt: 6,
//                         p: 4,
//                         bgcolor: 'white',
//                         borderRadius: 2,
//                         boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
//                         textAlign: 'center'
//                     }}
//                 >
//                     <Typography variant="h6" gutterBottom>
//                         무엇을 도와드릴까요?
//                     </Typography>
//                     <Typography variant="body1" paragraph color="text.secondary">
//                         첫 상담은 15분 무료입니다. 아래 버튼을 클릭하여 예약하세요.
//                     </Typography>
//                     <Button
//                         variant="contained"
//                         color="primary"
//                         size="large"
//                         startIcon={<CalendarTodayIcon />}
//                         sx={{
//                             px: 4,
//                             py: 1.5,
//                             borderRadius: 30,
//                             background: 'linear-gradient(45deg, #9c27b0 30%, #f50057 90%)',
//                             boxShadow: '0 3px 5px 2px rgba(156, 39, 176, .3)'
//                         }}
//                     >
//                         상담 예약하기
//                     </Button>
//                 </Box>
//             </Container>
//         </Box>
//     );
// };

// export default StylistConsultationSection;