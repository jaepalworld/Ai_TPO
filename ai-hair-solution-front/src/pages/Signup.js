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
    Alert
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/auth';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 비밀번호 확인
        if (password !== confirmPassword) {
            return setError('비밀번호가 일치하지 않습니다.');
        }

        // 비밀번호 길이 확인
        if (password.length < 6) {
            return setError('비밀번호는 6자 이상이어야 합니다.');
        }

        setLoading(true);

        try {
            // user 변수 사용하지 않는 경고 해결 - destructuring에서 제거
            const { error: registerError } = await registerUser(email, password);

            if (registerError) {
                // Firebase 오류 메시지를 사용자 친화적으로 변환
                let errorMessage = registerError;

                if (registerError.includes('email-already-in-use')) {
                    errorMessage = '이미 사용 중인 이메일 주소입니다.';
                } else if (registerError.includes('invalid-email')) {
                    errorMessage = '유효하지 않은 이메일 형식입니다.';
                } else if (registerError.includes('operation-not-allowed')) {
                    errorMessage = '이메일/비밀번호 로그인이 비활성화되어 있습니다.';
                } else if (registerError.includes('weak-password')) {
                    errorMessage = '비밀번호가 너무 약합니다.';
                }

                setError(errorMessage);
            } else {
                // 회원가입 성공 시 홈으로 리다이렉트
                navigate('/');
            }
        } catch (err) {
            setError('회원가입 중 오류가 발생했습니다.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" gutterBottom>
                        회원가입
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
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="비밀번호 확인"
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? '회원가입 중...' : '회원가입'}
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link component={RouterLink} to="/login" variant="body2">
                                    이미 계정이 있으신가요? 로그인
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Signup;