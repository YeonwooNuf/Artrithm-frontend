import React, { useState } from "react";
import "./Guestbook.css";

export default function Guestbook({ guestbook }) {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && msg) {
      setMessages([{ name, msg }, ...messages]);
      setName("");
      setMsg("");
    }
  };

  return (
    <div className="guestbook-container">
      <h3 className="guestbook-title">📝 방명록</h3>
      <form onSubmit={handleSubmit} className="guestbook-form">
        <input
          className="guestbook-input"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="guestbook-textarea"
          placeholder="응원의 메시지를 남겨주세요!"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button className="guestbook-button" type="submit">
          작성하기
        </button>
      </form>
      <div className="guestbook-messages">
        {messages.map((m, idx) => (
          <div key={idx} className="guestbook-message">
            <strong>{m.name}</strong> : {m.msg}
          </div>
        ))}
      </div>
      {guestbook.map((entry, i) => (
        <li key={i} className="guestbook-message">
          <strong>{entry.id}</strong>: {entry.message}
        </li>
      ))}
    </div>
  );
}
