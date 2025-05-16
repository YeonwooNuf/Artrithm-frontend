import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ExhibitionList() {
    const [exhibitions, setExhibitions] = useState([]);

    useEffect(() => {
        axios.get("/api/exhibitions")
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
            <div className="exhibition-list-grid">
                {exhibitions.map((exhibition) => (
                    <div key={exhibition.id} className="exhibition-card">
                        <img
                            src={exhibition.thumbnailUrl}
                            alt={exhibition.title}
                            className="exhibition-thumbnail"
                        />
                        <div className="exhibition-info">
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
