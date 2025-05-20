// 카카오톡 채널 상담 기능을 위한 컴포넌트
import React, { useState, useEffect } from 'react';
import {
    Button,
    CircularProgress,
    Typography,
    Box,
    Alert,
    Modal,
    Paper,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * 카카오톡 채널 상담 컴포넌트
 * @param {Object} props
 * @param {string} props.buttonText - 버튼에 표시될 텍스트
 * @param {boolean} props.isButton - 버튼 or 아이콘 모드 선택
 * @param {Object} props.iconSize - 아이콘 모드일 때 사이즈
 * @param {Function} props.onSuccess - 상담 시작 성공 콜백
 * @param {Function} props.onFailure - 상담 시작 실패 콜백
 */
const KakaoChannelChat = ({
    buttonText = '카카오톡 상담',
    isButton = true,
    iconSize = { width: 60, height: 60 },
    onSuccess,
    onFailure
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isKakaoSDKLoaded, setIsKakaoSDKLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 환경 변수 대신 직접 채널 ID 지정 (페이지를 찾을 수 없음 오류 해결)
    const channelPublicId = "_bmZin";

    // 카카오 SDK 로드
    useEffect(() => {
        // SDK 로드 상태 확인 (디버깅용)
        console.log("Kakao SDK 초기 상태:", window.Kakao ? "존재" : "없음");
        if (window.Kakao) {
            console.log("Kakao 초기화 상태:", window.Kakao.isInitialized() ? "초기화됨" : "초기화 안됨");
        }

        // 이미 로드되었는지 확인
        if (window.Kakao && window.Kakao.isInitialized()) {
            console.log("이미 초기화된 Kakao SDK 발견");
            setIsKakaoSDKLoaded(true);
            return;
        }

        const loadKakaoSDK = () => {
            const script = document.createElement('script');
            script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
            script.async = true;

            script.onload = () => {
                // API 키가 없을 경우를 대비해 하드코딩된 키 사용
                const apiKey = process.env.REACT_APP_KAKAO_LOGIN_API_KEY || "YOUR_KAKAO_API_KEY";
                console.log("API 키:", apiKey ? "설정됨" : "없음");

                // 카카오 SDK 초기화
                window.Kakao.init(apiKey);
                console.log('Kakao SDK 로드 및 초기화 완료:', window.Kakao.isInitialized());
                setIsKakaoSDKLoaded(true);
            };

            script.onerror = () => {
                setError('카카오 SDK를 로드하는데 실패했습니다');
                console.error('카카오 SDK 로드 실패');
            };

            document.body.appendChild(script);
        };

        loadKakaoSDK();

        // 컴포넌트 언마운트 시 정리 작업은 유지
        return () => {
            const kakaoScript = document.querySelector('script[src="https://developers.kakao.com/sdk/js/kakao.js"]');
            if (kakaoScript && kakaoScript.parentNode) {
                kakaoScript.parentNode.removeChild(kakaoScript);
            }
        };
    }, []);

    // 모달 열기
    const openModal = () => {
        setIsModalOpen(true);
        setError('');
    };

    // 카카오톡 채널 상담 시작
    const startKakaoChat = () => {
        // SDK 로드 확인
        if (!window.Kakao) {
            console.error('Kakao SDK가 로드되지 않았습니다');
            setError('카카오 SDK가 로드되지 않았습니다.');
            return;
        }

        // SDK 초기화 확인
        if (!window.Kakao.isInitialized()) {
            console.error('Kakao SDK가 초기화되지 않았습니다');
            setError('카카오 SDK가 초기화되지 않았습니다.');
            return;
        }

        // Channel 객체 확인
        if (!window.Kakao.Channel) {
            console.error('Kakao.Channel 객체가 없습니다');
            setError('카카오 채널 기능을 불러올 수 없습니다.');
            return;
        }

        setLoading(true);

        try {
            console.log("채널 ID:", channelPublicId);

            // 카카오톡 채널 상담 시작 (하드코딩된 채널 ID 사용)
            window.Kakao.Channel.chat({
                channelPublicId: channelPublicId
            });

            if (onSuccess) {
                onSuccess();
            }

            setIsModalOpen(false);
        } catch (err) {
            console.error('카카오 채널 상담 시작 에러:', err);
            setError('카카오톡 채널 상담을 시작할 수 없습니다.');

            if (onFailure) {
                onFailure(err);
            }
        } finally {
            setLoading(false);
        }
    };

    // 버튼 모드
    if (isButton) {
        return (
            <>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={openModal}
                    disabled={loading}
                    sx={{
                        backgroundColor: '#FEE500',
                        color: '#000000',
                        '&:hover': {
                            backgroundColor: '#E6CF00',
                        },
                        '&:disabled': {
                            backgroundColor: '#FEE50099',
                        }
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <>
                            <img
                                src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_small.png"
                                alt="카카오"
                                style={{ width: '20px', height: '20px', marginRight: '8px' }}
                            />
                            {buttonText}
                        </>
                    )}
                </Button>

                {/* 채널 상담 모달 */}
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    aria-labelledby="kakao-channel-modal"
                >
                    <Paper sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        p: 4,
                        outline: 'none',
                        textAlign: 'center'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton onClick={() => setIsModalOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <Typography variant="h6" component="h2" sx={{ color: '#3A1D1D', fontWeight: 'bold' }}>
                                <span style={{
                                    backgroundColor: '#FEE500',
                                    color: '#3A1D1D',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    marginRight: '8px'
                                }}>
                                    TALK
                                </span>
                                카카오톡 채널 상담
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Typography sx={{ mb: 2 }}>
                            카카오톡으로 상담을 시작합니다
                        </Typography>
                        <Typography sx={{ mb: 4, fontSize: '0.9rem', color: '#666' }}>
                            Mobile / PC 카카오톡으로 상담 시작을 알리는
                            메시지가 발송되었으니 확인해 주세요.
                        </Typography>

                        <Box>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#FEE500',
                                    color: '#3A1D1D',
                                    '&:hover': { backgroundColor: '#E6CF00' }
                                }}
                                onClick={startKakaoChat}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'API로 상담 시작하기'}
                            </Button>
                        </Box>
                    </Paper>
                </Modal>
            </>
        );
    } else {
        // 아이콘 모드
        return (
            <>
                <IconButton
                    onClick={openModal}
                    disabled={loading}
                    sx={{
                        backgroundColor: '#FEE500',
                        color: '#3A1D1D',
                        borderRadius: '50%',
                        width: iconSize.width,
                        height: iconSize.height,
                        margin: '8px 0',
                        '&:hover': { backgroundColor: '#E6CF00' }
                    }}
                >
                    {loading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                            TALK
                        </Typography>
                    )}
                </IconButton>

                {/* 아이콘 모드용 모달 */}
                <Modal
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    aria-labelledby="kakao-channel-modal"
                >
                    <Paper sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        p: 4,
                        outline: 'none',
                        textAlign: 'center'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <IconButton onClick={() => setIsModalOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                            <Typography variant="h6" component="h2" sx={{ color: '#3A1D1D', fontWeight: 'bold' }}>
                                <span style={{
                                    backgroundColor: '#FEE500',
                                    color: '#3A1D1D',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    marginRight: '8px'
                                }}>
                                    TALK
                                </span>
                                카카오톡 채널 상담
                            </Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <Typography sx={{ mb: 2 }}>
                            카카오톡으로 상담을 시작합니다
                        </Typography>
                        <Typography sx={{ mb: 4, fontSize: '0.9rem', color: '#666' }}>
                            Mobile / PC 카카오톡으로 상담 시작을 알리는
                            메시지가 발송되었으니 확인해 주세요.
                        </Typography>

                        <Box>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{
                                    backgroundColor: '#FEE500',
                                    color: '#3A1D1D',
                                    '&:hover': { backgroundColor: '#E6CF00' }
                                }}
                                onClick={startKakaoChat}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'API로 상담 시작하기'}
                            </Button>
                        </Box>
                    </Paper>
                </Modal>
            </>
        );
    }
};

export default KakaoChannelChat;