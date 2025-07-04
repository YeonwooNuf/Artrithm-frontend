import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ArtworkDetail.css";

const ArtworkDetail = ({ user }) => {
  const { artworkId } = useParams(); // artworkId
  const navigate = useNavigate();
  const userId = user?.id;

  const [artwork, setArtwork] = useState(null);
  const [showCartModal, setShowCartModal] = useState(false);

  useEffect(() => {
    fetch(`/api/fixed-price-sale/${artworkId}`)
      .then((res) => res.json())
      .then((data) => setArtwork(data))
      .catch((err) => console.error("작품 상세 불러오기 실패", err));
  }, [artworkId]);

  // 장바구니 추가 처리
  const handleAddToCart = async (artworkId, fixedPriceSaleId) => {
    console.log("🛒 장바구니 추가 요청", {
      userId,
      artworkId,
      fixedPriceSaleId,
    });
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

  const handleBuyNow = () => {
    navigate(`/checkout?artworkId=${artwork.artworkId}`);
  };

  if (!artwork) return <p>로딩 중...</p>;

  return (
    <div className="artwork-detail-container">
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

      <div className="artwork-detail-left">
        <img
          src={artwork.artworkImageUrl}
          alt={artwork.artworkTitle}
          className="artwork-detail-image"
        />
      </div>

      <div className="artwork-detail-right">
        <h2>{artwork.artworkTitle}</h2>
        <p className="artist-name">by {artwork.sellerNickname}</p>
        <p className="artwork-description">{artwork.description}</p>
        <p className="artwork-price">💰 {artwork.price?.toLocaleString()}원</p>
        <p className="artwork-date">
          🗓 등록일:{" "}
          {artwork.createdAt
            ? new Date(artwork.createdAt).toLocaleDateString()
            : "등록일 없음"}
        </p>

        <div className="artwork-detail-buttons">
          <button
            className="add-to-cart-button"
            onClick={() =>
              handleAddToCart(artwork.artworkId, artwork.fixedPriceSaleId)
            }
          >
            🛒 장바구니 담기
          </button>
          <button className="buy-now-button" onClick={handleBuyNow}>
            💳 바로 구매하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
