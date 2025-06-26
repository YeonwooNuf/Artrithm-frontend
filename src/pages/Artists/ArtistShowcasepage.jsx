import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ArtistShowcasepage.css";
import ArtistShowList from "./ArtistShowList";

export default function ArtistShowcasepage() {
  const [showTitle, setShowTitle] = useState(false);
  const [showCenterImage, setShowCenterImage] = useState(false);
  const [showDiscription, setShowDiscription] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) setShowTitle(true);
      if (scrollY > 200) setShowCenterImage(true);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="artist-showcase-page">
      <div className="artist-showcase">
        <div className="artist-container">
          <p className="artist-showcase-description1">
            예술은 특별한 사람만의 것이 아닙니다.
            <br />
            지금 바로
            <span className="soft"> 작가신청</span>을 통해 나만의 전시회를 열고,
            <br /> 당신의 이야기를 세상에 들려주세요.
          </p>
          <img
            src="/artist1.png"
            className="artist-photo left"
            alt="Left Artist"
            style={{ left: "5%", top: "70%", width: "200px", height: "300px" }}
          />
          <img
            src="/artist3.png"
            className={"artist-photo center visible"}
            alt="Center Artist"
            style={{ left: "50%", top: "25%", width: "200px", height: "250px" }}
          />
          <img
            src="/artist2.png"
            className={`artist-photo right ${showCenterImage ? "visible" : ""}`}
            alt="Right Artist"
            style={{ top: "48%" }}
          />
          <h1 className={`artist-title ${showTitle ? "visible" : ""}`}>
            ARTIST
          </h1>
          <p
            className={`artist-showcase-description2 ${
              showDiscription ? "visible" : ""
            }`}
          >
            "You don’t need to be famous to be an artist.
            <br />
            Start your own exhibition and share your story with the world."
          </p>
          <div className="artist-button-wrapper">
            <button
              className="apply-button"
              onClick={() => navigate("/request-artist")}
            >
              작가 신청하기
            </button>
            <button className="artist-view-button">등록 아티스트 보기</button>
          </div>
        </div>
      </div>
      <ArtistShowList />
    </div>
  );
}
