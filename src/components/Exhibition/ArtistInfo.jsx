import "./ArtistInfo.css";

export default function ArtistInfo({ exhibition }) {
  if (!exhibition) return null;

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
        <div className="exhibition-list">
          {exhibition.artist.works.map((work, i) => (
            <div className="exhibition-list-card" key={i}>
              <img src={work.src} alt={work.title} />
              <p>{work.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
