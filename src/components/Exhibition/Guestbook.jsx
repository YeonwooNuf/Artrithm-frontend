import React, { useState } from "react";
import "./Guestbook.css";

export default function Guestbook({ guestbook }) {
  const currentUser = JSON.parse(localStorage.getItem("user")); // ✅ 로그인한 사용자 정보
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    // 임시 저장 (실제로는 API 호출 필요)
    const newMessage = {
      id: Date.now(),
      nickname: currentUser.nickname,
      userId: currentUser.id,
      content,
    };
    setMessages([newMessage, ...messages]);
    setContent("");
  };

  const handleDelete = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <div className="guestbook-wrapper">
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
          {[...messages, ...guestbook].map((entry, i) => (
            <div key={entry.id || i} className="guestbook-message">
              <strong>{entry.nickname}</strong>: {entry.content}

              {/* ✅ 본인 작성글에만 수정/삭제 버튼 표시 */}
              {entry.userId === currentUser?.id && (
                <span className="guestbook-actions">
                  <button className="edit-guest-btn">수정</button>
                  <button
                    className="delete-guest-btn"
                    onClick={() => handleDelete(entry.id)}
                  >
                    삭제
                  </button>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
