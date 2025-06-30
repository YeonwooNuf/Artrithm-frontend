import React from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // 또는 props로 전달

  const handleChatWithAdmin = async () => {
    if (!user?.id) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("/api/users/admin-id");
      const adminId = await res.json(); // 서버가 Long 타입 응답할 경우, .json() 사용

      const roomRes = await fetch(`/api/chatroom/create?viewerId=${user.id}&artistId=${adminId}&exhibitionId=0`, {
        method: "POST"
      });

      const room = await roomRes.json();
      if (!room.id) throw new Error("유효한 채팅방 ID가 없습니다.");

      navigate(`/chat/${room.id}`);
    } catch (err) {
      console.error("❌ 문의 채팅 연결 실패:", err);
      alert("관리자와의 채팅 연결에 실패했습니다.");
    }
  };

  return (
    <footer className="footer">
      <div className="footer__left">
        <h3>Artrithm</h3>
      </div>

      <div className="footer__center">
        <a href="/">홈</a>
        <a href="/view">전시회</a>
        {/* 🔄 a 태그 대신 버튼 or span 사용 */}
        <button onClick={handleChatWithAdmin} className="footer__chat-btn">
          문의하기
        </button>
        <a href="/intro">소개</a>
      </div>

      <div className="footer__right">
        <p>© 2025 Artrithm. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
