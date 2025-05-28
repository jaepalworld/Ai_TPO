import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가

// ================ Animation Keyframes ================
const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Infinite slide animation
const infiniteSlide = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

// ================ Styled Components ================
const SectionWrapper = styled(Box)(({ theme }) => ({
    padding: theme.spacing(10, 0),
    position: 'relative',
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)',
    }
}));

const BackgroundImage = styled(Box)(({ theme }) => ({
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '25%',
    height: '70%',
    backgroundImage: 'url("/images/trendbackground.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.15,
    zIndex: 0,
    borderRadius: '0 16px 16px 0',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
    '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '40%',
        height: '100%',
        background: 'linear-gradient(to right, rgba(248,249,250,0), rgba(248,249,250,1))',
    }
}));

const BottomBackground = styled(Box)(({ theme }) => ({
    width: '100%',
    height: '200px',
    backgroundColor: '#f7f7f7',
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 0,
}));

const TitleWrapper = styled(Box)(({ theme, animate }) => ({
    opacity: animate ? 1 : 0,
    animation: animate ? `${slideInRight} 1.2s ${theme.transitions.easing.easeOut}` : 'none',
    marginBottom: theme.spacing(4),
    position: 'relative',
    paddingLeft: theme.spacing(3),
    zIndex: 1,
}));

const VerticalLine = styled(Box)(({ theme, animate }) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: '2px',
    height: '100%',
    backgroundColor: '#666',
    opacity: animate ? 1 : 0,
    transform: animate ? 'scaleY(1)' : 'scaleY(0)',
    transformOrigin: 'top',
    transition: 'transform 1.2s ease, opacity 1.2s ease',
    transitionDelay: '0.3s',
}));

const SliderContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    zIndex: 1,
    maxWidth: '100%'
}));

const SliderTrack = styled(Box)(({ theme, animate }) => ({
    display: 'flex',
    width: 'fit-content',
    animation: animate ? `${infiniteSlide} 35s linear infinite` : 'none',
}));

const ImageCard = styled(Box)(({ theme, delay, animate }) => ({
    width: '106%',
    height: 380,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
    opacity: animate ? 1 : 0,
    transform: animate ? 'translateY(0)' : 'translateY(50px)',
    transition: 'opacity 1s ease, transform 1s ease',
    transitionDelay: `${delay}s`,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    '@media (max-width:960px)': {
        height: 300,
    },
    '@media (max-width:600px)': {
        height: 250,
    },
}));

const LookbookImage = styled('img')(({ theme }) => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));

const AdCard = styled(Box)(({ theme, animate }) => ({
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: theme.spacing(4),
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    overflow: 'hidden',
    position: 'relative',
    opacity: animate ? 1 : 0,
    animation: animate ? `${slideInUp} 1.2s ${theme.transitions.easing.easeOut}` : 'none',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    maxWidth: '380px',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)',
    },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: theme.spacing(3),
    width: '100%',
    maxWidth: '280px',
    '& img': {
        width: '100%',
        height: 'auto',
        transition: 'transform 0.5s ease',
    },
    '&:hover img': {
        transform: 'scale(1.05)',
    },
}));

const StarsIcon = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& svg': {
        width: 24,
        height: 24,
        color: '#333',
    },
}));

// 버튼을 Box로 변경하여 navigate 사용
const TryNowButton = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 24px',
    borderRadius: 50,
    backgroundColor: 'transparent',
    border: '1px solid #4e7df1',
    color: '#4e7df1',
    fontSize: '1rem',
    fontWeight: 500,
    marginTop: theme.spacing(2),
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#4e7df1',
        color: 'white',
    },
    '& svg': {
        marginLeft: theme.spacing(1),
    },
}));

