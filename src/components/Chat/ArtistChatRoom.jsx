
import React, { useState } from "react";
import "./ArtistChatRoom.css";

export default function ArtistChatRoom({ artist }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { from: "user", text: input }]);
      setInput("");
      // 여기서는 예시로만 간단한 응답
      setTimeout(() => {
        setMessages((prev) => [...prev, { from: "artist", text: `안녕하세요, ${artist?.name}입니다.` }]);
      }, 500);
    }
  };

  return (
    <div className="chat-room">
      <div className="chat-header">
        👩‍🎨 {artist?.name || "작가"}와의 대화
      </div>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.from}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
}