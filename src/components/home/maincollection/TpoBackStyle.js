import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Stepper,
    Step,
    StepLabel,
    Grid,
    Card,
    CardContent,
    CardMedia,
    IconButton,
    TextField,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// API 서비스 import - 경로 확인 필요
// import { simulateBackground } from '../services/apiService';

// 스타일링된 컴포넌트
const WizardContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    zIndex: 5,
    maxHeight: '85vh', // 최대 높이 설정
    overflowY: 'auto', // 세로 스크롤 추가
    display: 'flex',
    flexDirection: 'column', // 컨텐츠를 세로로 배치
}));

const StyleCard = styled(Card)(({ theme, selected }) => ({
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: selected ? 'scale(1.05)' : 'scale(1)',
    border: selected ? `2px solid ${theme.palette.info.main}` : 'none',
    boxShadow: selected
        ? '0 10px 20px rgba(33, 150, 243, 0.3)'
        : '0 5px 15px rgba(0, 0, 0, 0.08)',
    '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: '0 8px 16px rgba(33, 150, 243, 0.2)',
    }
}));

const UploadBox = styled(Box)(({ theme, isDragActive }) => ({
    border: `2px dashed ${isDragActive ? theme.palette.info.main : theme.palette.grey[300]}`,
    borderRadius: 16,
    padding: theme.spacing(4), // 패딩 줄이기 (6 -> 4)
    textAlign: 'center',
    backgroundColor: isDragActive ? 'rgba(33, 150, 243, 0.05)' : 'transparent',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    minHeight: '120px', // 최소 높이 설정
    maxHeight: '180px', // 최대 높이 설정
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
        backgroundColor: 'rgba(33, 150, 243, 0.05)',
        borderColor: theme.palette.info.light,
    }
}));

const StepperContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3), // 여백 줄이기
}));