const FlexZoneSection = () => {
    const navigate = useNavigate(); // useNavigate 훅 추가
    const [animateTitle, setAnimateTitle] = useState(false);
    const [animateImages, setAnimateImages] = useState(false);
    const [animateAd, setAnimateAd] = useState(false);
    const sectionRef = useRef(null);

    // Trend images data
    const trendImages = [
        {
            id: 1,
            image: process.env.PUBLIC_URL + '/images/coll1.png',
            title: '모던 단발'
        },
        {
            id: 2,
            image: process.env.PUBLIC_URL + '/images/coll2.png',
            title: '레이어드 롱 헤어'
        },
        {
            id: 3,
            image: process.env.PUBLIC_URL + '/images/coll3.png',
            title: '웨이브 스타일'
        },
        {
            id: 4,
            image: process.env.PUBLIC_URL + '/images/lookman1.png',
            title: '남성 스타일'
        },
    ];

    // TRY NOW 버튼 클릭 핸들러 추가
    const handleTryNowClick = () => {
        navigate('/flex-zone'); // FlexZone으로 네비게이션
    };

    // Detect scroll and activate animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setAnimateTitle(true);
                    setTimeout(() => {
                        setAnimateImages(true);
                    }, 600);
                    setTimeout(() => {
                        setAnimateAd(true);
                    }, 800);
                }
            },
            {
                root: null,
                threshold: 0.2,
                rootMargin: '-100px',
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <SectionWrapper ref={sectionRef}>
            {/* Background elements */}
            <BackgroundImage />
            <Box sx={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '45%',
                height: '25%',
                opacity: 0.05,
                backgroundImage: 'url("/images/hair-texture.jpg")',
                backgroundSize: 'cover',
                filter: 'blur(4px)',
                transform: 'rotate(180deg)',
                borderRadius: '16px 0 0 0',
            }} />
            <BottomBackground />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={6}>
                    {/* 왼쪽 섹션 - 이미지 슬라이더와 타이틀이 있는 부분 */}
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={4}>
                            {/* 타이틀 영역 */}
                            <Grid item xs={12}>
                                <TitleWrapper animate={animateTitle}>
                                    <VerticalLine animate={animateTitle} />
                                    <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 500, color: 'text.secondary', mb: 1 }}>
                                        AI Hair
                                    </Typography>
                                    <Typography variant="h2" sx={{
                                        fontSize: '3rem',
                                        fontWeight: 700,
                                        color: '#333',
                                        mb: 2,
                                        letterSpacing: '0.05rem',
                                        '@media (max-width:960px)': {
                                            fontSize: '2.8rem',
                                        },
                                        '@media (max-width:600px)': {
                                            fontSize: '2.2rem',
                                        },
                                    }}>
                                        Flex Zone
                                    </Typography>
                                    <Box
                                        onClick={handleTryNowClick} // 클릭 핸들러 추가
                                        sx={{
                                            display: 'inline-block',
                                            color: '#666',
                                            textDecoration: 'none',
                                            fontSize: '1.1rem',
                                            fontWeight: 500,
                                            position: 'relative',
                                            cursor: 'pointer',
                                            mt: 4,
                                            borderBottom: '1px solid #999',
                                            pb: 0.5,
                                            opacity: animateTitle ? 1 : 0,
                                            transform: animateTitle ? 'translateY(0)' : 'translateY(20px)',
                                            transition: 'opacity 0.8s ease, transform 0.8s ease, color 0.3s ease',
                                            transitionDelay: '0.6s',
                                            '&:hover': {
                                                color: 'primary.main',
                                                borderColor: 'primary.main',
                                            }
                                        }}
                                    >
                                        TRY NOW
                                    </Box>
                                </TitleWrapper>
                            </Grid>

                            {/* 이미지 슬라이더 영역 */}
                            <Grid item xs={12}>
                                <SliderContainer>
                                    <SliderTrack animate={animateImages}>
                                        <Grid container spacing={2} sx={{ flexWrap: 'nowrap' }}>
                                            {trendImages.map((image) => (
                                                <Grid item key={`first-${image.id}`} sx={{ width: '220px' }}>
                                                    <ImageCard animate={animateImages} delay={0}>
                                                        <LookbookImage src={image.image} alt={image.title} />
                                                    </ImageCard>
                                                </Grid>
                                            ))}

                                            {trendImages.map((image) => (
                                                <Grid item key={`clone-${image.id}`} sx={{ width: '220px' }}>
                                                    <ImageCard animate={animateImages} delay={0}>
                                                        <LookbookImage src={image.image} alt={image.title} />
                                                    </ImageCard>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </SliderTrack>
                                </SliderContainer>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* 오른쪽 섹션 - AI 광고 카드 */}
                    <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <AdCard animate={animateAd}>
                            <ImageContainer>
                                <img
                                    src={process.env.PUBLIC_URL + '/images/cardimage.png'}
                                    alt="AI 솔루션"
                                />
                            </ImageContainer>

                            <StarsIcon>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.5 4.25a.75.75 0 01.75 0l1.5 1.5a.75.75 0 010 1l-1.5 1.5a.75.75 0 01-1.5 0L9.25 6.75a.75.75 0 010-1l1.5-1.5a.75.75 0 01.75 0zM16 7.5a.75.75 0 01.75 0l1.5 1.5a.75.75 0 010 1L16.75 11.5a.75.75 0 01-1.5 0l-1.5-1.5a.75.75 0 010-1l1.5-1.5a.75.75 0 01.75 0zM7 7.5a.75.75 0 01.75 0l1.5 1.5a.75.75 0 010 1L7.75 11.5a.75.75 0 01-1.5 0l-1.5-1.5a.75.75 0 010-1l1.5-1.5a.75.75 0 01.75 0z" />
                                </svg>
                            </StarsIcon>

                            <Typography variant="h4" sx={{
                                fontWeight: 700,
                                mb: 1,
                                fontSize: '2rem',
                            }}>
                                Ai Hair Solution
                            </Typography>

                            <Typography variant="body1" sx={{
                                color: '#666',
                                mb: 3,
                                fontSize: '1rem',
                            }}>
                                지금바로 시작해 보세요 !
                            </Typography>

                            <TryNowButton onClick={handleTryNowClick}>
                                TRY NOW
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </TryNowButton>
                        </AdCard>
                    </Grid>
                </Grid>
            </Container>
        </SectionWrapper>
    );
};

export default FlexZoneSection;