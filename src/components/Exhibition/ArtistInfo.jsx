import "./ArtistInfo.css";
import { useEffect, useState } from "react";

export default function ArtistInfo({ exhibition }) {
  if (!exhibition) return null;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const scrollBox = document.querySelector(".artist-works-horizontal-scroll");

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollBox.scrollLeft += e.deltaY;
      }
    };

    scrollBox.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollBox.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div className="artist-container">
      <div className="artist-photo-wrapper">
        <img
          src={exhibition.artist.profileImage}
          alt="작가사진"
          className="artist-photo"
        />
      </div>

      <div className="artist-info-box">
        <h3 className="artist-name">{exhibition.artist.name} 작가</h3>
        <p className="artist-tagline">{exhibition.artist.bio}</p>
      </div>

      <div
        className="artist-works-horizontal-scroll"
        style={{ overflowX: expanded ? "auto" : "hidden" }}
      >
        <div className="exhibition-list">
          {(expanded
            ? exhibition.artist.works
            : exhibition.artist.works.slice(0, 3)
          ).map((work, i) => (
            <div key={i} className="exhibition-list-card">
              <img src={work.src} alt={work.title} />
              <p>{work.title}</p>
            </div>
          ))}
        </div>
      </div>
      {!expanded && (
        <button onClick={() => setExpanded(true)} className="more-button">
          more
        </button>
      )}
    </div>
  );
}
