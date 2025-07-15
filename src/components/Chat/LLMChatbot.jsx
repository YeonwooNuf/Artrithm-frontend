import React, { useState, useRef, useEffect } from "react";
import "./LLMChatbot.css";

export default function LLMChatbot({ artwork, setIsInputFocused }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: `${artwork?.title}에 대해 궁금한 점을 물어보세요.` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ✅ 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest"});
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/artchat/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          artworkId: artwork?.id
        })
      });

      if (!response.ok) {
        // 서버 오류 로그
        console.error(`❌ 서버 오류 (${response.status}): ${response.statusText}`);
        throw new Error(`서버 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 LLM 응답 데이터:", data);

      // ✅ 출처 문서 유무 로그
      if (Array.isArray(data.source_documents) && data.source_documents.length > 0) {
        console.log(`✅ 출처 문서 기반 응답입니다. (artworkId: ${artwork?.id})`);
      } else {
        console.warn(`⚠️ 출처 없음. LLM이 지어냈을 가능성 있음. (artworkId: ${artwork?.id}, 질문: "${input}")`);
      }

      let text = "";

      if (typeof data.answer === "string") {
        text = data.answer;
      } else {
        text = JSON.stringify(data, null, 2);
      }

      const botMessage = { from: "bot", text };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("❌ 응답 처리 오류:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "⚠️ 서버 응답에 문제가 발생했습니다. 다시 시도해 주세요." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="llm-chatbot-container">
      <div className="llm-chatbot-header">
        LLM 챗봇 - <strong>{artwork?.title}</strong>
      </div>

      <div className="llm-chatbot-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`llm-message-bubble ${msg.from}`}>
            <div className="llm-message-text">{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="llm-message-bubble bot">
            <div className="llm-message-text">답변 생성 중입니다...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="llm-chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={handleKeyPress}
          onFocus={() => setIsInputFocused?.(true)}
          onBlur={() => setIsInputFocused?.(false)}
          placeholder="질문을 입력하세요..."
        />
        <button onClick={handleSend} disabled={loading}>
          {loading ? "전송 중..." : "전송"}
        </button>
      </div>
    </div>
  );
}
