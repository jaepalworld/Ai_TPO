import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FlexZone = () => {
    const navigate = useNavigate();
    const [activePanel, setActivePanel] = useState(null);
    const [hoverPanel, setHoverPanel] = useState(null);

    // TPO 스타일 관련 패널 데이터
    const panels = [
        {
            id: 'hair-styling',
            title: 'HAIR STYLING',
            subtitle: 'Design Your Perfect Look',
            path: '/hair-styling'
        },
        {
            id: 'place-based',
            title: 'PLACE BASED',
            subtitle: 'Style for Every Location',
            path: '/place-based'
        },
        {
            id: 'occasion-style',
            title: 'OCCASION STYLE',
            subtitle: 'Perfect for Every Moment',
            path: '/occasion-style'
        }
    ];

    // 패널 너비 계산 (마우스 오버 시 확장)
    const getPanelWidth = (panelId) => {
        if (activePanel) {
            return activePanel === panelId ? '70%' : '15%';
        }
        return '33.33%';
    };

    // 클릭 핸들러
    const handlePanelClick = (panelId) => {
        console.log("Panel clicked:", panelId);
        const panel = panels.find(p => p.id === panelId);
        if (panel && panel.path) {
            console.log("Navigating to:", panel.path);
            navigate(panel.path);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100vw',
                height: '100vh',
                overflow: 'hidden',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 9999, // 헤더와 티커슬라이더보다 높은 zIndex
            }}
        >
            {panels.map((panel, index) => (
                <Box
                    key={panel.id}
                    sx={{
                        position: 'relative',
                        width: getPanelWidth(panel.id),
                        height: '100%',
                        overflow: 'hidden',
                        transition: 'width 0.8s cubic-bezier(0.77, 0, 0.175, 1)',
                        cursor: 'pointer',
                        // 패널별 배경 이미지 설정 (새로운 이미지들)
                        background: panel.id === 'hair-styling'
                            ? 'url(/images/flex1.jpg) center/cover no-repeat'
                            : panel.id === 'place-based'
                                ? 'url(/images/flex2.jpg) center/cover no-repeat'
                                : 'url(/images/flex3.jpg) center/cover no-repeat',
                        '&:before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: activePanel === panel.id
                                ? 'rgba(0, 0, 0, 0.3)' // 활성화 시 약간 밝게
                                : 'rgba(0, 0, 0, 0.85)', // 기본 상태에서는 거의 검은색
                            zIndex: 1,
                            transition: 'background-color 0.8s cubic-bezier(0.77, 0, 0.175, 1)',
                        },
                        '&:hover:before': {
                            backgroundColor: 'rgba(0, 0, 0, 0.3)', // 호버 시 이미지가 보이도록
                        }
                    }}
                    onMouseEnter={() => {
                        setActivePanel(panel.id);
                        setHoverPanel(panel.id);
                    }}
                    onMouseLeave={() => {
                        setActivePanel(null);
                        setHoverPanel(null);
                    }}
                    onClick={() => handlePanelClick(panel.id)}
                >
                    {/* 패널 사이의 구분선 */}
                    {index < panels.length - 1 && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                right: 0,
                                width: '2px',
                                background: 'rgba(255, 255, 255, 0.5)',
                                zIndex: 10,
                                boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
                                opacity: hoverPanel ? 0.3 : 0.7,
                                transition: 'opacity 0.5s ease',
                                height: '100%'
                            }}
                        />
                    )}

                    {/* AI 아이콘 (비활성 상태에서 표시) */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '30%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 2,
                            opacity: activePanel === panel.id ? 0 : 0.8,
                            transition: 'opacity 0.5s ease',
                        }}
                    >
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </Box>
                    </Box>

                    {/* 수직 제목 (비활성 상태) */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: '50%',
                            left: '50%',
                            transform: 'translate(-50%, 50%) rotate(-90deg)',
                            zIndex: 2,
                            textAlign: 'center',
                            width: '100vh',
                            transition: 'all 0.5s ease',
                            opacity: activePanel === panel.id ? 0 : 1,
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                whiteSpace: 'nowrap',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                            }}
                        >
                            {panel.title}
                        </Typography>
                    </Box>

                    {/* 활성화된 패널 제목 (중앙 표시) */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 2,
                            textAlign: 'center',
                            width: '90%',
                            opacity: activePanel === panel.id ? 1 : 0,
                            transition: 'opacity 0.5s ease',
                        }}
                    >
                        {/* AI 로고/아이콘 */}
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px auto',
                                backdropFilter: 'blur(20px)',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                        </Box>

                        <Typography
                            variant="h2"
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                mb: 2,
                                textTransform: 'uppercase',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.8rem' },
                                lineHeight: 1.2,
                            }}
                        >
                            {panel.title}
                        </Typography>
                        {panel.subtitle && (
                            <Typography
                                variant="h5"
                                sx={{
                                    color: 'white',
                                    fontWeight: 300,
                                    fontStyle: 'italic',
                                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
                                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                                    mb: 3,
                                }}
                            >
                                {panel.subtitle}
                            </Typography>
                        )}

                        {/* START 버튼 */}
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '12px 32px',
                                borderRadius: '50px',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                color: '#333',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                '&:hover': {
                                    backgroundColor: 'white',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                                }
                            }}
                        >
                            <Typography variant="body1" sx={{ mr: 1, fontWeight: 600 }}>
                                START NOW
                            </Typography>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </Box>
                    </Box>
                </Box>
            ))}

            {/* 뒤로가기 버튼 */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 30,
                    left: 30,
                    zIndex: 1000,
                    cursor: 'pointer',
                }}
                onClick={() => navigate(-1)}
            >
                <Box
                    sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            transform: 'scale(1.1)',
                        }
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                </Box>
            </Box>
        </Box>
    );
};

export default FlexZone;