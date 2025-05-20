import React, { useState } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';
import TpoHairStyle from './TpoHairStyle'; // 위자드 컴포넌트 임포트

// 기존 스타일링된 컴포넌트들은 그대로 유지
const HeroWrapper = styled(Box)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    padding: theme.spacing(10, 0, 8),
    background: 'linear-gradient(135deg, #f5f7fa 0%, #fcfcfc 100%)',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(156, 39, 176, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
        zIndex: 0,
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, rgba(255, 64, 129, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
        zIndex: 0,
    },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}));

const StyledImagePlaceholder = styled(Paper)(({ theme }) => ({
    height: 420,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundImage: 'linear-gradient(45deg, #9c27b0 0%, #ff4081 100%)',
    boxShadow: '0 20px 40px rgba(156, 39, 176, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
        opacity: 0.6,
    }
}));

const TextHighlight = styled('span')(({ theme }) => ({
    color: theme.palette.primary.main,
    position: 'relative',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '30%',
        background: 'rgba(156, 39, 176, 0.15)',
        zIndex: -1,
        borderRadius: 4,
    },
}));

const ActionButton = styled(Button)(({ theme }) => ({
    minWidth: 180,
    height: 56,
    fontSize: '1.1rem',
    marginTop: theme.spacing(4),
    marginRight: theme.spacing(2),
    boxShadow: '0 10px 20px rgba(156, 39, 176, 0.2)',
}));

const OutlinedActionButton = styled(Button)(({ theme }) => ({
    minWidth: 180,
    height: 56,
    fontSize: '1.1rem',
    marginTop: theme.spacing(4),
    border: `2px solid ${theme.palette.primary.main}`,
    '&:hover': {
        border: `2px solid ${theme.palette.primary.dark}`,
        background: 'rgba(156, 39, 176, 0.05)',
    },
}));

// 모달 스타일
const StyledModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
}));

const ModalContent = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: 16,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(0),
    position: 'relative',
    width: '100%',
    maxWidth: 1000,
    maxHeight: '90vh',
    overflow: 'auto',
}));

const ModalCloseButton = styled(Button)(({ theme }) => ({
    position: 'absolute',
    top: 8,
    right: 8,
    minWidth: 'auto',
    zIndex: 1,
}));

// 이미지 오버레이 효과
const ImageOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    borderRadius: 24,
    '&:hover': {
        opacity: 1,
    },
}));

const HeroSection = () => {
    // 모달 상태 관리
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <HeroWrapper>
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
                        <Typography
                            component="h1"
                            variant="h2"
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                lineHeight: 1.2
                            }}
                        >
                            어떤 자리든 빛나는

                            <br />
                            <TextHighlight>AI 헤어 디자인</TextHighlight>
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                color: 'text.secondary',
                                lineHeight: 1.6,
                                mb: 3,
                                maxWidth: 500
                            }}
                        >
                            시간(Time), 장소(Place), 상황(Occasion)에 맞는<br />
                            최적의 스타일을 제안합니다.<br />
                            중요한 미팅, 특별한 데이트, 캐주얼한 일상까지<br />
                            - 모든 순간에 어울리는 완벽한 헤어스타일로 <br />
                            당신의 매력을 높여드립니다
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            <ActionButton
                                variant="contained"
                                color="primary"
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                onClick={handleOpen}
                            >
                                무료로 시작하기
                            </ActionButton>
                            <OutlinedActionButton
                                variant="outlined"
                                color="primary"
                                size="large"
                            >
                                더 알아보기
                            </OutlinedActionButton>
                        </Box>


                    </Grid>
                    <Grid item xs={12} md={6} sx={{ zIndex: 1 }}>
                        <ImageContainer>
                            <StyledImagePlaceholder elevation={10}>
                                <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                    <Typography
                                        variant="h5"
                                        color="white"
                                        fontWeight={600}
                                        sx={{
                                            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            zIndex: 1
                                        }}
                                    >
                                        AI 헤어스타일 시뮬레이션
                                    </Typography>
                                    <ImageOverlay>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleOpen}
                                            sx={{ mb: 2 }}
                                        >
                                            지금 시작하기
                                        </Button>
                                        <Typography variant="body2">
                                            TPO에 맞는 헤어스타일 추천받기
                                        </Typography>
                                    </ImageOverlay>
                                </Box>
                            </StyledImagePlaceholder>
                        </ImageContainer>
                    </Grid>
                </Grid>
            </Container>

            {/* TPO 스타일 추천 위자드 모달 */}
            <StyledModal
                open={open}
                onClose={handleClose}
                aria-labelledby="style-wizard-modal"
                aria-describedby="ai-hairstyle-recommendation-wizard"
            >
                <ModalContent>
                    <ModalCloseButton color="inherit" onClick={handleClose}>
                        <CloseIcon />
                    </ModalCloseButton>
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                            TPO 맞춤 헤어스타일 추천
                        </Typography>
                    </Box>
                    <Box sx={{ px: 3, pb: 3 }}>
                        <TpoHairStyle />
                    </Box>
                </ModalContent>
            </StyledModal>
        </HeroWrapper>
    );
};

export default HeroSection;