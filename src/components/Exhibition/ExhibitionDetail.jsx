import React from "react";
import "./ExhibitionDetail.css";

const keywords = ["빛", "감성", "추상", "자연", "몽환", "몰입"];

const getRandomColor = () => {
  const palette = ["#e8d9c4", "#d6c1b1", "#d4cab3", "#c4b4a2", "#eee2d2"];
  return palette[Math.floor(Math.random() * palette.length)];
};

export default function ExhibitionDetail() {
  return (
    <div className="detail-container">
      <div className="detail-image-wrapper">
        <img src="/exhibition2.png" alt="Exhibition" className="detail-image" />
      </div>
      <div className="keyword-box">
        <h3 className="keyword-title">AI Generated Keywords</h3>
        <div className="keywords">
          {keywords.map((word, idx) => (
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

      <div></div>
    </div>
  );
}
