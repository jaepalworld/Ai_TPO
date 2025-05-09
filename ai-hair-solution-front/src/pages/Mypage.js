import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Avatar,
    Grid,
    Divider,
    IconButton,
    Alert,
    Snackbar,
    CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { logoutUser } from '../services/auth';




const PageContainer = styled(Container)(({ theme }) => ({
    paddingBottom: theme.spacing(8),
}));

// 프로필 카드 스타일링
const ProfileCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    borderRadius: '8px',
    position: 'relative',
    overflow: 'visible',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(156, 39, 176, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
        zIndex: -1,
    },
}));

// 페이지 제목 스타일링
const PageTitle = styled(Typography)(({ theme }) => ({
    fontFamily: "'Playfair Display', serif",
    fontWeight: 500,
    fontSize: '2.5rem',
    marginBottom: theme.spacing(5),
    position: 'relative',
    display: 'inline-block',
    fontStyle: 'italic',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -10,
        left: 0,
        width: 80,
        height: 3,
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        borderRadius: 4,
    }
}));

// 섹션 제목 스타일링
const SectionTitle = styled(Typography)(({ theme }) => ({
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 600,
    fontSize: '1.25rem',
    marginBottom: theme.spacing(3),
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
}));

// 프로필 아바타 스타일링
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 150,
    height: 150,
    margin: '0 auto',
    border: '4px solid #fff',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    position: 'relative',
}));

// 드래그 앤 드롭 영역 스타일링
const DropZone = styled(Box)(({ theme, isDragActive, hasImage }) => ({
    width: 150,
    height: 150,
    borderRadius: '50%',
    border: isDragActive ? `2px dashed ${theme.palette.primary.main}` : hasImage ? 'none' : `2px dashed ${theme.palette.grey[400]}`,
    backgroundColor: isDragActive ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
    },
    '&:hover .MuiBox-root': {
        opacity: 1,
    }
}));

// 오버레이 스타일링
const DropZoneOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    color: '#fff',
    fontWeight: 500,
    fontSize: '0.9rem',
    textAlign: 'center',
    padding: theme.spacing(2),
}));

// 버튼 스타일링
const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: '30px',
    padding: '10px 24px',
    textTransform: 'uppercase',
    fontWeight: 500,
    letterSpacing: '0.05em',
    fontFamily: "'Montserrat', sans-serif",
    boxShadow: 'none',
    '&:hover': {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    }
}));

// 로그아웃 버튼 스타일링
const LogoutButton = styled(Button)(({ theme }) => ({
    borderRadius: '30px',
    padding: '8px 16px',
    textTransform: 'uppercase',
    fontWeight: 400,
    letterSpacing: '0.05em',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    }
}));

