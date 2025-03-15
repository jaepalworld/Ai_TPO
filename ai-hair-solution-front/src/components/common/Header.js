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
    Divider,
    Collapse,
    ListItemButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { logoutUser } from '../../services/auth';

// 헤더 AppBar 스타일 - 스크롤에 따라 보이거나 숨김
const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => ({
    background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
    boxShadow: scrolled ? '0px 1px 10px rgba(0, 0, 0, 0.08)' : 'none',
    color: theme.palette.text.primary,
    transition: 'all 0.3s ease',
    visibility: scrolled ? 'visible' : 'hidden',
    opacity: scrolled ? 1 : 0,
    transform: scrolled ? 'translateY(0)' : 'translateY(-100%)',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    backdropFilter: 'blur(8px)',
    height: '64px',
    '& + *': { // 헤더 다음에 오는 모든 요소에 패딩 추가
        paddingTop: scrolled ? '64px' : 0,
        transition: 'padding-top 0.3s ease',
    },
}));

// 로고 타이포그래피 - 미니멀한 스타일
const Logo = styled(Typography)(({ theme }) => ({
    fontWeight: 700,
    fontSize: '1.4rem',
    color: '#000',
    letterSpacing: '0.02em',
    textDecoration: 'none',
    fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
    textTransform: 'uppercase',
}));

// 네비게이션 버튼 - 드롭다운 스타일
const NavItem = styled(Box)(({ theme }) => ({
    margin: theme.spacing(0, 1.5),
    position: 'relative',
    '&:hover': {
        '& .MuiBox-root': {
            visibility: 'visible',
            opacity: 1,
            transform: 'translateY(0)',
        }
    }
}));

// 네비게이션 텍스트 - 링크 포함
const NavText = styled(Typography)(({ theme, active, component, to }) => ({
    color: active ? '#000' : '#555',
    fontWeight: active ? 500 : 400,
    fontSize: '0.9rem',
    padding: theme.spacing(1, 1),
    letterSpacing: '0.02em',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'block',
    '&:hover': {
        color: '#000',
    }
}));

// 드롭다운 메뉴 컨테이너
const DropdownMenu = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    minWidth: '180px',
    padding: theme.spacing(1.5, 0),
    visibility: 'hidden',
    opacity: 0,
    transform: 'translateY(10px)',
    transition: 'all 0.3s ease',
    zIndex: 1101,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
}));

// 드롭다운 메뉴 아이템
const DropdownItem = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(0.8, 1.5),
    fontSize: '0.85rem',
    color: '#555',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    display: 'block',
    textDecoration: 'none',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        color: '#000',
    }
}));

// 로그인 버튼 - 미니멀 스타일
const LoginButton = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    padding: '8px 16px',
    fontWeight: 400,
    fontSize: '0.9rem',
    letterSpacing: '0.02em',
    textTransform: 'none',
    minWidth: 'auto',
    color: '#000',
    backgroundColor: 'transparent',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '0',
        height: '1px',
        background: '#000',
        transition: 'width 0.3s ease',
    },
    '&:hover': {
        backgroundColor: 'transparent',
        '&::after': {
            width: '100%',
        }
    }
}));

// 회원가입 버튼 - 미니멀 스타일
const RegisterButton = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    padding: '8px 16px',
    marginLeft: theme.spacing(1.5),
    fontWeight: 400,
    fontSize: '0.9rem',
    letterSpacing: '0.02em',
    textTransform: 'none',
    minWidth: 'auto',
    color: '#fff',
    backgroundColor: '#000',
    border: '1px solid #000',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'transparent',
        color: '#000',
    }
}));

// 모바일 메뉴 아이템
const MobileNavItem = styled(ListItemButton)(({ theme, active }) => ({
    padding: theme.spacing(1, 2),
    borderLeft: active ? '2px solid #000' : '2px solid transparent',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        borderLeft: '2px solid #000',
    }
}));

