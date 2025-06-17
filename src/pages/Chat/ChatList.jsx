import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ChatList.css";
import api from "../../api/axios";

export default function ChatList({ user }) {
    const [chatRooms, setChatRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const userId = user?.id || localStorage.getItem("userId");
                const res = await api.get(`/api/chatroom/user/${userId}`);
                setChatRooms(res.data);
            } catch (err) {
                console.error("❌ 채팅 목록 조회 실패:", err);
            }
        };

        fetchChatRooms();
    }, [user]);

    const enterChatRoom = (roomId) => {
        const role = user?.role || localStorage.getItem("userRole");
        navigate(`/chat/${roomId}`);
    };

    return (
        <div className="chat-list-container">
            <h2>📨 채팅 목록</h2>
            <div className="chat-list">
                {chatRooms.length === 0 ? (
                    <p className="chat-empty">채팅 내역이 없습니다.</p>
                ) : (
                    chatRooms.map((room) => (
                        <div
                            key={room.roomId}
                            className="chat-room-preview"
                            onClick={() => enterChatRoom(room.roomId)}
                        >
                            <img
                                src={
                                    room.otherProfileImage
                                        ? `${import.meta.env.VITE_API_BASE_URL}${room.otherProfileImage}`
                                        : "/default-profile.png"
                                }
                                alt="상대방 프로필"
                                className="chat-profile-img"
                            />
                            <div className="chat-info">
                                <div className="chat-name">{room.otherNickname}</div>
                                <div className="chat-last-message">
                                    {room.lastMessage?.length > 30
                                        ? room.lastMessage.slice(0, 30) + "..."
                                        : room.lastMessage || "메시지가 없습니다."}
                                </div>
                            </div>
                            <div className="chat-time">
                                {room.lastMessageTime
                                    ? new Date(room.lastMessageTime).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : ""}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}