import React, { useState, useEffect } from "react";
import "./ArtworkMarketpage.css";
import { useNavigate } from "react-router-dom";

const ArtworkMarketpage = ({ user }) => {
  const userId = user?.id;
  const navigate = useNavigate();

  const [mode, setMode] = useState("buy");
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [groupedArtists, setGroupedArtists] = useState([]);
  const [selectedArtworkMap, setSelectedArtworkMap] = useState({});
  const [artworks, setArtworks] = useState([]);
  const [selectedArtworkId, setSelectedArtworkId] = useState("");
  const [price, setPrice] = useState("");
  const [showCartModal, setShowCartModal] = useState(false);

  // 판매 신청 처리
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

  // 전체 판매 중 작품 (내 것 제외, SOLD 제외)
  useEffect(() => {
    fetch("/api/fixed-price-sale/all-grouped")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 서버에서 받은 데이터:", data);
        const filteredData = data
          .map((artist) => ({
            ...artist,
            works: artist.works.filter((work) => work.buyerUserId === null),
          }))
          .filter((artist) => artist.works.length > 0);
        setGroupedArtists(filteredData);
      })
      .catch((err) => {
        console.error("❌ 판매 작품 불러오기 실패", err);
      });
  }, [userId]);

  // 검색 적용
  const handleSearch = () => {
    setActiveQuery(searchInput);
  };

  // 검색어 기반 필터
  const filteredArtists = groupedArtists
    .map((artist) => {
      const matchedWorks = artist.works.filter((work) =>
        work.artworkTitle.toLowerCase().includes(activeQuery.toLowerCase())
      );
      const isArtistMatched = artist.artistName
        .toLowerCase()
        .includes(activeQuery.toLowerCase());

      if (isArtistMatched || matchedWorks.length > 0) {
        return { ...artist, works: artist.works };
      }
      return null;
    })
    .filter((artist) => artist !== null);

  // 검색 시 대표 작품 지정
  useEffect(() => {
    if (activeQuery && filteredArtists.length > 0) {
      const lowerQuery = activeQuery.toLowerCase();
      const newMap = { ...selectedArtworkMap };

      filteredArtists.forEach((artist) => {
        if (!newMap[artist.artistName]) {
          const match = artist.works.find((work) =>
            work.artworkTitle.toLowerCase().includes(lowerQuery)
          );
          newMap[artist.artistName] = match || artist.works[0];
        }
      });

      setSelectedArtworkMap(newMap);
    }
  }, [activeQuery, filteredArtists]);

  // 장바구니 추가 처리
  const handleAddToCart = async (artworkId, fixedPriceSaleId) => {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        artworkId,
        type: "FIXED_PRICE",
        fixedPriceSaleId,
      }),
    });

    if (res.ok) {
      setShowCartModal(true);
    } else {
      const errMsg = await res.text();
      alert("❌ 장바구니 추가 실패: " + errMsg);
    }
  };

  // 내 작품 목록 불러오기
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
      {showCartModal && (
        <div className="cart-modal">
          <div className="cart-modal-content">
            <h3>🎉 장바구니에 담겼습니다!</h3>
            <div className="cart-modal-buttons">
              <button onClick={() => navigate("/cart")}>
                🛒 장바구니로 이동
              </button>
              <button onClick={() => setShowCartModal(false)}>
                🎨 계속 감상하기
              </button>
            </div>
          </div>
        </div>
      )}

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
          className={`marketpage-mode-button ${
            mode === "sell" ? "active" : ""
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
          </div>
        )}
      </div>

      {mode === "buy" && (
        <div className="marketplace-wrapper">
          {filteredArtists.map((artist) => {
            const selectedArtwork =
              selectedArtworkMap[artist.artistName] || artist.works[0];

            return (
              <div key={artist.artistId} className="marketplace-container">
                <div className="highlighted-artwork-section">
                  <img
                    src={selectedArtwork.artworkImageUrl}
                    alt={selectedArtwork.artworkTitle}
                    className="highlighted-artwork"
                  />
                  <div className="artwork-info-box">
                    <h3>
                      {selectedArtwork.artworkTitle}
                      {"    "}
                      <span className="artist-name-tooltip-container">
                        <span className="artist-name">
                          (By {artist.artistName})
                        </span>
                        <div className="artist-tooltip">
                          <img
                            src={artist.artistProfileImage}
                            alt={artist.artistName}
                          />
                          <p>{artist.artistBio}</p>
                        </div>
                      </span>
                    </h3>
                    <p>{selectedArtwork.description}</p>
                    <p style={{ fontSize: "0.9em", color: "#FAF1DC" }}>
                      가격: {selectedArtwork.price?.toLocaleString() || "문의"}
                    </p>
                    <div className="marketpage-buttons">
                      <button
                        className="marketpage-exhibition-button"
                        onClick={() =>
                          navigate(
                            `/exhibitions/Gallery3D/${selectedArtwork.exhibitionId}`
                          )
                        }
                      >
                        🖼 전시회에서 보기
                      </button>
                      {selectedArtwork.sellerUserId !== userId && (
                        <button
                          className="marketpage-buy-button"
                          onClick={() =>
                            handleAddToCart(
                              selectedArtwork.artworkId,
                              selectedArtwork.fixedPriceSaleId
                            )
                          }
                        >
                          🛒 구매하기
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="marketplace-artwork-grid">
                  {artist.works.map((work) => (
                    <div
                      key={work.artworkId}
                      className={`artwork-card ${
                        selectedArtwork.artworkId === work.artworkId
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedArtworkMap((prev) => ({
                          ...prev,
                          [artist.artistName]: work,
                        }))
                      }
                    >
                      <img
                        src={work.artworkImageUrl}
                        alt={work.artworkTitle}
                        style={{ width: "100%", borderRadius: "0px" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
