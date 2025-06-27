import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./PaymentReceiptPage.css";

export default function PaymentReceiptPage() {
    const { paymentId } = useParams();
    const navigate = useNavigate();
    const [receipt, setReceipt] = useState(null);
    const userId = parseInt(localStorage.getItem("userId")); // 🔍 현재 사용자 ID

    useEffect(() => {
        const fetchReceipt = async () => {
            try {
                const res = await api.get(`/api/payments/${paymentId}`);
                console.log("🧾 영수증 응답:", res.data);
                setReceipt(res.data);
            } catch (err) {
                console.error("❌ 영수증 불러오기 실패:", err);
            }
        };

        fetchReceipt();
    }, [paymentId]);

    if (!receipt) return <div className="receipt-page">로딩 중...</div>;

    const item = receipt.items[0]; // ✅ 단일 구매라고 가정
    const isBuyer = item.buyerId === userId;

    return (
        <div className="receipt-page">
            <div className="receipt-container">
                <h2 className="shop-name">🎨 Artrithm Gallery</h2>
                <div className="receipt-divider" />

                <div className="receipt-info">
                    <p><strong>주문번호:</strong> {receipt.paymentId}</p>
                    <p><strong>구매일시:</strong> {new Date(receipt.paidAt).toLocaleString()}</p>
                    <p><strong>결제수단:</strong> {receipt.paymentMethod}</p>
                </div>

                <div className="receipt-divider" />

                <div className="item-info">
                    <p><strong>작품명:</strong> {item.artworkTitle}</p>
                    <p><strong>{isBuyer ? "판매자" : "구매자"}:</strong> {isBuyer ? item.sellerNickname : item.buyerNickname}</p>
                    <p><strong>가격:</strong> ₩{item.price.toLocaleString()}</p>
                    <p><strong>거래 방식:</strong> {item.purchaseType}</p>

                    {!isBuyer && (
                        <>
                            <p><strong>수수료율:</strong> {(receipt.commissionRate * 100).toFixed(0)}%</p>
                            <p><strong>수수료 금액:</strong> ₩{receipt.commissionAmount.toLocaleString()}</p>
                            <p><strong>정산 금액:</strong> ₩{receipt.payoutAmount.toLocaleString()}</p>
                        </>
                    )}
                </div>

                <div className="receipt-divider" />

                <div className="total-info">
                    <p><strong>총 결제금액:</strong> ₩{receipt.totalAmount.toLocaleString()}</p>
                </div>

                <div className="receipt-divider" />
                <p className="thanks">거래해주셔서 감사합니다.</p>
                <button className="back-button" onClick={() => navigate(-1)}>← 돌아가기</button>
            </div>
        </div>
    );
}
