import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ExhibitionList.css";

export default function ExhibitionList() {
  const [exhibitions, setExhibitions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // ✅ 태그 선택/해제 핸들러
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // ✅ 랜덤 태그 목록 불러오기
  const fetchRandomTags = async () => {
    try {
      const res = await axios.get("/api/keywords/random?count=5");
      setAvailableTags(res.data);
    } catch (err) {
      console.error("❌ 랜덤 태그 로딩 실패:", err);
    }
  };

  // ✅ 전체 전시 불러오기
  const fetchExhibitions = async () => {
    try {
      const res = await axios.get("/api/exhibitions");
      console.log("📦 전시 목록 응답 데이터:", res.data);
      setExhibitions(res.data);
    } catch (err) {
      console.error("전시 목록 조회 실패:", err);
    }
  };

  // ✅ 검색 또는 태그 기반 Elasticsearch 호출
  const handleSearch = async () => {
    try {
      if (searchKeyword.trim()) {
        const res = await axios.get("/api/search", {
          params: { query: searchKeyword },
        });
        setExhibitions(res.data);
      } else if (selectedTags.length > 0) {
        const keywords = selectedTags.map((t) => t.replace("#", ""));
        const res = await axios.get("/api/search/recommend", {
          params: { keyword: keywords[0] },
        });
        setExhibitions(res.data);
      } else {
        fetchExhibitions();
      }
    } catch (err) {
      console.error("🔍 검색 실패:", err);
    }
  };

  // ✅ 첫 마운트 시 전체 조회 + 태그 로드
  useEffect(() => {
    fetchExhibitions();
    fetchRandomTags();
  }, []);

  // ✅ 검색어/태그 변경 시 검색 수행
  useEffect(() => {
    handleSearch();
  }, [searchKeyword, selectedTags]);

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

      {/* 🏷️ 랜덤 태그 필터 */}
      <div className="tag-filter">
        {availableTags.map((tag) => (
          <button
            key={tag}
            className={`tag-button ${selectedTags.includes(tag) ? "selected" : ""}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* 🎨 전시 리스트 */}
      <div className="exhibition-list-grid">
        {exhibitions.map((exhibition) => (
          <div key={exhibition.id} className="exhibition-list-card">
            <img
              src={exhibition.thumbnailUrl}
              alt={exhibition.title}
              className="exhibition-list-thumbnail"
            />
            <div className="exhibition-list-info">
              <h3>{exhibition.title}</h3>
              <p style={{ whiteSpace: "pre-line" }}>{exhibition.description}</p>
              <Link
                to={`/exhibitions/${exhibition.id}`}
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
