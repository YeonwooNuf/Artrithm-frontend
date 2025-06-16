import React, { useEffect, useState } from "react";
import "./cartpage.css";

const Cartpage = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/cart/${user.id}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error("장바구니 불러오기 실패", err));
  }, [user]);

  const fixedItems = cartItems.filter((item) => item.type === "FIXED_PRICE");
  const auctionItems = cartItems.filter((item) => item.type === "AUCTION");

  return (
    <div className="cart-page">
      <h2>🛍 장바구니</h2>

      <section>
        <h3>정가 구매 작품</h3>
        {fixedItems.length === 0 ? (
          <p>없음</p>
        ) : (
          <ul>
            {fixedItems.map((item) => (
              <li key={item.id}>
                {item.artworkTitle} - {item.price.toLocaleString()}원
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3>경매 낙찰 작품</h3>
        {auctionItems.length === 0 ? (
          <p>없음</p>
        ) : (
          <ul>
            {auctionItems.map((item) => (
              <li key={item.id}>
                {item.artworkTitle} - 낙찰가:{" "}
                {item.price?.toLocaleString() || "?"}원
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default Cartpage;
