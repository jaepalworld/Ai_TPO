// src/components/about/Lookbook.js
import React, { useState } from 'react';
import './Lookbook.css';

const Lookbook = () => {
    // 카테고리 목록 설정
    const categories = ['전체', '숏컷', '미디엄', '롱', '펌', '컬러'];
    const [activeCategory, setActiveCategory] = useState('전체');

    // 헤어스타일 데이터 (실제로는 API에서 가져올 수 있습니다)
    const [styles, setStyles] = useState([
        {
            id: 1,
            title: '내추럴 레이어드 컷',
            category: '미디엄',
            description: '부드러운 레이어링으로 자연스러운 볼륨감을 살린 미디엄 길이 스타일입니다.',
            imageUrl: 'https://via.placeholder.com/300x400',
            likes: 120
        },
        {
            id: 2,
            title: '에어 컷',
            category: '숏컷',
            description: '가볍고 시원한 느낌의 에어 컷으로 관리가 편한 스타일입니다.',
            imageUrl: 'https://via.placeholder.com/300x400',
            likes: 95
        },
        {
            id: 3,
            title: '웨이브 롱 스타일',
            category: '롱',
            description: '자연스러운 웨이브가 있는 롱 헤어로 여성스러운 매력을 강조합니다.',
            imageUrl: 'https://via.placeholder.com/300x400',
            likes: 145
        },
        {
            id: 4,
            title: 'C컬 펌',
            category: '펌',
            description: 'C자형 컬이 자연스럽게 흐르는 펌 스타일로 부드러운 이미지를 연출합니다.',
            imageUrl: 'https://via.placeholder.com/300x400',
            likes: 88
        },
        {
            id: 5,
            title: '애쉬 브라운 발레아쥬',
            category: '컬러',
            description: '자연스러운 애쉬 브라운 톤의 발레아쥬 염색으로 세련된 느낌을 줍니다.',
            imageUrl: 'https://via.placeholder.com/300x400',
            likes: 110
        },
        {
            id: 6,
            title: '바디 레이어드 컷',
            category: '롱',
            description: '풍성한 볼륨을 살린 바디 레이어드 컷으로 세련된 스타일을 연출합니다.',
            imageUrl: 'https://via.placeholder.com/300x400',
            likes: 132
        },
    ]);

    // 카테고리에 따라 필터링
    const filteredStyles = activeCategory === '전체'
        ? styles
        : styles.filter(style => style.category === activeCategory);

    // 좋아요 기능
    const handleLike = (id) => {
        setStyles(styles.map(style =>
            style.id === id ? { ...style, likes: style.likes + 1 } : style
        ));
    };

    return (
        <div className="lookbook-container">
            <h1>스타일 룩북</h1>
            <p className="lookbook-intro">
                AiHairSolution에서 추천하는 다양한 헤어스타일을 확인하고 영감을 얻어보세요.
            </p>

            <div className="category-tabs">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="lookbook-grid">
                {filteredStyles.map(style => (
                    <div key={style.id} className="style-card">
                        <div className="style-image">
                            <img src={style.imageUrl} alt={style.title} />
                        </div>
                        <div className="style-info">
                            <h3 className="style-title">{style.title}</h3>
                            <span className="style-category">{style.category}</span>
                            <p className="style-description">{style.description}</p>
                            <div className="style-actions">
                                <button
                                    className="like-button"
                                    onClick={() => handleLike(style.id)}
                                >
                                    ♥ {style.likes}
                                </button>
                                <button className="try-button">AI 시뮬레이션 해보기</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="lookbook-cta">
                <h2>나에게 어울리는 헤어스타일이 궁금하신가요?</h2>
                <p>AiHairSolution의 AI 시스템이 당신의 얼굴형, 헤어 상태, 스타일 취향을 분석하여 최적의 헤어스타일을 추천해 드립니다.</p>
                <button className="cta-button">AI 헤어 추천 받기</button>
            </div>
        </div>
    );
};

export default Lookbook;