import React from 'react';
import { Box, Container, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

// 주변 미용실 찾기 컴포넌트 임포트
import KakaomapSection from '../components/home/KakaomapSection';

const SalonsPage = () => {
    return (
        <Box>
            {/* 페이지 헤더 영역 */}
            <Box
                sx={{
                    py: 6,
                    bgcolor: 'primary.light',
                    color: 'white',
                    mb: 4
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            textAlign: 'center'
                        }}
                    >
                        내 주변 헤어샵 찾기
                    </Typography>
                    <Typography
                        variant="h6"
                        component="p"
                        sx={{
                            textAlign: 'center',
                            maxWidth: '800px',
                            mx: 'auto',
                            mb: 3
                        }}
                    >
                        AI로 찾은 최적의 헤어스타일, 가까운 미용실에서 바로 실현해보세요
                    </Typography>

                    {/* 브레드크럼 네비게이션 */}
                    <Breadcrumbs
                        separator={<NavigateNextIcon fontSize="small" />}
                        aria-label="breadcrumb"
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            '& .MuiBreadcrumbs-ol': {
                                justifyContent: 'center'
                            },
                            '& a': {
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center'
                            }
                        }}
                    >
                        <MuiLink
                            component={Link}
                            to="/"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none'
                            }}
                        >
                            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                            홈
                        </MuiLink>
                        <Typography color="text.primary" sx={{ color: 'white' }}>주변 헤어샵</Typography>
                    </Breadcrumbs>
                </Container>
            </Box>

            {/* 주변 미용실 찾기 컴포넌트 */}
            <KakaomapSection />

            {/* 추가 정보 섹션 */}
            <Box sx={{ py: 6, bgcolor: '#f5f5f5' }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
                        AI 헤어스타일과 미용실의 완벽한 만남
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            gap: 4,
                            textAlign: 'center'
                        }}
                    >
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>가상 시뮬레이션 후 실제 시술</Typography>
                            <Typography variant="body1">
                                AI로 가상 헤어스타일을 경험한 후, 마음에 드는 스타일을 찾으면 주변 미용실에서 전문가의 손길로 실현해보세요.
                            </Typography>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>AI 스타일 가이드 제공</Typography>
                            <Typography variant="body1">
                                선택한 헤어스타일 이미지와 상세 가이드를 미용사에게 보여주고 정확한 스타일링을 받아보세요.
                            </Typography>
                        </Box>

                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>파트너 미용실 특별 혜택</Typography>
                            <Typography variant="body1">
                                AiHairSolution 파트너 미용실에서는 앱을 통해 방문 시 특별 할인과 우선 예약 혜택을 제공합니다.
                            </Typography>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default SalonsPage;