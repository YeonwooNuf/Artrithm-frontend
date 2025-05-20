import React, { useState, useEffect, useRef } from "react";
import "./ArtworkAuctionpage.css";

const ArtworkAuctionpage = ({ artwork }) => {
  const [currentPrice, setCurrentPrice] = useState(
    Number(artwork.price || 10000)
  );
  const [bid, setBid] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5분 남았다고 가정
  const socket = useRef(null);

  useEffect(() => {
    // 웹소켓 연결
    socket.current = new WebSocket("ws://localhost:8080/ws/auction");

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.price > currentPrice) {
        setCurrentPrice(data.price);
      }
    };

    return () => socket.current.close();
  }, [currentPrice]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}분 ${s}초`;
  };

  const handleBid = () => {
    const bidPrice = parseInt(bid);
    if (bidPrice > currentPrice) {
      socket.current.send(JSON.stringify({ price: bidPrice }));
      setBid("");
    } else {
      alert("현재가보다 높은 금액을 입력하세요.");
    }
  };

  return (
    <div className="auction-container">
      <img
        className="auction-image"
        src={artwork.works[0].src}
        alt={artwork.works[0].title}
      />

      <div className="auction-info">
        <h2>{artwork.works[0].title}</h2>
        <p className="artist-name">👤 {artwork.name}</p>
        <p className="description">{artwork.works[0].description}</p>

        <div className="auction-status">
          <p>
            ⏱️ 종료까지: <strong>{formatTime(timeLeft)}</strong>
          </p>
          <p>
            💰 현재 입찰가: <strong>{currentPrice.toLocaleString()}원</strong>
          </p>
        </div>

        <div className="bid-section">
          <input
            type="number"
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            placeholder="입찰가 입력"
          />
          <button onClick={handleBid}>입찰하기</button>
        </div>
      </div>
    </div>
  );
};

export default ArtworkAuctionpage;
