import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ExhibitionUpload.css";

export default function ExhibitionEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exhibition, setExhibition] = useState(null);
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || {});
    const [artistList, setArtistList] = useState([]);
    const [selectedArtistId, setSelectedArtistId] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState(null);

    useEffect(() => {
        axios.get(`/api/exhibitions/${id}`)
            .then(res => {
                setExhibition(res.data);
                setSelectedArtistId(res.data.artistInfo?.id || "");
            })
            .catch(err => console.error("전시 불러오기 실패", err));

        if (user.role === "ADMIN") {
            axios.get("/api/artists")
                .then(res => setArtistList(res.data))
                .catch(err => console.error("작가 목록 로딩 실패", err));
        }
    }, [id, user.role]);

    const handleChange = (field, value) => {
        setExhibition(prev => ({ ...prev, [field]: value }));
    };

    const handleArtworkChange = (index, field, value) => {
        const updated = [...exhibition.artworks];
        updated[index] = { ...updated[index], [field]: value };
        setExhibition(prev => ({ ...prev, artworks: updated }));
    };

    const handleImageChange = (index, file) => {
        const updated = [...exhibition.artworks];
        updated[index] = { ...updated[index], imageFile: file };
        setExhibition(prev => ({ ...prev, artworks: updated }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("authorId", user.id);
            formData.append("title", exhibition.title);
            formData.append("description", exhibition.description);
            formData.append("theme", exhibition.theme);

            if (thumbnailFile) {
                formData.append("thumbnail", thumbnailFile);
            } else {
                formData.append("thumbnailUrl", exhibition.thumbnailUrl);
            }

            exhibition.keywords.forEach((kw, i) => formData.append(`keywords[${i}]`, kw));

            if (user.role === "ADMIN" && selectedArtistId) {
                formData.append("artistId", selectedArtistId);
            }

            exhibition.artworks.forEach((work, i) => {
                formData.append(`works[${i}].title`, work.title);
                formData.append(`works[${i}].description`, work.description);
                if (work.imageFile) {
                    formData.append(`works[${i}].image`, work.imageFile);
                } else if (work.imageUrl) {
                    formData.append(`works[${i}].imageUrl`, work.imageUrl);
                }
            });

            await axios.put(`/api/exhibitions/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("전시가 수정되었습니다.");
            navigate("/mypage");
        } catch (err) {
            console.error("전시 수정 실패", err);
            alert("수정 중 오류 발생");
        }
    };

    if (!exhibition) return <p>불러오는 중...</p>;

    return (
        <div className="upload-container">
            <h2 className="upload-title">전시 수정</h2>
            <form className="upload-form" onSubmit={handleSubmit}>
                <label>전시 제목</label>
                <input className="input" value={exhibition.title} onChange={e => handleChange("title", e.target.value)} required />

                <label>전시 설명</label>
                <textarea className="textarea" value={exhibition.description} onChange={e => handleChange("description", e.target.value)} required />

                <label>전시 테마</label>
                <select className="select" value={exhibition.theme} onChange={e => handleChange("theme", e.target.value)}>
                    <option value="modern">Modern</option>
                    <option value="circle">Circle</option>
                    {user.role === "ADMIN" && <option value="masterpiece">MasterPiece</option>}
                </select>

                <label>썸네일 이미지 업로드</label>
                <input className="input" type="file" accept="image/*" onChange={e => setThumbnailFile(e.target.files[0])} />

                <label>기존 썸네일 경로</label>
                <input className="input" value={exhibition.thumbnailUrl} onChange={e => handleChange("thumbnailUrl", e.target.value)} disabled />

                <label>키워드 (쉼표로 구분)</label>
                <input className="input" value={exhibition.keywords?.join(", ")} onChange={e => handleChange("keywords", e.target.value.split(/[\s,]+/))} />

                {user.role === "ADMIN" && (
                    <>
                        <label>작가 선택</label>
                        <select className="select" value={selectedArtistId} onChange={e => setSelectedArtistId(e.target.value)}>
                            <option value="">작가를 선택하세요</option>
                            {artistList.map((artist) => (
                                <option key={artist.id} value={artist.id}>{artist.name}</option>
                            ))}
                        </select>
                    </>
                )}

                <div className="works-section">
                    <h3>작품 목록 수정</h3>
                    {exhibition.artworks.map((work, index) => (
                        <div className="work-item" key={index}>
                            <label>작품 제목</label>
                            <input className="input" value={work.title} onChange={e => handleArtworkChange(index, "title", e.target.value)} required />

                            <label>작품 설명</label>
                            <textarea className="textarea" value={work.description} onChange={e => handleArtworkChange(index, "description", e.target.value)} required />

                            <label>작품 이미지 업로드</label>
                            <input className="input" type="file" accept="image/*" onChange={e => handleImageChange(index, e.target.files[0])} />

                            <input type="hidden" name={`works[${index}].imageUrl`} value={work.imageUrl} />
                        </div>
                    ))}
                </div>

                <button type="submit" className="ex-upload-button">저장</button>
            </form>
        </div>
    );
}