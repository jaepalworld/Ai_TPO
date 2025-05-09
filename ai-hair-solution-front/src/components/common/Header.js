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
    ListItemButton,
    ListItemIcon
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PersonIcon from '@mui/icons-material/Person'; // Import for default avatar icon
import EditIcon from '@mui/icons-material/Edit'; // Import for edit icon
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Import for profile icon
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Import for logout icon
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../services/firebase';
import { logoutUser } from '../../services/auth';
import TickerSlider from './TickerSlider';

// 헤더 AppBar 스타일 - 스크롤에 따라 보이거나 숨김
const StyledAppBar = styled(AppBar)(({ theme, scrolled }) => ({
    // 기본 배경은 불투명하게 유지, 스크롤 시에만 투명도 적용
    background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 1)',
    boxShadow: scrolled ? '0px 2px 10px rgba(0, 0, 0, 0.08)' : 'none',
    color: theme.palette.text.primary,
    transition: 'all 0.3s ease',
    // 항상 표시되도록 설정
    visibility: 'visible',
    opacity: 1,
    transform: 'translateY(0)',
    position: 'fixed',
    top: '45px', // 티커슬라이더 높이에 맞게 조정
    left: 0,
    right: 0,
    zIndex: 1000, // 티커슬라이더보다 낮은 zIndex
    // 스크롤 시에만 블러 효과 적용
    backdropFilter: scrolled ? 'blur(8px)' : 'none',
    height: '72px',
    // 메인 콘텐츠 영역 패딩 설정
    '& + *': {
        paddingTop: '117px', // 티커슬라이더(45px) + 헤더(72px)
    },
}));

// 로고 타이포그래피 - 우아한 스타일로 업데이트
const Logo = styled(Typography)(({ theme }) => ({
    fontWeight: 500,
    fontSize: '1.5rem',
    color: '#000',
    letterSpacing: '0.12em', // 더 넓은 자간
    textDecoration: 'none',
    fontFamily: "'Didot', 'Playfair Display', 'Pretendard', serif", // 고급스러운 폰트
    fontStyle: 'italic',
    textTransform: 'uppercase',
}));

// 네비게이션 버튼 - 드롭다운 스타일
const NavItem = styled(Box)(({ theme }) => ({
    margin: theme.spacing(0, 2.2), // 여백 증가
    position: 'relative',
    '&:hover': {
        '& .MuiBox-root': {
            visibility: 'visible',
            opacity: 1,
            transform: 'translateY(0)',
        }
    }
}));

