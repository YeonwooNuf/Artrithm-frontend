import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Exhibition/ExhibitionUpload.css"; // 기존 스타일 재사용
import { useNavigate } from "react-router-dom";

export default function UploadExplanationFile() {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtworkId, setSelectedArtworkId] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/artworks")
      .then(res => setArtworks(res.data))
      .catch(err => console.error("작품 목록 불러오기 실패", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedArtworkId || !file) {
      alert("작품과 파일을 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`/api/artworks/${selectedArtworkId}/upload-explanation`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("설명 파일이 업로드되었습니다.");
      navigate("/view");
    } catch (err) {
      console.error("업로드 실패", err);
      alert("업로드 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">작품 설명 파일 업로드</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <label>작품 선택</label>
        <select
          className="select"
          value={selectedArtworkId}
          onChange={(e) => setSelectedArtworkId(e.target.value)}
        >
          <option value="">작품을 선택해주세요</option>
          {artworks.map((art) => (
            <option key={art.id} value={art.id}>{art.title}</option>
          ))}
        </select>

        <label>PDF 설명 파일 선택</label>
        <input
          className="input"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit" className="ex-upload-button">업로드</button>
      </form>
    </div>
  );
}
