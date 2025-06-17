import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LikedExhibitionsModal.css";

export default function LikedExhibitionsModal({ userId, onClose }) {
  const [likedList, setLikedList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/user/likes`, { params: { userId } })
      .then((res) => setLikedList(res.data))
      .catch(console.error);
  }, [userId]);

  return (
    <div className="likes-modal-overlay" onClick={onClose}>
      <div className="likes-modal" onClick={(e) => e.stopPropagation()}>
        <div className="likes-modal-header">
          <h2>관심 전시 목록</h2>
          <button className="likes-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="likes-modal-body">
          {likedList.length === 0 ? (
            <p className="likes-empty">아직 관심 등록한 전시가 없습니다.</p>
          ) : (
            <ul className="likes-list">
              {likedList.map((ex) => (
                <li
                  key={ex.id}
                  className="likes-item"
                  onClick={() =>
                    navigate(`/exhibitions/${ex.id}`, {
                      state: { works: ex.artworks, theme: ex.theme },
                    })
                  }
                >
                  <img src={ex.thumbnailUrl} alt={ex.title} />
                  <div className="likes-info">
                    <h4>{ex.title}</h4>
                    <p>{ex.authorNickname}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
