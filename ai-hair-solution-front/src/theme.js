import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5',
            light: '#757de8',
            dark: '#002984',
        },
        secondary: {
            main: '#f50057',
            light: '#ff4081',
            dark: '#c51162',
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        fontFamily: [
            'Pretendard', // 프리텐다드 폰트 적용 (공유해주신 폰트)
            'Roboto',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
            fontSize: '3.5rem',
            lineHeight: 1.2,
            '@media (max-width:960px)': {
                fontSize: '2.5rem',
            },
            '@media (max-width:600px)': {
                fontSize: '2rem',
            },
        },
        h5: {
            fontWeight: 400,
            lineHeight: 1.6,
            '@media (max-width:600px)': {
                fontSize: '1rem',
            },
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 30, // 버튼 둥글게 (이가자 스타일)
                    padding: '10px 24px',
                },
                contained: {
                    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.12)',
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
    },
    transitions: {
        easing: {
            easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
            easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
        },
        duration: {
            standard: 300,
            enteringScreen: 400,
            leavingScreen: 300,
        },
    },
});

export default theme;