import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ExhibitionUpload.css";
import { useNavigate } from "react-router-dom";

export default function ExhibitionUpload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("modern");
  const [thumbnail, setThumbnail] = useState(null);
  const [keywords, setKeywords] = useState("");
  const [works, setWorks] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
    }
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
    const formData = new FormData();
    formData.append("authorId", userId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("theme", theme);
    formData.append("thumbnail", thumbnail);
    keywords.split(/[\s,]+/).forEach((kw, i) => formData.append(`keywords[${i}]`, kw));

    works.forEach((w, i) => {
      formData.append(`works[${i}].title`, w.title);
      formData.append(`works[${i}].description`, w.description);
      formData.append(`works[${i}].image`, w.image);
    });

    try {
      await axios.post("/api/exhibitions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("전시가 성공적으로 업로드되었습니다.");
      navigate("/exhibitions");
    } catch (err) {
      console.error("전시 업로드 실패:", err);
      alert("전시 업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">전시 업로드</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <label>전시 제목</label>
        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>전시 설명</label>
        <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>전시 테마</label>
        <select className="select" value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="modern">Modern</option>
          <option value="circle">Circle</option>
          {user?.role === "ADMIN" && <option value="masterpiece">MasterPiece</option>}
        </select>

        <label>썸네일 이미지</label>
        <input className="input" type="file" accept="image/*" onChange={handleThumbnailChange} required />

        <label>키워드 (쉼표 또는 공백 구분)</label>
        <input className="input" value={keywords} onChange={(e) => setKeywords(e.target.value)} />

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

        <button type="submit" className="ex-upload-button">전시 업로드</button>
      </form>
    </div>
  );
}
