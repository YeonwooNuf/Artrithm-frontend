import React from "react";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import "./ExhibitionMasonry.css";

const exhibitionData = [
  { id: 1, title: "봄의 감각", thumbnail: "/exhibition1.png" },
  { id: 2, title: "AI 아트쇼", thumbnail: "/exhibition2.png" },
  { id: 3, title: "인체의 재해석", thumbnail: "/exhibition3.png" },
  { id: 4, title: "빛의 탐험", thumbnail: "/exhibition2.png" },
  { id: 5, title: "색의 향연", thumbnail: "/exhibition3.png" },
];

const breakpointColumnsObj = {
  default: 3,
  1100: 2,
  700: 1,
};

const ExhibitionMasonry = () => {
  return (
    <section className="exhibition-masonry">
      <h2 className="masonry-title">현재 진행 중인 전시</h2>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        {exhibitionData.map((exhibition) => (
          <Link
            to={`/exhibitions/${exhibition.id}`}
            className="masonry-item"
            key={exhibition.id}
          >
            <div className="image-box">
              <img src={exhibition.thumbnail} alt={exhibition.title} />
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
