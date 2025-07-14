import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ExhibitionFeed.css";

export default function ExhibitionFeed({ exhibition, userId }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false); // 💖 하트 오버레이 상태

  useEffect(() => {
    if (userId && exhibition?.id) {
      axios
        .get(`/api/user/likes/${exhibition.id}`, { params: { userId } })
        .then((res) => {
          setLiked(res.data.liked);
          setLoading(false);
        })
        .catch((err) => {
          console.error("좋아요 여부 불러오기 실패:", err);
          setLoading(false);
        });
    }
  }, [userId, exhibition?.id]);

  const handleLike = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!userId || !exhibition?.id) return;

    try {
      if (liked) {
        await axios.delete(`/api/user/likes/${exhibition.id}`, {
          params: { userId },
        });
      } else {
        await axios.post(`/api/user/likes/${exhibition.id}`, null, {
          params: { userId },
        });

        // 🤍 하트 효과 표시
        setShowOverlay(true);
        setTimeout(() => setShowOverlay(false), 3000);
      }

      setLiked(!liked);
    } catch (err) {
      console.error("좋아요 처리 중 오류:", err);
    }
  };

  if (!exhibition || loading) return <p>전시 정보를 불러오는 중입니다...</p>;

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
            {liked ? "❤️ 관심 있음" : "🤍 관심 없음"}
          </span>
          <span className="view-count">
            조회수 : {exhibition.viewCount?.toLocaleString()}회
          </span>
        </div>
      </div>

      {/* 💖 하트 팝업 오버레이 */}
      {showOverlay && (
        <div className="card-overlay">
          <div className="heart-pop">🤍</div>
        </div>
      )}
    </div>
  );
}
