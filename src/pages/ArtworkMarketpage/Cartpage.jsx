import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import "./CartPage.css";

const CartPage = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [activeTab, setActiveTab] = useState("FIXED_PRICE");
  const [selectedIds, setSelectedIds] = useState([]);

  const navigate = useNavigate();

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
      setSelectedIds((prev) => prev.filter((id) => id !== cartItemId));
    } else {
      alert("삭제 실패");
    }
  };

  const handleToggleSelect = (cartItemId) => {
    setSelectedIds((prev) =>
      prev.includes(cartItemId)
        ? prev.filter((id) => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

  const handleToggleAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((item) => item.cartItemId));
    }
  };

  const handleBulkPurchase = async () => {
    if (selectedIds.length === 0) return alert("선택된 작품이 없습니다.");

    try {
      // ✅ 1. 주문 먼저 생성
      const orderRes = await fetch(`/api/cart/orders/create?userId=${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemIds: selectedIds }),
      });

      if (!orderRes.ok) throw new Error("주문 생성 실패");

      const order = await orderRes.json();
      console.log("🧾 주문 응답:", order);

      // ✅ 2. 결제 페이지로 이동 → 실 결제는 Payment.jsx에서 처리
      navigate("/payment", {
        state: {
          cartOrderId: order.orderId,
          paymentType: order.type,
          finalPrice: order.totalAmount, // 서버에서 계산한 총 금액 사용
        },
      });
    } catch (err) {
      console.error(err);
      alert("❌ 주문 생성 실패: " + err.message);
    }
  };

  return (
    <div className="cart-page">
      <h2>🛒 나의 장바구니</h2>

      <div className="cart-tab-buttons">
        <button
          className={activeTab === "FIXED_PRICE" ? "active" : ""}
          onClick={() => {
            setActiveTab("FIXED_PRICE");
            setSelectedIds([]);
          }}
        >
          🛍 지정가
        </button>
        <button
          className={activeTab === "AUCTION" ? "active" : ""}
          onClick={() => {
            setActiveTab("AUCTION");
            setSelectedIds([]);
          }}
        >
          🏆 경매
        </button>
      </div>

      <div className="cart-action-bar">
        <button onClick={handleToggleAll}>
          {selectedIds.length === filteredItems.length ? "전체 해제" : "전체 선택"}
        </button>
        <button onClick={handleBulkPurchase} disabled={selectedIds.length === 0}>
          {selectedIds.length}개 작품 구매하기
        </button>
      </div>

      <div className="cart-list">
        {filteredItems.length === 0 ? (
          <p className="empty-message">장바구니에 담긴 작품이 없습니다.</p>
        ) : (
          filteredItems.map((item) => (
            <div className="cart-item" key={item.cartItemId}>
              <input
                type="checkbox"
                checked={selectedIds.includes(item.cartItemId)}
                onChange={() => handleToggleSelect(item.cartItemId)}
              />
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${item.artworkImageUrl}`}
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartPage;
