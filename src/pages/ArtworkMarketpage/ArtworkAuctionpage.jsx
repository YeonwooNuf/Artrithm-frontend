import React, { useState, useEffect, useRef } from "react";
import "./ArtworkAuctionpage.css";

const ArtworkAuctionpage = ({ user }) => {
  const userId = user.id;
  const [lastestPrice, setLatestPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [bid, setBid] = useState("");
  const [timeLeft, setTimeLeft] = useState(10); // 5분 남았다고 가정
  const socket = useRef(null);
  const auctionId = 1;
  const [auctionData, setAuctionData] = useState(null);

  const [isEnded, setIsEnded] = useState(false);
  //초기 가격 정보
  useEffect(() => {
    fetch(`/api/auctions/bid/${auctionId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 초기 입찰 정보:", data);
        if (data.top1Price) {
          setLatestPrice(data.top1Price);
          setCurrentPrice(data.top1Price);
          setTimeLeft(
            getRemainingSeconds(auctionData.startTime, auctionData.endTime)
          );
        }
      })
      .catch((err) => {
        console.error("❌ 입찰 정보 가져오기 실패:", err);
        setLatestPrice(auctionData.startPrice);
        setCurrentPrice(auctionData.startPrice);
        setTimeLeft(
          getRemainingSeconds(auctionData.startTime, auctionData.endTime)
        );
      });
  }, [auctionId]);

  //타이머 끝나면 낙찰 상태로 전환
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsEnded(true);

      fetch(`/api/auctions/${auctionId}/finalize`, { method: "POST" })
        .then((res) => res.ok && console.log("🏁 낙찰 처리 완료"))
        .catch((err) => console.error("❌ 낙찰 처리 실패:", err));

      socket.current.close();
    }
  }, [timeLeft]);

  // 웹소켓 연결
  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8080/ws/auction");

    socket.current.onopen = () => {
      console.log("✅ 웹소켓 연결 성공");
    };

    socket.current.onclose = (e) => {
      console.warn("❌ 웹소켓 연결 끊김", e);
    };

    socket.current.onerror = (e) => {
      console.error("🛑 웹소켓 오류", e);
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 서버에서 받은 가격:", data.price);
      console.log(event.data);
      setCurrentPrice((prev) => (data.price > prev ? data.price : prev));
    };

    return () => socket.current.close();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  //auctionData 불러오기
  useEffect(() => {
    fetch(`/api/auctions/${auctionId}`)
      .then((res) => res.json())
      .then((data) => setAuctionData(data));
  }, []);

  if (!auctionData) return <p>로딩 중...</p>;

  // 시간 계산 함수
  function getRemainingSeconds(startTimeStr, endTimeStr) {
    const now = new Date();
    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);

    const totalAuctionSeconds = Math.floor((endTime - startTime) / 1000);
    const elapsed = Math.floor((now - startTime) / 1000);

    const remaining = totalAuctionSeconds - elapsed;
    return Math.max(0, remaining);
  }

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}분 ${s}초`;
  };

  // 입찰하기
  const handleBid = () => {
    const bidPrice = parseInt(bid);
    if (bidPrice > currentPrice) {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(
          JSON.stringify({
            auctionId: auctionId,
            userId: userId,
            price: bidPrice,
          })
        );
        setBid("");
      } else {
        alert("⚠️ 서버와 연결이 끊어졌습니다. 페이지를 새로고침해주세요.");
      }
    } else {
      alert("현재가보다 높은 금액을 입력하세요.");
    }
  };

  return isEnded ? (
    <div className="auction-container ended">
      <img
        className="auction-image"
        src={auctionData.artwork.imageUrl}
        alt={auctionData.artwork.title}
      />
      <div className="auction-info">
        <h2>{auctionData.artwork.title}</h2>
        <p className="artist-name">👤 {auctionData.artwork.userNickname}</p>
        <p className="description">{auctionData.artwork.description}</p>

        <div className="auction-result">
          <h3 className="congrats">🎉 낙찰 완료!</h3>
          <p>
            🏁 낙찰가: <strong>{currentPrice.toLocaleString()}원</strong>
          </p>
          <p>
            👤 낙찰자: <strong>{auctionData.winnerNickname}</strong>
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className="auction-container">
      <img
        className="auction-image"
        src={auctionData.artwork.imageUrl}
        alt={auctionData.artwork.title}
      />

      <div className="auction-info">
        <h2>{auctionData.artwork.title}</h2>
        <p className="artist-name">👤 {auctionData.artwork.artistName}</p>
        <p className="description">{auctionData.artwork.description}</p>

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
