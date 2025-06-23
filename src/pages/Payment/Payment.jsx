import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as PortOne from "@portone/browser-sdk/v2";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    paymentType,
    cartOrderId,
    finalPrice,
    tierId,
    isYearly = false,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("CARD");

  useEffect(() => {
    if (!paymentType || !finalPrice) {
      alert("결제 정보가 누락되었습니다.");
      navigate(-1);
    }
  }, []);

  const getUserId = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return null;
    }
    try {
      return JSON.parse(user).id;
    } catch {
      alert("잘못된 사용자 정보입니다.");
      return null;
    }
  };

  const randomId = () =>
    [...crypto.getRandomValues(new Uint32Array(2))]
      .map((word) => word.toString(16).padStart(8, "0"))
      .join("");

  const handlePayment = async () => {
    const userId = getUserId();
    if (!userId) return;

    const paymentId = randomId();

    const payment = await PortOne.requestPayment({
      storeId: "store-648c3fc7-1da1-467a-87bb-3b235f5c9879",
      channelKey: "channel-key-f3019356-750d-42dd-b2ba-9c857896bd38",
      paymentId,
      orderName:
        paymentType === "SUBSCRIPTION"
          ? "Artrithm 구독 결제"
          : paymentType === "AUCTION"
          ? "Artrithm 경매 낙찰 결제"
          : "Artrithm 작품 구매",
      totalAmount: finalPrice,
      currency: "KRW",
      customer: {
        fullName: "홍길동",
        phoneNumber: "010-1234-5678",
        email: "test@artrithm.com",
      },
      payMethod: paymentMethod.toUpperCase(),
    });

    if (payment.code !== undefined) {
      alert(`결제 실패: ${payment.message}`);
      return;
    }

    const body = {
      userId,
      paymentType,
      paymentId,
      totalAmount: finalPrice,
      paymentMethod,
      cartOrderId,
      tierId,
      isYearly,
    };

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      const paymentDate = new Date().toISOString();
      navigate("/order/complete", {
        state: {
          paymentId,
          paymentType,
          finalAmount: finalPrice,
          paymentDate,
        },
      });
    } else {
      alert("결제 검증 실패");
    }
  };

  return (
    <div className="payment">
      <h2>결제하기</h2>
      <h3>총 결제 금액: {finalPrice.toLocaleString()}원</h3>

      <label>결제 수단 선택:</label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="card">카드 결제</option>
        <option value="naverpay">네이버페이</option>
        <option value="kakaopay">카카오페이</option>
      </select>

      <button onClick={handlePayment}>결제 진행</button>
    </div>
  );
};

export default Payment;
