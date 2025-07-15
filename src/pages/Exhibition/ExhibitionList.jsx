import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ExhibitionList.css";

export default function ExhibitionList() {
  const [exhibitions, setExhibitions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // 태그 선택/해제 핸들러
  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 랜덤 태그 목록 불러오기
  const fetchRandomTags = async () => {
    try {
      const res = await axios.get("/api/keywords/random?count=5");
      setAvailableTags(res.data);
    } catch (err) {
      console.error("❌ 랜덤 태그 로딩 실패:", err);
    }
  };

  // 전체 전시 불러오기
  const fetchExhibitions = async () => {
    try {
      const res = await axios.get("/api/exhibitions");
      setExhibitions(res.data);
    } catch (err) {
      console.error("전시 목록 조회 실패:", err);
    }
  };

  // 검색 또는 태그 기반 Elasticsearch 호출
  const handleSearch = async () => {
    try {
      if (searchKeyword.trim()) {
        const res = await axios.get("/api/search", {
          params: { query: searchKeyword },
        });
        setExhibitions(res.data);
      } else if (selectedTags.length > 0) {
        const keywords = selectedTags.map((t) => t.replace("#", ""));
        console.log("✅ 검색 요청 keyword 목록:", keywords);

        const res = await axios.get("/api/search/recommend", {
          params: { keyword: keywords }, // 백엔드에 맞는 key로 전달
          paramsSerializer: (params) => {
            if (!params.keyword || !Array.isArray(params.keyword)) return "";
            return params.keyword.map((k) => `keyword=${encodeURIComponent(k)}`).join("&");
          },
        });
        setExhibitions(res.data);
      } else {
        fetchExhibitions();
      }
    } catch (err) {
      console.error("🔍 검색 실패:", err);
    }
  };

  const handleSemanticRecommend = async () => {
    try {
      if (!searchKeyword.trim()) return;

      const res = await axios.get("http://192.168.10.159:8000/api/recommend", {
        params: { query: searchKeyword },
      });
      console.log("🔥 의미 기반 추천 응답:", res.data);

      const recommended = res.data.recommended;
      if (!Array.isArray(recommended)) {
        console.error("❌ recommended 형식 오류:", recommended);
        setExhibitions([]);
        return;
      }

      const ids = recommended.map((r) => r.id);
      const detailRes = await axios.get("/api/exhibitions/by-ids", {
        params: { ids: ids.join(",") },
      });

      const rankedMap = new Map(recommended.map((r) => [r.id, r.rank]));
      const sorted = detailRes.data
        .map((ex) => ({
          ...ex,
          rank: rankedMap.get(ex.id) ?? null,
        }))
        .sort((a, b) => a.rank - b.rank);

      setExhibitions(sorted);
    } catch (err) {
      console.error("🔥 의미 기반 추천 실패:", err);
      setExhibitions([]);
    }
  };

  useEffect(() => {
    fetchExhibitions();
    fetchRandomTags();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchKeyword, selectedTags]);

  return (
    <div className="exhibition-list-container">
      <h2 className="exhibition-list-title">현재 개설된 전시</h2>

      <div className="search-section">
        <input
          type="text"
          placeholder="전시 제목 또는 작가 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="search-input"
        />
        <button className="recommend-button" onClick={handleSemanticRecommend}>
          추천 전시 보기
        </button>
      </div>

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
