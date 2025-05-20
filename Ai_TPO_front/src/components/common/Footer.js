import React from 'react';
import {
    Box,
    Container,
    Typography,
    Link,
    Grid,
    Divider,
    IconButton,
    Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import BookIcon from '@mui/icons-material/Book'; // Using Book icon for Velog
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import { Link as RouterLink } from 'react-router-dom';

const FooterWrapper = styled(Box)(({ theme }) => ({
    backgroundColor: '#f8f9fa',
    color: theme.palette.text.primary,
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(4),
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(156, 39, 176, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
    },
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -30,
        left: -30,
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 64, 129, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
    }
}));

const FooterHeading = styled(Typography)(({ theme }) => ({
    fontSize: '1.25rem',
    fontWeight: 600,
    marginBottom: theme.spacing(3),
    position: 'relative',
    display: 'inline-block',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -8,
        left: 0,
        width: 40,
        height: 3,
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        borderRadius: 4,
    }
}));

const StyledLink = styled(Link)(({ theme }) => ({
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    marginBottom: theme.spacing(1.5),
    display: 'block',
    transition: 'color 0.2s ease-in-out',
    '&:hover': {
        color: theme.palette.primary.main,
    }
}));

const SocialButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.text.secondary,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    marginRight: theme.spacing(1),
    transition: 'all 0.3s ease',
    '&:hover': {
        color: 'white',
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        transform: 'translateY(-3px)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    }
}));

const ContactItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    marginBottom: theme.spacing(2),
    '& svg': {
        color: theme.palette.primary.main,
        marginRight: theme.spacing(1.5),
        fontSize: 20,
    }
}));

const Logo = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '1.8rem',
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: theme.spacing(2),
}));

const Footer = () => {
    return (
        <FooterWrapper>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Logo variant="h6">
                            AiHairSolution
                        </Logo>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            인공지능 기술로 당신에게 맞는 헤어스타일을 찾아드립니다.
                            가상으로 미리 체험하고 실제 스타일링에 반영해보세요.
                        </Typography>
                        <Box sx={{ display: 'flex', mb: 3 }}>
                            <SocialButton aria-label="youtube" component="a" href="https://www.youtube.com/@%EB%82%91%EB%8B%AC%EB%8B%AC%ED%95%98%EB%88%84" target="_blank">
                                <YouTubeIcon />
                            </SocialButton>
                            <SocialButton aria-label="velog" component="a" href="https://velog.io/@cjw4032/posts" target="_blank">
                                <BookIcon />
                            </SocialButton>
                            <SocialButton aria-label="github" component="a" href="https://github.com/jaepalworld/AiHairSolution" target="_blank">
                                <GitHubIcon />
                            </SocialButton>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <FooterHeading variant="h6">
                            바로가기
                        </FooterHeading>
                        <StyledLink component={RouterLink} to="/">
                            홈
                        </StyledLink>
                        <StyledLink component={RouterLink} to="/about">
                            서비스 소개
                        </StyledLink>
                        <StyledLink component={RouterLink} to="/styles">
                            헤어스타일
                        </StyledLink>
                        <StyledLink component={RouterLink} to="/booking">
                            예약하기
                        </StyledLink>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <FooterHeading variant="h6">
                            연락처
                        </FooterHeading>
                        <ContactItem>
                            <LocationOnIcon />
                            <Typography variant="body2" color="text.secondary">
                                경기도 부천시 소사본동
                            </Typography>
                        </ContactItem>
                        <ContactItem>
                            <PhoneIcon />
                            <Typography variant="body2" color="text.secondary">
                                010-3161-4032
                            </Typography>
                        </ContactItem>
                        <ContactItem>
                            <EmailIcon />
                            <Typography variant="body2" color="text.secondary">
                                cjw4032@gmail.com
                            </Typography>
                        </ContactItem>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'center' } }}>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: { xs: 2, sm: 0 } }}>
                        © {new Date().getFullYear()} AiHairSolution. All rights reserved.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Link href="/terms" color="text.secondary" underline="hover" variant="body2">
                            이용약관
                        </Link>
                        <Link href="/contact" color="text.secondary" underline="hover" variant="body2">
                            문의하기
                        </Link>
                    </Box>
                </Box>
            </Container>
        </FooterWrapper>
    );
};

export default Footer;