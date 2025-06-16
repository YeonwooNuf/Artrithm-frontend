import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ExhibitionMasonry.css";

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1,
};

const ExhibitionMasonry = () => {
  const [exhibitions, setExhibitions] = useState([]);

  useEffect(() => {
    axios
      .get("/api/exhibitions") // ✅ 모든 전시 불러오기
      .then((res) => setExhibitions(res.data))
      .catch((err) => console.error("전시 목록 불러오기 실패", err));
  }, []);

  return (
    <section className="exhibition-masonry">
      <h2 className="masonry-title">현재 진행 중인 전시</h2>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {exhibitions.map((exhibition) => (
          <Link
            to={`/exhibitions/${exhibition.id}`}
            className="masonry-item"
            key={exhibition.id}
          >
            <div className="image-box">
              <img
                src={exhibition.thumbnailUrl}
                alt={exhibition.title}
                loading="lazy"
              />
              <div className="image-overlay">
                <p>{exhibition.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </Masonry>
    </section>
  );
};

export default ExhibitionMasonry;
