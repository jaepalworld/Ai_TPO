import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import FlexZoneSection from '../components/home/maincollection/FlexZoneSection';
import HeroSlider from '../components/home/maincollection/HeroSlider';
import LookbookSection from '../components/home/maincollection/LookbookSection';
import KakaomapSection from '../components/home/KakaomapSection';
import Menu from '../components/login/Menu'; // Menu 컴포넌트 추가

const Main = () => {
    return (
        <Box>
            {/* 플로팅 메뉴 추가 */}
            <Menu />

            {/* 1. 당신만의 스타일을 찾아보세요 (CTA section with HeroSlider) */}
            <Box sx={{ bgcolor: 'primary.light', color: 'white' }}>
                <HeroSlider />
            </Box>


            {/* 4. Collection (TrendCollectionSection) */}
            <FlexZoneSection />

            {/* 5. LOOKBOOK (LookbookSection) */}
            <LookbookSection />

            {/* 새로 추가: 주변 헤어샵 찾기 섹션 */}
            <KakaomapSection />


            {/* 하단 CTA 섹션 */}
            <Box sx={{ py: 8, bgcolor: 'primary.light', color: 'white' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center" justifyContent="center">
                        <Grid item xs={12} md={8} textAlign="center">
                            <Typography variant="h4" component="h2" gutterBottom>
                                지금 바로 헤어스타일 변화를 시작하세요
                            </Typography>
                            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                                AI 기술로 당신의 얼굴형에 최적화된 헤어스타일을 찾아보세요.
                                가상으로 먼저 경험하고, 실제 미용실에서 더 확신 있는 선택을 할 수 있습니다.
                            </Typography>
                            <Button variant="contained" color="secondary" size="large">
                                무료로 시작하기
                            </Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Main;