// 메뉴 구조 데이터
const menuItems = [
    {
        title: '서비스 소개',
        path: '/about',
        submenu: [
            { title: '서비스 소개', path: '/about' },
            { title: '기업 스토리', path: '/about/story' },
            { title: '회사 연혁', path: '/about/history' },
            { title: '공지사항', path: '/about/notice' }
        ]
    },
    {
        title: '헤어스타일',
        path: '/styles',
        submenu: [
            { title: '헤어 컷', path: '/styles/haircut' },
            { title: '헤어 펌', path: '/styles/perm' },
            { title: '헤어 컬러', path: '/styles/color' },
            { title: '헤어 케어', path: '/styles/care' }
        ]
    },
    {
        title: '주변 헤어샵',
        path: '/nearby-salons',
        submenu: [
            { title: '매장 찾기', path: '/nearby-salons/find' },
            { title: '예약하기', path: '/nearby-salons/reservation' },
            { title: '스타일리스트', path: '/nearby-salons/stylists' }
        ]
    }
];

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [expanded, setExpanded] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const user = auth.currentUser;

    // 현재 경로가 메뉴 항목 페이지인지 확인하는 함수
    const isMenuPage = () => {
        // 홈 페이지는 제외
        if (location.pathname === '/') return false;

        // 모든 메뉴 항목과 서브메뉴 항목의 경로를 확인
        return menuItems.some(item => {
            if (location.pathname === item.path) return true;
            if (item.submenu) {
                return item.submenu.some(subItem => location.pathname === subItem.path);
            }
            return false;
        });
    };

    useEffect(() => {
        const handleScroll = () => {
            // 메뉴 페이지일 경우 항상 헤더 표시
            if (isMenuPage()) {
                setScrolled(true);
                return;
            }

            // 그 외의 경우 기존 로직 유지
            if (window.scrollY > 100) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        // 초기 로드 시에도 체크
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location.pathname]); // location.pathname이 변경될 때마다 effect 재실행

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

    const handleExpandClick = (panel) => {
        setExpanded(expanded === panel ? '' : panel);
    };

    // 현재 경로가 해당 메뉴 항목 또는 하위 메뉴 항목의 경로와 일치하는지 확인
    const isActive = (item) => {
        if (location.pathname === item.path) return true;

        if (item.submenu) {
            return item.submenu.some(subItem => location.pathname === subItem.path);
        }

        return false;
    };

    // 모바일 메뉴 내용
    const drawer = (
        <Box sx={{ width: 280, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Logo variant="h6" component={Link} to="/">
                    AiHairSolution
                </Logo>
                <IconButton onClick={handleDrawerToggle} sx={{ p: 0.5 }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ mb: 1 }} />
            <List sx={{ pt: 0 }}>
                <MobileNavItem
                    component={Link}
                    to="/"
                    active={location.pathname === '/' ? 1 : 0}
                    onClick={handleDrawerToggle}
                >
                    <ListItemText
                        primary="홈"
                        primaryTypographyProps={{
                            fontWeight: location.pathname === '/' ? 500 : 400,
                            fontSize: '0.95rem',
                        }}
                    />
                </MobileNavItem>

                {/* 메뉴 항목 */}
                {menuItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <MobileNavItem
                            onClick={() => handleExpandClick(item.title)}
                            active={isActive(item) ? 1 : 0}
                        >
                            <ListItemText
                                primary={item.title}
                                primaryTypographyProps={{
                                    fontWeight: isActive(item) ? 500 : 400,
                                    fontSize: '0.95rem',
                                }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    component={Link}
                                    to={item.path}
                                    onClick={(e) => {
                                        e.stopPropagation(); // 버블링 방지
                                        handleDrawerToggle();
                                    }}
                                    sx={{
                                        minWidth: 'auto',
                                        fontSize: '0.75rem',
                                        p: 0.5,
                                        mr: 1,
                                        color: '#555',
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            color: '#000',
                                            textDecoration: 'underline',
                                        }
                                    }}
                                >
                                    바로가기
                                </Button>
                                <KeyboardArrowDownIcon
                                    sx={{
                                        transform: expanded === item.title ? 'rotate(180deg)' : 'rotate(0)',
                                        transition: 'transform 0.3s ease',
                                    }}
                                />
                            </Box>
                        </MobileNavItem>
                        <Collapse in={expanded === item.title} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {item.submenu.map((subItem, subIndex) => (
                                    <ListItemButton
                                        key={subIndex}
                                        component={Link}
                                        to={subItem.path}
                                        onClick={handleDrawerToggle}
                                        sx={{
                                            pl: 4,
                                            py: 0.5,
                                        }}
                                    >
                                        <ListItemText
                                            primary={subItem.title}
                                            primaryTypographyProps={{
                                                fontSize: '0.85rem',
                                                color: location.pathname === subItem.path ? '#000' : '#666',
                                                fontWeight: location.pathname === subItem.path ? 500 : 400,
                                            }}
                                        />
                                    </ListItemButton>
                                ))}
                            </List>
                        </Collapse>
                    </React.Fragment>
                ))}
            </List>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ px: 2, py: 1 }}>
                {user ? (
                    <>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            p: 1,
                        }}>
                            <Avatar sx={{
                                mr: 2,
                                bgcolor: '#000',
                                width: 32,
                                height: 32,
                                borderRadius: 0,
                            }}>
                                {user.email.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                                <Typography variant="body2" fontWeight={500} fontSize="0.9rem">
                                    {user.displayName || '사용자'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                    {user.email}
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            variant="text"
                            color="inherit"
                            fullWidth
                            onClick={handleLogout}
                            sx={{
                                justifyContent: 'flex-start',
                                fontWeight: 400,
                                fontSize: '0.9rem',
                                padding: '8px 0',
                                color: '#555',
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    textDecoration: 'underline',
                                }
                            }}
                        >
                            로그아웃
                        </Button>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <LoginButton
                            component={Link}
                            to="/login"
                            onClick={handleDrawerToggle}
                            fullWidth
                            sx={{ justifyContent: 'flex-start' }}
                        >
                            로그인
                        </LoginButton>
                        <RegisterButton
                            component={Link}
                            to="/register"
                            onClick={handleDrawerToggle}
                            fullWidth
                        >
                            회원가입
                        </RegisterButton>
                    </Box>
                )}
            </Box>
        </Box>
    );

    return (
        <>
            {/* 스크롤에 따라 등장하는 헤더 */}
            <StyledAppBar scrolled={scrolled ? 1 : 0}>
                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                    <Toolbar disableGutters sx={{ height: '64px', minHeight: '64px' }}>
                        <Logo variant="h6" component={Link} to="/">
                            AiHairSolution
                        </Logo>

                        {isMobile ? (
                            <IconButton
                                edge="end"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleDrawerToggle}
                                sx={{
                                    ml: 'auto',
                                    p: 0.5,
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        ) : (
                            <Box sx={{ ml: 5, display: 'flex', flexGrow: 1, alignItems: 'center' }}>
                                <NavItem>
                                    <NavText
                                        active={location.pathname === '/' ? 1 : 0}
                                        component={Link}
                                        to="/"
                                    >
                                        홈
                                    </NavText>
                                </NavItem>

                                {/* 드롭다운 메뉴 */}
                                {menuItems.map((item, index) => (
                                    <NavItem key={index}>
                                        {/* 메인 메뉴 항목에 링크 기능 추가 */}
                                        <NavText
                                            active={isActive(item) ? 1 : 0}
                                            component={Link}
                                            to={item.path}
                                        >
                                            {item.title}
                                        </NavText>
                                        <DropdownMenu className="MuiBox-root">
                                            {item.submenu.map((subItem, subIndex) => (
                                                <DropdownItem
                                                    key={subIndex}
                                                    component={Link}
                                                    to={subItem.path}
                                                >
                                                    {subItem.title}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </NavItem>
                                ))}

                                <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                                    {user ? (
                                        <>
                                            <Button
                                                color="inherit"
                                                onClick={handleMenu}
                                                sx={{
                                                    fontSize: '0.9rem',
                                                    fontWeight: 400,
                                                    textTransform: 'none',
                                                    minWidth: 'auto',
                                                    p: 1,
                                                }}
                                                disableRipple
                                            >
                                                {user.displayName || '사용자'}
                                            </Button>
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
                                                PaperProps={{
                                                    elevation: 1,
                                                    sx: {
                                                        borderRadius: 0,
                                                        minWidth: '150px',
                                                        mt: 1,
                                                        border: '1px solid #eee',
                                                    },
                                                }}
                                            >
                                                <MenuItem
                                                    component={Link}
                                                    to="/profile"
                                                    onClick={handleClose}
                                                    sx={{
                                                        fontSize: '0.9rem',
                                                        py: 1,
                                                    }}
                                                >
                                                    프로필
                                                </MenuItem>
                                                <MenuItem
                                                    component={Link}
                                                    to="/my-styles"
                                                    onClick={handleClose}
                                                    sx={{
                                                        fontSize: '0.9rem',
                                                        py: 1,
                                                    }}
                                                >
                                                    나의 스타일
                                                </MenuItem>
                                                <Divider sx={{ my: 0.5 }} />
                                                <MenuItem
                                                    onClick={handleLogout}
                                                    sx={{
                                                        fontSize: '0.9rem',
                                                        py: 1,
                                                    }}
                                                >
                                                    로그아웃
                                                </MenuItem>
                                            </Menu>
                                        </>
                                    ) : (
                                        <>
                                            <LoginButton
                                                component={Link}
                                                to="/login"
                                                disableRipple
                                            >
                                                로그인
                                            </LoginButton>
                                            <RegisterButton
                                                component={Link}
                                                to="/register"
                                            >
                                                회원가입
                                            </RegisterButton>
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
                PaperProps={{
                    sx: {
                        width: 280,
                        boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
                    }
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Header;