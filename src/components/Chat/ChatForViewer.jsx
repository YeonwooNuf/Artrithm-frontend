import React, { useEffect, useRef, useState } from "react";
import "./ChatForViewer.css";

export default function ChatForViewer({ artist, roomId, senderId, senderRole }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    if (!roomId) {
      console.warn("⚠️ roomId가 없습니다. 채팅방을 생성하지 못했습니다.");
      return;
    }

    if (socketRef.current) {
      console.warn("⚠️ 기존 WebSocket이 이미 존재합니다. 중복 연결 방지");
      return;
    }

    const ws = new WebSocket(`ws://192.168.0.56:8080/ws/chat?roomId=${roomId}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket 연결됨");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data.message) return;

        console.log("📨 수신된 메시지:", data);

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
        console.error("❌ 메시지 파싱 실패:", err);
      }
    };

    ws.onclose = (event) => {
      console.log("❎ WebSocket 연결 종료:", event.code, event.reason);
      socketRef.current = null; // 연결 종료 시 초기화
    };

    return () => {
      if (socketRef.current) {
        console.log("🧹 WebSocket 연결 해제");
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [roomId]); // ✅ roomId 변경 시만 effect 재실행

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;

    const messageObj = {
      roomId,
      senderId,
      senderRole,
      senderNickname: user.nickname,
      senderProfileImage: user.profileImage,
      message: input,
    };

    socketRef.current.send(JSON.stringify(messageObj));

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 👈 필수!
      sendMessage();
    }
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
          onKeyUp={handleKeyDown}
          placeholder="메시지를 입력하세요"
          className="viewer-chat-input-field"
        />
        <button onClick={sendMessage} className="viewer-chat-send-btn">전송</button>
      </div>
    </div>
  );
}
