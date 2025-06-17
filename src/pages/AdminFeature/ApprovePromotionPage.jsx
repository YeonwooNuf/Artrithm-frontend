import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ApprovePromotionPage.css";
import api from "../../api/axios";

export default function ApprovePromotionPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // 대기 중인 작가 승격 요청 목록 조회
    api.get("/api/promotion-requests/pending")
      .then(res => {
        console.log("✅ 서버로부터 받은 작가 요청 목록:", res.data);
        setRequests(res.data);
      })
      .catch(err => {
        console.error("❌ 요청 목록 불러오기 실패:", err);
        alert("요청 목록을 불러오는 데 실패했습니다.");
      });
  }, []);

  const handleApprove = async (requestId) => {
    try {
      await api.put(`/api/promotion-requests/${requestId}/approve`);
      alert("✅ 승인 완료되었습니다.");
      // 승인된 요청은 목록에서 제거
      setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
    } catch (err) {
      console.error("❌ 승인 실패:", err);
      alert("승인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="approve-promotion-page">
      <h2>작가 승인 요청 목록</h2>

      {requests.length === 0 ? (
        <p>현재 대기 중인 요청이 없습니다.</p>
      ) : (
        requests.map((req) => {
          console.log("✅ 대표작 이미지 경로 확인:", req.artworkImageUrls);

          return (
            <div key={req.requestId} className="request-card">
              <h4>{req.nickname} 님</h4>
              <p><strong>요청 사유:</strong> {req.reason}</p>

              <div className="image-preview-container">
                {req.artworkImageUrls.map((url, index) => {
                  const fullUrl = `${import.meta.env.VITE_API_BASE_URL}${url}`;
                  console.log(`🖼️ 이미지 ${index + 1} →`, fullUrl);
                  return (
                    <img
                      key={index}
                      src={fullUrl}
                      alt={`대표작 ${index + 1}`}
                    />
                  );
                })}
              </div>

              <button onClick={() => handleApprove(req.requestId)}>승인하기</button>
            </div>
          );
        })
      )}
    </div>
  );
}
