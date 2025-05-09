// src/components/about/About.js
import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
    // 회사 연혁 데이터
    const history = [
        { year: 2023, event: 'AiHairSolution 프로젝트 시작' },
        { year: 2023, event: '초기 AI 헤어 분석 알고리즘 개발' },
        { year: 2024, event: '첫 번째 AI 헤어 솔루션 서비스 프로토타입 개발' },
        { year: 2024, event: 'Firebase를 활용한 데이터베이스 구축' },
        { year: 2025, event: 'React 기반 웹 애플리케이션 출시' },
        { year: 2025, event: '헤어 스타일 가상 체험 기능 구현 (ComfyUI 활용)' }
    ];

    return (
        <div className="about-container">
            <section className="hero-section">
                <div className="hero-content">
                    <h1>AI로 변화하는 헤어 스타일링의 미래</h1>
                    <p>인공지능으로 당신에게 딱 맞는 완벽한 헤어 스타일을 찾아드립니다</p>
                </div>
            </section>

            <section className="about-section">
                <div className="about-grid">
                    <div className="about-text">
                        <h2>AiHairSolution 소개</h2>
                        <p><strong>헤어 디자이너에서 AI 개발자로.</strong> 5년간의 미용 현장 경험을 바탕으로, 이제는 기술로 헤어 스타일링의 혁신을 만들어갑니다.</p>
                        <p>저는 최재원, 미용 디자이너로서의 전문성과 IT 풀스택 개발 역량을 결합해 AI 헤어 솔루션을 개발 중인 취업 준비생입니다. 현장에서 직접 보고 느낀 고객의 니즈와 개발자로서의 기술력을 통해, 누구나 쉽게 자신에게 어울리는 헤어스타일을 찾을 수 있는 서비스를 만들고 있습니다.</p>
                    </div>
                    <div className="about-image">
                        <img src="https://via.placeholder.com/500x300" alt="AiHairSolution 소개" />
                    </div>
                </div>
            </section>

            <section className="vision-section">
                <h2>전문성과 가치</h2>
                <div className="vision-grid">
                    <div className="vision-card">
                        <div className="vision-icon">🎨</div>
                        <h3>미적 감각</h3>
                        <p>5년간의 헤어 디자이너 경험을 통해 얻은 미적 감각으로 시각적으로 아름다운 솔루션을 개발합니다.</p>
                    </div>
                    <div className="vision-card">
                        <div className="vision-icon">👂</div>
                        <h3>고객 니즈 파악</h3>
                        <p>수많은 고객 상담 경험을 바탕으로, 사용자가 진정으로 원하는 것이 무엇인지 정확히 이해합니다.</p>
                    </div>
                    <div className="vision-card">
                        <div className="vision-icon">✅</div>
                        <h3>정확성과 성실함</h3>
                        <p>디테일에 집중하는 정확성과 꾸준히 목표를 향해 나아가는 성실함으로 프로젝트를 완성합니다.</p>
                    </div>
                    <div className="vision-card">
                        <div className="vision-icon">🚀</div>
                        <h3>실행력과 자신감</h3>
                        <p>아이디어를 구체적인 결과물로 빠르게 전환하는 실행력과 새로운 도전에 대한 자신감을 갖추고 있습니다.</p>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <h2>핵심 기술 및 서비스</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <h3>ComfyUI 기반 AI 이미지 생성</h3>
                        <p>ComfyUI를 활용한 맞춤형 AI 헤어스타일 시뮬레이션으로 스타일 변화를 미리 체험할 수 있습니다.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Firebase 데이터 관리</h3>
                        <p>Firebase를 통한 안정적인 데이터베이스 구축으로 사용자 정보와 스타일 데이터를 효율적으로 관리합니다.</p>
                    </div>
                    <div className="feature-item">
                        <h3>React 기반 반응형 웹</h3>
                        <p>React를 활용한 모던하고 사용자 친화적인 UI/UX로 어떤 디바이스에서도 최적의 경험을 제공합니다.</p>
                    </div>
                    <div className="feature-item">
                        <h3>풀스택 개발 역량</h3>
                        <p>프론트엔드부터 백엔드까지 직접 구현한 완전한 웹 애플리케이션으로 끊김 없는 서비스 경험을 제공합니다.</p>
                    </div>
                </div>
            </section>

            <section className="team-section">
                <h2>개발자 소개</h2>
                <div className="team-grid single-member" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="team-member" style={{ padding: '30px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 5px rgba(0,0,0,0.05)' }}>
                        <div className="member-image" style={{
                            width: '200px',
                            height: '200px',
                            margin: '0 auto 20px'
                        }}>
                            <img
                                src="/images/profile.jpg"
                                alt="최재원"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '100%',
                                    borderRadius: '50%'
                                }}
                            />
                        </div>
                        <h3>최재원</h3>
                        <p className="member-position">풀스택 개발자 / 전 헤어 디자이너</p>
                        <p className="member-bio">
                            5년간의 미용 경력을 가진 후, 기술을 통해 더 많은 사람들에게 가치를 전달하고자 IT 개발자로 전환했습니다. 현재 ComfyUI, Firebase, React를 활용한 AI 헤어 솔루션 사이드 프로젝트를 단독으로 개발 중이며, 미용 경험에서 얻은 인사이트와 기술적 역량을 결합해 혁신적인 서비스를 만들어가고 있습니다.
                        </p>
                        <p className="member-contact">연락처: 010-3161-4032</p>
                    </div>
                </div>
            </section>

            <section className="history-section">
                <h2>프로젝트 타임라인</h2>
                <div className="timeline">
                    {history.map((item, index) => (
                        <div key={index} className="timeline-item">
                            <div className="timeline-dot"></div>
                            <div className="timeline-content">
                                <h3>{item.year}</h3>
                                <p>{item.event}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="explore-section">
                <h2>더 알아보기</h2>
                <div className="explore-grid">
                    <Link to="/about/reviews" className="explore-card">
                        <div className="explore-icon">⭐</div>
                        <h3>사용자 후기</h3>
                        <p>AiHairSolution을 이용한 사용자들의 생생한 후기를 확인해보세요.</p>
                    </Link>
                    <Link to="/about/lookbook" className="explore-card">
                        <div className="explore-icon">📷</div>
                        <h3>스타일 룩북</h3>
                        <p>다양한 헤어 스타일 컬렉션을 확인하고 영감을 얻어보세요.</p>
                    </Link>
                    <Link to="/about/manual" className="explore-card">
                        <div className="explore-icon">📖</div>
                        <h3>사용 설명서</h3>
                        <p>AiHairSolution을 쉽고 효과적으로 활용하는 방법을 알아보세요.</p>
                    </Link>
                    <Link to="/about/faq" className="explore-card">
                        <div className="explore-icon">❓</div>
                        <h3>자주 묻는 질문</h3>
                        <p>서비스 이용 관련 자주 묻는 질문들을 확인해보세요.</p>
                    </Link>
                </div>
            </section>

            <section className="contact-cta">
                <h2>프로젝트에 관심이 있으신가요?</h2>
                <p>AiHairSolution 프로젝트에 대해 더 알고 싶거나 협업 제안이 있으시면 언제든지 연락주세요.</p>
                <button className="contact-button">연락하기</button>
            </section>
        </div>
    );
};

export default About;