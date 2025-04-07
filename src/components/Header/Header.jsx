import React, { useState } from "react";
import "./Header.css";

const Header = () => {
  const [openExhibition, setOpenExhibition] = useState(false);
  const [openArtwork, setOpenArtwork] = useState(false);
  return (
    <header className="header">
      <div className="header__logo">
        <h1>
          Artrithm
          <img src="/logo.png" alt="logo" className="logo-icon" />
        </h1>
      </div>
      <nav className="header__nav">
        <ul>
          <li>
            <a href="/">홈</a>
          </li>

          <li
            className="dropdown"
            onMouseEnter={() => setOpenExhibition(true)}
            onMouseLeave={() => setOpenExhibition(false)}
          >
            <span className="dropdown__title">3D 전시회</span>

            {openExhibition && (
              <ul className="dropdown__menu">
                <li>
                  <a href="/create">개설하기</a>
                </li>
                <li>
                  <a href="/view">감상하기</a>
                </li>
              </ul>
            )}
          </li>

          <li
            className="dropdown"
            onMouseEnter={() => setOpenArtwork(true)}
            onMouseLeave={() => setOpenArtwork(false)}
          >
            <span className="dropdown__title">작품</span>

            {openArtwork && (
              <ul className="dropdown__menu">
                <li>
                  <a href="/fixed-price">지정가 구매</a>
                </li>
                <li>
                  <a href="/auctions">진행중인 경매</a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <a href="/artist">작가</a>
          </li>
          <li>
            <a href="/intro">소개</a>
          </li>
          <li>
            <a href="/login">로그인</a>
          </li>
          <li>
            <a href="/register">회원가입</a>
          </li>
          <li>
            <a href="/mypage">마이페이지</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
