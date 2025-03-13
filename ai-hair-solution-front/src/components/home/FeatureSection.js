import React from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Box } from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import StyleIcon from '@mui/icons-material/Style';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import PeopleIcon from '@mui/icons-material/People';

const features = [
    {
        title: '얼굴/머리 인식 시스템',
        description: '사용자의 얼굴형, 헤어라인, 현재 헤어스타일을 AI가 정밀하게 분석합니다.',
        icon: <FaceIcon fontSize="large" color="primary" />
    },
    {
        title: '헤어스타일 데이터베이스',
        description: '다양한 헤어스타일, 컬러, 길이 등의 카테고리화된 방대한 스타일 DB를 보유하고 있습니다.',
        icon: <StyleIcon fontSize="large" color="primary" />
    },
    {
        title: '가상 시뮬레이션 엔진',
        description: '염색, 파마, 커트 등 다양한 스타일을 사용자 얼굴에 실시간으로 적용해 볼 수 있습니다.',
        icon: <DesignServicesIcon fontSize="large" color="primary" />
    },
    {
        title: '커뮤니티 피드백',
        description: '가상으로 적용한 스타일에 대해 다른 사용자나 미용 전문가의 의견을 받을 수 있습니다.',
        icon: <PeopleIcon fontSize="large" color="primary" />
    }
];

const FeatureSection = () => {
    return (
        <Box sx={{ py: 8, bgcolor: 'background.default' }}>
            <Container maxWidth="lg">
                <Typography variant="h3" component="h2" align="center" gutterBottom>
                    핵심 기능
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
                    AI 헤어 솔루션의 주요 기능을 살펴보세요
                </Typography>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item key={index} xs={12} sm={6} md={3}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
                                    {feature.icon}
                                </Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h5" component="h3" align="center">
                                        {feature.title}
                                    </Typography>
                                    <Typography align="center">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default FeatureSection;