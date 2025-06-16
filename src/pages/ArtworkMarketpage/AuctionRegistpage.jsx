import React, { useEffect, useState } from "react";
import "./AuctionRegisterpage.css"; // 아래 CSS 파일 불러오기

const AuctionRegisterpage = () => {
  const [requests, setRequests] = useState([]);
  const [selectedEndTimes, setSelectedEndTimes] = useState({});

  useEffect(() => {
    fetch("/api/auctions/admin/pending")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("신청 목록 불러오기 실패", err));
  }, []);

  const handleEndTimeChange = (requestId, value) => {
    setSelectedEndTimes((prev) => ({
      ...prev,
      [requestId]: value,
    }));
  };

  const handleRegister = async (requestId) => {
    const endTime = selectedEndTimes[requestId];

    if (!endTime) {
      alert("종료 시간을 입력하세요.");
      return;
    }

    const res = await fetch("/api/auctions/admin/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auctionRequestId: requestId,
        endTime: endTime,
      }),
    });

    if (res.ok) {
      alert("경매 등록 완료!");
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    } else if (res.status === 409) {
      const msg = await res.text();
      alert(msg); // 이미 진행 중인 경매가 있습니다.
    } else {
      alert("등록 실패!");
    }
  };

  return (
    <div className="approval-container">
      <h2 className="approval-title">경매 승인 요청 목록</h2>
      {requests.length === 0 && <p>대기 중인 신청이 없습니다.</p>}
      {requests.map((req) => (
        <div className="request-card" key={req.requestId}>
          <div className="request-info">
            <img
              src={req.imageUrl}
              alt={req.title}
              className="request-thumbnail"
            />
            <div className="request-text">
              <h3>{req.title}</h3>
              <p>시작가: {req.startPrice}원</p>
            </div>
          </div>
          <div className="request-actions">
            <input
              type="datetime-local"
              value={selectedEndTimes[req.requestId] || ""}
              onChange={(e) =>
                handleEndTimeChange(req.requestId, e.target.value)
              }
            />
            <button onClick={() => handleRegister(req.requestId)}>등록</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuctionRegisterpage;
