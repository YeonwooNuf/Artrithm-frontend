import React from "react";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
import "./ChatPage.css"; // 아래에 스타일 정의 포함

export default function ChatRoomLayout({ user }) {
  return (
    <div className="chatpage-container">
      <div className="chatlist-wrapper">
        <ChatList user={user} />
      </div>
      <div className="chatroom-wrapper">
        <ChatRoom user={user} />
      </div>
    </div>
  );
}
