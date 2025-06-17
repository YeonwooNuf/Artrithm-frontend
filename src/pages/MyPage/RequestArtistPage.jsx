import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RequestArtistPage.css";
import api from '../../api/axios';

export default function RequestArtistPage() {
  const [reason, setReason] = useState("");
  const [artworks, setArtworks] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (artworks.length !== 4) {
      alert("대표작 4개를 첨부해주세요.");
      return;
    }

    const userId = localStorage.getItem("userId");
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("reason", reason);
    artworks.forEach((file) => formData.append("artworkImages", file));

    try {
      await api.post("/api/promotion-requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("작가 승격 요청이 제출되었습니다.");
      navigate("/mypage");
    } catch (err) {
      console.error("요청 실패:", err);
      alert(err.response?.data || "요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="request-artist-container">
      <h2>작가 승인 요청</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>작가 신청 사유</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <label>대표작 업로드 (4개)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setArtworks(Array.from(e.target.files))}
        />

        <button type="submit">요청 제출</button>
      </form>
    </div>
  );
}
