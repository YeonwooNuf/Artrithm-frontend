import React, { useEffect, useRef, useState } from "react";
import "./ChatForViewer.css";

export default function ChatForViewer({ artist, roomId, senderId, senderRole }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ws/chat?roomId=${roomId}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket 연결됨");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.message) return;

        setMessages((prev) => [
          ...prev,
          {
            from: data.senderRole,
            text: data.message,
            timestamp: new Date().toLocaleTimeString(),
            read: data.read ?? false,
            senderNickname: data.senderNickname || "익명",
            senderProfileImage: data.senderProfileImage || null,
          },
        ]);
      } catch (err) {
        console.error("메시지 파싱 실패:", err);
      }
    };

    ws.onclose = () => {
      console.log("❌ WebSocket 연결 종료");
    };

    return () => ws.close();
  }, [roomId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const messageObj = {
      roomId,
      senderId,
      senderRole,
      message: input,
    };

    socketRef.current.send(JSON.stringify(messageObj));

    setMessages((prev) => [
      ...prev,
      {
        from: senderRole,
        text: input,
        timestamp: new Date().toLocaleTimeString(),
        read: true,
        senderNickname: "나",
        senderProfileImage: null,
      },
    ]);

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleCloseChat = async () => {
    if (window.confirm("채팅을 종료하시겠습니까?")) {
      try {
        await fetch(`/api/chatroom/${roomId}`, { method: "DELETE" });
        window.history.back();
      } catch (err) {
        console.error("채팅 종료 실패:", err);
      }
    }
  };

  return (
    <div className="viewer-chat-room">
      <div className="viewer-chat-header">
        {artist?.profileImage && (
          <img
            src={`http://localhost:8080${artist.profileImage}`}
            alt="프로필"
            className="viewer-chat-profile"
          />
        )}
        <span className="viewer-chat-artist-name">{artist?.name || "작가"}</span>
        <button onClick={handleCloseChat} className="viewer-chat-close-btn">채팅 종료</button>
      </div>

      <div className="viewer-chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`viewer-chat-message-wrapper ${msg.from === senderRole ? "me" : "other"}`}>
            <div className="viewer-chat-bubble">
              <div className="viewer-chat-text">{msg.text}</div>
              <div className="viewer-chat-meta">
                <span className="viewer-chat-time">{msg.timestamp}</span>
                {msg.from === senderRole && msg.read && <span className="viewer-chat-read">읽음</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="viewer-chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          className="viewer-chat-input-field"
        />
        <button onClick={sendMessage} className="viewer-chat-send-btn">전송</button>
      </div>
    </div>
  );
}