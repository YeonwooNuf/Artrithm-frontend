import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ChatRoom.css";
import api from "../../api/axios";

export default function ChatRoom({ user }) {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // ✅ 채팅방 정보 + 이전 메시지 불러오기
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/messages/${roomId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("❌ 메시지 불러오기 실패:", err);
      }
    };

    const fetchRoomInfo = async () => {
      try {
        const res = await api.get(
          `/api/chatroom/${roomId}/info?userId=${user.id}`
        );
        setRoomInfo(res.data);
      } catch (err) {
        console.error("❌ 채팅방 정보 조회 실패:", err);
      }
    };

    fetchMessages();
    fetchRoomInfo();

    // ✅ WebSocket 연결
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

        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error("❌ WebSocket 메시지 파싱 실패:", err);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket 오류:", error);
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket 종료");
      socketRef.current = null;
    };

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [roomId, user.id]);

  // ✅ 메시지 맨 아래로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ 메시지 전송
  const sendMessage = () => {
    if (!input.trim()) return;

    const messageObj = {
      roomId,
      senderId: user.id,
      senderRole: user.role.toLowerCase(),
      senderNickname: user.nickname,
      senderProfileImage: user.profileImage,
      message: input,
    };

    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      socketRef.current.send(JSON.stringify(messageObj));
      setInput("");
    } else {
      alert("⚠️ 채팅 연결 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  // ✅ 채팅방 종료
  const exitChat = async () => {
    try {
      await api.delete(`/api/chatroom/${roomId}?userId=${user.id}`);
      window.location.href = "/chat/list";
    } catch (err) {
      console.error("❌ 채팅방 종료 실패:", err);
    }
  };

  return (
    <div className="chatroom-container-page">
      <div className="chatroom-header">
        <img
          src={
            roomInfo?.otherProfileImage
              ? `${import.meta.env.VITE_API_BASE_URL}${roomInfo.otherProfileImage}`
              : "/default-profile.png"
          }
          alt="상대 프로필"
        />
        <div className="info">
          <div className="nickname">{roomInfo?.otherNickname}</div>
          <div className="status">온라인</div>
        </div>
          <button onClick={exitChat}>x</button>
      </div>

      <div className="chatroom-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chatroom-message-row ${
              msg.senderId === user.id ? "self" : "other"
            }`}
          >
            <div className="chatroom-message-bubble">
              {msg.message}
              <div className="chatroom-message-time">
                {new Date(msg.sentAt || new Date()).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatroom-input-box">
        <input
          type="text"
          className="chatroom-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={handleKeyPress}
          placeholder="메시지를 입력하세요"
        />
        <button className="chatroom-send-button" onClick={sendMessage}>
          전송
        </button>
      </div>
    </div>
  );
}
