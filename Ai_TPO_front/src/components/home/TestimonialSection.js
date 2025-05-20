import React from 'react';
import { Container, Typography, Box, Card, CardContent, Avatar, Grid } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const testimonials = [
    {
        name: '김지현',
        role: '일반 고객',
        content: '미용실 가기 전에 어떤 스타일이 어울릴지 고민이 많았는데, 이 앱을 통해 다양한 스타일을 시도해볼 수 있어서 정말 좋았어요. 실제로 선택한 스타일로 머리를 하고 나니 정말 만족스러웠습니다!',
        avatar: 'K'
    },
    {
        name: '이민수',
        role: '미용사',
        content: '고객들이 원하는 스타일을 정확히 파악하기 어려웠는데, 이 앱을 통해 고객과 소통이 훨씬 원활해졌어요. 시술 전 가상으로 결과를 보여줄 수 있어 고객 만족도도 크게 향상되었습니다.',
        avatar: 'L'
    },
    {
        name: '박서연',
        role: '일반 고객',
        content: '헤어스타일 변화가 두려웠는데, 이 앱으로 다양한 스타일을 미리 볼 수 있어서 자신감을 얻었어요. 추천해준 스타일이 제 얼굴형에 정말 잘 어울렸고, 미용실에서도 정확히 원하는 스타일을 설명할 수 있었습니다.',
        avatar: 'P'
    }
];

const TestimonialSection = () => {
    return (
        <Box sx={{ py: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" component="h2" align="center" gutterBottom>
                    고객 후기
                </Typography>
                <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
                    AI 헤어 솔루션을 경험한 사용자들의 이야기
                </Typography>

                <Grid container spacing={4}>
                    {testimonials.map((testimonial, index) => (
                        <Grid item key={index} xs={12} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                                    <FormatQuoteIcon color="primary" fontSize="large" />
                                </Box>
                                <CardContent sx={{ pt: 6, pb: 2, px: 3, flexGrow: 1 }}>
                                    <Typography variant="body1" paragraph sx={{ minHeight: 120 }}>
                                        {testimonial.content}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                            {testimonial.avatar}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1">
                                                {testimonial.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {testimonial.role}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default TestimonialSection;