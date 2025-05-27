import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Exhibition/ExhibitionUpload.css";
import { useNavigate } from "react-router-dom";

export default function ExhibitionUploadMasterpiece() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [keywords, setKeywords] = useState("");
  const [works, setWorks] = useState([]);
  const [artistList, setArtistList] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get("/api/artists")
      .then(res => setArtistList(res.data))
      .catch(err => console.error("작가 목록 불러오기 실패", err));
  }, []);

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleAddWork = () => {
    setWorks([...works, { title: "", description: "", image: null }]);
  };

  const handleWorkChange = (index, field, value) => {
    const updated = [...works];
    updated[index][field] = value;
    setWorks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedArtistId) {
      alert("작가를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("authorId", userId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("theme", "masterpiece");
    formData.append("thumbnail", thumbnail);
    formData.append("artistId", selectedArtistId);

    keywords.split(/[,\s]+/).forEach((kw, i) => formData.append(`keywords[${i}]`, kw));

    works.forEach((w, i) => {
      formData.append(`works[${i}].title`, w.title);
      formData.append(`works[${i}].description`, w.description);
      formData.append(`works[${i}].image`, w.image);
    });

    try {
      await axios.post("/api/exhibitions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("명화 전시가 성공적으로 업로드되었습니다.");
      navigate("/view");
    } catch (err) {
      console.error("전시 업로드 실패:", err);
      alert("전시 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">명화 전시 업로드</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <label>전시 제목</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>전시 설명</label>
        <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>썸네일 이미지</label>
        <input className="input" type="file" accept="image/*" onChange={handleThumbnailChange} required />

        <label>키워드 (쉼표 또는 공백 구분)</label>
        <input className="input" value={keywords} onChange={(e) => setKeywords(e.target.value)} />

        <label>작가 선택</label>
        <select className="select" value={selectedArtistId} onChange={(e) => setSelectedArtistId(e.target.value)} required>
          <option value="">작가를 선택해주세요</option>
          {artistList.map((artist) => (
            <option key={artist.id} value={artist.id}>{artist.name}</option>
          ))}
        </select>

        <div className="works-section">
          <h3>작품 목록</h3>
          {works.map((work, index) => (
            <div className="work-item" key={index}>
              <label>작품 제목</label>
              <input
                className="input"
                value={work.title}
                onChange={(e) => handleWorkChange(index, "title", e.target.value)}
                required
              />
              <label>작품 설명</label>
              <textarea
                className="textarea"
                value={work.description}
                onChange={(e) => handleWorkChange(index, "description", e.target.value)}
                required
              />
              <label>작품 이미지</label>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(e) => handleWorkChange(index, "image", e.target.files[0])}
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddWork} className="add-work-button">
            + 작품 추가
          </button>
        </div>

        <button type="submit" className="ex-upload-button">명화 전시 업로드</button>
      </form>
    </div>
  );
}
