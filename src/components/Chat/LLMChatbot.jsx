import React, { useState } from "react";
import "./LLMChatbot.css";

export default function LLMChatbot({ artwork }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: `${artwork?.title}에 대해 궁금한 점을 물어보세요.` }
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("/api/artchat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          artworkId: artwork?.id
        })
      });

      const data = await response.json();
      console.log("📦 LLM 응답 데이터:", data); // ✅ 응답 구조 확인

      // ✅ 객체 방지: 문자열만 text로 넘기기
      let text = "";

      if (typeof data.answer === "string") {
        text = data.answer;
      } else {
        text = JSON.stringify(data, null, 2); // fallback (디버깅용)
      }

      const botMessage = { from: "bot", text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("❌ 서버 응답 오류:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ 서버 응답에 문제가 발생했습니다." }
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="llm-chatbot-container">
      <div className="llm-chatbot-header">
        🧠 LLM 챗봇 - <strong>{artwork?.title}</strong>
      </div>

      <div className="llm-chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`llm-message-bubble ${msg.from}`}>
            <div className="llm-message-text">{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="llm-chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="질문을 입력하세요..."
        />
        <button onClick={handleSend}>전송</button>
      </div>
    </div>
  );
}
