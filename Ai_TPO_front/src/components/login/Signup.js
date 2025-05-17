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
    FormControlLabel,
    Checkbox,
    Divider,
    LinearProgress,
    InputAdornment,
    IconButton,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/auth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import KakaoLogin from './KakaoLogin';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: '',
        birthdate: '',
        gender: '',
        address: '',
        profileImageUrl: ''
    });
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [agreePrivacy, setAgreePrivacy] = useState(false);
    const [agreeMarketing, setAgreeMarketing] = useState(false);
    const [error, setError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordFeedback, setPasswordFeedback] = useState('');
    const navigate = useNavigate();

    // 입력 필드 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // 비밀번호 강도 검사
        if (name === 'password') {
            checkPasswordStrength(value);
        }
    };

    // 비밀번호 강도 검사 함수
    const checkPasswordStrength = (password) => {
        let strength = 0;
        let feedback = '';

        if (password.length >= 8) {
            strength += 1;
        } else {
            feedback = '비밀번호는 8자 이상이어야 합니다.';
        }

        if (/[A-Z]/.test(password)) {
            strength += 1;
        }

        if (/[a-z]/.test(password)) {
            strength += 1;
        }

        if (/[0-9]/.test(password)) {
            strength += 1;
        }

        if (/[^A-Za-z0-9]/.test(password)) {
            strength += 1;
        }

        // 강도에 따른 피드백
        if (strength === 0) {
            feedback = '비밀번호를 입력해주세요.';
        } else if (strength === 1) {
            feedback = '매우 약한 비밀번호입니다.';
        } else if (strength === 2) {
            feedback = '약한 비밀번호입니다.';
        } else if (strength === 3) {
            feedback = '적절한 비밀번호입니다.';
        } else if (strength === 4) {
            feedback = '강한 비밀번호입니다.';
        } else if (strength === 5) {
            feedback = '매우 강한 비밀번호입니다!';
        }

        setPasswordStrength(strength);
        setPasswordFeedback(feedback);
    };

    // 비밀번호 강도에 따른 색상
    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 1) return '#f44336'; // 빨강
        if (passwordStrength <= 3) return '#ff9800'; // 주황
        return '#4caf50'; // 초록
    };

    // 전화번호 포맷팅
    const formatPhoneNumber = (value) => {
        if (!value) return value;

        // 숫자만 남기고 나머지 제거
        const phoneNumber = value.replace(/[^\d]/g, '');

        // 전화번호 포맷팅 (010-1234-5678)
        if (phoneNumber.length <= 3) {
            return phoneNumber;
        } else if (phoneNumber.length <= 7) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        } else {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
        }
    };

    // 전화번호 입력 핸들러
    const handlePhoneChange = (e) => {
        const formattedPhone = formatPhoneNumber(e.target.value);
        setFormData({ ...formData, phone: formattedPhone });
    };

    // 모든 필수 동의 항목에 체크했는지 확인
    const allRequiredChecked = agreeTerms && agreePrivacy;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // 필수 입력 확인
        if (!formData.name.trim()) {
            return setError('이름을 입력해주세요.');
        }

        // 전화번호 유효성 검사
        const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/-/g, ''))) {
            return setError('유효한 전화번호 형식이 아닙니다.');
        }

        // 비밀번호 확인
        if (formData.password !== formData.confirmPassword) {
            return setError('비밀번호가 일치하지 않습니다.');
        }

        // 비밀번호 강도 확인
        if (passwordStrength < 3) {
            return setError('더 강력한 비밀번호를 사용해주세요.');
        }

        // 약관 동의 확인
        if (!allRequiredChecked) {
            return setError('필수 약관에 동의해주세요.');
        }

        setLoading(true);

        try {
            // Firebase에 회원가입 정보 전송
            const { user, error: registerError } = await registerUser(formData.email, formData.password);

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
                // 회원가입 성공 시 추가 정보를 데이터베이스에 저장하는 코드가 필요
                // 예: await saveUserProfile(user.uid, {
                //     name: formData.name,
                //     phone: formData.phone,
                //     birthdate: formData.birthdate,
                //     gender: formData.gender,
                //     address: formData.address,
                //     agreeMarketing: agreeMarketing
                // });

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

    // 비밀번호 토글
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    // 비밀번호 확인 토글
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };

    // 카카오 로그인 성공 핸들러
    const handleKakaoLoginSuccess = (userData) => {
        console.log('카카오 로그인 성공:', userData);
        // 백엔드와 연동이 필요하다면 여기서 처리
        navigate('/');
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8, mb: 8, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography component="h1" variant="h5" gutterBottom>
                        회원가입
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ width: '100%', mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2, textAlign: 'center' }}>
                            간편 가입
                        </Typography>
                        <KakaoLogin
                            buttonText="카카오로 회원가입"
                            onLoginSuccess={handleKakaoLoginSuccess}
                        />
                    </Box>

                    <Divider sx={{ width: '100%', mb: 3 }}>또는 이메일로 가입</Divider>

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            기본 정보
                        </Typography>

                        {/* 이메일 */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="이메일 주소"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                        />

                        {/* 비밀번호 */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="비밀번호"
                            type={passwordVisible ? "text" : "password"}
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Tooltip title="8자 이상, 대소문자, 숫자, 특수문자를 포함하면 더 안전합니다">
                                            <InfoOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                        </Tooltip>
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={togglePasswordVisibility}
                                            edge="end"
                                        >
                                            {passwordVisible ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            helperText={passwordFeedback}
                        />

                        {/* 비밀번호 강도 표시 */}
                        {formData.password && (
                            <Box sx={{ mb: 2, mt: 0.5 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={(passwordStrength / 5) * 100}
                                    sx={{
                                        height: 8,
                                        borderRadius: 5,
                                        bgcolor: '#e0e0e0',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: getPasswordStrengthColor(),
                                        },
                                    }}
                                />
                            </Box>
                        )}

                        {/* 비밀번호 확인 */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="비밀번호 확인"
                            type={confirmPasswordVisible ? "text" : "password"}
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={toggleConfirmPasswordVisibility}
                                            edge="end"
                                        >
                                            {confirmPasswordVisible ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                            helperText={
                                formData.password !== formData.confirmPassword && formData.confirmPassword !== ''
                                    ? "비밀번호가 일치하지 않습니다"
                                    : ""
                            }
                        />

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            개인 정보
                        </Typography>

                        {/* 이름 */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="이름"
                            name="name"
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        {/* 전화번호 */}
                        <TextField
                            margin="normal"
                            fullWidth
                            id="phone"
                            label="전화번호"
                            name="phone"
                            autoComplete="tel"
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            placeholder="010-0000-0000"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">+82</InputAdornment>,
                            }}
                        />

                        {/* 생년월일 */}
                        <TextField
                            margin="normal"
                            fullWidth
                            id="birthdate"
                            label="생년월일"
                            name="birthdate"
                            type="date"
                            value={formData.birthdate}
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        {/* 성별 */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="gender-label">성별</InputLabel>
                            <Select
                                labelId="gender-label"
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                label="성별"
                                onChange={handleChange}
                            >
                                <MenuItem value="">선택 안함</MenuItem>
                                <MenuItem value="male">남성</MenuItem>
                                <MenuItem value="female">여성</MenuItem>
                                <MenuItem value="other">기타</MenuItem>
                            </Select>
                        </FormControl>

                        {/* 주소 */}
                        <TextField
                            margin="normal"
                            fullWidth
                            id="address"
                            label="주소"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                            약관 동의
                        </Typography>

                        {/* 이용약관 동의 */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2">
                                        이용약관 동의 (필수)
                                    </Typography>
                                    <Link component={RouterLink} to="/terms" variant="body2" sx={{ ml: 1 }}>
                                        보기
                                    </Link>
                                </Box>
                            }
                        />

                        {/* 개인정보 수집 동의 */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={agreePrivacy}
                                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2">
                                        개인정보 수집 및 이용 동의 (필수)
                                    </Typography>
                                    <Link component={RouterLink} to="/privacy" variant="body2" sx={{ ml: 1 }}>
                                        보기
                                    </Link>
                                </Box>
                            }
                        />

                        {/* 마케팅 정보 수신 동의 */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={agreeMarketing}
                                    onChange={(e) => setAgreeMarketing(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2">
                                        마케팅 정보 수신 동의 (선택)
                                    </Typography>
                                </Box>
                            }
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            disabled={loading || !allRequiredChecked}
                        >
                            {loading ? <CircularProgress size={24} /> : '회원가입'}
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