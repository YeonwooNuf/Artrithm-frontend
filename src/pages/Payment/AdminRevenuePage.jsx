import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "./AdminRevenuePage.css";

export default function AdminRevenuePage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState(null);

  const fetchRevenue = async () => {
    try {
      const params = {};
      if (startDate) params.start = startDate;
      if (endDate) params.end = endDate;

      const res = await api.get("/api/admin/revenue", { params });
      setStats(res.data);
    } catch (err) {
      console.error("❌ 매출 정보 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchRevenue(); // 기본값: 전체 기간
  }, []);

  return (
    <div className="admin-revenue-page">
      <h2>📊 관리자 매출 통계</h2>

      <div className="date-filter">
        <label>
          시작일:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          종료일:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={fetchRevenue}>조회</button>
      </div>

      {stats && (
        <div className="revenue-stats">
          <h3>💰 매출 요약</h3>
          <p><strong>작품 판매 총액:</strong> ₩{stats.artworkRevenue.toLocaleString()}</p>
          <p><strong>구독 결제 총액:</strong> ₩{stats.subscriptionRevenue.toLocaleString()}</p>
          <p><strong>총 매출:</strong> ₩{stats.totalRevenue.toLocaleString()}</p>
          <p><strong>전시관 수수료 수익:</strong> ₩{stats.totalCommission.toLocaleString()}</p>
          <p><strong>작가 정산 총액:</strong> ₩{stats.payoutAmount.toLocaleString()}</p>

          <h3>🖼 작품 판매 현황</h3>
          <p><strong>판매된 작품 수:</strong> {stats.soldArtworkCount}개</p>
          <p><strong>고정가 판매:</strong> {stats.fixedPriceSoldCount}개</p>
          <p><strong>경매 판매:</strong> {stats.auctionSoldCount}개</p>

          <h3>👤 구독자 정보</h3>
          <p><strong>현재 구독자 수:</strong> {stats.currentSubscriberCount}명</p>
          <ul>
            {stats.tierBreakdown &&
              Object.entries(stats.tierBreakdown).map(([tier, count]) => (
                <li key={tier}>
                  <strong>{tier}:</strong> {count}명
                </li>
              ))}
          </ul>

          <h3>🎨 활동 작가 수</h3>
          <p><strong>해당 기간 판매 작가 수:</strong> {stats.activeArtistCount}명</p>
        </div>
      )}
    </div>
  );
}
