import React from "react";
import { useParams } from "react-router-dom";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
import "./ChatPage.css";

export default function ChatPage() {
  const { roomId } = useParams();
  const user = JSON.parse(localStorage.getItem("user")); // 또는 props로 전달

  return (
    <div className="chatpage-container">
      <div className="chatpage-sidebar">
        <ChatList user={user} />
      </div>
      <div className="chatpage-chatroom">
        <ChatRoom roomId={roomId} user={user} />
      </div>
    </div>
  );
}
