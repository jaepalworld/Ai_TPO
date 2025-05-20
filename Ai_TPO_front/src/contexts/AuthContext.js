// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { logoutUser } from '../services/auth';

// 컨텍스트 생성
const AuthContext = createContext();

// 제공자 컴포넌트
export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [kakaoUser, setKakaoUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 통합 사용자 정보
    const [userInfo, setUserInfo] = useState(null);

    // 초기화 시 Firebase와 카카오 로그인 상태 모두 확인
    useEffect(() => {
        // Firebase 인증 상태 리스너
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);

            // Firebase 사용자가 있으면 통합 사용자 정보 설정
            if (user) {
                setUserInfo({
                    id: user.uid,
                    name: user.displayName || '사용자',
                    email: user.email,
                    photoURL: user.photoURL,
                    provider: 'firebase'
                });
            } else {
                // Firebase 사용자가 없으면 카카오 로그인 확인
                const storedKakaoUser = localStorage.getItem('kakaoUser');
                if (storedKakaoUser) {
                    const kakaoUserData = JSON.parse(storedKakaoUser);
                    setKakaoUser(kakaoUserData);
                    setUserInfo({
                        id: kakaoUserData.id,
                        name: kakaoUserData.name || '사용자',
                        email: kakaoUserData.email,
                        photoURL: kakaoUserData.photoURL,
                        provider: 'kakao'
                    });
                } else {
                    setUserInfo(null);
                }
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // 카카오 로그아웃 함수
    const logoutKakao = () => {
        if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
            window.Kakao.Auth.logout(() => {
                console.log('카카오 로그아웃 성공');
                localStorage.removeItem('kakaoUser');
                setKakaoUser(null);
                setUserInfo(null);
            });
        } else {
            localStorage.removeItem('kakaoUser');
            setKakaoUser(null);
            setUserInfo(null);
        }
    };

    // 통합 로그아웃 함수
    const logout = async () => {
        if (currentUser) {
            await logoutUser();
        }

        if (kakaoUser) {
            logoutKakao();
        }

        return { success: true };
    };

    // 컨텍스트 값
    const value = {
        currentUser,
        kakaoUser,
        userInfo,
        isLoggedIn: !!userInfo,
        loading,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// 커스텀 훅
export function useAuth() {
    return useContext(AuthContext);
}