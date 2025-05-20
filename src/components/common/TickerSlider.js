import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
// 더 이상 useLocation이 필요하지 않음
// import { useLocation } from 'react-router-dom';

const TickerContainer = styled(Box)(({ theme }) => ({
    width: '100% !important',
    overflow: 'hidden !important',
    backgroundColor: '#222222 !important',
    color: '#f5f5f5 !important',
    height: '45px !important',
    display: 'flex !important',
    alignItems: 'center !important',
    // 항상 고정 위치로 설정
    position: 'fixed !important', // 고정 위치로 변경
    top: '0 !important',          // 항상 최상단에 위치
    left: '0 !important',
    right: '0 !important',
    zIndex: '1200 !important',    // 헤더보다 높은 zIndex
    borderBottom: '1px solid rgba(255,255,255,0.08) !important',
}));

// 티커 내용 컨테이너
const TickerContent = styled(Box)(({ theme }) => ({
    display: 'flex !important',
    width: '100% !important',
    justifyContent: 'space-between !important',
    alignItems: 'center !important',
    padding: '0 !important',
    height: '100% !important',
}));

// 티커 아이템 스타일 - 더 세련된 타이포그래피
const TickerItem = styled(Box)(({ isActive }) => ({
    padding: '0 16px !important',
    fontSize: '1rem !important',  // 글씨 크기 키움
    letterSpacing: '0.15em !important',  // 자간 더 넓힘
    textTransform: 'uppercase !important',
    fontWeight: isActive ? '600 !important' : '400 !important',  // 활성화 시 더 굵게
    whiteSpace: 'nowrap !important',
    textAlign: 'center !important',
    fontFamily: "'Montserrat', 'Pretendard', sans-serif !important", // 세련된 폰트로 변경
    transition: 'all 0.8s ease-in-out !important',
    color: isActive ? '#ffffff !important' : 'rgba(255,255,255,0.6) !important',
    textShadow: isActive ? '0 0 10px rgba(255,255,255,0.3) !important' : 'none !important',
    opacity: isActive ? '1 !important' : '0.4 !important',
}));

// 전체 아이템 래퍼
const TickerItemsWrapper = styled(Box)({
    display: 'flex !important',
    width: '100% !important',
    justifyContent: 'space-between !important',
    padding: '0 20px !important', // 패딩 약간 증가
});

const TickerSlider = () => {
    // useLocation은 더 이상 필요하지 않음
    // const location = useLocation();
    const [isOddActive, setIsOddActive] = useState(true);

    // 홈페이지 체크 제거 - 모든 페이지에서 표시
    // const isHomePage = location.pathname === '/';

    // 모든 항목들을 하나의 배열로 관리
    const allItems = [
        "COMFYUI", // 홀수 위치 1
        "FASTAPI", // 짝수 위치 2
        "FIREBASE", // 홀수 위치 3
        "REACT", // 짝수 위치 4
        "PYTHON", // 홀수 위치 5
        "AI_TPO" // 짝수 위치 6
    ];

    // Hook은 항상 컴포넌트 최상위 레벨에서 호출되어야 함
    useEffect(() => {
        // 타이머 설정하여 홀수/짝수 포지션 항목 간 전환
        const timer = setInterval(() => {
            setIsOddActive(prev => !prev);
        }, 4000); // 4초마다 전환

        return () => {
            // 컴포넌트 언마운트 시 타이머 정리
            clearInterval(timer);
        };
    }, []);

    // 메인 페이지 체크 조건 제거 - 항상 렌더링
    // if (!isHomePage) return null;

    return (
        <TickerContainer>
            <TickerContent>
                <TickerItemsWrapper>
                    {allItems.map((item, index) => {
                        // 홀수 인덱스(0, 2, 4...)는 첫 번째 그룹
                        // 짝수 인덱스(1, 3, 5...)는 두 번째 그룹
                        const isOddIndex = index % 2 === 0;
                        const isActive = isOddIndex ? isOddActive : !isOddActive;

                        return (
                            <TickerItem key={index} isActive={isActive}>
                                {item}
                            </TickerItem>
                        );
                    })}
                </TickerItemsWrapper>
            </TickerContent>
        </TickerContainer>
    );
};

export default TickerSlider;