// 네비게이션 텍스트 - 링크 포함, 첫 번째 스크린샷처럼 업데이트
const NavText = styled(Typography)(({ theme, active, component, to }) => ({
    color: active ? '#000' : '#555',
    fontWeight: 400,
    fontSize: '0.95rem', // 폰트 크기 조정
    padding: theme.spacing(1, 1),
    letterSpacing: '0.12em', // 자간 더 넓게
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'block',
    fontFamily: "'Montserrat', 'Pretendard', sans-serif", // 고급스러운 산세리프 폰트
    textTransform: 'uppercase', // 대문자로 변환
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
    minWidth: '200px', // 너비 증가
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
    fontSize: '0.9rem',
    letterSpacing: '0.03em', // 자간 추가
    fontFamily: "'Montserrat', 'Pretendard', sans-serif", // 일관된 폰트
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

// 로그인 버튼 - 우아한 스타일로 업데이트
const LoginButton = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    padding: '8px 18px', // 패딩 증가
    fontWeight: 400,
    fontSize: '0.9rem',
    letterSpacing: '0.12em', // 자간 더 넓게
    textTransform: 'uppercase', // 대문자로 변경
    minWidth: 'auto',
    color: '#000',
    backgroundColor: 'transparent',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    fontFamily: "'Montserrat', 'Pretendard', sans-serif", // 일관된 폰트
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

// 회원가입 버튼 - 로그인 버튼과 동일한 스타일로 업데이트
const RegisterButton = styled(Button)(({ theme }) => ({
    borderRadius: 0,
    padding: '8px 18px',
    marginLeft: theme.spacing(2.5),
    fontWeight: 400,
    fontSize: '0.9rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    minWidth: 'auto',
    color: '#000',
    backgroundColor: 'transparent',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    fontFamily: "'Montserrat', 'Pretendard', sans-serif",
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

// 프로필 아바타 스타일
const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: 36,
    height: 36,
    backgroundColor: '#f0f0f0',
    color: '#555',
    border: '1px solid #ddd',
    '& .MuiSvgIcon-root': {
        width: 22,
        height: 22,
    }
}));

// 프로필 드롭다운 아바타 (더 작게)
const MenuAvatar = styled(Avatar)(({ theme }) => ({
    width: 24,
    height: 24,
    backgroundColor: '#f0f0f0',
    color: '#555',
    marginRight: theme.spacing(1.5),
    border: '1px solid #ddd',
    '& .MuiSvgIcon-root': {
        width: 16,
        height: 16,
    }
}));

const TryBadge = styled(Box)(({ theme }) => ({
    position: 'absolute',
    bottom: -32, // 버튼 아래에 위치
    left: '50%', // 중앙 정렬
    transform: 'translateX(-50%)', // 중앙 정렬 보정
    backgroundColor: '#666', // 회색 배경
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: 500,
    padding: '3px 10px',
    borderRadius: '4px',
    letterSpacing: '0.05em',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    fontFamily: "'Montserrat', 'Pretendard', sans-serif",
}));

// 모바일 메뉴 아이템
const MobileNavItem = styled(ListItemButton)(({ theme, active }) => ({
    padding: theme.spacing(1.2, 2), // 패딩 증가
    borderLeft: active ? '2px solid #000' : '2px solid transparent',
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        borderLeft: '2px solid #000',
    }
}));

// 메뉴 구조 데이터 - About 드롭다운 메뉴 항목 변경
const menuItems = [
    {
        title: '서비스 소개',
        path: '/about',
        submenu: [
            { title: '후기', path: '/about/reviews' },
            { title: '룩북', path: '/about/lookbook' },
            { title: '사용 설명서', path: '/about/manual' },
            { title: '자주 묻는 질문', path: '/about/faq' },
            { title: '이용 가이드', path: '/about/guide' }
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
    const isHomePage = location.pathname === '/';

    // 사용자 프로필 이미지 상태
    const [profileImageUrl, setProfileImageUrl] = useState(null);

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
            // 메뉴 페이지일 경우 항상 헤더 흐리게 표시
            if (isMenuPage()) {
                setScrolled(true);
                return;
            }

            // 스크롤 위치에 따라 헤더 스타일 변경 (50px 이상 스크롤 시 흐리게)
            if (window.scrollY > 50) {
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
    }, [location.pathname, isMenuPage]);


    // 유저 프로필 이미지 체크
    useEffect(() => {
        if (user && user.photoURL) {
            setProfileImageUrl(user.photoURL);
        } else {
            setProfileImageUrl(null);
        }
    }, [user]);

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
        if (!item) return false; // item이 undefined인 경우 처리
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
                            letterSpacing: '0.03em', // 자간 추가
                            fontFamily: "'Montserrat', 'Pretendard', sans-serif", // 폰트 통일
                            textTransform: 'uppercase', // 대문자로 통일
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
                                    letterSpacing: '0.03em', // 자간 추가
                                    fontFamily: "'Montserrat', 'Pretendard', sans-serif", // 폰트 통일
                                    textTransform: 'uppercase', // 대문자로 통일
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
                                        textTransform: 'uppercase', // 대문자로 통일
                                        letterSpacing: '0.03em', // 자간 추가
                                        fontFamily: "'Montserrat', 'Pretendard', sans-serif", // 폰트 통일
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
                                                letterSpacing: '0.03em', // 자간 추가
                                                fontFamily: "'Montserrat', 'Pretendard', sans-serif", // 폰트 통일
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
                            {/* 모바일 프로필 이미지 */}
                            <ProfileAvatar src={profileImageUrl}>
                                {!profileImageUrl && <PersonIcon />}
                            </ProfileAvatar>
                            <Box sx={{ ml: 2, flex: 1 }}>
                                <Typography variant="body2" fontWeight={500} fontSize="0.9rem"
                                    fontFamily="'Montserrat', 'Pretendard', sans-serif"
                                    letterSpacing="0.03em">
                                    {user.displayName || '사용자'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{
                                    fontSize: '0.8rem',
                                    fontFamily: "'Montserrat', 'Pretendard', sans-serif",
                                }}>
                                    {user.email}
                                </Typography>
                            </Box>
                            <IconButton
                                component={Link}
                                to="/profile/edit"
                                size="small"
                                onClick={handleDrawerToggle}
                                sx={{
                                    color: 'text.secondary',
                                    '&:hover': { color: 'primary.main' }
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Box>
                        <Divider sx={{ mb: 1 }} />
                        <List>
                            <ListItemButton
                                component={Link}
                                to="/profile"
                                onClick={handleDrawerToggle}
                                sx={{ py: 1 }}
                            >
                                <ListItemIcon sx={{ minWidth: '32px' }}>
                                    <AccountCircleIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="마이프로필"
                                    primaryTypographyProps={{
                                        fontSize: '0.9rem',
                                        letterSpacing: '0.03em',
                                        fontFamily: "'Montserrat', 'Pretendard', sans-serif",
                                    }}
                                />
                            </ListItemButton>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{ py: 1 }}
                            >
                                <ListItemIcon sx={{ minWidth: '32px' }}>
                                    <ExitToAppIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="로그아웃"
                                    primaryTypographyProps={{
                                        fontSize: '0.9rem',
                                        letterSpacing: '0.03em',
                                        fontFamily: "'Montserrat', 'Pretendard', sans-serif",
                                    }}
                                />
                            </ListItemButton>
                        </List>
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
            {/* 메인 페이지에서만 상단 티커 슬라이더 표시 */}
            {isHomePage && <TickerSlider />}
            {/* 스크롤에 따라 등장하는 헤더 */}
            <StyledAppBar scrolled={scrolled ? 1 : 0}>
                <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
                    <Toolbar disableGutters sx={{ height: '72px', minHeight: '72px' }}>
                        {/* 왼쪽 메뉴 영역 */}
                        {!isMobile && (
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '33%' }}>
                                <NavItem>
                                    <NavText
                                        active={location.pathname === '/' ? 1 : 0}
                                        component={Link}
                                        to="/"
                                    >
                                        Home
                                    </NavText>
                                </NavItem>
                                <NavItem>
                                    <NavText
                                        active={isActive(menuItems[0]) ? 1 : 0}
                                        component={Link}
                                        to={menuItems[0].path}
                                    >
                                        About
                                    </NavText>
                                    <DropdownMenu className="MuiBox-root">
                                        {menuItems[0].submenu.map((subItem, subIndex) => (
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
                                <NavItem>
                                    <NavText
                                        active={isActive(menuItems[1]) ? 1 : 0}
                                        component={Link}
                                        to={menuItems[1].path}
                                    >
                                        Salon
                                    </NavText>
                                    <DropdownMenu className="MuiBox-root">
                                        {menuItems[1].submenu.map((subItem, subIndex) => (
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
                            </Box>
                        )}

                        {/* 중앙 로고 영역 */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: isMobile ? 'auto' : '33%'
                        }}>
                            <Logo
                                variant="h6"
                                component={Link}
                                to="/"
                                sx={{ textAlign: 'center' }}
                            >
                                AIHAIRSOLUTION
                            </Logo>
                        </Box>

                        {/* 오른쪽 로그인/회원가입 영역 */}
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
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: '33%'
                            }}>
                                {user ? (
                                    <>
                                        <Box
                                            onClick={handleMenu}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                padding: '4px 8px',
                                                borderRadius: '20px',
                                                transition: 'background-color 0.2s',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                                }
                                            }}
                                        >
                                            {/* 프로필 이미지 */}
                                            <ProfileAvatar src={profileImageUrl}>
                                                {!profileImageUrl && <PersonIcon />}
                                            </ProfileAvatar>
                                            <Typography
                                                sx={{
                                                    ml: 1.5,
                                                    fontSize: '0.95rem',
                                                    fontWeight: 400,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    fontFamily: "'Montserrat', 'Pretendard', sans-serif",
                                                }}
                                            >
                                                {user.displayName || '사용자'}
                                            </Typography>
                                        </Box>
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
                                                    minWidth: '200px',
                                                    mt: 1,
                                                    border: '1px solid #eee',
                                                },
                                            }}
                                        >
                                            <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
                                                <MenuAvatar src={profileImageUrl} sx={{ width: 32, height: 32 }}>
                                                    {!profileImageUrl && <PersonIcon />}
                                                </MenuAvatar>
                                                <Box sx={{ ml: 1.5, flex: 1 }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '0.9rem',
                                                            fontWeight: 500,
                                                            letterSpacing: '0.03em',
                                                            fontFamily: "'Montserrat', 'Pretendard', sans-serif",
                                                            lineHeight: 1.2
                                                        }}
                                                    >
                                                        {user.displayName || '사용자'}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '0.75rem',
                                                            color: 'text.secondary',
                                                            fontFamily: "'Montserrat', 'Pretendard', sans-serif",
                                                        }}
                                                    >
                                                        {user.email}
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    component={Link}
                                                    to="/profile/edit"
                                                    size="small"
                                                    onClick={handleClose}
                                                    sx={{
                                                        color: 'text.secondary',
                                                        '&:hover': { color: 'primary.main' }
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                            <Divider />
                                            <MenuItem
                                                component={Link}
                                                to="/profile"
                                                onClick={handleClose}
                                                sx={{
                                                    py: 1.2,
                                                    px: 2,
                                                    fontSize: '0.85rem',
                                                    letterSpacing: '0.03em',
                                                    fontFamily: "'Montserrat', 'Pretendard', sans-serif",
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: '32px' }}>
                                                    <AccountCircleIcon fontSize="small" />
                                                </ListItemIcon>
                                                마이프로필
                                            </MenuItem>
                                            <MenuItem
                                                onClick={handleLogout}
                                                sx={{
                                                    py: 1.2,
                                                    px: 2,
                                                    fontSize: '0.85rem',
                                                    letterSpacing: '0.03em',
                                                    fontFamily: "'Montserrat', 'Pretendard', sans-serif",
                                                }}
                                            >
                                                <ListItemIcon sx={{ minWidth: '32px' }}>
                                                    <ExitToAppIcon fontSize="small" />
                                                </ListItemIcon>
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
                                            Login
                                        </LoginButton>
                                        <LoginButton
                                            component={Link}
                                            to="/register"
                                            disableRipple
                                            sx={{ ml: 2.5 }}
                                        >
                                            Join
                                            <TryBadge>Try!</TryBadge>
                                        </LoginButton>
                                    </>
                                )}
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
                    keepMounted: true,
                }}
                PaperProps={{
                    sx: {
                        width: 280,
                        boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
                        marginTop: '45px', // 티커슬라이더 높이만큼 여백 추가
                    }
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Header;