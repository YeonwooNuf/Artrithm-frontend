import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ExhibitionMasonry.css";

const ExhibitionMasonry = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const trackRef = useRef(null);

  const scrollBy = (direction) => {
    const scrollAmount = 267; // 카드 너비 + gap
    if (trackRef.current) {
      trackRef.current.scrollBy({
        left: scrollAmount * direction,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    axios
      .get("/api/exhibitions/subscribed")
      .then((res) => {
        const shuffled = [...res.data].sort(() => Math.random() - 0.5); // 랜덤 셔플
        setExhibitions(shuffled);
      })
      .catch((err) => console.error("전시 목록 불러오기 실패", err));
  }, []);

  return (
    <section className="exhibition-slider">
      <h2 className="slider-title">Recommended Exhibitions</h2>
      <div className="slider-wrapper">
        <button className="arrow-prev" onClick={() => scrollBy(-1)}>
          &lt;
        </button>
        <div className="slider-track" ref={trackRef}>
          {exhibitions.map((exh, idx) => (
            <Link
              to={`/exhibitions/${exh.id}`}
              className="slider-card"
              key={exh.id}
            >
              <div
                className={`card-inner ${idx % 2 === 0 ? "normal" : "reverse"}`}
              >
                <div className="thumb">
                  <img src={exh.thumbnailUrl} alt={exh.title} loading="lazy" />
                </div>
                <div className="text">
                  <h3>{exh.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <button className="arrow-next" onClick={() => scrollBy(1)}>
          &gt;
        </button>
      </div>
    </section>
  );
};

export default ExhibitionMasonry;
