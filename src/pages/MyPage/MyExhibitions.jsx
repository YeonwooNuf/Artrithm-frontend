import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyExhibitions.css";

export default function MyExhibitions({ user }) {
  const [exhibitions, setExhibitions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;
    axios.get(`/api/exhibitions?authorId=${user.id}`)
      .then((res) => setExhibitions(res.data))
      .catch((err) => console.error("내 전시 불러오기 실패", err));
  }, [user]);

  const handleEdit = (id) => navigate(`/exhibitions/edit/${id}`);
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`/api/exhibitions/${id}`);
      setExhibitions((prev) => prev.filter((ex) => ex.id !== id));
    } catch (err) {
      console.error("삭제 실패", err);
      alert("삭제 중 오류 발생");
    }
  };

  return (
    <div className="my-exhibitions">
      <h3>내가 개설한 전시</h3>
      {exhibitions.length === 0 ? (
        <p>개설한 전시가 없습니다.</p>
      ) : (
        <ul>
          {exhibitions.map((ex) => (
            <li key={ex.id} className="exhibition-item">
              <strong>{ex.title}</strong>
              <span> / {ex.theme}</span>
              <button onClick={() => handleEdit(ex.id)}>수정</button>
              <button onClick={() => handleDelete(ex.id)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
