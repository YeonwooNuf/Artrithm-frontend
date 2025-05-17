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
      const response = await fetch("/api/llm/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          artworkId: artwork?.id
        })
      });

      const data = await response.json();
      const botMessage = { from: "bot", text: data.answer || "답변을 불러오지 못했습니다." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
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