const Mypage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [nameError, setNameError] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isDragActive, setIsDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // 페이지 로드 시 현재 사용자 정보 가져오기
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setDisplayName(currentUser.displayName || '');
                setPreviewUrl(currentUser.photoURL || '');
            } else {
                // 로그인되지 않은 경우 로그인 페이지로 리디렉션
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);
    useEffect(() => {
        const authCheck = () => {
            const currentUser = auth.currentUser;
            console.log("현재 인증된 사용자:", currentUser);

            if (currentUser) {
                console.log("사용자 ID:", currentUser.uid);
                console.log("사용자 이메일:", currentUser.email);
                console.log("사용자 토큰이 있음:", !!currentUser.getIdToken);
            } else {
                console.log("사용자가 로그인되어 있지 않음");
            }
        };

        authCheck();
    }, []);

    // 드래그 앤 드롭 핸들러
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    }, []);

    // 파일 선택 핸들러
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const handleFileSelect = (file) => {
        // 이미지 파일 확인
        if (!file.type.match('image.*')) {
            setSnackbar({
                open: true,
                message: '이미지 파일만 업로드할 수 있습니다.',
                severity: 'error'
            });
            return;
        }

        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setSnackbar({
                open: true,
                message: '5MB 이하의 이미지만 업로드할 수 있습니다.',
                severity: 'error'
            });
            return;
        }

        setProfileImage(file);

        // 이미지 미리보기 생성
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // 이름 유효성 검사 함수
    const validateName = (name) => {
        // 한글, 영문만 허용 (공백 포함)
        const nameRegex = /^[가-힣a-zA-Z\s]+$/;

        if (name.trim() === '') {
            return '이름을 입력해주세요.';
        }

        if (!nameRegex.test(name)) {
            return '이름은 한글과 영문만 입력 가능합니다.';
        }

        return '';
    };

    // 이름 변경 핸들러
    const handleNameChange = (e) => {
        const newName = e.target.value;
        setDisplayName(newName);
        setNameError(validateName(newName));
    };


    // 프로필 저장 함수
    const handleSaveProfile = async () => {
        // 이름 최종 유효성 검사
        const error = validateName(displayName);
        if (error) {
            setNameError(error);
            return;
        }

        setLoading(true);

        try {
            // 먼저 사용자 인증 상태 확인
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error("로그인이 필요합니다. 다시 로그인해 주세요.");
            }

            // 현재 사용자 토큰 확인 (인증 상태 검증)
            const idToken = await currentUser.getIdToken(true);
            console.log("사용자 토큰 갱신됨:", !!idToken);

            let photoURL = user.photoURL;

            // 프로필 이미지가 변경된 경우 업로드
            if (profileImage) {
                try {
                    const storage = getStorage();

                    // 간단한 경로로 변경 (권한 문제 디버깅 용이)
                    const fileName = `profile_images/${currentUser.uid}/profile.jpg`;
                    const storageRef = ref(storage, fileName);

                    console.log("업로드 시작:", fileName);
                    console.log("현재 사용자 ID:", currentUser.uid);

                    // 메타데이터 설정
                    const metadata = {
                        contentType: 'image/jpeg'
                    };

                    // 이미지 업로드
                    const uploadResult = await uploadBytes(storageRef, profileImage, metadata);
                    console.log("업로드 결과:", uploadResult);

                    // 다운로드 URL 가져오기
                    photoURL = await getDownloadURL(storageRef);
                    console.log("이미지 URL:", photoURL);

                    // 미리보기 URL 업데이트
                    setPreviewUrl(photoURL);
                } catch (imageError) {
                    console.error("이미지 업로드 오류 상세:", imageError);
                    console.error("오류 코드:", imageError.code);
                    console.error("오류 메시지:", imageError.message);

                    // 이미지 업로드 실패 시에도 이름 업데이트는 진행
                    setSnackbar({
                        open: true,
                        message: `이미지 업로드 실패: ${imageError.message}. 이름만 업데이트합니다.`,
                        severity: 'warning'
                    });
                }
            }

            // 사용자 프로필 업데이트
            await updateProfile(currentUser, {
                displayName: displayName,
                photoURL: photoURL
            });

            // 사용자 정보 새로고침
            await currentUser.reload();
            const refreshedUser = auth.currentUser;

            // UI 상태 업데이트
            setUser({ ...refreshedUser });

            setSnackbar({
                open: true,
                message: '프로필이 성공적으로 업데이트되었습니다.',
                severity: 'success'
            });
        } catch (error) {
            console.error('프로필 업데이트 오류:', error);
            setSnackbar({
                open: true,
                message: `프로필 업데이트 실패: ${error.message}`,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };


    // 로그아웃 핸들러
    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate('/');
        } catch (error) {
            console.error('로그아웃 오류:', error);
            setSnackbar({
                open: true,
                message: '로그아웃 중 오류가 발생했습니다.',
                severity: 'error'
            });
        }
    };
    const DropZone = styled(Box)(({ theme, $isDragActive, $hasImage }) => ({
        width: 150,
        height: 150,
        borderRadius: '50%',
        border: $isDragActive
            ? `2px dashed ${theme.palette.primary.main}`
            : $hasImage
                ? 'none'
                : `2px dashed ${theme.palette.grey[400]}`,
        backgroundColor: $isDragActive ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
        },
        '&:hover .MuiBox-root': {
            opacity: 1,
        }
    }));
    // 스낵바 닫기 핸들러
    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        });
    };

    if (!user) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ py: 6 }}> {/* 상하 패딩 48px 추가 - NearbySalonsSection과 동일한 구조 */}
            <PageContainer maxWidth="md">
                {/* 페이지 제목 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <PageTitle variant="h2">
                        프로필
                    </PageTitle>
                    <LogoutButton
                        onClick={handleLogout}
                        startIcon={<span className="material-icons-outlined" style={{ fontSize: '18px' }}>logout</span>}
                    >
                        로그아웃
                    </LogoutButton>
                </Box>

                {/* 프로필 카드 */}
                <ProfileCard elevation={0}>
                    <Grid container spacing={4}>
                        {/* 프로필 이미지 영역 */}
                        <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                            <SectionTitle variant="h6">프로필 이미지</SectionTitle>

                            {/* 드래그 앤 드롭 영역 */}
                            <Box sx={{ position: 'relative' }}>
                                <input
                                    type="file"
                                    id="profile-image-upload"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />

                                <label htmlFor="profile-image-upload">
                                    <DropZone
                                        $isDragActive={isDragActive}
                                        $hasImage={!!previewUrl}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        {previewUrl ? (
                                            <ProfileAvatar src={previewUrl} alt="프로필 이미지" />
                                        ) : (
                                            <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                                                이미지를 끌어다 놓거나 클릭하세요
                                            </Typography>
                                        )}
                                        <DropZoneOverlay className="MuiBox-root">
                                            이미지 변경
                                        </DropZoneOverlay>
                                    </DropZone>
                                </label>
                            </Box>

                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                최대 5MB, 이미지 파일만 가능
                            </Typography>
                        </Grid>

                        {/* 프로필 정보 영역 */}
                        <Grid item xs={12} md={8}>
                            <SectionTitle variant="h6">정보</SectionTitle>

                            <TextField
                                fullWidth
                                label="이름"
                                value={displayName}
                                onChange={handleNameChange}
                                error={!!nameError}
                                helperText={nameError || "한글과 영문만 입력 가능합니다"}
                                variant="outlined"
                                margin="normal"
                                sx={{ mb: 3 }}
                            />

                            <TextField
                                fullWidth
                                label="이메일"
                                value={user.email}
                                disabled
                                variant="outlined"
                                margin="normal"
                                sx={{
                                    mb: 4,
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                                    }
                                }}
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <StyledButton
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveProfile}
                                    disabled={loading || !!nameError}
                                >
                                    {loading ? <CircularProgress size={24} color="inherit" /> : '프로필 저장'}
                                </StyledButton>
                            </Box>
                        </Grid>
                    </Grid>
                </ProfileCard>

                {/* 알림 스낵바 */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        sx={{ width: '100%' }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </PageContainer>
        </Box>
    );
};


export default Mypage;