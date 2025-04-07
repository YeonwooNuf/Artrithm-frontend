import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HeroSection.css";

const HeroSection = () => {
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setAtTop(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className={`hero ${!atTop ? "blur-active" : ""}`}>
      <div className="hero__overlay"></div>

      <div className="hero__content-wrapper">
        {!atTop ? (
          <div className="hero__logo-container">
            <img src="/logo.png" alt="Artism Logo" className="hero__logo" />
          </div>
        ) : (
          <div className="hero__content">
            <h2 className="hero__title">Think Art, Speak Artrithm</h2>
            <p className="hero__subtitle">AI와 함께하는 온라인 전시 플랫폼</p>
            {/* 임시로 */}
            <Link to="/exhibitions/3">
              <button className="hero__button">전시 보러가기</button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
