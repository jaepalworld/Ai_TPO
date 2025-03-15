import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#000000', // 검정색으로 변경
            light: '#333333',
            dark: '#000000',
        },
        secondary: {
            main: '#666666', // 회색계열로 변경
            light: '#999999',
            dark: '#444444',
        },
        text: {
            primary: '#000000', // 텍스트 색상 검정으로 설정
            secondary: '#666666',
        },
        background: {
            default: '#FFFFFF', // 배경색 흰색
            paper: '#FFFFFF',
        },
    },
    typography: {
        fontFamily: [
            'Pretendard',
            'AppleSDGothicNeo',
            'Noto Sans KR',
            'sans-serif',
        ].join(','),
        h1: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h2: {
            fontWeight: 700,
            fontSize: '2.8rem',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            '@media (max-width:960px)': {
                fontSize: '2.2rem',
            },
            '@media (max-width:600px)': {
                fontSize: '1.8rem',
            },
        },
        h3: {
            fontWeight: 600,
            letterSpacing: '-0.01em',
        },
        h4: {
            fontWeight: 600,
            letterSpacing: '-0.01em',
        },
        h5: {
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: '-0.01em',
        },
        h6: {
            fontWeight: 500,
            letterSpacing: '-0.01em',
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
            letterSpacing: '-0.01em',
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
            letterSpacing: '-0.01em',
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
            letterSpacing: '0.02em',
        },
        subtitle1: {
            fontWeight: 500,
            fontSize: '1rem',
        },
        subtitle2: {
            fontWeight: 500,
            fontSize: '0.875rem',
        },
        caption: {
            fontSize: '0.75rem',
            letterSpacing: '0',
        },
    },
    shape: {
        borderRadius: 0, // 모서리 둥글게 제거
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 0, // 버튼 모서리 각지게
                    padding: '8px 20px',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
                outlined: {
                    borderWidth: '1px',
                    '&:hover': {
                        borderWidth: '1px',
                    },
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: 24,
                    paddingRight: 24,
                    '@media (min-width:600px)': {
                        paddingLeft: 32,
                        paddingRight: 32,
                    },
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderBottom: '1px solid #eee',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    letterSpacing: '-0.01em',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    border: '1px solid #eee',
                    borderRadius: 0,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 0,
                    },
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 0,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    minHeight: 40,
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: '#eee',
                },
            },
        },
        MuiAvatar: {
            styleOverrides: {
                root: {
                    borderRadius: 0, // 아바타 각진 형태로
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                },
            },
        },
    },
    transitions: {
        easing: {
            easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
            easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
        },
        duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
            complex: 375,
            enteringScreen: 225,
            leavingScreen: 195,
        },
    },
});

export default theme;