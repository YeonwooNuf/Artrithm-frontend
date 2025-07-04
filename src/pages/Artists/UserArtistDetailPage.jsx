import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./UserArtistDetailPage.css"; // 선택사항: 스타일 따로 분리

export default function UserArtistDetailPage() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArtist(data);

        // 2. 해당 유저가 등록한 판매 전 작품 목록 불러오기
        return fetch(`/api/artworks/my/unsold/${data.id}`);
      })
      .then((res) => res.json())
      .then((artworks) => {
        setArtworks(artworks);
      })
      .catch((err) => console.error("유저 작가 정보 로딩 실패", err));
  }, [id]);

  if (!artist) return <div>로딩 중...</div>;

  return (
    <div className="user-artist-detail-page">
      <div className="user-artist-info">
        <img
          src={artist.profileImage}
          alt={artist.nickname}
          className="user-artist-profile"
        />
        <div className="user-artist-profile-info">
          <div className="user-artist-container">
            <h2>{artist.nickname}</h2>{" "}
            <button alt="채팅 버튼" className="artist-chat-button">
              작가에게 문의하기
            </button>
          </div>
          <p>{artist.artistBio || "작가 소개가 없습니다."}</p>
        </div>{" "}
      </div>

      <h3>작품 목록</h3>
      <div className="user-artwork-grid">
        {artworks.length > 0 ? (
          artworks.map((artwork) => (
            <div key={artwork.id} className="user-artwork-card">
              <img src={artwork.imageUrl} alt={artwork.title} />
              <div className="user-artwork-title">{artwork.title}</div>
            </div>
          ))
        ) : (
          <p>등록된 작품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}
