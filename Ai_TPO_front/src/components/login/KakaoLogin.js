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
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// 카카오 로그인 컴포넌트 - 재사용 가능하도록 설계
const KakaoLogin = ({
    buttonText = '카카오로 로그인',
    onLoginSuccess,
    onLoginFailure,
    isButton = true, // 버튼 또는 아이콘 모드 선택
    iconSize = { width: 60, height: 60 } // 아이콘 크기 (아이콘 모드일 때 사용)
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isKakaoSDKLoaded, setIsKakaoSDKLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [webLoggedIn, setWebLoggedIn] = useState(false); // 웹 로그인 상태 추가
    const navigate = useNavigate();

    // Firebase 인증 상태 확인 - 웹 로그인 체크
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // 웹에서 로그인 상태
                setWebLoggedIn(true);
            } else {
                setWebLoggedIn(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // 카카오 SDK 로드
    useEffect(() => {
        const loadKakaoSDK = () => {
            // 이미 로드되었는지 확인
            if (window.Kakao) {
                if (window.Kakao.isInitialized()) {
                    setIsKakaoSDKLoaded(true);
                    checkKakaoLoginStatus();
                    return;
                }
            }

            const script = document.createElement('script');
            script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
            script.async = true;

            script.onload = () => {
                // 카카오 SDK 초기화 - 환경 변수에서 API 키 가져오기
                window.Kakao.init(process.env.REACT_APP_KAKAO_LOGIN_API_KEY);
                console.log('Kakao SDK loaded:', window.Kakao.isInitialized());
                setIsKakaoSDKLoaded(true);
                checkKakaoLoginStatus();
            };

            document.body.appendChild(script);
        };

        loadKakaoSDK();
    }, []);

    // 로그인 상태 확인
    const checkKakaoLoginStatus = () => {
        if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
            fetchUserInfo();
            return true;
        }

        // LocalStorage에서도 확인
        const storedUser = localStorage.getItem('kakaoUser');
        if (storedUser) {
            setUserInfo(JSON.parse(storedUser));
            return true;
        }

        return false;
    };

    // 사용자 정보 가져오기
    const fetchUserInfo = () => {
        if (!window.Kakao) return;

        window.Kakao.API.request({
            url: '/v2/user/me',
            success: (res) => {
                console.log('카카오 사용자 정보:', res);
                const kakaoUser = {
                    id: res.id,
                    email: res.kakao_account?.email || '',
                    name: res.kakao_account?.profile?.nickname || '',
                    photoURL: res.kakao_account?.profile?.profile_image_url || '',
                    provider: 'kakao'
                };
                setUserInfo(kakaoUser);

                // 로컬 스토리지에 저장
                localStorage.setItem('kakaoUser', JSON.stringify(kakaoUser));
            },
            fail: (error) => {
                console.error('카카오 사용자 정보 요청 실패:', error);
                setError('사용자 정보를 가져오는데 실패했습니다.');
            }
        });
    };

    // 카카오 로그인 처리 함수
    const handleKakaoLogin = () => {
        if (!isKakaoSDKLoaded) {
            setError('카카오 SDK가 아직 로드되지 않았습니다.');
            return;
        }

        setLoading(true);
        setError('');

        window.Kakao.Auth.login({
            success: (authObj) => {
                console.log('카카오 로그인 성공', authObj);

                // 사용자 정보 요청
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: (res) => {
                        console.log('카카오 사용자 정보:', res);

                        const kakaoUser = {
                            id: res.id,
                            email: res.kakao_account?.email || '',
                            name: res.kakao_account?.profile?.nickname || '',
                            photoURL: res.kakao_account?.profile?.profile_image_url || '',
                            provider: 'kakao'
                        };

                        // 사용자 정보 저장
                        setUserInfo(kakaoUser);

                        // 로컬 스토리지에 저장
                        localStorage.setItem('kakaoUser', JSON.stringify(kakaoUser));

                        // 상위 컴포넌트에 로그인 성공 알림
                        if (onLoginSuccess) {
                            onLoginSuccess(kakaoUser);
                        }

                        setLoading(false);
                        setIsModalOpen(false);
                    },
                    fail: (error) => {
                        console.error('카카오 사용자 정보 요청 실패:', error);
                        setError('사용자 정보를 가져오는데 실패했습니다.');

                        if (onLoginFailure) {
                            onLoginFailure(error);
                        }

                        setLoading(false);
                    }
                });
            },
            fail: (err) => {
                console.error('카카오 로그인 실패:', err);
                setError('카카오 로그인에 실패했습니다.');

                if (onLoginFailure) {
                    onLoginFailure(err);
                }

                setLoading(false);
            },
            scope: 'profile_nickname, profile_image' // 동의 항목 설정
        });
    };

    // 카카오 로그아웃 처리 함수
    const handleKakaoLogout = () => {
        if (!isKakaoSDKLoaded) {
            setError('카카오 SDK가 아직 로드되지 않았습니다.');
            return;
        }

        if (!window.Kakao.Auth.getAccessToken()) {
            console.log('Not logged in with Kakao');
            return;
        }

        setLoading(true);

        window.Kakao.Auth.logout(() => {
            console.log('카카오 로그아웃 성공');
            setUserInfo(null);

            // 로컬 스토리지에서 카카오 사용자 정보 제거
            localStorage.removeItem('kakaoUser');

            setLoading(false);
            setIsModalOpen(false);
        });
    };

    // 카카오 상담 처리 함수
    const startKakaoChat = () => {
        if (!isKakaoSDKLoaded) {
            setError('카카오 SDK가 아직 로드되지 않았습니다.');
            return;
        }

        // 카카오톡 채널 연결 - 환경 변수에서 채널 ID 가져오기
        if (window.Kakao && window.Kakao.Channel) {
            window.Kakao.Channel.chat({
                channelPublicId: process.env.REACT_APP_KAKAO_CHANNEL_ID
            });
        } else {
            setError('카카오톡 채널 기능을 불러올 수 없습니다.');
        }
    };

    // 모달 열기
    const openModal = () => {
        setIsModalOpen(true);
    };

    // 이미 로그인 되어 있는지 확인
    const isLoggedIn = userInfo !== null;

    // 웹 로그인 상태 또는 카카오 로그인 상태가 아닌 경우만 로그인 버튼 표시
    // 카카오로 로그인한 경우는 카카오 상담 기능 제공
    // 웹 로그인(Firebase)만 한 경우는 컴포넌트를 숨김

    // 웹 로그인만 되어 있고 카카오 로그인은 안 된 경우 - 컴포넌트 숨김
    if (webLoggedIn && !isLoggedIn) {
        return null;
    }

    // 버튼 컴포넌트
    if (isButton) {
        // 카카오 로그인 된 상태이면 상담 버튼 표시
        if (isLoggedIn) {
            return (
                <>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={openModal}
                        disabled={loading || !isKakaoSDKLoaded}
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
                                카카오 상담
                            </>
                        )}
                    </Button>

                    {/* 카카오 계정 관리 모달 */}
                    <Modal
                        open={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        aria-labelledby="kakao-profile-modal"
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
                                    카카오 상담
                                </Typography>
                            </Box>

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {userInfo && (
                                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    {userInfo.photoURL && (
                                        <img
                                            src={userInfo.photoURL}
                                            alt="프로필"
                                            style={{ width: '60px', height: '60px', borderRadius: '50%', marginBottom: '10px' }}
                                        />
                                    )}
                                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                        {userInfo.name || '사용자'}님
                                    </Typography>
                                    {userInfo.email && (
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            {userInfo.email}
                                        </Typography>
                                    )}
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', gap: 2 }}>
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
                                    카카오톡 상담 시작
                                </Button>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                        borderColor: '#E5E5E5',
                                        color: '#3A1D1D',
                                        '&:hover': { borderColor: '#CCCCCC', backgroundColor: '#F5F5F5' }
                                    }}
                                    onClick={handleKakaoLogout}
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : '로그아웃'}
                                </Button>
                            </Box>
                        </Paper>
                    </Modal>
                </>
            );
        } else {
            // 카카오 로그인 안 된 상태이면 로그인 버튼 표시 (웹 로그인은 위에서 처리됨)
            return (
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleKakaoLogin}
                    disabled={loading || !isKakaoSDKLoaded}
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
            );
        }
    } else {
        // 아이콘 컴포넌트 - 메뉴에서 사용
        // 카카오 로그인된 상태이면 상담 아이콘, 아니면 로그인 아이콘
        return (
            <>
                {isLoggedIn && (
                    <>
                        <IconButton
                            onClick={openModal}
                            disabled={loading || !isKakaoSDKLoaded}
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

                        {/* 카카오 상담 모달 (아이콘 버전) */}
                        <Modal
                            open={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            aria-labelledby="kakao-profile-modal"
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
                                        카카오 상담
                                    </Typography>
                                </Box>

                                {error && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                {userInfo && (
                                    <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        {userInfo.photoURL && (
                                            <img
                                                src={userInfo.photoURL}
                                                alt="프로필"
                                                style={{ width: '60px', height: '60px', borderRadius: '50%', marginBottom: '10px' }}
                                            />
                                        )}
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            {userInfo.name || '사용자'}님
                                        </Typography>
                                        {userInfo.email && (
                                            <Typography variant="body2" sx={{ color: '#666' }}>
                                                {userInfo.email}
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                <Typography sx={{ mb: 2 }}>
                                    카카오톡으로 상담을 시작합니다
                                </Typography>
                                <Typography sx={{ mb: 4, fontSize: '0.9rem', color: '#666' }}>
                                    Mobile / PC 카카오톡으로 상담 시작을 알리는
                                    메시지가 발송되었으니 확인해 주세요.
                                </Typography>

                                <Box sx={{ display: 'flex', gap: 2 }}>
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
                                        상담 시작하기
                                    </Button>

                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        sx={{
                                            borderColor: '#E5E5E5',
                                            color: '#3A1D1D',
                                            '&:hover': { borderColor: '#CCCCCC', backgroundColor: '#F5F5F5' }
                                        }}
                                        onClick={handleKakaoLogout}
                                        disabled={loading}
                                    >
                                        {loading ? <CircularProgress size={24} /> : '로그아웃'}
                                    </Button>
                                </Box>
                            </Paper>
                        </Modal>
                    </>
                )}

                {/* 웹 로그인이 안 되어 있을 때만 카카오 로그인 아이콘 표시 */}
                {!webLoggedIn && !isLoggedIn && (
                    <IconButton
                        onClick={handleKakaoLogin}
                        disabled={loading || !isKakaoSDKLoaded}
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
                )}
            </>
        );
    }
};

export default KakaoLogin;