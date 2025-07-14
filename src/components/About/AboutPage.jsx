import React from "react";
import "./AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-userview">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-text">
          <h1 className="main-title">예술을 더 가깝고, 더 깊이 있게</h1>
          <p className="main-subtitle">
            누구나 전시하고 소통하며 거래할 수 있는 새로운 예술의 장, Artrithm
          </p>
        </div>
      </section>

      {/* 역할 소개 */}
      <section className="experience-section">
        <h2 className="section-title">Artrithm에서 가능한 역할들</h2>
        <ul className="experience-list">
          <li>
            <strong>전시 감상자</strong>: 3D 전시관에서 작품을 감상하고, 직접 질문하며 몰입형 경험을 누릴 수 있습니다.
          </li>
          <li>
            <strong>예술 애호가</strong>: 작가와의 실시간 대화를 통해 작품의 배경과 의도를 직접 들어볼 수 있습니다.
          </li>
          <li>
            <strong>작가</strong>: 자신만의 전시를 기획하고, 관람자와 교류하며 작품의 가치를 넓힐 수 있습니다.
          </li>
          <li>
            <strong>수집가</strong>: 지정가 혹은 경매를 통해 원하는 작품을 소장할 수 있습니다.
          </li>
        </ul>
      </section>

      {/* 서비스 특징 */}
      <section className="why-section">
        <h2 className="section-title">Artrithm의 차별점</h2>
        <div className="why-cards">
          <div className="why-card">
            <h3>경계를 넘는 예술 감상</h3>
            <p>어디서든 3D 전시관에서 실감나게 작품을 감상할 수 있습니다.</p>
          </div>
          <div className="why-card">
            <h3>작품에게 질문하다</h3>
            <p>AI 도슨트를 통해 작품에 대한 궁금증을 해소하세요.</p>
          </div>
          <div className="why-card">
            <h3>실시간 소통</h3>
            <p>작가와 직접 소통하며 작품의 비하인드를 들을 수 있습니다.</p>
          </div>
          <div className="why-card">
            <h3>AI 기반 전시 추천</h3>
            <p>취향에 꼭 맞는 전시를 추천해드립니다.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>지금, 예술의 주인공이 되어보세요</h2>
        <p>Artrithm은 관람자, 작가, 수집가 모두를 위한 예술 공간입니다.</p>
        <a href="/signup" className="cta-button">시작하기</a>
      </section>
    </div>
  );
}
