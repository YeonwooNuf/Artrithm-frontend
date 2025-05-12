import React, { useState } from "react";
import "./MyPage.css";

export default function MyPage({ user, onUpdate }) {
  const [nickname, setNickname] = useState(user.nickname || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [profileImage, setProfileImage] = useState(null);
  const [artistBio, setArtistBio] = useState(user.artistBio || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nickname", nickname);
    formData.append("phoneNumber", phoneNumber);
    if (profileImage) formData.append("profileImage", profileImage);
    if (user.isArtistApproved) formData.append("artistBio", artistBio);
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="mypage-container">
      <h2 className="mypage-title">마이페이지</h2>

      <div className="mypage-profile-section">
        <div className="profile-image-preview">
          <img
            src={
              profileImage
                ? URL.createObjectURL(profileImage)
                : user.profileImage || "/default-profile.png"
            }
            alt="프로필"
          />
        </div>
        <div className="profile-info">
          <h3>{user.nickname} 님</h3>
        </div>
      </div>

      <div className="mypage-menu">
        <button className="mypage-button" onClick={() => setIsEditing(true)}>회원정보 수정</button>
        <button className="mypage-button">구매 / 판매 내역</button>
        <button className="mypage-button">주소 등록</button>
        <button className="mypage-button">관심 전시</button>
      </div>

      {isEditing && (
        <form className="mypage-form" onSubmit={handleSubmit}>
          <label>닉네임</label>
          <input
            className="input"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <label>전화번호</label>
          <input
            className="input"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <label>프로필 이미지</label>
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />

          {user.isArtistApproved && (
            <>
              <label>작가 소개글</label>
              <textarea
                className="textarea"
                value={artistBio}
                onChange={(e) => setArtistBio(e.target.value)}
              />
            </>
          )}

          <button type="submit" className="save-button">저장</button>
        </form>
      )}
    </div>
  );
}
