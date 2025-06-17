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
    const ws = useRef(null);

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
                const res = await api.get(`/api/chatroom/${roomId}/info?userId=${user.id}`);
                setRoomInfo(res.data);
            } catch (err) {
                console.error("❌ 채팅방 정보 조회 실패:", err);
            }
        };

        fetchMessages();
        fetchRoomInfo();

        ws.current = new WebSocket(`ws://192.168.0.56:8080/ws/chat?roomId=${roomId}`);

        ws.current.onmessage = (event) => {
            const received = JSON.parse(event.data);
            setMessages((prev) => [...prev, received]);
        };

        return () => {
            ws.current?.close();
        };
    }, [roomId, user.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim()) return;

        const message = {
            roomId,
            senderId: user.id,
            senderRole: user.role.toLowerCase(),
            message: input,
        };

        ws.current.send(JSON.stringify(message));
        setInput("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    const exitChat = async () => {
        try {
            await api.delete(`/api/chatroom/${roomId}?userId=${user.id}`);
            window.location.href = "/chat/list"; // 목록으로 이동
        } catch (err) {
            console.error("❌ 채팅방 종료 실패:", err);
        }
    };

    return (
        <div className="chatroom-container-page">
            <div className="chatroom-header">
                <img
                    src={roomInfo?.otherProfileImage ? `${import.meta.env.VITE_API_BASE_URL}${roomInfo.otherProfileImage}` : "/default-profile.png"}
                    alt="상대 프로필"
                />
                <div className="info">
                    <div className="nickname">{roomInfo?.otherNickname}</div>
                    <div className="status">온라인</div>
                </div>
                {user.role === "ARTIST" && (
                    <button onClick={exitChat}>✕</button>
                )}
            </div>

            <div className="chatroom-messages">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`chatroom-message-row ${msg.senderId === user.id ? "self" : "other"}`}
                    >
                        <div className="chatroom-message-bubble">{msg.message}</div>
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
                <button className="chatroom-send-button" onClick={sendMessage}>전송</button>
            </div>
        </div>
    );
}
