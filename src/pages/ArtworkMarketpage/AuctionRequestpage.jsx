// AuctionRequestpage.jsx
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
      fetch(`/api/artworks/my/${user.id}`)
        .then((res) => res.json())
        .then((data) => setArtworks(data))
        .catch((err) => console.error("작품 목록 갱신 실패", err));
    } else {
      alert("경매 신청 실패!");
    }
  };

  const selectedArtwork = artworks.find(
    (a) => a.id === parseInt(selectedArtworkId)
  );

  return (
    <div className="auction-request-page">
      <div className="form-section">
        <h2 className="form-title">🎨 Auction Request</h2>
        <form onSubmit={handleSubmit} className="auction-form">
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

      {/* <div className="preview-section">
        {selectedArtwork ? (
          <img
            src={selectedArtwork.imageUrl}
            alt="선택한 작품"
            className="art-preview-img"
          />
        ) : (
          <div className="placeholder-box">
            <img
              src="/images/auction-placeholder.png"
              alt="신청서 안내"
              className="placeholder-img"
            />
            <p className="placeholder-text">
              작품을 선택하면 미리보기가 여기에 표시됩니다.
            </p>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default AuctionRequestpage;
