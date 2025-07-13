import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import "./AdminRevenuePage.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

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
    fetchRevenue(); // 전체 기간 기본 조회
  }, []);

  return (
    <div className="admin-revenue-page">
      <h2>관리자 매출 통계</h2>

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
          <section className="stat-card">
            <h3>매출 요약</h3>
            <p><strong>작품 판매 총액:</strong> ₩ {stats.artworkRevenue.toLocaleString()}</p>
            <p><strong>구독 결제 총액:</strong> ₩ {stats.subscriptionRevenue.toLocaleString()}</p>
            <p><strong>총 매출:</strong> ₩ {stats.totalRevenue.toLocaleString()}</p>
            <p><strong>전시관 수수료 수익:</strong> ₩ {stats.totalCommission.toLocaleString()}</p>
            <p><strong>작가 정산 총액:</strong> ₩ {stats.payoutAmount.toLocaleString()}</p>
          </section>

          <section className="stat-card">
            <h3>작품 판매 현황</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                { name: "고정가", count: stats.fixedPriceSoldCount },
                { name: "경매", count: stats.auctionSoldCount }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            <p><strong>전체 판매 수:</strong> {stats.soldArtworkCount}개</p>
          </section>

          <section className="stat-card">
            <h3>구독자 분포</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={Object.entries(stats.tierBreakdown || {}).map(([tier, count]) => ({
                    name: tier,
                    value: count
                  }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {Object.entries(stats.tierBreakdown || {}).map(([tier], index) => (
                    <Cell key={tier} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p><strong>총 구독자 수:</strong> {stats.currentSubscriberCount}명</p>
          </section>

          <section className="stat-card">
            <h3>작가 활동</h3>
            <p><strong>판매 작가 수:</strong> {stats.activeArtistCount}명</p>
          </section>
        </div>
      )}
    </div>
  );
}
