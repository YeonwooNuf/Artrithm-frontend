import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ClassicArtistDetailPage.css"; // CSS 따로 작성

export default function ClassicArtistDetailPage() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    fetch(`/api/artists/${id}`)
      .then((res) => res.json())
      .then((data) => setArtist(data))
      .catch((err) => console.error("클래식 작가 정보 로딩 실패", err));
  }, [id]);

  if (!artist) return <div>로딩 중...</div>;

  const {
    name,
    bio,
    nationality,
    birthDate,
    deathDate,
    profileImage,
    artworks = [],
  } = artist;

  return (
    <div className="classic-artist-detail-page">
      <div className="classic-artist-info">
        <img src={profileImage} alt={name} className="classic-artist-profile" />
        <div className="classic-artist-bio">
          <h2>{name}</h2>
          <p className="artist-dates">
            {birthDate} ~ {deathDate}
          </p>
          <p className="artist-nationality">{nationality}</p>
          <p>{bio || "작가 소개가 없습니다."}</p>
        </div>
      </div>

      <h3>대표 작품</h3>
      <div className="classic-artwork-grid">
        {artworks.length > 0 ? (
          artworks.map((artwork) => (
            <div key={artwork.id} className="classic-artwork-card">
              <img src={artwork.imageUrl} alt={artwork.title} />
              <div className="classic-artwork-title">{artwork.title}</div>
            </div>
          ))
        ) : (
          <p>등록된 작품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
