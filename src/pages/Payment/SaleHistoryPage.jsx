import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./SaleHistoryPage.css";

export default function SaleHistoryPage() {
  const userId = localStorage.getItem("userId");
  const [activeTab, setActiveTab] = useState("purchase");
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const [purchaseRes, saleRes] = await Promise.all([
        api.get(`/api/history/purchases/${userId}`),
        api.get(`/api/history/sales/${userId}`)
      ]);
      console.log("✅ [구매 내역 응답]:", purchaseRes.data);
      console.log("✅ [판매 내역 응답]:", saleRes.data);
      setPurchases(purchaseRes.data);
      setSales(saleRes.data);
    } catch (err) {
      console.error("❌ 거래 내역 불러오기 실패:", err);
    }
  };

  const renderPurchaseCard = (item) => (
    <div
      key={`purchase-${item.artworkId}-${item.purchasedAt}`}
      className="history-card"
      onClick={() => navigate(`/artwork/${item.artworkId}`)}
    >
      <div className="thumbnail">
        <img src={item.artworkImageUrl} alt={item.artworkTitle} />
      </div>
      <div className="details">
        <h3>{item.artworkTitle}</h3>
        <p className="label">작가: {item.sellerNickname}</p>
        <p>{item.method === "AUCTION" ? "경매 낙찰" : "즉시 구매"}</p>
        <p className="price">₩{item.price.toLocaleString()}</p>
        <p className="date">{new Date(item.purchasedAt).toLocaleString()}</p>
      </div>
    </div>
  );

  const renderSaleCard = (item) => (
    <div
      key={`sale-${item.artworkId}-${item.soldAt}`}
      className="history-card"
      onClick={() => navigate(`/artwork/${item.artworkId}`)}
    >
      <div className="thumbnail">
        <img src={item.artworkImageUrl} alt={item.artworkTitle} />
      </div>
      <div className="details">
        <h3>{item.artworkTitle}</h3>
        <p className="label">구매자: {item.buyerNickname}</p>
        <p>{item.status}</p>
        <p className="price">₩{item.price.toLocaleString()}</p>
        <p className="date">{new Date(item.soldAt).toLocaleString()}</p>
      </div>
    </div>
  );

  const currentList =
    activeTab === "purchase" ? purchases : sales;

  return (
    <div className="sale-history-page">
      <h2 className="title">🧾 구매 / 판매 내역</h2>
      <div className="tab-menu">
        <button
          className={activeTab === "purchase" ? "active" : ""}
          onClick={() => setActiveTab("purchase")}
        >
          구매 내역
        </button>
        <button
          className={activeTab === "sale" ? "active" : ""}
          onClick={() => setActiveTab("sale")}
        >
          판매 내역
        </button>
      </div>

      <div className="history-list">
        {currentList.length === 0 ? (
          <p className="no-data">거래 내역이 없습니다.</p>
        ) : activeTab === "purchase" ? (
          currentList.map(renderPurchaseCard)
        ) : (
          currentList.map(renderSaleCard)
        )}
      </div>
    </div>
  );
}
