import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ArtistShowList.css";

export default function ArtistShowList() {
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/artists/all")
      .then((res) => res.json())
      .then((data) => setArtists(data))
      .catch((err) => console.error("작가 목록 불러오기 실패", err));
  }, []);

  const handleArtistClick = (artist) => {
    const rawId = artist.id.replace(/^.*?_/, ""); // "Artist_5" → "5", "User_12" → "12"

    if (artist.type === "USER") {
      navigate(`/artists/user/${rawId}`);
    } else if (artist.type === "ARTIST") {
      navigate(`/artists/classic/${rawId}`);
    }
  };

  return (
    <div className="artist-showlist-section">
      <hr className="custom-line" />
      <h2 className="artist-list-title">Artists</h2>
      <div className="artistpage-scroll-wrapper">
        {artists.map((artist) => (
          <div key={artist.id} className="artistpage-item">
            <img
              src={artist.profileImage}
              alt={artist.name}
              className="artistpage-profile"
              onClick={() => handleArtistClick(artist)}
            />
            <div className="artistpage-name">{artist.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
