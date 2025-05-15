import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Link,
    Alert,
    Divider,
    CircularProgress
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/auth';
import KakaoLogin from './KakaoLogin';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error: loginError } = await loginUser(email, password);

            if (loginError) {
                // Firebase 오류 메시지를 사용자 친화적으로 변환
                let errorMessage = '로그인 중 오류가 발생했습니다.';

                if (loginError.includes('invalid-email')) {
                    errorMessage = '유효하지 않은 이메일 형식입니다.';
                } else if (loginError.includes('user-disabled')) {
                    errorMessage = '이 계정은 비활성화되었습니다.';
                } else if (loginError.includes('user-not-found')) {
                    errorMessage = '등록되지 않은 이메일입니다.';
                } else if (loginError.includes('wrong-password')) {
                    errorMessage = '비밀번호가 올바르지 않습니다.';
                } else if (loginError.includes('too-many-requests')) {
                    errorMessage = '너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
                }

                setError(errorMessage);
            } else {
                // 로그인 성공 시 홈으로 리다이렉트
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError('로그인 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 카카오 로그인 성공 핸들러
    const handleKakaoLoginSuccess = (userData) => {
        console.log('카카오 로그인 성공:', userData);
        // 백엔드와 연동이 필요하다면 여기서 처리
        navigate('/');
    };

    // 카카오 로그인 실패 핸들러
    const handleKakaoLoginFailure = (error) => {
        console.error('카카오 로그인 실패:', error);
        setError('카카오 로그인에 실패했습니다.');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" gutterBottom>
                        로그인
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="이메일 주소"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="비밀번호"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : '로그인'}
                        </Button>

                        <Divider sx={{ my: 2 }}>또는</Divider>

                        {/* 카카오 로그인 버튼 */}
                        <KakaoLogin
                            buttonText="카카오로 로그인"
                            onLoginSuccess={handleKakaoLoginSuccess}
                            onLoginFailure={handleKakaoLoginFailure}
                        />

                        <Grid container sx={{ mt: 2 }}>
                            <Grid item xs>
                                <Link component={RouterLink} to="/forgot-password" variant="body2">
                                    비밀번호를 잊으셨나요?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link component={RouterLink} to="/signup" variant="body2">
                                    계정이 없으신가요? 회원가입
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;