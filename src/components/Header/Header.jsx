import React, { useState } from "react";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ user, setUser }) => {
  const [openExhibition, setOpenExhibition] = useState(false);
  const [openArtwork, setOpenArtwork] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setUser(null);
    navigate("/");
  };

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
            <Link to="/">홈</Link>
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
                  <Link to="/upload">개설하기</Link>
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
                  <a href="/auction">진행중인 경매</a>
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

          {user ? (
            <>
              <li>{user.nickname}님, 환영합니다!</li>
              <li>
                <button className="logout-btn" onClick={handleLogout}>
                  로그아웃
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">로그인</Link>
              </li>
              <li>
                <Link to="/signup">회원가입</Link>
              </li>
            </>
          )}

          <li>
            <Link to="/mypage">마이페이지</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
