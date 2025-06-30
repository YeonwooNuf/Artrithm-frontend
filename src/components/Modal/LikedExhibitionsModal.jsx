import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LikedExhibitionsModal.css";

export default function LikedExhibitionsModal({ userId }) {
  const [likedList, setLikedList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/user/likes`, { params: { userId } })
      .then((res) => setLikedList(res.data))
      .catch(console.error);
  }, [userId]);

  return (
    <div className="liked-page-container">
      <h2 className="liked-page-title">💖 관심 전시 목록</h2>

      {likedList.length === 0 ? (
        <p className="liked-empty">아직 관심 등록한 전시가 없습니다.</p>
      ) : (
        <ul className="liked-list">
          {likedList.map((ex) => (
            <li
              key={ex.id}
              className="liked-item"
              onClick={() =>
                navigate(`/exhibitions/${ex.id}`, {
                  state: { works: ex.artworks, theme: ex.theme },
                })
              }
            >
              <img
                src={ex.thumbnailUrl}
                alt={ex.title}
                className="liked-thumbnail"
              />
              <div className="liked-info">
                <h4>{ex.title}</h4>
                <p>{ex.authorNickname}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
