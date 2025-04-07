import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__left">
        <h3>Artrithm</h3>
      </div>

      <div className="footer__center">
        <a href="/">홈</a>
        <a href="/view">전시회</a>
        <a href="/ask">문의하기</a>
        <a href="/intro">소개</a>
      </div>

      <div className="footer__right">
        <p>© 2025 Artrithm. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
