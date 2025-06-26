import { useEffect, useState } from "react";
import "./ArtistShowList.css";

export default function ArtistShowList() {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    fetch("/api/artists") // ✅ 실제 백엔드 URL로 바꿔줘
      .then((res) => res.json())
      .then((data) => setArtists(data))
      .catch((err) => console.error("작가 목록 불러오기 실패", err));
  }, []);

  return (
    <div className="artist-showlist-section">
      <h2 className="artist-list-title">Artists</h2>
      <div className="artist-scroll-wrapper">
        {artists.map((artist) => (
          <div key={artist.id} className="artist-item">
            <img
              src={artist.profileImage}
              alt={artist.name}
              className="artist-profile"
            />
            <div className="artist-name">{artist.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
