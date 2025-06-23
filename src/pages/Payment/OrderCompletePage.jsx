import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderCompletePage.css";

const OrderCompletePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentId, paymentType, finalAmount, paymentDate } = location.state || {};

  if (!paymentId) {
    return (
      <div className="ocp-container">
        <h2 className="ocp-title">잘못된 접근입니다.</h2>
        <button className="ocp-button" onClick={() => navigate("/")}>홈으로 돌아가기</button>
      </div>
    );
  }

  const formatDate = (iso) => {
    const date = new Date(iso);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
  };

  const getPaymentLabel = () => {
    switch (paymentType) {
      case "SUBSCRIPTION":
        return "구독 결제";
      case "AUCTION":
        return "경매 낙찰 결제";
      case "CART_ORDER":
      default:
        return "작품 구매";
    }
  };

  return (
    <div className="ocp-container">
      <div className="ocp-card">
        <h2 className="ocp-title">🎉 결제가 완료되었습니다!</h2>
        <p className="ocp-subtitle">아래 결제 정보를 확인해주세요.</p>

        <div className="ocp-summary">
          <div className="ocp-item"><span>결제 유형</span><strong>{getPaymentLabel()}</strong></div>
          <div className="ocp-item"><span>결제 번호</span><strong>{paymentId}</strong></div>
          <div className="ocp-item"><span>결제 금액</span><strong>{finalAmount.toLocaleString()}원</strong></div>
          <div className="ocp-item"><span>결제 일시</span><strong>{formatDate(paymentDate)}</strong></div>
        </div>

        <button className="ocp-button" onClick={() => navigate("/")}>홈으로 돌아가기</button>
      </div>
    </div>
  );
};

export default OrderCompletePage;
