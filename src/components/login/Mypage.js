import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    TextField,
    Button,
    Grid,
    Tabs,
    Tab,
    Divider,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    CardMedia,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import EventNoteIcon from '@mui/icons-material/EventNote';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getAuth, signOut, updatePassword } from 'firebase/auth';

const Mypage = () => {
    const [user, setUser] = useState(null);
    const [kakaoUser, setKakaoUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        phone: '',
        address: '',
        birthdate: '',
        gender: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // 로그인 상태 확인
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                // 사용자 정보 불러오기 - 실제 구현 시 데이터베이스에서 추가 정보 불러오기
                // fetchUserProfile(currentUser.uid);
                setProfileData({
                    ...profileData,
                    name: currentUser.displayName || '',
                    email: currentUser.email || '',
                });
            } else {
                // 파이어베이스에 로그인되어 있지 않은 경우, 카카오 로그인 확인
                const storedKakaoUser = localStorage.getItem('kakaoUser');
                if (storedKakaoUser) {
                    const kakaoUserData = JSON.parse(storedKakaoUser);
                    setKakaoUser(kakaoUserData);
                    setProfileData({
                        ...profileData,
                        name: kakaoUserData.name || '',
                        email: kakaoUserData.email || '',
                    });
                } else {
                    // 로그인되어 있지 않은 경우 로그인 페이지로 리다이렉트
                    navigate('/login');
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    // 탭 변경 핸들러
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // 편집 모드 토글
    const toggleEditMode = () => {
        setEditMode(!editMode);
        setError('');
        setSuccess('');
    };

    // 입력 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    // 프로필 업데이트 핸들러
    const handleProfileUpdate = async () => {
        setError('');
        setSuccess('');

        try {
            // 프로필 정보 업데이트 로직 구현
            // 실제로는 백엔드 API 호출하여 저장

            // 사용자 표시 이름 업데이트 (Firebase)
            if (user) {
                // 파이어베이스 사용자 표시 이름 업데이트 예시
                // await updateProfile(user, { displayName: profileData.name });
            }

            setSuccess('프로필이 성공적으로 업데이트되었습니다.');
            setEditMode(false);
        } catch (err) {
            console.error('프로필 업데이트 중 오류 발생:', err);
            setError('프로필 업데이트에 실패했습니다.');
        }
    };

    // 비밀번호 변경 핸들러
    const handlePasswordChange = async () => {
        setError('');
        setSuccess('');

        if (profileData.newPassword !== profileData.confirmNewPassword) {
            return setError('새 비밀번호가 일치하지 않습니다.');
        }

        if (profileData.newPassword.length < 6) {
            return setError('비밀번호는 6자 이상이어야 합니다.');
        }

        try {
            if (user) {
                // 파이어베이스 비밀번호 변경
                await updatePassword(user, profileData.newPassword);
                setSuccess('비밀번호가 성공적으로 변경되었습니다.');
                setProfileData({
                    ...profileData,
                    currentPassword: '',
                    newPassword: '',
                    confirmNewPassword: '',
                });
            } else {
                setError('비밀번호 변경을 위해서는 재로그인이 필요합니다.');
            }
        } catch (err) {
            console.error('비밀번호 변경 중 오류 발생:', err);

            if (err.code === 'auth/requires-recent-login') {
                setError('보안을 위해 재로그인 후 다시 시도해주세요.');
            } else {
                setError('비밀번호 변경에 실패했습니다.');
            }
        }
    };

    // 로그아웃 핸들러
    const handleLogout = async () => {
        try {
            if (user) {
                // Firebase 로그아웃
                await signOut(getAuth());
            }

            if (kakaoUser) {
                // 카카오 로그아웃
                if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
                    window.Kakao.Auth.logout(() => {
                        console.log('카카오 로그아웃 성공');
                    });
                }

                // 로컬 스토리지에서 카카오 사용자 정보 제거
                localStorage.removeItem('kakaoUser');
            }

            // 홈페이지로 리다이렉트
            navigate('/');
        } catch (err) {
            console.error('로그아웃 중 오류 발생:', err);
            setError('로그아웃에 실패했습니다.');
        }
    };

    // 로딩 중 표시
    if (loading) {
        return (
            <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    // 로그인되지 않은 경우 처리됨 - useEffect에서 리다이렉트

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                마이페이지
            </Typography>

            <Grid container spacing={4}>
                {/* 왼쪽 사이드바 - 프로필 요약 */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                src={kakaoUser?.photoURL || user?.photoURL || ''}
                                alt={profileData.name}
                                sx={{ width: 100, height: 100, mb: 2 }}
                            />
                            <Typography variant="h6" gutterBottom>
                                {profileData.name || '사용자'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {profileData.email || '이메일 없음'}
                            </Typography>
                            <Box sx={{ width: '100%', textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    onClick={handleLogout}
                                >
                                    로그아웃
                                </Button>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <List component="nav">
                            <ListItem button selected={tabValue === 0} onClick={(e) => handleTabChange(e, 0)}>
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText primary="프로필 관리" />
                            </ListItem>
                            <ListItem button selected={tabValue === 1} onClick={(e) => handleTabChange(e, 1)}>
                                <ListItemIcon>
                                    <EventNoteIcon />
                                </ListItemIcon>
                                <ListItemText primary="예약 내역" />
                            </ListItem>
                            <ListItem button selected={tabValue === 2} onClick={(e) => handleTabChange(e, 2)}>
                                <ListItemIcon>
                                    <HistoryIcon />
                                </ListItemIcon>
                                <ListItemText primary="이용 내역" />
                            </ListItem>
                            <ListItem button selected={tabValue === 3} onClick={(e) => handleTabChange(e, 3)}>
                                <ListItemIcon>
                                    <FavoriteIcon />
                                </ListItemIcon>
                                <ListItemText primary="관심 헤어샵" />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                {/* 오른쪽 메인 컨텐츠 */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleTabChange}>
                                <Tab label="프로필 관리" />
                                <Tab label="예약 내역" />
                                <Tab label="이용 내역" />
                                <Tab label="관심 헤어샵" />
                            </Tabs>
                        </Box>

                        {/* 프로필 관리 탭 */}
                        {tabValue === 0 && (
                            <Box sx={{ pt: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">개인정보 관리</Typography>
                                    <Button
                                        startIcon={editMode ? <CancelIcon /> : <EditIcon />}
                                        onClick={toggleEditMode}
                                        color={editMode ? "error" : "primary"}
                                    >
                                        {editMode ? '취소' : '편집'}
                                    </Button>
                                </Box>

                                {error && (
                                    <Alert severity="error" sx={{ mb: 2 }}>
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        {success}
                                    </Alert>
                                )}

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="이름"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="이메일"
                                            name="email"
                                            value={profileData.email}
                                            disabled={true}
                                            margin="normal"
                                            helperText="이메일은 변경할 수 없습니다"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="전화번호"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            margin="normal"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="생년월일"
                                            name="birthdate"
                                            type="date"
                                            value={profileData.birthdate}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="주소"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleChange}
                                            disabled={!editMode}
                                            margin="normal"
                                        />
                                    </Grid>
                                </Grid>

                                {editMode && (
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        sx={{ mt: 3 }}
                                        onClick={handleProfileUpdate}
                                    >
                                        저장하기
                                    </Button>
                                )}

                                {/* 비밀번호 변경 섹션 - 카카오 로그인이 아닌 경우에만 표시 */}
                                {user && !kakaoUser && (
                                    <Box sx={{ mt: 4 }}>
                                        <Typography variant="h6" gutterBottom>
                                            비밀번호 변경
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />

                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    fullWidth
                                                    label="현재 비밀번호"
                                                    name="currentPassword"
                                                    type="password"
                                                    value={profileData.currentPassword}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="새 비밀번호"
                                                    name="newPassword"
                                                    type="password"
                                                    value={profileData.newPassword}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="새 비밀번호 확인"
                                                    name="confirmNewPassword"
                                                    type="password"
                                                    value={profileData.confirmNewPassword}
                                                    onChange={handleChange}
                                                    margin="normal"
                                                    error={profileData.newPassword !== profileData.confirmNewPassword && profileData.confirmNewPassword !== ''}
                                                    helperText={
                                                        profileData.newPassword !== profileData.confirmNewPassword && profileData.confirmNewPassword !== ''
                                                            ? "비밀번호가 일치하지 않습니다"
                                                            : ""
                                                    }
                                                />
                                            </Grid>
                                        </Grid>

                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{ mt: 2 }}
                                            onClick={handlePasswordChange}
                                            disabled={!profileData.currentPassword || !profileData.newPassword || !profileData.confirmNewPassword}
                                        >
                                            비밀번호 변경
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* 예약 내역 탭 */}
                        {tabValue === 1 && (
                            <Box sx={{ pt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    예약 내역
                                </Typography>

                                {/* 예약 내역이 없는 경우 */}
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        예약 내역이 없습니다.
                                    </Typography>
                                </Box>

                                {/* 실제 구현 시 예약 내역 목록 표시 */}
                            </Box>
                        )}

                        {/* 이용 내역 탭 */}
                        {tabValue === 2 && (
                            <Box sx={{ pt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    이용 내역
                                </Typography>

                                {/* 이용 내역이 없는 경우 */}
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        이용 내역이 없습니다.
                                    </Typography>
                                </Box>

                                {/* 실제 구현 시 이용 내역 목록 표시 */}
                            </Box>
                        )}

                        {/* 관심 헤어샵 탭 */}
                        {tabValue === 3 && (
                            <Box sx={{ pt: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    관심 헤어샵
                                </Typography>

                                {/* 관심 헤어샵이 없는 경우 */}
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        관심 헤어샵이 없습니다.
                                    </Typography>
                                </Box>

                                {/* 실제 구현 시 관심 헤어샵 목록 표시 */}
                                {/* 예시 UI */}
                                <Grid container spacing={2} sx={{ display: 'none' }}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                height="140"
                                                image="/path/to/salon-image.jpg"
                                                alt="헤어샵 이미지"
                                            />
                                            <CardContent>
                                                <Typography variant="h6" component="div">
                                                    헤어샵 이름
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    서울 강남구 강남대로 123
                                                </Typography>
                                                <Button size="small" sx={{ mt: 1 }}>
                                                    예약하기
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Mypage;