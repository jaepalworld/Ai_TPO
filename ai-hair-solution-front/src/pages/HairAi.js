import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';

// ================ Styled Components ================
const AdCard = styled(Box)(({ theme }) => ({
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: theme.spacing(4),
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    overflow: 'hidden',
    position: 'relative',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1)',
    },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: theme.spacing(3),
    '& img': {
        width: '100%',
        height: 'auto',
        transition: 'transform 0.5s ease',
    },
    '&:hover img': {
        transform: 'scale(1.05)',
    },
}));

const TryNowButton = styled('a')(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 24px',
    borderRadius: 50,
    backgroundColor: 'transparent',
    border: '1px solid #4e7df1',
    color: '#4e7df1',
    fontSize: '1rem',
    fontWeight: 500,
    textDecoration: 'none',
    marginTop: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: '#4e7df1',
        color: 'white',
    },
    '& svg': {
        marginLeft: theme.spacing(1),
    },
}));

const StarsIcon = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& svg': {
        width: 24,
        height: 24,
        color: '#333',
    },
}));

const HairAi = () => {
    return (
        <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ mt: 4, mb: 8 }}>
                <Grid item xs={12} md={6}>
                    {/* Keep the existing Flex Zone */}
                </Grid>

                <Grid item xs={12} md={6}>
                    <AdCard>
                        <ImageContainer>
                            <img
                                src="/images/ai-ad-model.jpg"
                                alt="AI 광고 모델"
                            />
                        </ImageContainer>

                        <StarsIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.5 4.25a.75.75 0 01.75 0l1.5 1.5a.75.75 0 010 1l-1.5 1.5a.75.75 0 01-1.5 0L9.25 6.75a.75.75 0 010-1l1.5-1.5a.75.75 0 01.75 0zM16 7.5a.75.75 0 01.75 0l1.5 1.5a.75.75 0 010 1L16.75 11.5a.75.75 0 01-1.5 0l-1.5-1.5a.75.75 0 010-1l1.5-1.5a.75.75 0 01.75 0zM7 7.5a.75.75 0 01.75 0l1.5 1.5a.75.75 0 010 1L7.75 11.5a.75.75 0 01-1.5 0l-1.5-1.5a.75.75 0 010-1l1.5-1.5a.75.75 0 01.75 0z" />
                            </svg>
                        </StarsIcon>

                        <Typography variant="h4" sx={{
                            fontWeight: 700,
                            mb: 1,
                            fontSize: '2rem',
                        }}>
                            AI 광고
                        </Typography>

                        <Typography variant="body1" sx={{
                            color: '#666',
                            mb: 3,
                            fontSize: '1rem',
                        }}>
                            인공지능으로 제작하는 맞춤형 광고
                        </Typography>

                        <TryNowButton href="#">
                            TRY NOW
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </TryNowButton>
                    </AdCard>
                </Grid>
            </Grid>
        </Container>
    );
};

export default HairAi;