import React from "react";
import { Link } from "react-router-dom";
import "./ExhibitionFeed.css";
import { useState } from "react";

// const exhibition = {
//   title: "짱구",
//   thumbnail: "/exhibition1.png",
//   views: 0,
//   likes: 0,
//   path: "/exhibitions/Gallery3D",
//   description:
//     "이 전시는 빛과 색의 조화를 통해 현대 예술의 새로운 해석을 시도합니다. 작품 하나하나에 담긴 작가의 감정을 느껴보세요. 짱구 엉덩이춤 볼래?",
// };

export default function ExhibitionFeed({ exhibition }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };
  if (!exhibition) return <p>전시 정보를 불러오는 중입니다...</p>;
  return (
    <div className="exhibition-card">
      <Link
        to={`/exhibitions/Gallery3D/${exhibition.id}`}
        state={{ works: exhibition.artworks, theme: exhibition.theme }}
        className="thumbnail-wrapper"
      >
        <img
          src={exhibition.thumbnailUrl}
          alt={exhibition.title}
          className="card-thumbnail"
        />
      </Link>
      <div className="card-content">
        <h2 className="card-title">{exhibition.title}</h2>
        <p className="card-desc">{exhibition.description}</p>
        <div className="card-meta">
          <span onClick={handleLike} style={{ cursor: "pointer" }}>
            {liked ? "❤️" : "🤍"} &nbsp; {likes}
          </span>
        </div>
      </div>
    </div>
  );
}
