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

  const [artistList, setArtistList] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState("");
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [newArtist, setNewArtist] = useState({ name: "", bio: "", profileImage: null });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsedUser = JSON.parse(saved);
      setUser(parsedUser);

      if (parsedUser.role === "ADMIN") {
        axios.get("/api/artists")
          .then((res) => setArtistList(res.data))
          .catch((err) => console.error("작가 목록 불러오기 실패:", err));
      }
    }
  }, []);

  const handleThumbnailChange = (e) => setThumbnail(e.target.files[0]);
  const handleAddWork = () => setWorks([...works, { title: "", description: "", image: null }]);
  const handleWorkChange = (i, field, value) => {
    const updated = [...works];
    updated[i][field] = value;
    setWorks(updated);
  };

  const handleArtistSubmit = async () => {
    const formData = new FormData();
    formData.append("name", newArtist.name);
    formData.append("bio", newArtist.bio);
    if (newArtist.profileImage) formData.append("profileImageFile", newArtist.profileImage);

    try {
      const res = await axios.post("/api/artists", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newId = res.data.id;
      setArtistList((prev) => [...prev, res.data]);
      setSelectedArtistId(newId);
      setNewArtist({ name: "", bio: "", profileImage: null });
      setShowArtistModal(false);
    } catch (err) {
      console.error("작가 등록 실패", err);
      alert("작가 등록에 실패했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("authorId", userId);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("theme", theme);
    formData.append("thumbnail", thumbnail);

    keywords.split(/[,\s]+/).filter(Boolean).forEach((kw, i) => formData.append(`keywords[${i}]`, kw));

    works.forEach((w, i) => {
      formData.append(`works[${i}].title`, w.title);
      formData.append(`works[${i}].description`, w.description);
      formData.append(`works[${i}].image`, w.image);
    });

    if (user?.role === "ADMIN" && selectedArtistId) {
      formData.append("artistId", selectedArtistId);
    }

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

        {user?.role === "ADMIN" && (
          <>
            <label>작가 선택</label>
            <select
              className="select"
              value={selectedArtistId}
              onChange={(e) => setSelectedArtistId(e.target.value)}
              required
            >
              <option value="" disabled>작가를 선택해주세요</option>
              {artistList.map((artist) => (
                <option key={artist.id} value={artist.id}>{artist.name}</option>
              ))}
            </select>

            <button type="button" className="add-artist-button" onClick={() => setShowArtistModal(true)}>
              + 새 작가 등록
            </button>
          </>
        )}

        <div className="works-section">
          <h3>작품 목록</h3>
          {works.map((work, index) => (
            <div className="work-item" key={index}>
              <label>작품 제목</label>
              <input className="input" value={work.title} onChange={(e) => handleWorkChange(index, "title", e.target.value)} required />
              <label>작품 설명</label>
              <textarea className="textarea" value={work.description} onChange={(e) => handleWorkChange(index, "description", e.target.value)} required />
              <label>작품 이미지</label>
              <input className="input" type="file" accept="image/*" onChange={(e) => handleWorkChange(index, "image", e.target.files[0])} required />
            </div>
          ))}
          <button type="button" onClick={handleAddWork} className="add-work-button">+ 작품 추가</button>
        </div>

        <button type="submit" className="ex-upload-button">전시 업로드</button>
      </form>

      {/* 작가 등록 모달 */}
      {showArtistModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>새 작가 등록</h3>
            <input className="input" placeholder="작가 이름" value={newArtist.name} onChange={(e) => setNewArtist({ ...newArtist, name: e.target.value })} />
            <textarea className="textarea" placeholder="작가 소개" value={newArtist.bio} onChange={(e) => setNewArtist({ ...newArtist, bio: e.target.value })} />
            <input className="input" type="file" accept="image/*" onChange={(e) => setNewArtist({ ...newArtist, profileImage: e.target.files[0] })} />
            <button className="add-artist-button" onClick={handleArtistSubmit}>등록</button>
            <button className="add-work-button" onClick={() => setShowArtistModal(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
