import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Guestbook.css";

export default function Guestbook({ exhibitionId }) {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [guestbook, setGuestbook] = useState([]);
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchGuestbook = async () => {
    const res = await axios.get(`/api/exhibitions/${exhibitionId}/guestbook`);
    setGuestbook(res.data);
  };

  useEffect(() => {
    fetchGuestbook();
  }, [exhibitionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await axios.post(`/api/exhibitions/${exhibitionId}/guestbook`, {
      userId: currentUser.id,
      content,
    });
    setContent("");
    fetchGuestbook();
  };

  const handleUpdate = async (id) => {
    await axios.put(`/api/exhibitions/${exhibitionId}/guestbook/${id}`, {
      userId: currentUser.id,
      content: editContent,
    });
    setEditId(null);
    setEditContent("");
    fetchGuestbook();
  };

  const handleDelete = async (id) => {
    await axios.delete(
      `/api/exhibitions/${exhibitionId}/guestbook/${id}?userId=${currentUser.id}`
    );
    fetchGuestbook();
  };

  return (
    <div className="guestbook-wrapper">
      {/* 배경 문양 */}
      <div className="guestbook-background-dot"></div>
      <div className="guestbook-background-dot-2"></div>

      <div className="guestbook-container">
        <h3 className="guestbook-title">📝 방명록</h3>

        <form onSubmit={handleSubmit} className="guestbook-form">
          <textarea
            className="guestbook-textarea"
            placeholder="응원의 메시지를 남겨주세요!"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className="guestbook-button" type="submit">
            작성하기
          </button>
        </form>

        <div className="guestbook-messages">
          {guestbook.map((entry) => (
            <div key={entry.id} className="guestbook-message">
              <strong>{entry.nickname}</strong>:
              {editId === entry.id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  <button
                    className="guestbook-button"
                    onClick={() => handleUpdate(entry.id)}
                  >
                    저장
                  </button>
                  <button
                    className="guestbook-button"
                    onClick={() => setEditId(null)}
                  >
                    취소
                  </button>
                </>
              ) : (
                <>
                  <span> {entry.content}</span>
                  {entry.nickname === currentUser.nickname && (
                    <div className="guestbook-actions">
                      <button
                        className="guestbook-button"
                        onClick={() => {
                          setEditId(entry.id);
                          setEditContent(entry.content);
                        }}
                      >
                        수정
                      </button>
                      <button
                        className="guestbook-button"
                        onClick={() => handleDelete(entry.id)}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
