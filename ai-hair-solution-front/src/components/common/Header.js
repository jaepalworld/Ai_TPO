import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    Container,
    MenuItem,
    Menu,
    useMediaQuery,
    useTheme,
    Avatar,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import StyleIcon from '@mui/icons-material/Style';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { logoutUser } from '../../services/auth';

const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => ({
    background: scrolled
        ? 'rgba(255, 255, 255, 0.95)'
        : 'transparent',
    boxShadow: scrolled
        ? '0px 4px 12px rgba(0, 0, 0, 0.05)'
        : 'none',
    color: scrolled ? theme.palette.text.primary : theme.palette.text.primary,
    transition: 'all 0.3s ease',
    backdropFilter: scrolled ? 'blur(10px)' : 'none',
}));

const Logo = styled(Typography)(({ theme, scrolled, pathname }) => ({
    fontWeight: 700,
    fontSize: '1.5rem',
    background: scrolled || pathname !== '/'
        ? `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`
        : `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
}));

const NavButton = styled(Button)(({ theme, active }) => ({
    margin: theme.spacing(0, 1),
    color: active ? theme.palette.primary.main : theme.palette.text.primary,
    position: 'relative',
    fontWeight: 500,
    '&::after': active ? {
        content: '""',
        position: 'absolute',
        bottom: 6,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '20px',
        height: '3px',
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        borderRadius: '10px',
    } : {},
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 6,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20px',
            height: '3px',
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            borderRadius: '10px',
        }
    }
}));

const AuthButton = styled(Button)(({ theme, btntype }) => ({
    borderRadius: 30,
    marginLeft: theme.spacing(1),
    padding: theme.spacing(1, 3),
    fontWeight: 500,
    ...(btntype === 'login' && {
        border: `2px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        '&:hover': {
            background: 'rgba(156, 39, 176, 0.04)',
        }
    }),
    ...(btntype === 'register' && {
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
        color: '#ffffff',
        boxShadow: '0 4px 12px rgba(156, 39, 176, 0.2)',
        '&:hover': {
            boxShadow: '0 6px 14px rgba(156, 39, 176, 0.3)',
        }
    })
}));

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const user = auth.currentUser;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await logoutUser();
        handleClose();
    };

    // 모바일 메뉴 내용
    const drawer = (
        <Box sx={{ width: 280, height: '100%', py: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, mb: 2 }}>
                <Logo variant="h6" component={Link} to="/" scrolled="true" pathname={location.pathname}>
                    AiHairSolution
                </Logo>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
                <ListItem
                    button
                    component={Link}
                    to="/"
                    selected={location.pathname === '/'}
                    onClick={handleDrawerToggle}
                >
                    <ListItemIcon>
                        <HomeIcon color={location.pathname === '/' ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="홈" />
                </ListItem>
                <ListItem
                    button
                    component={Link}
                    to="/about"
                    selected={location.pathname === '/about'}
                    onClick={handleDrawerToggle}
                >
                    <ListItemIcon>
                        <InfoIcon color={location.pathname === '/about' ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="서비스 소개" />
                </ListItem>
                <ListItem
                    button
                    component={Link}
                    to="/styles"
                    selected={location.pathname === '/styles'}
                    onClick={handleDrawerToggle}
                >
                    <ListItemIcon>
                        <StyleIcon color={location.pathname === '/styles' ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="헤어스타일" />
                </ListItem>
                <ListItem
                    button
                    component={Link}
                    to="/booking"
                    selected={location.pathname === '/booking'}
                    onClick={handleDrawerToggle}
                >
                    <ListItemIcon>
                        <EventNoteIcon color={location.pathname === '/booking' ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="예약하기" />
                </ListItem>
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ px: 2 }}>
                {user ? (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                                {user.email.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="body1" fontWeight={500}>
                                    {user.displayName || '사용자'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            startIcon={<ExitToAppIcon />}
                            onClick={handleLogout}
                            sx={{ mb: 1 }}
                        >
                            로그아웃
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="outlined"
                            color="primary"
                            fullWidth
                            component={Link}
                            to="/login"
                            startIcon={<AccountCircleIcon />}
                            onClick={handleDrawerToggle}
                            sx={{ mb: 1 }}
                        >
                            로그인
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            component={Link}
                            to="/register"
                            startIcon={<PersonAddIcon />}
                            onClick={handleDrawerToggle}
                        >
                            회원가입
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            <StyledAppBar position="fixed" scrolled={scrolled ? 1 : 0}>
                <Container maxWidth="lg">
                    <Toolbar disableGutters>
                        <Logo variant="h6" component={Link} to="/" scrolled={scrolled ? 1 : 0} pathname={location.pathname}>
                            AiHairSolution
                        </Logo>

                        {isMobile ? (
                            <IconButton
                                edge="end"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleDrawerToggle}
                                sx={{ ml: 'auto' }}
                            >
                                <MenuIcon />
                            </IconButton>
                        ) : (
                            <Box sx={{ ml: 4, display: 'flex', flexGrow: 1 }}>
                                <NavButton
                                    color="inherit"
                                    component={Link}
                                    to="/"
                                    active={location.pathname === '/' ? 1 : 0}
                                >
                                    홈
                                </NavButton>
                                <NavButton
                                    color="inherit"
                                    component={Link}
                                    to="/about"
                                    active={location.pathname === '/about' ? 1 : 0}
                                >
                                    서비스 소개
                                </NavButton>
                                <NavButton
                                    color="inherit"
                                    component={Link}
                                    to="/styles"
                                    active={location.pathname === '/styles' ? 1 : 0}
                                >
                                    헤어스타일
                                </NavButton>
                                <NavButton
                                    color="inherit"
                                    component={Link}
                                    to="/booking"
                                    active={location.pathname === '/booking' ? 1 : 0}
                                >
                                    예약하기
                                </NavButton>

                                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                                    {user ? (
                                        <>
                                            <IconButton
                                                color="inherit"
                                                aria-label="account of current user"
                                                aria-controls="menu-appbar"
                                                aria-haspopup="true"
                                                onClick={handleMenu}
                                            >
                                                <Avatar sx={{ width: 36, height: 36, bgcolor: theme.palette.primary.main }}>
                                                    {user.email.charAt(0).toUpperCase()}
                                                </Avatar>
                                            </IconButton>
                                            <Menu
                                                id="menu-appbar"
                                                anchorEl={anchorEl}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                                keepMounted
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                                open={Boolean(anchorEl)}
                                                onClose={handleClose}
                                            >
                                                <MenuItem component={Link} to="/profile" onClick={handleClose}>프로필</MenuItem>
                                                <MenuItem component={Link} to="/my-styles" onClick={handleClose}>나의 스타일</MenuItem>
                                                <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
                                            </Menu>
                                        </>
                                    ) : (
                                        <>
                                            <AuthButton
                                                btntype="login"
                                                variant="outlined"
                                                component={Link}
                                                to="/login"
                                            >
                                                로그인
                                            </AuthButton>
                                            <AuthButton
                                                btntype="register"
                                                variant="contained"
                                                component={Link}
                                                to="/register"
                                            >
                                                회원가입
                                            </AuthButton>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        )}
                    </Toolbar>
                </Container>
            </StyledAppBar>

            {/* 모바일 메뉴 드로어 */}
            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // 모바일 성능 향상
                }}
            >
                {drawer}
            </Drawer>

            {/* 헤더 높이만큼 여백 추가 */}
            <Toolbar />
        </>
    );
};

export default Header;