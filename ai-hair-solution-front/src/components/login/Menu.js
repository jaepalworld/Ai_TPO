import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tooltip, Typography, Modal, Paper, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import GitHubIcon from '@mui/icons-material/GitHub';
import CloseIcon from '@mui/icons-material/Close';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import KakaoLogin from './KakaoLogin';
import KakaoChannelChat from './KakaoChannelChat';


const Menu = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isAiChatOpen, setIsAiChatOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Firebase 인증 상태 확인
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // 사용자가 로그인한 상태
                setIsLoggedIn(true);
            } else {
                // 사용자가 로그아웃한 상태
                // 카카오 로그인 상태 확인
                const kakaoUser = localStorage.getItem('kakaoUser');
                setIsLoggedIn(!!kakaoUser);
            }
        });

        return () => unsubscribe(); // 컴포넌트 언마운트시 이벤트 리스너 제거
    }, []);

    // 스크롤 이벤트 리스너
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 맨 위로 스크롤하는 함수
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // 카카오 로그인 성공 핸들러
    const handleKakaoLoginSuccess = (userData) => {
        console.log('카카오 로그인 성공:', userData);
        setIsLoggedIn(true);
        window.dispatchEvent(new Event('userLogin'));
    };

    // AI 상담 처리 함수
    const handleAiChat = () => {
        // 사용자가 로그인한 상태라면 카카오 채널 상담 모달 열기
        if (isLoggedIn) {
            setIsAiChatOpen(true);
        } else {
            // 로그인 필요 안내
            // 또는 간단한 로그인 없이 사용 가능한 채널 상담 모달 표시
            setIsAiChatOpen(true);
        }
    };

    // 유튜브로 이동하는 함수
    const goToYoutube = () => {
        window.open('https://www.youtube.com/@%EB%82%91%EB%8B%AC%EB%8B%AC%ED%95%98%EB%88%84', '_blank');
    };

    // 깃허브로 이동하는 함수
    const goToGithub = () => {
        window.open('https://github.com/jaepalworld/AiHairSolution', '_blank');
    };

    return (
        <>
            <Box
                sx={{
                    position: 'fixed',
                    right: 20,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: '20px 10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                    width: '80px',
                }}
            >
                {/* 유튜브 버튼 */}
                <Tooltip title="유튜브 채널" placement="left">
                    <IconButton
                        onClick={goToYoutube}
                        sx={{
                            color: '#666',
                            width: 60,
                            height: 60,
                            margin: '8px 0'
                        }}
                    >
                        <PlayArrowIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                </Tooltip>

                <Tooltip title="AI 상담" placement="left">
                    <IconButton
                        component={Link}
                        to="/chat/ai"
                        sx={{
                            color: '#666',
                            width: 60,
                            height: 60,
                            margin: '8px 0'
                        }}
                    >
                        <SmartToyIcon sx={{ fontSize: 32 }} /> {/* ChatIcon에서 SmartToyIcon으로 변경 */}
                    </IconButton>
                </Tooltip>

                {/* 카카오 버튼 - 로그인되지 않았을 때만 표시 */}
                {!isLoggedIn && (
                    <Tooltip title="카카오 로그인" placement="left">
                        <Box>
                            <KakaoLogin
                                isButton={false}
                                iconSize={{ width: 60, height: 60 }}
                                onLoginSuccess={handleKakaoLoginSuccess}
                            />
                        </Box>
                    </Tooltip>
                )}

                {/* AI 상담 버튼 - 로그인 후에만 표시 */}
                {isLoggedIn && (
                    <Tooltip title="카카오톡 상담" placement="left">
                        <Box>
                            <KakaoChannelChat
                                isButton={false}
                                iconSize={{ width: 60, height: 60 }}
                                onSuccess={() => console.log('카카오톡 상담 시작')}
                            />
                        </Box>
                    </Tooltip>
                )}

                {/* GitHub 버튼 */}
                <Tooltip title="GitHub" placement="left">
                    <IconButton
                        onClick={goToGithub}
                        sx={{
                            color: '#666',
                            width: 60,
                            height: 60,
                            margin: '8px 0'
                        }}
                    >
                        <GitHubIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                </Tooltip>

                {showScrollTop && (
                    <Tooltip title="맨 위로" placement="left">
                        <IconButton
                            onClick={scrollToTop}
                            sx={{
                                color: '#666',
                                width: 60,
                                height: 60,
                                margin: '8px 0'
                            }}
                        >
                            <ArrowUpwardIcon sx={{ fontSize: 32 }} />
                        </IconButton>
                    </Tooltip>
                )}

                <Tooltip title="맨 아래로" placement="left">
                    <IconButton
                        onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                        sx={{
                            color: '#666',
                            width: 60,
                            height: 60,
                            margin: '8px 0'
                        }}
                    >
                        <ArrowDownwardIcon sx={{ fontSize: 32 }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* 일반 채팅 상담 모달을 AI 상담 모달로 변경 */}
            <Modal
                open={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                aria-labelledby="ai-chat-modal"
            >
                <Paper sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    height: 500,
                    p: 4,
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" component="h2">
                            <SmartToyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            AI 상담
                        </Typography>
                        <IconButton onClick={() => setIsChatOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{
                        flexGrow: 1,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 2,
                        mb: 2,
                        p: 2,
                        overflowY: 'auto'
                    }}>
                        <Typography variant="body2" sx={{ backgroundColor: '#e0e0e0', p: 1, borderRadius: 1, display: 'inline-block', mb: 1 }}>
                            안녕하세요! AI 스타일 어시스턴트입니다. 어떤 도움이 필요하신가요?
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex' }}>
                        <input
                            style={{
                                flexGrow: 1,
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                marginRight: '8px'
                            }}
                            placeholder="메시지 입력..."
                        />
                        <Button
                            variant="contained"
                            sx={{ minWidth: 'auto' }}
                        >
                            전송
                        </Button>
                    </Box>
                </Paper>
            </Modal>

            {/* AI 상담 모달 */}
            <Modal
                open={isAiChatOpen}
                onClose={() => setIsAiChatOpen(false)}
                aria-labelledby="ai-chat-modal"
            >
                <Paper sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    height: 500,
                    p: 4,
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" component="h2">
                            <SmartToyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            AI 상담 서비스
                        </Typography>
                        <IconButton onClick={() => setIsAiChatOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Box sx={{
                        flexGrow: 1,
                        backgroundColor: '#f5f5f5',
                        borderRadius: 2,
                        mb: 2,
                        p: 2,
                        overflowY: 'auto'
                    }}>
                        <Typography variant="body2" sx={{ backgroundColor: '#e0e0e0', p: 1, borderRadius: 1, display: 'inline-block', mb: 1 }}>
                            안녕하세요! AI 헤어 스타일 상담사입니다. 어떤 도움이 필요하신가요?
                        </Typography>

                        {/* 카카오톡 상담 추천 메시지 */}
                        <Typography variant="body2" sx={{ backgroundColor: '#e0e0e0', p: 1, borderRadius: 1, display: 'inline-block', mt: 2 }}>
                            1:1 상담을 원하시면 카카오톡 채널 상담을 이용해보세요!
                        </Typography>
                        {/* 카카오톡 채널 상담 버튼 - 모달 내부 */}
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <KakaoChannelChat buttonText="카카오톡 1:1 상담 시작하기" />
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex' }}>
                        <input
                            style={{
                                flexGrow: 1,
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                marginRight: '8px'
                            }}
                            placeholder="메시지 입력..."
                        />
                        <Button
                            variant="contained"
                            sx={{ minWidth: 'auto' }}
                        >
                            전송
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </>
    );
};


export default Menu;