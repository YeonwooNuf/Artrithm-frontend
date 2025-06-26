import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import AdminDrawer from "../Sidebar/AdminDrawer";

const Header = ({ user, setUser }) => {
  const [openExhibition, setOpenExhibition] = useState(false);
  const [openArtwork, setOpenArtwork] = useState(false);
  const navigate = useNavigate();

  const exhibitionTimer = useRef(null);
  const artworkTimer = useRef(null);

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY > lastScrollY.current) {
        setIsVisible(false); // 아래로 스크롤 → 숨김
      } else {
        setIsVisible(true); // 위로 스크롤 → 보임
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    setUser(null);
    navigate("/");
  };

  const handleExhibitionEnter = () => {
    clearTimeout(exhibitionTimer.current);
    setOpenExhibition(true);
  };

  const handleExhibitionLeave = () => {
    exhibitionTimer.current = setTimeout(() => setOpenExhibition(false), 200);
  };

  const handleArtworkEnter = () => {
    clearTimeout(artworkTimer.current);
    setOpenArtwork(true);
  };

  const handleArtworkLeave = () => {
    artworkTimer.current = setTimeout(() => setOpenArtwork(false), 200);
  };

  return (
    <header className={`header ${isVisible ? "visible" : "hidden"}`}>
      <div className="header_logo">
        <h1>
          Artrithm <img src="/logo.png" alt="logo" className="logo-icon" />
        </h1>
      </div>

      <nav className="header__nav">
        <ul>
          <li>
            <Link to="/">홈</Link>
          </li>
          <li
            className="nav-dropdown"
            onMouseEnter={handleExhibitionEnter}
            onMouseLeave={handleExhibitionLeave}
          >
            <span className="dropdown_title">전시</span>
            {openExhibition && (
              <ul
                className="dropdown__menu"
                onMouseEnter={handleExhibitionEnter}
                onMouseLeave={handleExhibitionLeave}
              >
                <li>
                  <Link to="/upload">개설하기</Link>
                </li>
                <li>
                  <Link to="/view">감상하기</Link>
                </li>
              </ul>
            )}
          </li>

          <li
            className="nav-dropdown"
            onMouseEnter={handleArtworkEnter}
            onMouseLeave={handleArtworkLeave}
          >
            <span className="dropdown_title">작품 거래</span>
            {openArtwork && (
              <ul
                className="dropdown__menu"
                onMouseEnter={handleArtworkEnter}
                onMouseLeave={handleArtworkLeave}
              >
                <li>
                  <Link to="/fixed-price">지정가 구매</Link>
                </li>
                <li>
                  <Link to="/auction">진행중인 경매</Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/artist">작가</Link>
          </li>
          <li>
            <Link to="/intro">소개</Link>
          </li>

          {user ? (
            <li>
              <span onClick={handleLogout} className="logout-link">
                로그아웃
              </span>
            </li>
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
          <li>
            <Link to="/cart">🛒</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
