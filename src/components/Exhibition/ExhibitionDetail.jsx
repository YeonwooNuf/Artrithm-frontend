import React from "react";
import "./ExhibitionDetail.css";

const getRandomColor = () => {
  const palette = ["#e8d9c4", "#d6c1b1", "#d4cab3", "#c4b4a2", "#eee2d2"];
  return palette[Math.floor(Math.random() * palette.length)];
};

export default function ExhibitionDetail({ exhibition }) {
  if (!exhibition) return null;
  return (
    <div className="detail-container">
      <div className="detail-image-wrapper">
        <img
          src={exhibition.thumbnail}
          alt="Exhibition"
          className="detail-image"
        />
      </div>
      <div className="keyword-box">
        <div className="keyword-background-dot"></div> {/* 문양 배경 */}
        <div className="keyword-background-dot-2"></div>
        <h3 className="keyword-title">AI Generated Keywords</h3>
        <div className="keywords">
          {exhibition.keywords.map((word, idx) => (
            <span
              key={idx}
              className="keyword"
              style={{ backgroundColor: getRandomColor() }}
            >
              #{word}
            </span>
          ))}
        </div>
      </div>

      <div className="artist">
        <div className="artist"></div>
      </div>
    </div>
  );
}
