import React, { useEffect, useRef, useState } from "react";
import "./ChatForViewer.css";
import axios from "axios";

export default function ChatForViewer({
  artist,
  roomId,
  senderId,
  senderRole,
  user,
  setIsInputFocused,
  closeChat,
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ✅ 이전 메시지 불러오기
  useEffect(() => {
    const fetchPreviousMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${roomId}`);
        const formatted = res.data.map((msg) => ({
          from: msg.senderRole,
          text: msg.message,
          timestamp: new Date(msg.sentAt).toLocaleTimeString(),
          read: false,
          senderNickname: msg.senderNickname || "익명",
          senderProfileImage: msg.senderProfileImage || null,
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("❌ 이전 메시지 불러오기 실패:", err);
      }
    };

    if (roomId) {
      fetchPreviousMessages();
    }
  }, [roomId]);

  // ✅ WebSocket 연결
  useEffect(() => {
    if (!roomId) return;

    if (socketRef.current) return;

    const ws = new WebSocket(
      `ws://${window.location.hostname}:8080/ws/chat?roomId=${roomId}`
    );
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
        console.error("❌ 메시지 파싱 실패:", err);
      }
    };

    ws.onclose = () => {
      socketRef.current = null;
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [roomId]);

  // ✅ 스크롤 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const sendMessage = () => {
    if (
      !input.trim() ||
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    )
      return;

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
      e.preventDefault();
      sendMessage();
    }
  };

  const handleCloseChat = async () => {
    if (window.confirm("채팅을 종료하시겠습니까?")) {
      try {
        await axios.delete(`/api/chatroom/${roomId}`);
        closeChat?.();
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
            src={`${import.meta.env.VITE_API_BASE_URL}${artist.profileImage}`}
            alt="프로필"
            className="viewer-chat-profile"
          />
        )}
        <span className="viewer-chat-artist-name">
          {artist?.name || "작가"}
        </span>
        <button onClick={handleCloseChat} className="viewer-chat-close-btn">
          채팅 종료
        </button>
      </div>

      <div className="viewer-chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`viewer-chat-message-wrapper ${
              msg.from === senderRole ? "me" : "other"
            }`}
          >
            <div className="viewer-chat-bubble">
              <div className="viewer-chat-text">{msg.text}</div>
              <div className="viewer-chat-meta">
                <span className="viewer-chat-time">{msg.timestamp}</span>
                {msg.from === senderRole && msg.read && (
                  <span className="viewer-chat-read">읽음</span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="viewer-chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={handleKeyDown}
          onFocus={() => setIsInputFocused?.(true)}
          onBlur={() => setIsInputFocused?.(false)}
          placeholder="메시지를 입력하세요"
          className="viewer-chat-input-field"
        />
        <button onClick={sendMessage} className="viewer-chat-send-btn">
          전송
        </button>
      </div>
    </div>
  );
}
