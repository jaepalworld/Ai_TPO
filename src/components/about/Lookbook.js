// src/components/about/Lookbook.js
import React, { useState } from 'react';
import './Lookbook.css';

const Lookbook = () => {
    // 사용자 정보 (실제로는 인증 시스템에서 가져올 수 있음)
    const [currentUser, setCurrentUser] = useState({
        id: 1,
        username: '사용자123',
        profileImage: 'https://via.placeholder.com/50',
        isLoggedIn: true
    });

    // 카테고리 목록 설정
    const categories = ['전체', '숏컷', '미디엄', '롱', '펌', '컬러', '내 스타일'];
    const [activeCategory, setActiveCategory] = useState('전체');

    // 정렬 옵션
    const sortOptions = ['최신순', '인기순', '댓글 많은 순'];
    const [activeSort, setActiveSort] = useState('최신순');

    // 스타일 데이터 (실제로는 API에서 가져올 수 있습니다)
    const [styles, setStyles] = useState([
        {
            id: 1,
            userId: 2,
            username: '헤어마스터',
            userProfileImage: 'https://via.placeholder.com/50',
            title: '내추럴 레이어드 컷',
            category: '미디엄',
            description: '부드러운 레이어링으로 자연스러운 볼륨감을 살린 미디엄 길이 스타일입니다. 제 고객님께 시술한 작품입니다.',
            imageUrl: 'https://via.placeholder.com/300x400',
            likes: 120,
            comments: [
                { id: 1, userId: 3, username: '미미', content: '정말 예쁘네요! 저도 이런 스타일 하고 싶어요.', timestamp: '2시간 전' },
                { id: 2, userId: 4, username: '스타일러', content: '레이어드컷의 정석이네요! 어떤 제품을 사용하셨나요?', timestamp: '1시간 전' }
            ],
            timestamp: '오늘',
            isLiked: false
        },
        {
            id: 2,
            userId: 5,
            username: '헤어스타일리스트',
            userProfileImage: 'https://via.placeholder.com/50',
            title: '에어 컷',
            category: '숏컷',
            description: '가볍고 시원한 느낌의 에어 컷으로 관리가 편한 스타일입니다. 여름에 특히 추천해요!',
            imageUrl: 'https://via.placeholder.com/300x400',
            likes: 95,
            comments: [
                { id: 3, userId: 6, username: '여름이좋아', content: '시원해 보이네요! 저도 이번 여름에 도전해볼까 합니다.', timestamp: '3시간 전' }
            ],
            timestamp: '어제',
            isLiked: true
        },
        {
            id: 3,
            userId: 7,
            username: '웨이브마스터',
            userProfileImage: 'https://via.placeholder.com/50',
            title: '웨이브 롱 스타일',
            category: '롱',
            description: '자연스러운 웨이브가 있는 롱 헤어로 여성스러운 매력을 강조합니다. 디지털 펌으로 완성했어요.',
            imageUrl: 'https://via.placeholder.com/300x400',
            likes: 145,
            comments: [
                { id: 4, userId: 8, username: '롱헤어사랑', content: '너무 예뻐요! 롱헤어의 정석이네요.', timestamp: '5시간 전' },
                { id: 5, userId: 9, username: '펌고민중', content: '디지털 펌 유지기간은 얼마나 되나요?', timestamp: '4시간 전' },
                { id: 6, userId: 7, username: '웨이브마스터', content: '보통 3-4개월 정도 유지됩니다!', timestamp: '3시간 전' }
            ],
            timestamp: '3일 전',
            isLiked: false
        },
        {
            id: 4,
            userId: 10,
            username: '펌전문가',
            userProfileImage: 'https://via.placeholder.com/50',
            title: 'C컬 펌',
            category: '펌',
            description: 'C자형 컬이 자연스럽게 흐르는 펌 스타일로 부드러운 이미지를 연출합니다.',
            imageUrl: 'https://via.placeholder.com/300x400',
            likes: 88,
            comments: [],
            timestamp: '일주일 전',
            isLiked: false
        },
        {
            id: 5,
            userId: 11,
            username: '컬러리스트',
            userProfileImage: 'https://via.placeholder.com/50',
            title: '애쉬 브라운 발레아쥬',
            category: '컬러',
            description: '자연스러운 애쉬 브라운 톤의 발레아쥬 염색으로 세련된 느낌을 줍니다.',
            imageUrl: 'https://via.placeholder.com/300x400',
            likes: 110,
            comments: [],
            timestamp: '2주일 전',
            isLiked: false
        },
        {
            id: 6,
            userId: 12,
            username: '스타일리스트',
            userProfileImage: 'https://via.placeholder.com/50',
            title: '바디 레이어드 컷',
            category: '롱',
            description: '풍성한 볼륨을 살린 바디 레이어드 컷으로 세련된 스타일을 연출합니다.',
            imageUrl: 'https://via.placeholder.com/300x400',
            likes: 132,
            comments: [],
            timestamp: '3주일 전',
            isLiked: false
        },
    ]);

    // 새 스타일 작성 모달 상태
    const [showNewStyleModal, setShowNewStyleModal] = useState(false);
    const [newStyle, setNewStyle] = useState({
        title: '',
        category: '미디엄',
        description: '',
        image: null
    });

    // 새 댓글 입력 상태
    const [commentInputs, setCommentInputs] = useState({});

    // 카테고리 및 정렬에 따라 필터링 및 정렬
    const filteredStyles = activeCategory === '전체'
        ? [...styles]
        : activeCategory === '내 스타일'
            ? styles.filter(style => style.userId === currentUser.id)
            : styles.filter(style => style.category === activeCategory);

    // 정렬 적용
    const sortedStyles = [...filteredStyles].sort((a, b) => {
        if (activeSort === '최신순') {
            return -1; // 실제로는 날짜를 비교해야 함
        } else if (activeSort === '인기순') {
            return b.likes - a.likes;
        } else if (activeSort === '댓글 많은 순') {
            return b.comments.length - a.comments.length;
        }
        return 0;
    });

    // 좋아요 기능
    const handleLike = (styleId) => {
        setStyles(styles.map(style => {
            if (style.id === styleId) {
                const newLiked = !style.isLiked;
                return {
                    ...style,
                    likes: newLiked ? style.likes + 1 : style.likes - 1,
                    isLiked: newLiked
                };
            }
            return style;
        }));
    };

    // 댓글 입력 처리
    const handleCommentInputChange = (styleId, value) => {
        setCommentInputs({
            ...commentInputs,
            [styleId]: value
        });
    };

    // 댓글 추가
    const handleAddComment = (styleId) => {
        if (!commentInputs[styleId] || commentInputs[styleId].trim() === '') return;

        const newComment = {
            id: Date.now(),
            userId: currentUser.id,
            username: currentUser.username,
            content: commentInputs[styleId],
            timestamp: '방금 전'
        };

        setStyles(styles.map(style => {
            if (style.id === styleId) {
                return {
                    ...style,
                    comments: [...style.comments, newComment]
                };
            }
            return style;
        }));

        // 댓글 입력 필드 초기화
        setCommentInputs({
            ...commentInputs,
            [styleId]: ''
        });
    };

    // 새 스타일 입력 처리
    const handleNewStyleChange = (e) => {
        const { name, value } = e.target;
        setNewStyle({
            ...newStyle,
            [name]: value
        });
    };

    // 이미지 업로드 처리
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 실제로는 파일 업로드 처리를 해야 함
            setNewStyle({
                ...newStyle,
                image: URL.createObjectURL(file)
            });
        }
    };

    // 새 스타일 제출
    const handleSubmitNewStyle = (e) => {
        e.preventDefault();

        // 폼 검증
        if (!newStyle.title || !newStyle.description || !newStyle.image) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        // 새 스타일 객체 생성
        const styleObject = {
            id: Date.now(),
            userId: currentUser.id,
            username: currentUser.username,
            userProfileImage: currentUser.profileImage,
            title: newStyle.title,
            category: newStyle.category,
            description: newStyle.description,
            imageUrl: newStyle.image,
            likes: 0,
            comments: [],
            timestamp: '방금 전',
            isLiked: false
        };

        // 스타일 목록에 추가
        setStyles([styleObject, ...styles]);

        // 모달 닫기 및 폼 초기화
        setShowNewStyleModal(false);
        setNewStyle({
            title: '',
            category: '미디엄',
            description: '',
            image: null
        });
    };

    return (
        <div className="lookbook-container">
            <header className="lookbook-header">
                <h1>스타일 룩북</h1>
                <p className="lookbook-intro">
                    AiHairSolution에서 추천하는 다양한 헤어스타일을 확인하고 영감을 얻어보세요.
                    여러분의 헤어스타일도 함께 공유해보세요!
                </p>

                <div className="lookbook-controls">
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

                    <div className="sort-controls">
                        <label>정렬: </label>
                        <select
                            value={activeSort}
                            onChange={(e) => setActiveSort(e.target.value)}
                        >
                            {sortOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {currentUser.isLoggedIn && (
                    <button
                        className="new-style-button"
                        onClick={() => setShowNewStyleModal(true)}
                    >
                        내 스타일 공유하기
                    </button>
                )}
            </header>

            <div className="lookbook-grid">
                {sortedStyles.length === 0 ? (
                    <div className="no-styles-message">
                        <p>해당 카테고리에 스타일이 없습니다.</p>
                        <button
                            className="new-style-button"
                            onClick={() => setShowNewStyleModal(true)}
                        >
                            첫 스타일 공유하기
                        </button>
                    </div>
                ) : (
                    sortedStyles.map(style => (
                        <div key={style.id} className="style-card">
                            <div className="style-header">
                                <div className="style-user">
                                    <img
                                        src={style.userProfileImage}
                                        alt={`${style.username}의 프로필`}
                                        className="user-profile-image"
                                    />
                                    <div>
                                        <h3 className="user-name">{style.username}</h3>
                                        <span className="style-timestamp">{style.timestamp}</span>
                                    </div>
                                </div>
                                <span className="style-category">{style.category}</span>
                            </div>

                            <h3 className="style-title">{style.title}</h3>

                            <div className="style-image">
                                <img src={style.imageUrl} alt={style.title} />
                            </div>

                            <p className="style-description">{style.description}</p>

                            <div className="style-actions">
                                <button
                                    className={`like-button ${style.isLiked ? 'liked' : ''}`}
                                    onClick={() => handleLike(style.id)}
                                >
                                    {style.isLiked ? '♥' : '♡'} {style.likes}
                                </button>
                                <button className="share-button">공유하기</button>
                                <button className="try-button">AI 시뮬레이션 해보기</button>
                            </div>

                            <div className="style-comments">
                                <h4>댓글 {style.comments.length}개</h4>

                                {style.comments.map(comment => (
                                    <div key={comment.id} className="comment">
                                        <span className="comment-username">{comment.username}</span>
                                        <p className="comment-content">{comment.content}</p>
                                        <span className="comment-timestamp">{comment.timestamp}</span>
                                    </div>
                                ))}

                                {currentUser.isLoggedIn && (
                                    <div className="comment-input-container">
                                        <input
                                            type="text"
                                            placeholder="댓글을 입력하세요..."
                                            value={commentInputs[style.id] || ''}
                                            onChange={(e) => handleCommentInputChange(style.id, e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddComment(style.id)}
                                        />
                                        <button onClick={() => handleAddComment(style.id)}>게시</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 새 스타일 작성 모달 */}
            {showNewStyleModal && (
                <div className="modal-overlay">
                    <div className="new-style-modal">
                        <h2>내 스타일 공유하기</h2>
                        <form onSubmit={handleSubmitNewStyle}>
                            <div className="form-group">
                                <label htmlFor="title">스타일 이름</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newStyle.title}
                                    onChange={handleNewStyleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="category">카테고리</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={newStyle.category}
                                    onChange={handleNewStyleChange}
                                >
                                    {categories.filter(c => c !== '전체' && c !== '내 스타일').map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">설명</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newStyle.description}
                                    onChange={handleNewStyleChange}
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="image">이미지</label>
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    required
                                />
                                {newStyle.image && (
                                    <div className="image-preview">
                                        <img src={newStyle.image} alt="미리보기" />
                                    </div>
                                )}
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowNewStyleModal(false)}>취소</button>
                                <button type="submit">게시하기</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="lookbook-cta">
                <h2>나에게 어울리는 헤어스타일이 궁금하신가요?</h2>
                <p>AiHairSolution의 AI 시스템이 당신의 얼굴형, 헤어 상태, 스타일 취향을 분석하여 최적의 헤어스타일을 추천해 드립니다.</p>
                <button className="cta-button">AI 헤어 추천 받기</button>
            </div>
        </div>
    );
};

export default Lookbook;