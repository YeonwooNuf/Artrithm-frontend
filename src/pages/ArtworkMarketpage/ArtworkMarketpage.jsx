import React, { useState, useEffect } from "react";
import { dummyArtists } from "../../data/dummyArtists";
import "./ArtworkMarketpage.css";

const ArtworkMarketpage = () => {
  const [mode, setMode] = useState("buy");
  const [selectedArtworkMap, setSelectedArtworkMap] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");

  const handleSearch = () => {
    setActiveQuery(searchInput);
  };

  const filteredArtists = dummyArtists
    .map((artist) => {
      const matchedWorks = artist.works.filter((work) =>
        work.title.toLowerCase().includes(activeQuery.toLowerCase())
      );
      const isArtistMatched = artist.name
        .toLowerCase()
        .includes(activeQuery.toLowerCase());

      if (isArtistMatched || matchedWorks.length > 0) {
        return {
          ...artist,
          works: artist.works,
        };
      }

      return null;
    })
    .filter((artist) => artist !== null);
  useEffect(() => {
    if (activeQuery && filteredArtists.length > 0) {
      const lowerQuery = activeQuery.toLowerCase();
      const newMap = { ...selectedArtworkMap };

      filteredArtists.forEach((artist) => {
        if (!newMap[artist.name]) {
          const match = artist.works.find((work) =>
            work.title.toLowerCase().includes(lowerQuery)
          );

          newMap[artist.name] = match || artist.works[0];
        }
      });

      setSelectedArtworkMap(newMap);
    }
  }, [activeQuery, filteredArtists]);

  return (
    <div className="marketplace-wrapper">
      {/* 상단 버튼 */}
      <div className="marketpage-mode-buttons">
        <button
          onClick={() => setMode("buy")}
          className={`marketpage-mode-button ${mode === "buy" ? "active" : ""}`}
        >
          작품 구매하기
        </button>
        <span className="marketpage-mode-divider">|</span>
        <button
          onClick={() => setMode("sell")}
          className={`marketpage-mode-button ${
            mode === "sell" ? "active" : ""
          }`}
        >
          작품 판매하기
        </button>

        {mode === "buy" && (
          <div className="marketpage-search-bar">
            <input
              type="text"
              placeholder="작가님과 작품을 검색해보세요"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button onClick={handleSearch}>검색</button>
          </div>
        )}
      </div>

      {/* 구매 모드 */}
      {mode === "buy" && (
        <>
          <div className="marketplace-wrapper">
            {filteredArtists.map((artist, index) => {
              const selectedArtwork =
                selectedArtworkMap[artist.name] || artist.works[0];

              return (
                <div key={index} className="marketplace-container">
                  {/* 상단 선택된 작품 박스 */}
                  {artist && selectedArtwork && selectedArtwork.title && (
                    <div className="highlighted-artwork-section">
                      <img
                        src={selectedArtwork.src}
                        alt={selectedArtwork.title}
                        className="highlighted-artwork"
                      />
                      <div className="artwork-info-box">
                        <h3>
                          {selectedArtwork.title}
                          {"  "}
                          <span className="artist-name-tooltip-container">
                            <span className="artist-name">
                              {` (By ${artist.name})`}
                            </span>
                            <div className="artist-tooltip">
                              <img
                                src={artist.profileImage}
                                alt={artist.name}
                              />
                              <p>{artist.bio}</p>
                            </div>
                          </span>
                        </h3>
                        <p>{selectedArtwork.description}</p>
                        <p style={{ fontSize: "0.9em", color: "#888" }}>
                          가격: {selectedArtwork.price || "문의"}
                        </p>
                        <div
                          className="marketpage
                        -buttons"
                        >
                          <button className="marketpage-exhibition-button">
                            🖼 전시회에서 보기
                          </button>
                          <button className="marketpage-buy-button">
                            {" "}
                            🛒 구매하기
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="marketplace-artwork-grid">
                    {artist.works.map((work) => (
                      <div
                        key={work.id}
                        className={`artwork-card ${
                          selectedArtwork.id === work.id ? "selected" : ""
                        }`}
                        onClick={() =>
                          setSelectedArtworkMap((prev) => ({
                            ...prev,
                            [artist.name]: work,
                          }))
                        }
                      >
                        <img
                          src={work.src}
                          alt={work.title}
                          style={{ width: "100%", borderRadius: "0px" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* 판매 모드 */}
      {mode === "sell" && (
        <div className="marketpage-sell-placeholder">
          <h2>작품 판매 등록 페이지</h2>
          <p>여기에 판매 폼 만들 예정</p>
        </div>
      )}
    </div>
  );
};

export default ArtworkMarketpage;
