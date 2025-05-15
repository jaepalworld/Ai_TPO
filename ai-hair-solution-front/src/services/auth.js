import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase';

// 회원가입
export const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
};

// 로그인
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
    } catch (error) {
        return { user: null, error: error.message };
    }
};

// 로그아웃
export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// 사용자 인증 상태 관찰
export const observeAuthState = (callback) => {
    return onAuthStateChanged(auth, callback);
};
// 카카오 로그인 상태 확인
export const checkKakaoLoginStatus = () => {
    if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
        return true;
    }

    const storedUser = localStorage.getItem('kakaoUser');
    return !!storedUser;
};

// 카카오 사용자 정보 가져오기
export const getKakaoUserInfo = () => {
    const storedUser = localStorage.getItem('kakaoUser');
    return storedUser ? JSON.parse(storedUser) : null;
};

// 통합 로그아웃 (Firebase + 카카오)
export const logoutAllProviders = async () => {
    try {
        // Firebase 로그아웃
        await logoutUser();

        // 카카오 로그아웃
        if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
            window.Kakao.Auth.logout(() => {
                localStorage.removeItem('kakaoUser');
            });
        } else {
            localStorage.removeItem('kakaoUser');
        }

        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: error.message };
    }
};