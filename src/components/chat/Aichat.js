import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    Badge
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import './Aichat.css'; // 수정: AIChat.css → Aichat.css
import { sendMessageToAI } from '../../services/chatService';


const AIChat = () => {
    const [sessions, setSessions] = useState({}); // 날짜별 세션 저장
    const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜
    const [messages, setMessages] = useState([]); // 현재 표시되는 메시지들
    const [inputMessage, setInputMessage] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false); // 사이드 메뉴 열림 상태
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // 오늘 날짜를 YYMMDD 형식으로 가져오기
    const getTodayFormatted = () => {
        const today = new Date();
        const year = today.getFullYear().toString().slice(2); // 끝 두 자리
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}${month}${day}`;
    };

    // 날짜 형식 변환 (YYMMDD -> YY.MM.DD)
    const formatDate = (dateString) => {
        if (!dateString || dateString.length !== 6) return '날짜 없음';
        return `${dateString.slice(0, 2)}.${dateString.slice(2, 4)}.${dateString.slice(4, 6)}`;
    };

    // 초기 메시지 형식 
    const getInitialMessage = () => ({
        id: Date.now(),
        text: '안녕하세요! AI 스타일 어시스턴트입니다. 어떤 도움이 필요하신가요?\n\n⚠️ 주의: 욕설, 성희롱 등 부적절한 언어 사용 시 경고 없이 서비스 이용이 제한될 수 있습니다.',
        sender: 'ai',
        timestamp: new Date().toISOString()
    });

    // 컴포넌트 마운트 시 초기화
    useEffect(() => {
        // 로컬 스토리지에서 세션 데이터 불러오기
        const savedSessions = localStorage.getItem('hairStyleChatSessions');

        if (savedSessions) {
            const parsedSessions = JSON.parse(savedSessions);
            setSessions(parsedSessions);

            // 최근 날짜 선택 (또는 오늘 날짜)
            const today = getTodayFormatted();
            const dates = Object.keys(parsedSessions).sort().reverse();

            if (parsedSessions[today]) {
                setSelectedDate(today);
                setMessages(parsedSessions[today]);
            } else if (dates.length > 0) {
                setSelectedDate(dates[0]);
                setMessages(parsedSessions[dates[0]]);
            } else {
                // 세션이 없으면 새 세션 시작
                startNewSession();
            }
        } else {
            // 저장된 세션이 없으면 새 세션 시작
            startNewSession();
        }
    }, []);

    // 세션 데이터가 변경될 때 로컬 스토리지에 저장
    useEffect(() => {
        if (Object.keys(sessions).length > 0) {
            localStorage.setItem('hairStyleChatSessions', JSON.stringify(sessions));
        }
    }, [sessions]);

    // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 새 상담 세션 시작
    const startNewSession = () => {
        const today = getTodayFormatted();

        // 오늘 세션이 있는지 확인
        let todayMessages = [];
        if (sessions[today]) {
            // 이미 오늘 세션이 있으면 기존 메시지 사용
            todayMessages = [...sessions[today]];
        } else {
            // 오늘 세션이 없으면 새 세션 시작
            todayMessages = [getInitialMessage()];
        }

        // 상태 업데이트
        setSelectedDate(today);
        setMessages(todayMessages);

        // 세션 업데이트
        setSessions(prev => ({
            ...prev,
            [today]: todayMessages
        }));

        // 사이드바 닫기
        setDrawerOpen(false);
    };

    // 날짜 선택 처리
    const handleDateSelect = (date) => {
        if (sessions[date]) {
            setSelectedDate(date);
            setMessages(sessions[date]);
            setDrawerOpen(false);  // 모바일에서 선택 후 자동으로 닫기
        }
    };

    // 메시지 전송 함수
    const sendMessage = async () => {
        if (!inputMessage.trim() || isBlocked) return;

        // 욕설/부적절한 내용 필터링 (간단한 예시)
        const forbiddenWords = ['욕설1', '욕설2', '성희롱단어1', '성희롱단어2'];
        const containsForbiddenWord = forbiddenWords.some(word =>
            inputMessage.toLowerCase().includes(word.toLowerCase())
        );

        if (containsForbiddenWord) {
            setIsBlocked(true);

            const blockMessage = {
                id: Date.now(),
                text: '부적절한 언어가 감지되어 서비스 이용이 제한되었습니다.',
                sender: 'ai',
                timestamp: new Date().toISOString()
            };

            const updatedMessages = [...messages, blockMessage];
            setMessages(updatedMessages);

            // 세션 업데이트
            if (selectedDate) {
                setSessions(prev => ({
                    ...prev,
                    [selectedDate]: updatedMessages
                }));
            }

            return;
        }

        // 사용자 메시지 추가
        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        // 현재 날짜가 없으면 오늘 날짜로 설정
        const currentDate = selectedDate || getTodayFormatted();
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInputMessage('');

        // 세션 업데이트
        setSessions(prev => ({
            ...prev,
            [currentDate]: updatedMessages
        }));

        // AI 응답 처리 (실제 FastAPI 백엔드 API 호출)
        try {
            // 로딩 메시지 추가 (선택사항)
            const loadingId = Date.now() + 1;
            const loadingMessage = {
                id: loadingId,
                text: '응답 생성 중...',
                sender: 'ai',
                timestamp: new Date().toISOString(),
                isLoading: true
            };

            setMessages(prev => [...prev, loadingMessage]);

            // 이전 메시지 기록 준비 (옵션 - Gemini에 컨텍스트 제공)
            // 최근 10개 메시지만 전송 (너무 많은 토큰 사용 방지)
            const recentMessages = messages.slice(-10).map(msg => ({
                text: msg.text,
                sender: msg.sender
            }));

            // 백엔드 API 호출
            const aiResponseText = await sendMessageToAI(inputMessage, recentMessages);

            // 로딩 메시지 제거
            setMessages(prev => prev.filter(msg => msg.id !== loadingId));

            // 실제 응답 추가
            const aiResponse = {
                id: Date.now() + 2,
                text: aiResponseText,
                sender: 'ai',
                timestamp: new Date().toISOString()
            };

            const messagesWithResponse = [...updatedMessages, aiResponse];
            setMessages(messagesWithResponse);

            // 세션 업데이트
            setSessions(prev => ({
                ...prev,
                [currentDate]: messagesWithResponse
            }));

        } catch (error) {
            console.error('AI 응답 오류:', error);

            const errorMessage = {
                id: Date.now() + 2,
                text: '죄송합니다. 응답 중 오류가 발생했습니다.',
                sender: 'ai',
                timestamp: new Date().toISOString()
            };

            const messagesWithError = [...updatedMessages, errorMessage];
            setMessages(messagesWithError);

            // 세션 업데이트
            setSessions(prev => ({
                ...prev,
                [currentDate]: messagesWithError
            }));
        }
    };

    // 엔터키로 메시지 전송
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // 이전 페이지로 돌아가기
    const goBack = () => {
        navigate(-1);
    };

    // 드로워 토글
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    return (
        <Container maxWidth="md" className="chat-container">
            <Paper elevation={3} className="chat-paper">
                {/* 사이드 메뉴 (날짜별 상담 목록) */}
                <Drawer
                    anchor="left"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: '280px',
                            boxSizing: 'border-box',
                        },
                    }}
                >
                    <Box className="drawer-header">
                        <Typography variant="h6" component="div" gutterBottom>
                            상담 기록
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={startNewSession}
                            fullWidth
                            className="new-chat-button"
                        >
                            새 상담 시작
                        </Button>
                    </Box>

                    <Divider />

                    <List className="date-list">
                        {Object.keys(sessions).length === 0 ? (
                            <ListItem>
                                <Typography variant="body2" color="text.secondary">
                                    상담 기록이 없습니다
                                </Typography>
                            </ListItem>
                        ) : (
                            Object.keys(sessions)
                                .sort((a, b) => b.localeCompare(a)) // 날짜 내림차순 정렬
                                .map(date => (
                                    <ListItem
                                        key={date}
                                        button
                                        onClick={() => handleDateSelect(date)}
                                        className={`date-list-item ${date === selectedDate ? 'selected' : ''}`}
                                    >
                                        <ListItemText
                                            primary={`${formatDate(date)} 상담`}
                                            secondary={`메시지 ${sessions[date].length}개`}
                                            primaryTypographyProps={{
                                                fontWeight: date === selectedDate ? 'bold' : 'normal'
                                            }}
                                        />
                                        {date === getTodayFormatted() && (
                                            <span className="date-badge">오늘</span>
                                        )}
                                    </ListItem>
                                ))
                        )}
                    </List>
                </Drawer>

                {/* 헤더 */}
                <Box className="chat-header">
                    <IconButton onClick={toggleDrawer} sx={{ mr: 1 }}>
                        <ChatIcon />
                    </IconButton>
                    <IconButton onClick={goBack} sx={{ mr: 1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" className="header-title">
                        {selectedDate ? `${formatDate(selectedDate)} 상담` : 'AI 스타일 상담'}
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={startNewSession}
                    >
                        새 상담
                    </Button>
                </Box>

                {/* 채팅 내용 */}
                <Box className="chat-messages-container">
                    {messages.map((message) => (
                        <Box
                            key={message.id}
                            className={`message-bubble ${message.sender === 'user' ? 'user' : 'ai'}`}
                        >
                            <Typography className="message-text">
                                {message.text.includes('⚠️')
                                    ? message.text.split('⚠️').map((part, index) => {
                                        // 첫 번째 부분 뒤에만 경고 아이콘 추가
                                        if (index === 0) {
                                            return (
                                                <React.Fragment key={index}>
                                                    {part}
                                                </React.Fragment>
                                            );
                                        }
                                        // 주의 문구에는 아이콘 추가
                                        else if (part.trim().startsWith('주의:')) {
                                            return (
                                                <React.Fragment key={index}>
                                                    <Box component="span" className="warning-icon">
                                                        <Box component="span" className="warning-icon-symbol">
                                                            ⚠️
                                                        </Box>
                                                        {part}
                                                    </Box>
                                                </React.Fragment>
                                            );
                                        }
                                        // 그 외 부분은 그대로 반환
                                        return <React.Fragment key={index}>{part}</React.Fragment>;
                                    })
                                    : message.text
                                }
                            </Typography>
                            <Typography
                                variant="caption"
                                className={`message-timestamp ${message.sender === 'user' ? 'user' : 'ai'}`}
                            >
                                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        </Box>
                    ))}
                    <div ref={messagesEndRef} />
                </Box>

                {/* 입력 영역 */}
                <Box className="chat-input-container">
                    <TextField
                        fullWidth
                        placeholder={isBlocked ? "채팅이 차단되었습니다" : "메시지를 입력하세요..."}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isBlocked}
                        multiline
                        maxRows={4}
                        variant="outlined"
                        size="small"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isBlocked}
                        sx={{ minWidth: 'auto', p: 1 }}
                    >
                        <SendIcon />
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AIChat;