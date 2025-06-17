import React, { useEffect, useState } from "react";
import "./CartPage.css"; // CSS는 아래에 따로 제공할게

const CartPage = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [activeTab, setActiveTab] = useState("FIXED_PRICE");

  useEffect(() => {
    if (!user?.id) return;

    fetch(`/api/cart/${user.id}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error("❌ 장바구니 로드 실패", err));
  }, [user]);

  const filteredItems = cartItems.filter((item) => item.type === activeTab);

  const handleDelete = async (cartItemId) => {
    const res = await fetch(`/api/cart/delete/${cartItemId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("삭제 완료!");
      setCartItems((prev) =>
        prev.filter((item) => item.cartItemId !== cartItemId)
      );
    } else {
      alert("삭제 실패");
    }
  };

  return (
    <div className="cart-page">
      <h2>🛒 나의 장바구니</h2>

      <div className="cart-tab-buttons">
        <button
          className={activeTab === "FIXED_PRICE" ? "active" : ""}
          onClick={() => setActiveTab("FIXED_PRICE")}
        >
          🛍 지정가
        </button>
        <button
          className={activeTab === "AUCTION" ? "active" : ""}
          onClick={() => setActiveTab("AUCTION")}
        >
          🏆 경매
        </button>
      </div>

      <div className="cart-list">
        {filteredItems.length === 0 ? (
          <p className="empty-message">장바구니에 담긴 작품이 없습니다.</p>
        ) : (
          filteredItems.map((item) => (
            <div className="cart-item" key={item.cartItemId}>
              <img
                src={`http://localhost:8080${item.artworkImageUrl}`}
                alt={item.artworkTitle}
                className="cart-thumbnail"
              />
              <div className="cart-info">
                <h4>{item.artworkTitle}</h4>
                <p>
                  {item.type === "FIXED_PRICE"
                    ? `정가: ${item.price.toLocaleString()}원`
                    : `낙찰가: ${item.price?.toLocaleString() || "?"}원`}
                </p>
              </div>
              <button
                className="remove-button"
                onClick={() => handleDelete(item.cartItemId)}
              >
                삭제
              </button>
              <button className="purchase-button">구매</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartPage;
