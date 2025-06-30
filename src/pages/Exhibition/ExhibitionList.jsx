import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ExhibitionList.css";

export default function ExhibitionList() {
  const [exhibitions, setExhibitions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const tags = ["#인상주의", "#현대미술", "#회화", "#조각", "#디지털아트"];

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  useEffect(() => {
    axios
      .get("/api/exhibitions")
      .then((res) => {
        console.log("📦 전시 목록 응답 데이터:", res.data); // ✅ 로그 찍기
        setExhibitions(res.data);
      })
      .catch((err) => {
        console.error("전시 목록 조회 실패:", err);
      });
  }, []);

  return (
    <div className="exhibition-list-container">
      <h2 className="exhibition-list-title">현재 개설된 전시</h2>
      {/* 🔍 검색창 */}
      <div className="search-section">
        <input
          type="text"
          placeholder="전시 제목 또는 작가 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="search-input"
        />
      </div>

      {/* 🏷️ 태그 필터 */}
      <div className="tag-filter">
        {tags.map((tag) => (
          <button
            key={tag}
            className={`tag-button ${
              selectedTags.includes(tag) ? "selected" : ""
            }`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <div className="exhibition-list-grid">
        {exhibitions.map((exhibition) => (
          <div key={exhibition.id} className="exhibition-card">
            <img
              src={exhibition.thumbnailUrl}
              alt={exhibition.title}
              className="exhibition-list-thumbnail"
            />
            <div className="exhibition-list-info">
              <h3>{exhibition.title}</h3>
              <p style={{ whiteSpace: "pre-line" }}>{exhibition.description}</p>
              <Link
                to={`/exhibitions/Gallery3D/${exhibition.id}`}
                state={{ works: exhibition.artworks, theme: exhibition.theme }}
                className="view-button"
              >
                감상하기
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
