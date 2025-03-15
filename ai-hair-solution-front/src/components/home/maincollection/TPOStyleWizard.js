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
// import { analyzeFace, simulateHairstyle } from '../services/apiService';

// 스타일링된 컴포넌트
const WizardContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    background: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    zIndex: 5,
}));

const StyleCard = styled(Card)(({ theme, selected }) => ({
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: selected ? 'scale(1.05)' : 'scale(1)',
    border: selected ? `2px solid ${theme.palette.primary.main}` : 'none',
    boxShadow: selected
        ? '0 10px 20px rgba(156, 39, 176, 0.3)'
        : '0 5px 15px rgba(0, 0, 0, 0.08)',
    '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: '0 8px 16px rgba(156, 39, 176, 0.2)',
    }
}));

const UploadBox = styled(Box)(({ theme, isDragActive }) => ({
    border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[300]}`,
    borderRadius: 16,
    padding: theme.spacing(6),
    textAlign: 'center',
    backgroundColor: isDragActive ? 'rgba(156, 39, 176, 0.05)' : 'transparent',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: 'rgba(156, 39, 176, 0.05)',
        borderColor: theme.palette.primary.light,
    }
}));

const StepperContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(6),
}));

const TPOStyleWizard = () => {
    // 상태 관리
    const [activeStep, setActiveStep] = useState(0);
    const [selectedFaceShape, setSelectedFaceShape] = useState(null);
    const [selectedHairLength, setSelectedHairLength] = useState(null);
    const [selectedOccasion, setSelectedOccasion] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedImageFile, setUploadedImageFile] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const [showResultDialog, setShowResultDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [simulationResult, setSimulationResult] = useState(null);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    // 얼굴형 데이터
    const faceShapes = [
        { id: 'oval', name: '계란형', image: '/placeholder/face-oval.jpg' },
        { id: 'round', name: '둥근형', image: '/placeholder/face-round.jpg' },
        { id: 'square', name: '각진형', image: '/placeholder/face-square.jpg' },
        { id: 'heart', name: '하트형', image: '/placeholder/face-heart.jpg' },
        { id: 'long', name: '긴 형', image: '/placeholder/face-long.jpg' },
    ];

    // 헤어 길이 데이터
    const hairLengths = [
        { id: 'short', name: '숏 헤어', image: '/placeholder/hair-short.jpg' },
        { id: 'medium', name: '미디엄 헤어', image: '/placeholder/hair-medium.jpg' },
        { id: 'long', name: '롱 헤어', image: '/placeholder/hair-long.jpg' },
    ];

    // 상황 (TPO) 데이터
    const occasions = [
        { id: 'date', name: '데이트', image: '/placeholder/occasion-date.jpg' },
        { id: 'wedding', name: '결혼식', image: '/placeholder/occasion-wedding.jpg' },
        { id: 'funeral', name: '장례식', image: '/placeholder/occasion-funeral.jpg' },
        { id: 'cafe', name: '카페', image: '/placeholder/occasion-cafe.jpg' },
        { id: 'work', name: '직장', image: '/placeholder/occasion-work.jpg' },
        { id: 'party', name: '파티', image: '/placeholder/occasion-party.jpg' },
    ];

    // 단계 정의
    const steps = ['얼굴 사진 업로드', '얼굴형 선택', '현재 헤어 길이', '상황 선택'];

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

    // 얼굴 분석 함수
    const analyzeUploadedFace = async () => {
        if (!uploadedImageFile) return;

        try {
            setIsLoading(true);
            setError(null);

            // API 서비스가 구현되면 주석 해제
            /*
            const result = await analyzeFace(uploadedImageFile);
            
            setAnalysisResult(result);
            
            // 자동으로 얼굴형 선택 (백엔드에서 제공한 경우)
            if (result.face_shape) {
              setSelectedFaceShape(result.face_shape.toLowerCase());
            }
            */

            // 임시: API 연동 전 테스트용 지연
            setTimeout(() => {
                setIsLoading(false);
            }, 1000);

        } catch (err) {
            console.error('얼굴 분석 오류:', err);
            setError('얼굴 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
            setSnackbarOpen(true);
            setIsLoading(false);
        }
    };

    // 다음 단계로 이동
    const handleNext = async () => {
        if (activeStep === 0 && uploadedImageFile) {
            // 1단계로 넘어갈 때 얼굴 분석 시작
            await analyzeUploadedFace();
        }

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

    // 헤어스타일 시뮬레이션 실행
    const handleSubmitSimulation = async () => {
        try {
            setIsLoading(true);
            setError(null);
            setShowResultDialog(true);

            // API 서비스가 구현되면 주석 해제
            /*
            const result = await simulateHairstyle({
              image: uploadedImageFile,
              faceShape: selectedFaceShape,
              hairLength: selectedHairLength,
              occasion: selectedOccasion
            });
            
            setSimulationResult(result);
            */

            // 임시: API 연동 전 테스트용 지연
            setTimeout(() => {
                setIsLoading(false);
                // 테스트용 더미 결과
                setSimulationResult({
                    style_info: {
                        description: `${selectedOccasion}을(를) 위한 맞춤형 헤어스타일입니다.`,
                        tips: "스타일링 시 볼륨을 살려주면 더 좋습니다."
                    }
                });
            }, 2000);

        } catch (err) {
            console.error('시뮬레이션 오류:', err);
            setError('헤어스타일 시뮬레이션 중 오류가 발생했습니다. 다시 시도해주세요.');
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
                                height="140"
                                image={item.image}
                                alt={item.name}
                                sx={{ objectFit: 'cover' }}
                                // 실제 이미지가 없는 경우 플레이스홀더 사용
                                onError={(e) => {
                                    e.target.src = `https://via.placeholder.com/300x200?text=${item.name}`;
                                }}
                            />
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h6" component="div">
                                        {item.name}
                                    </Typography>
                                    {selectedItem === item.id && (
                                        <CheckCircleIcon color="primary" />
                                    )}
                                </Box>
                            </CardContent>
                        </StyleCard>
                    </Grid>
                ))}
            </Grid>
        );
    };

    // 현재 단계 컨텐츠 렌더링
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h5" gutterBottom>
                            얼굴 사진을 업로드해주세요
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            AI가 당신의 얼굴형을 분석하여 최적의 헤어스타일을 추천해 드립니다.
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
                                <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
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
                                    alt="Uploaded face"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '300px',
                                        borderRadius: '16px',
                                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
                                    }}
                                />
                                <Button
                                    variant="outlined"
                                    color="primary"
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
                            얼굴형을 선택해 주세요
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            정확한 추천을 위해 가장 비슷한 얼굴형을 선택해 주세요.
                        </Typography>
                        {renderSelectionCards(faceShapes, selectedFaceShape, setSelectedFaceShape)}
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            현재 헤어 길이를 선택해 주세요
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            현재 헤어스타일에 가장 가까운 길이를 선택해 주세요.
                        </Typography>
                        {renderSelectionCards(hairLengths, selectedHairLength, setSelectedHairLength)}
                    </Box>
                );
            case 3:
                return (
                    <Box>
                        <Typography variant="h5" gutterBottom>
                            어떤 상황을 위한 스타일인가요?
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                            헤어스타일을 적용할 상황(TPO)을 선택해 주세요.
                        </Typography>
                        {renderSelectionCards(occasions, selectedOccasion, setSelectedOccasion)}
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
                return !uploadedImage;
            case 1:
                return !selectedFaceShape;
            case 2:
                return !selectedHairLength;
            case 3:
                return !selectedOccasion;
            default:
                return false;
        }
    };

    // 결과 다이얼로그
    const ResultDialog = () => {
        const getOccasionName = () => {
            const occasion = occasions.find(o => o.id === selectedOccasion);
            return occasion ? occasion.name : '';
        };

        return (
            <Dialog
                open={showResultDialog}
                onClose={() => setShowResultDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                        맞춤형 헤어스타일 추천
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <img
                                src={uploadedImage}
                                alt="Your face"
                                style={{
                                    width: '100%',
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
                                    <CircularProgress color="primary" sx={{ mb: 3 }} />
                                    <Typography variant="h6" gutterBottom>
                                        AI가 분석 중입니다...
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {getOccasionName()}을(를) 위한 최적의 헤어스타일을 생성하고 있습니다.
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
                                            alt="AI 생성 헤어스타일"
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
                                            backgroundColor: 'rgba(156, 39, 176, 0.1)',
                                            mb: 2
                                        }}>
                                            <Typography variant="body1" color="primary">
                                                API 연동 후 이미지가 표시됩니다
                                            </Typography>
                                        </Box>
                                    )}

                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                                        AI 생성 이미지
                                    </Typography>

                                    <Box sx={{ mt: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            {getOccasionName()}을(를) 위한 추천 스타일
                                        </Typography>

                                        {simulationResult.style_info && (
                                            <Box sx={{ mt: 2 }}>
                                                <Typography variant="body1" paragraph>
                                                    {simulationResult.style_info.description ||
                                                        `${getOccasionName()}에 어울리는 ${selectedHairLength === 'short' ? '숏' :
                                                            selectedHairLength === 'medium' ? '미디엄' : '롱'} 헤어 스타일입니다.`}
                                                </Typography>

                                                {simulationResult.style_info.tips && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        <strong>스타일링 팁:</strong> {simulationResult.style_info.tips}
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
                                        {getOccasionName()}을(를) 위한 추천 스타일
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

                    {simulationResult && simulationResult.style_info && (
                        <Box sx={{ mt: 4, p: 2, bgcolor: 'rgba(156, 39, 176, 0.05)', borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                추천 스타일 정보
                            </Typography>
                            <Typography variant="body2">
                                얼굴형: <strong>{selectedFaceShape === 'oval' ? '계란형' :
                                    selectedFaceShape === 'round' ? '둥근형' :
                                        selectedFaceShape === 'square' ? '각진형' :
                                            selectedFaceShape === 'heart' ? '하트형' : '긴형'}</strong> |
                                헤어 길이: <strong>{selectedHairLength === 'short' ? '숏 헤어' :
                                    selectedHairLength === 'medium' ? '미디엄 헤어' : '롱 헤어'}</strong> |
                                상황: <strong>{getOccasionName()}</strong>
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowResultDialog(false)}>닫기</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isLoading || !simulationResult}
                    >
                        스타일 저장하기
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
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
                    color="primary"
                    onClick={handleNext}
                    endIcon={<NavigateNextIcon />}
                    disabled={isNextDisabled() || isLoading}
                >
                    {activeStep === steps.length - 1 ? '스타일 확인하기' : '다음'}
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

export default TPOStyleWizard;