const TpoBackStyle = () => {
    // 상태 관리
    const [activeStep, setActiveStep] = useState(0);
    const [selectedBackground, setSelectedBackground] = useState(null);
    const [selectedOccasion, setSelectedOccasion] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImageFile, setUploadedImageFile] = useState(null);
    const [savedHairStyleImage, setSavedHairStyleImage] = useState(null); // 이전 단계에서 가져온 헤어스타일 이미지
    const [isDragActive, setIsDragActive] = useState(false);
    const [showResultDialog, setShowResultDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [simulationResult, setSimulationResult] = useState(null);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // TPO 상황 데이터
    const occasions = [
        { id: 'business', name: '비즈니스/직장', image: '/placeholder/occasion-business.jpg' },
        { id: 'date', name: '데이트/미팅', image: '/placeholder/occasion-date.jpg' },
        { id: 'party', name: '파티/행사', image: '/placeholder/occasion-party.jpg' },
        { id: 'casual', name: '일상/캐주얼', image: '/placeholder/occasion-casual.jpg' },
        { id: 'wedding', name: '웨딩/가족행사', image: '/placeholder/occasion-wedding.jpg' }
    ];

    // 배경 데이터
    const backgrounds = [
        { id: 'office', name: '오피스', image: '/placeholder/background-office.jpg' },
        { id: 'restaurant', name: '레스토랑', image: '/placeholder/background-restaurant.jpg' },
        { id: 'cafe', name: '카페', image: '/placeholder/background-cafe.jpg' },
        { id: 'outdoor', name: '야외/공원', image: '/placeholder/background-outdoor.jpg' },
        { id: 'event', name: '이벤트홀', image: '/placeholder/background-event.jpg' },
        { id: 'street', name: '거리/길', image: '/placeholder/background-street.jpg' }
    ];

    // 단계 정의
    const steps = ['사진 가져오기', '상황(TPO) 선택', '배경 선택'];

    // 헤어스타일 이미지 가져오기 (실제 구현 시 로컬 스토리지 또는 전역 상태 관리로 대체)
    useEffect(() => {
        // 임시로 localStorage에서 헤어스타일 이미지를 가져오는 코드 (예시)
        const savedImage = localStorage.getItem('hairStyleImage');
        if (savedImage) {
            setSavedHairStyleImage(savedImage);
        } else {
            // 헤어스타일 이미지가 없는 경우 (이미지가 있다고 가정하고 설정)
            setSavedHairStyleImage('/placeholder/default-hairstyle.jpg');
        }
    }, []);

    // 오류 스낵바 핸들러
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // 파일 업로드 핸들러
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // 이미지 타입 확인
            if (!file.type.match('image.*')) {
                setError('이미지 파일만 업로드 가능합니다.');
                setSnackbarOpen(true);
                return;
            }

            // 파일 크기 제한 (10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('파일 크기는 10MB 이하여야 합니다.');
                setSnackbarOpen(true);
                return;
            }

            setUploadedImageFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 드래그 앤 드롭 핸들러
    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragActive(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            // 이미지 타입 확인
            if (!file.type.match('image.*')) {
                setError('이미지 파일만 업로드 가능합니다.');
                setSnackbarOpen(true);
                return;
            }

            // 파일 크기 제한 (10MB)
            if (file.size > 10 * 1024 * 1024) {
                setError('파일 크기는 10MB 이하여야 합니다.');
                setSnackbarOpen(true);
                return;
            }

            setUploadedImageFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // 다음 단계로 이동
    const handleNext = async () => {
        if (activeStep === steps.length - 1) {
            // 마지막 단계에서는 시뮬레이션 및 결과 다이얼로그 표시
            handleSubmitSimulation();
        } else {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    // 이전 단계로 이동
    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    // 배경 시뮬레이션 실행
    const handleSubmitSimulation = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setShowResultDialog(true);

            // API 서비스가 구현되면 주석 해제
            /*
            const result = await simulateBackground({
              image: uploadedImage || savedHairStyleImage,
              occasion: selectedOccasion,
              background: selectedBackground
            });
            
            setSimulationResult(result);
            */

            // 임시: API 연동 전 테스트용 지연
            setTimeout(() => {
                setIsLoading(false);
                // 테스트용 더미 결과
                setSimulationResult({
                    background_info: {
                        occasion: selectedOccasion,
                        background: selectedBackground,
                        description: `${getOccasionName()} 상황의 ${getBackgroundName()} 배경에 적용된 이미지입니다.`,
                        tips: "이런 환경에서는 자신감 있는 표정과 자세가 중요합니다."
                    }
                });
            }, 2000);

        } catch (err) {
            console.error('시뮬레이션 오류:', err);
            setError('배경 시뮬레이션 중 오류가 발생했습니다. 다시 시도해주세요.');
            setSnackbarOpen(true);
            setIsLoading(false);
        }
    };

    // 선택 카드 렌더링 함수
    const renderSelectionCards = (items, selectedItem, setSelectedItem) => {
        return (
            <Grid container spacing={2}>
                {items.map((item) => (
                    <Grid item xs={6} sm={4} md={4} key={item.id}>
                        <StyleCard
                            selected={selectedItem === item.id}
                            onClick={() => setSelectedItem(item.id)}
                        >
                            <CardMedia
                                component="img"
                                height="120" // 140 -> 120으로 줄이기
                                image={item.image}
                                alt={item.name}
                                sx={{ objectFit: 'cover' }}
                                // 실제 이미지가 없는 경우 플레이스홀더 사용
                                onError={(e) => {
                                    e.target.src = `https://via.placeholder.com/300x200?text=${item.name}`;
                                }}
                            />
                            <CardContent sx={{ p: 1 }}> {/* 패딩 줄이기 */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="subtitle1" component="div">
                                        {item.name}
                                    </Typography>
                                    {selectedItem === item.id && (
                                        <CheckCircleIcon color="info" />
                                    )}
                                </Box>
                            </CardContent>
                        </StyleCard>
                    </Grid>
                ))}
            </Grid>
        );
    };

    // 상황/배경 이름 가져오기 함수
    const getOccasionName = () => {
        const occasion = occasions.find(o => o.id === selectedOccasion);
        return occasion ? occasion.name : '';
    };

    const getBackgroundName = () => {
        const background = backgrounds.find(b => b.id === selectedBackground);
        return background ? background.name : '';
    };

    // 현재 단계 컨텐츠 렌더링
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ textAlign: 'center', py: 1, px: 1 }}>
                        <Typography variant="h5" gutterBottom>
                            헤어스타일 사진을 가져와주세요
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            이전에 생성한 헤어스타일 사진이나 새로운 사진을 업로드하세요.
                        </Typography>

                        {/* 이전 헤어스타일 이미지가 있을 경우 표시 */}
                        {savedHairStyleImage && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    이전에 생성한 헤어스타일
                                </Typography>
                                <Box sx={{ display: 'inline-block' }}>
                                    <img
                                        src={savedHairStyleImage}
                                        alt="Saved hairstyle"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '180px',
                                            borderRadius: '16px',
                                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
                                        }}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x400?text=헤어스타일+이미지';
                                        }}
                                    />
                                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                                        <Button
                                            variant="contained"
                                            color="info"
                                            size="small"
                                            onClick={() => {
                                                setUploadedImage(savedHairStyleImage);
                                                setActiveStep(1);
                                            }}
                                        >
                                            이 이미지 사용하기
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        )}

                        <Typography variant="h6" gutterBottom>
                            또는 새 이미지 업로드
                        </Typography>

                        <input
                            type="file"
                            accept="image/*"
                            id="image-upload"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                        />

                        {!uploadedImage ? (
                            <UploadBox
                                isDragActive={isDragActive}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                component="label"
                                htmlFor="image-upload"
                            >
                                <CloudUploadIcon sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    이미지를 드래그하거나 클릭하여 업로드
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    JPG, PNG 형식 지원 (최대 10MB)
                                </Typography>
                            </UploadBox>
                        ) : (
                            <Box sx={{ position: 'relative', mt: 2 }}>
                                <img
                                    src={uploadedImage}
                                    alt="Uploaded image"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '200px', // 300px -> 200px로 줄이기
                                        borderRadius: '16px',
                                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    color="info"
                                    component="label"
                                    htmlFor="image-upload"
                                    sx={{ mt: 2 }}
                                >
                                    다른 사진 선택
                                </Button>
                            </Box>
                        )}
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            상황(TPO)을 선택해 주세요
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            어떤 상황에서의 스타일을 확인하고 싶으신가요?
                        </Typography>
                        {renderSelectionCards(occasions, selectedOccasion, setSelectedOccasion)}
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            배경을 선택해 주세요
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            선택한 상황에 맞는 배경을 선택하세요.
                        </Typography>
                        {renderSelectionCards(backgrounds, selectedBackground, setSelectedBackground)}
                    </Box>
                );
            default:
                return 'Unknown step';
        }
    };

    // 다음 버튼 비활성화 조건
    const isNextDisabled = () => {
        switch (activeStep) {
            case 0:
                return !uploadedImage && !savedHairStyleImage;
            case 1:
                return !selectedOccasion;
            case 2:
                return !selectedBackground;
            default:
                return false;
        }
    };

    // 결과 다이얼로그
    const ResultDialog = () => {
        return (
            <Dialog
                open={showResultDialog}
                onClose={() => setShowResultDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                        {getOccasionName()} 상황의 스타일 시뮬레이션
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <img
                                src={uploadedImage || savedHairStyleImage}
                                alt="Original image"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '250px', // 300px에서 250px로 줄임
                                    borderRadius: '16px',
                                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                                }}
                            />

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                                원본 이미지
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {isLoading ? (
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%',
                                    minHeight: 300
                                }}>
                                    <CircularProgress color="info" sx={{ mb: 3 }} />
                                    <Typography variant="h6" gutterBottom>
                                        배경 적용 중입니다...
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {getOccasionName()} 상황의 {getBackgroundName()} 배경에 이미지를 합성하고 있습니다.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                        잠시만 기다려주세요. 약 10-20초 정도 소요됩니다.
                                    </Typography>
                                </Box>
                            ) : simulationResult ? (
                                <Box>
                                    {/* 실제 API 연동 시 이미지 표시 */}
                                    {simulationResult.image_url || simulationResult.result_image ? (
                                        <img
                                            src={simulationResult.image_url || `data:image/jpeg;base64,${simulationResult.result_image}`}
                                            alt="배경 적용 이미지"
                                            style={{
                                                width: '100%',
                                                borderRadius: '16px',
                                                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
                                            }}
                                        />
                                    ) : (
                                        <Box sx={{
                                            width: '100%',
                                            height: 300,
                                            borderRadius: '16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                            mb: 2
                                        }}>
                                            <Typography variant="body1" color="info.main">
                                                API 연동 후 이미지가 표시됩니다
                                            </Typography>
                                        </Box>
                                    )}

                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                                        배경 적용 이미지
                                    </Typography>

                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            {getOccasionName()} + {getBackgroundName()} 스타일
                                        </Typography>

                                        {simulationResult.background_info && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body1" paragraph>
                                                    {simulationResult.background_info.description ||
                                                        `${getOccasionName()} 상황의 ${getBackgroundName()} 배경에서의 모습입니다.`}
                                                </Typography>

                                                {simulationResult.background_info.tips && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>스타일링 팁:</strong> {simulationResult.background_info.tips}
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        minHeight: 300
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom>
                                        {getOccasionName()} + {getBackgroundName()} 스타일
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        시뮬레이션이 곧 시작됩니다...
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        이 과정은 약 10-20초 정도 소요됩니다.
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>

                    {simulationResult && simulationResult.background_info && (
                        <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(33, 150, 243, 0.05)', borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                상황 및 배경 정보
                            </Typography>
                            <Typography variant="body2">
                                상황(TPO): <strong>{getOccasionName()}</strong> |
                                배경: <strong>{getBackgroundName()}</strong>
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowResultDialog(false)}>닫기</Button>
                    <Button
                        variant="contained"
                        color="info"
                        disabled={isLoading || !simulationResult}
                    >
                        이미지 저장하기
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <WizardContainer>
            <StepperContainer>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </StepperContainer>

            {getStepContent(activeStep)}

            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mt: 2, // 여백 줄이기 (4 -> 2)
                pt: 2,
                borderTop: '1px solid rgba(0, 0, 0, 0.1)',
                position: 'sticky', // 고정 위치
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.95)', // 배경색 추가
                zIndex: 10 // 다른 요소 위에 표시
            }}>
                <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<NavigateBeforeIcon />}
                    sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
                >
                    이전
                </Button>
                <Button
                    variant="contained"
                    color="info"
                    onClick={handleNext}
                    endIcon={<NavigateNextIcon />}
                    disabled={isNextDisabled() || isLoading}
                >
                    {activeStep === steps.length - 1 ? '배경 적용하기' : '다음'}
                </Button>
            </Box>


            {/* 오류 메시지 스낵바 */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <ResultDialog />
        </WizardContainer>
    );
};

export default TpoBackStyle;