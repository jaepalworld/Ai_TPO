// src/components/about/Reviews.js
import React, { useState, useEffect } from 'react';
import './Reviews.css';

const Reviews = () => {
    // 후기 데이터 (실제로는 API에서 가져올 수 있습니다)
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: '김민지',
            rating: 5,
            date: '2025-04-15',
            service: '퍼머넌트 볼륨',
            content: '처음 방문했는데 AI 추천으로 받은 헤어스타일이 정말 잘 어울려요! 디자이너 선생님이 친절하게 설명해주셔서 안심하고 맡길 수 있었습니다.',
            imageUrl: 'https://via.placeholder.com/150'
        },
        {
            id: 2,
            name: '이준호',
            rating: 4,
            date: '2025-04-10',
            service: '컬러링',
            content: 'AI가 추천해준 컬러가 처음엔 걱정됐지만 결과는 대만족! 친구들에게도 추천했어요.',
            imageUrl: 'https://via.placeholder.com/150'
        },
        {
            id: 3,
            name: '박소연',
            rating: 5,
            date: '2025-04-05',
            service: '커트 & 트리트먼트',
            content: '헤어 고민이 많았는데 AI 솔루션으로 정확히 내 얼굴형에 맞는 스타일을 찾았어요. 디자이너님의 실력도 최고였습니다!',
            imageUrl: 'https://via.placeholder.com/150'
        },
    ]);

    const [filter, setFilter] = useState('all');

    // 별점 표시 함수
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <span key={i} className={i < rating ? 'star filled' : 'star'}>
                    ★
                </span>
            );
        }
        return stars;
    };

    // 필터링된 후기 목록
    const filteredReviews = filter === 'all'
        ? reviews
        : reviews.filter(review => review.rating === parseInt(filter));

    return (
        <div className="reviews-container">
            <h1>고객 후기</h1>
            <p className="reviews-intro">
                AiHairSolution을 이용한 고객님들의 생생한 후기를 확인하세요.
            </p>

            <div className="filter-container">
                <span>필터: </span>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="filter-select"
                >
                    <option value="all">모든 후기</option>
                    <option value="5">★★★★★ 만</option>
                    <option value="4">★★★★ 만</option>
                    <option value="3">★★★ 만</option>
                </select>
            </div>

            <div className="reviews-grid">
                {filteredReviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <div className="review-image">
                                <img src={review.imageUrl} alt="후기 이미지" />
                            </div>
                            <div className="review-info">
                                <div className="review-name">{review.name}</div>
                                <div className="review-rating">{renderStars(review.rating)}</div>
                                <div className="review-date">{review.date}</div>
                                <div className="review-service">{review.service}</div>
                            </div>
                        </div>
                        <div className="review-content">{review.content}</div>
                    </div>
                ))}
            </div>

            <div className="write-review-container">
                <h2>후기 작성하기</h2>
                <p>AiHairSolution 서비스를 이용하셨나요? 여러분의 소중한 후기를 남겨주세요.</p>
                <button className="write-review-button">후기 작성하기</button>
            </div>
        </div>
    );
};

export default Reviews;