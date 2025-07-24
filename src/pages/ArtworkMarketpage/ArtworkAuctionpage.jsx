import React, { useState, useEffect, useRef } from "react";
import "./ArtworkAuctionpage.css";

const ArtworkAuctionpage = ({ user }) => {
  const userId = user.id;
  const [auctionId, setAuctionId] = useState(null);
  const [auctionData, setAuctionData] = useState(null);
  const [lastestPrice, setLatestPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [bid, setBid] = useState("");
  const [timeLeft, setTimeLeft] = useState(10);
  const [isEnded, setIsEnded] = useState(false);
  const socket = useRef(null);

  // 1. 가장 첫 ongoing 경매 가져오기
  useEffect(() => {
    fetch("/api/auctions/ongoing")
      .then((res) => {
        if (res.status === 404) {
          throw new Error("진행 중인 경매 없음");
        }
        return res.json();
      })
      .then((id) => {
        setAuctionId(id); // ✅ 단일 auctionId
      })
      .catch((err) => {
        alert(err.message);
      });
  }, []);

  // 2. auctionId 받아오면 상세 정보 요청
  useEffect(() => {
    if (auctionId !== null) {
      fetch(`/api/auctions/${auctionId}`)
        .then((res) => res.json())
        .then((data) => setAuctionData(data));
    }
  }, [auctionId]);

  // 3. 입찰 정보 및 남은 시간 계산
  useEffect(() => {
    if (auctionId && auctionData) {
      fetch(`/api/auctions/bid/${auctionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.top1Price) {
            setLatestPrice(data.top1Price);
            setCurrentPrice(data.top1Price);
          } else {
            setLatestPrice(auctionData.startPrice);
            setCurrentPrice(auctionData.startPrice);
          }
          setTimeLeft(
            getRemainingSeconds(auctionData.startTime, auctionData.endTime)
          );
        })
        .catch((err) => {
          console.error("❌ 입찰 정보 가져오기 실패:", err);
          setLatestPrice(auctionData.startPrice);
          setCurrentPrice(auctionData.startPrice);
          setTimeLeft(
            getRemainingSeconds(auctionData.startTime, auctionData.endTime)
          );
        });
    }
  }, [auctionId, auctionData]);

  // 4. 타이머 종료 시 낙찰 처리
  useEffect(() => {
    if (timeLeft <= 0 && auctionId) {
      setIsEnded(true);

      fetch(`/api/auctions/${auctionId}/finalize`, { method: "POST" })
        .then((res) => {
          if (res.ok) {
            console.log("🏁 낙찰 처리 완료");
            return fetch(`/api/auctions/${auctionId}`); // ✅ 최신 정보 재요청
          }
        })
        .then((res) => res.json())
        .then((data) => setAuctionData(data)); // ✅ winnerNickname 포함
    }
  }, [timeLeft]);

  // 5. 웹소켓 연결
  useEffect(() => {
    socket.current = new WebSocket("ws://172.30.1.11:8080/ws/auction");

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
      setCurrentPrice((prev) => (data.price > prev ? data.price : prev));
    };

    return () => socket.current.close();
  }, []);

  // 6. 타이머 감소
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!auctionData) return <p>로딩 중...</p>;

  const getRemainingSeconds = (startTimeStr, endTimeStr) => {
    const now = new Date();
    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);
    const totalAuctionSeconds = Math.floor((endTime - startTime) / 1000);
    const elapsed = Math.floor((now - startTime) / 1000);
    const remaining = totalAuctionSeconds - elapsed;
    return Math.max(0, remaining);
  };

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const s = sec % 60;
    return `${min}분 ${s}초`;
  };

  const handleBid = () => {
    const bidPrice = parseInt(bid);
    if (bidPrice > currentPrice) {
      if (socket.current && socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(
          JSON.stringify({ auctionId, userId, price: bidPrice })
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
        <p className="artist-name">
          {" "}
          {auctionData.artwork.artistName
            ? auctionData.artwork.artistName
            : auctionData.artwork.userNickname}
        </p>
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
