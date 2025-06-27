import "./ArtistInfo.css";
import { useEffect, useState } from "react";

export default function ArtistInfo({ exhibition }) {
  if (!exhibition) return null;

  const [expanded, setExpanded] = useState(false);
  const isMasterpiece = exhibition.theme === "masterpiece";

  const artist = exhibition.artistInfo;
  const author = {
    profileImage: exhibition.authorProfileImage,
    nickname: exhibition.authorNickname,
    bio: exhibition.authorBio,
  };

  // ✅ 작가 프로필 이미지
  const profileImage = isMasterpiece
    ? artist?.profileImage || "/default/profile.png"
    : author?.profileImage || "/default/profile.png";

  // ✅ 작가 이름
  const artistName = isMasterpiece
    ? artist?.name || "작가 미상"
    : author?.nickname || "무명 작가";

  // ✅ 작가 소개
  const artistBio = isMasterpiece
    ? artist?.bio || "작가 소개가 없습니다."
    : author?.bio || "작가 소개가 없습니다.";

  // ✅ 수평 스크롤 마우스 휠 제어
  useEffect(() => {
    const scrollBox = document.querySelector(".artist-works-horizontal-scroll");

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollBox.scrollLeft += e.deltaY;
      }
    };

    scrollBox?.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollBox?.removeEventListener("wheel", handleWheel);
  }, []);

  // ✅ 작가의 작품 리스트
  const artworks = exhibition.artworks || [];

  return (
    <div className="artist-container">
      <div className="artist-photo-wrapper">
        <img src={profileImage} alt="작가 사진" className="artist-photo-show" />
      </div>

      <div className="artist-info-box">
        <h3 className="artist-name">{artistName} 작가</h3>
        <p className="artist-tagline">{artistBio}</p>
      </div>

      <div
        className="artist-works-horizontal-scroll"
        style={{ overflowX: expanded ? "auto" : "hidden" }}
      >
        <div className="exhibition-list">
          {(expanded ? artworks : artworks.slice(0, 3)).map((work, i) => (
            <div key={i} className="exhibition-list-card">
              <img src={work.imageUrl} alt={work.title} />
              <p>{work.title}</p>
            </div>
          ))}
        </div>
      </div>

      {!expanded && artworks.length > 3 && (
        <button onClick={() => setExpanded(true)} className="more-button">
          more
        </button>
      )}
    </div>
  );
}
