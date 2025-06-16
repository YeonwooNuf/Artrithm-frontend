import React, { useEffect, useState } from "react";
import "./AuctionRequestpage.css";

const AuctionRequestpage = ({ user }) => {
  const userId = user.id;
  const [artworks, setArtworks] = useState([]);
  const [selectedArtworkId, setSelectedArtworkId] = useState("");
  const [startPrice, setStartPrice] = useState("");
  useEffect(() => {
    fetch(`/api/artworks/my/${userId}`)
      .then((res) => res.json())
      .then((data) => setArtworks(data))
      .catch((err) => console.error("작품 불러오기 실패", err));
  }, []);

  // 신청 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auctions/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        artworkId: parseInt(selectedArtworkId),
        startPrice: parseInt(startPrice),
      }),
    });

    if (res.ok) {
      alert("경매 신청 완료!");
      setStartPrice("");
      setSelectedArtworkId("");
      // ✅ 목록 다시 불러오기 (최신 saleStatus 반영)
      fetch(`/api/artworks/my/${user.id}`) // 또는 내 userId 변수명
        .then((res) => res.json())
        .then((data) => setArtworks(data))
        .catch((err) => console.error("작품 목록 갱신 실패", err));
    } else {
      alert("경매 신청 실패!");
    }
  };

  return (
    <div className="auction-request-page">
      <h2>경매 신청</h2>
      <form onSubmit={handleSubmit}>
        <label>작품 선택:</label>
        <select
          value={selectedArtworkId}
          onChange={(e) => setSelectedArtworkId(e.target.value)}
          required
        >
          <option value="">작품을 선택하세요</option>
          {artworks.map((art) => (
            <option key={art.id} value={art.id}>
              {art.title} ({art.userNickname || art.artistName})
            </option>
          ))}
        </select>

        <label>시작 가격:</label>
        <input
          type="number"
          value={startPrice}
          onChange={(e) => setStartPrice(e.target.value)}
          placeholder="예: 10000"
          required
        />

        <button type="submit">신청하기</button>
      </form>
    </div>
  );
};

export default AuctionRequestpage;
