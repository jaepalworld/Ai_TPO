import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Container, Grid } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

// 애니메이션 키프레임 수정 - 세로 방향 텍스트 맞춤
const slideInFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100px) rotate(180deg);
  }
  to {
    opacity: 1;
    transform: translateX(0) rotate(180deg);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 무한 슬라이드 애니메이션 정의
const infiniteSlide = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

// 스타일 컴포넌트
const SectionWrapper = styled(Box)(({ theme }) => ({
    padding: theme.spacing(12, 0),
    position: 'relative',
    backgroundColor: '#f8f9fa',
    overflow: 'hidden',
    // 추가 스타일링으로 더 세련된 느낌 줄 수 있음
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

// 백그라운드 이미지 수정 - 첫 번째 이미지의 절반 위치까지만 보이도록 설정
const BackgroundImage = styled(Box)(({ theme }) => ({
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '25%', // 첫 번째 이미지의 절반 위치까지만 보이도록 조정
    height: '70%', // 높이 조정
    backgroundImage: 'url("/images/trendbackground.png")', // 배경 이미지 경로
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.15,
    zIndex: 0,
    borderRadius: '0 16px 16px 0', // 오른쪽만 둥글게
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)', // 미묘한 그림자 추가
    // 자연스러운 페이드 아웃 효과
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

// 수직 텍스트 스타일링 - 애니메이션 방향 수정
const LookbookTitle = styled(Typography)(({ theme, animate }) => ({
    fontSize: '3rem',
    fontWeight: 700,
    color: '#333',
    opacity: animate ? 1 : 0,
    animation: animate ? `${slideInFromRight} 1.2s ${theme.transitions.easing.easeOut}` : 'none',
    letterSpacing: '0.2rem',
    writingMode: 'vertical-lr',
    transform: 'rotate(180deg)', // 항상 같은 방향 유지
    height: '70%',
    position: 'sticky', // 위치 고정
    top: theme.spacing(12), // 상단에서 약간 떨어지게
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '@media (max-width:960px)': {
        fontSize: '3rem',
    },
    '@media (max-width:600px)': {
        fontSize: '2rem',
        writingMode: 'horizontal-tb', // 모바일에서는 가로로 전환
        transform: 'none', // 모바일에서는 회전 없음
        position: 'relative',
        top: 0,
        marginBottom: theme.spacing(4),
        animation: animate ? `${slideUp} 1.2s ${theme.transitions.easing.easeOut}` : 'none', // 모바일에서는 다른 애니메이션
    },
}));

// 이미지 카드 - 초기에는 아래에서 위로 등장
const ImageCard = styled(Box)(({ theme, delay, animate }) => ({
    width: '105%',
    height: 340,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 8,
    opacity: animate ? 1 : 0,
    transform: animate ? 'translateY(0)' : 'translateY(50px)', // 아래에서 위로 등장
    transition: 'opacity 1s ease, transform 1s ease',
    transitionDelay: `${delay}s`,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    '@media (max-width:960px)': {
        height: 320,
    },
    '@media (max-width:600px)': {
        height: 280,
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

// 전체 슬라이더 컨테이너
const SliderContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
}));

// 슬라이더 트랙 - CSS 애니메이션으로 무한 반복 구현
const SliderTrack = styled(Box)(({ theme, animate }) => ({
    display: 'flex',
    width: 'fit-content', // 컨텐츠 크기에 맞게 자동 조정
    animation: animate ? `${infiniteSlide} 25s linear infinite` : 'none', // 더 느린 속도로 설정 (25초)
}));

// 슬라이더 이미지 데이터
const lookbookImages = [
    {
        id: 1,
        image: process.env.PUBLIC_URL + '/images/coll1.png',
        title: '여자 1',
    },
    {
        id: 2,
        image: process.env.PUBLIC_URL + '/images/coll2.png',
        title: '여자 1.1',
    },
    {
        id: 3,
        image: process.env.PUBLIC_URL + '/images/coll3.png',
        title: '여자 1.2',
    },
    {
        id: 4,
        image: process.env.PUBLIC_URL + '/images/lookman1.png',
        title: '남자 1',
    },
    {
        id: 5,
        image: process.env.PUBLIC_URL + '/images/lookman2.png',
        title: '남자 2',
    },
    {
        id: 6,
        image: process.env.PUBLIC_URL + '/images/lookman3.png',
        title: '남자 3',
    },
];

const LookbookSection = () => {
    const [animateTitle, setAnimateTitle] = useState(false);
    const [animateImages, setAnimateImages] = useState(false);
    const sectionRef = useRef(null);
    const titleRef = useRef(null);

    // 스크롤 감지 및 애니메이션 활성화
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setAnimateTitle(true);
                    setTimeout(() => {
                        setAnimateImages(true);
                    }, 600);
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
            {/* 백그라운드 이미지 추가 */}
            <BackgroundImage />
            {/* 추가 백그라운드 효과 */}
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

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={4} sx={{ height: { md: '600px', xs: 'auto' } }}>
                    {/* 타이틀 영역 - 항상 세로로 표시 */}
                    <Grid
                        item
                        xs={12}
                        md={2}
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            height: { md: '100%', xs: 'auto' }
                        }}
                    >
                        <Box
                            ref={titleRef}
                            sx={{
                                height: { md: '100%', xs: 'auto' },
                                display: 'flex',
                                alignItems: 'center',
                                position: { md: 'sticky', xs: 'relative' },
                                top: { md: '80px', xs: '0' }
                            }}
                        >
                            <LookbookTitle variant="h2" animate={animateTitle}>
                                LOOKBOOK
                            </LookbookTitle>
                        </Box>
                    </Grid>

                    {/* 이미지 슬라이더 영역 */}
                    <Grid item xs={12} md={10}>
                        <SliderContainer>
                            <SliderTrack animate={animateImages}>
                                {/* 첫 번째 이미지 세트 */}
                                {lookbookImages.map((image) => (
                                    <Box key={`first-${image.id}`} sx={{ width: '300px', padding: '0 8px' }}>
                                        <ImageCard animate={animateImages} delay={0}>
                                            <LookbookImage src={image.image} alt={image.title} />
                                        </ImageCard>
                                    </Box>
                                ))}

                                {/* 복제된 이미지 세트 (무한 반복을 위해) */}
                                {lookbookImages.map((image) => (
                                    <Box key={`clone-${image.id}`} sx={{ width: '300px', padding: '0 8px' }}>
                                        <ImageCard animate={animateImages} delay={0}>
                                            <LookbookImage src={image.image} alt={image.title} />
                                        </ImageCard>
                                    </Box>
                                ))}
                            </SliderTrack>
                        </SliderContainer>
                    </Grid>
                </Grid>
            </Container>
        </SectionWrapper>
    );
};

export default LookbookSection;