import React, { useState, useEffect } from "react";
import "./ArtworkMarketpage.css";
import { useNavigate } from "react-router-dom";

const ArtworkMarketpage = ({ user }) => {
  const userId = user?.id;
  const navigate = useNavigate();

  const [mode, setMode] = useState("buy");
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [allArtworks, setAllArtworks] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [selectedArtworkId, setSelectedArtworkId] = useState("");
  const [price, setPrice] = useState("");

  const [sortOption, setSortOption] = useState("latest"); // 기본값: 최신순

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/fixed-price-sale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        artworkId: parseInt(selectedArtworkId),
        price: Number(price),
        sellerUserId: userId,
      }),
    });

    if (res.ok) {
      alert("지정가 판매 신청 완료!");
      setPrice("");
      setSelectedArtworkId("");
      setArtworks((prev) =>
        prev.filter((art) => art.id !== parseInt(selectedArtworkId))
      );
    } else {
      alert("신청 실패! 이미 판매 중인 작품일 수 있어요.");
    }
  };

  useEffect(() => {
    fetch("/api/fixed-price-sale/all")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 서버에서 받은 데이터:", data);
        // 구매되지 않은 작품만 필터링
        const artworks = data.filter((work) => work.buyerUserId === null);
        setAllArtworks(artworks);
      })
      .catch((err) => {
        console.error("❌ 판매 작품 불러오기 실패", err);
      });
  }, [userId]);

  const handleSearch = () => {
    setActiveQuery(searchInput);
  };

  const filteredArtworks = allArtworks
    .filter((work) => {
      const titleMatch = work.artworkTitle
        .toLowerCase()
        .includes(activeQuery.toLowerCase());
      const artistMatch = (work.sellerNickname || "")
        .toLowerCase()
        .includes(activeQuery.toLowerCase());
      return titleMatch || artistMatch;
    })
    .sort((a, b) => {
      if (sortOption === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOption === "priceLow") {
        return a.price - b.price;
      } else if (sortOption === "priceHigh") {
        return b.price - a.price;
      } else if (sortOption === "titleAsc") {
        return (a.artworkTitle || "").localeCompare(
          b.artworkTitle || "",
          "ko-KR",
          { sensitivity: "base", ignorePunctuation: true }
        );
      }
      return 0;
    });

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/artworks/my/${userId}`)
      .then((res) => res.json())
      .then((data) => setArtworks(data))
      .catch((err) => console.error("작품 불러오기 실패", err));
  }, [user]);

  if (!userId) return <p>사용자 정보를 불러오는 중입니다...</p>;

  return (
    <div className="marketplace-wrapper">
      <div className="marketpage-mode-buttons">
        <button
          onClick={() => setMode("buy")}
          className={`marketpage-mode-button ${mode === "buy" ? "active" : ""}`}
        >
          작품 구매하기
        </button>
        <span className="marketpage-mode-divider">|</span>
        <button
          onClick={() => setMode("sell")}
          className={`marketpage-mode-button ${mode === "sell" ? "active" : ""
            }`}
        >
          작품 판매하기
        </button>
        {mode === "buy" && (
          <div className="marketpage-search-bar">
            <input
              type="text"
              placeholder="작가님과 작품을 검색해보세요"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button onClick={handleSearch}>검색</button>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{ marginLeft: "12px", padding: "8px" }}
            >
              <option value="latest">최신순</option>
              <option value="priceLow">가격 낮은 순</option>
              <option value="priceHigh">가격 높은 순</option>
              <option value="titleAsc">가나다순</option>
            </select>
          </div>
        )}
      </div>

      {mode === "buy" && (
        <div className="artwork-grid-wrapper">
          {filteredArtworks.map((artwork) => (
            <div
              key={artwork.artworkId}
              className="artwork-card"
              onClick={() => navigate(`/artworks/${artwork.artworkId}`)}
            >
              <img
                src={artwork.artworkImageUrl}
                alt={artwork.artworkTitle}
                className="artwork-image"
              />
              <div className="artwork-info">
                <div className="artwork-info-container">
                  <h4 className="artwork-title">{artwork.artworkTitle}</h4>
                  <p className="artwork-artist">{artwork.sellerNickname}</p>
                </div>
                <p className="artwork-price">{artwork.price}원</p>
                <p className="artwork-date">
                  {artwork.createdAt
                    ? new Date(artwork.createdAt).toLocaleDateString()
                    : "등록일 없음"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {mode === "sell" && (
        <div className="fixed-sale-container">
          <h2>지정가 판매 신청</h2>
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
                  {art.title}
                </option>
              ))}
            </select>

            <label>지정가 입력 (원):</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="예: 30000"
              required
            />

            <button type="submit">판매 신청</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ArtworkMarketpage;
