import React, { useState } from "react";
import "./MyPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MyExhibitions from "./MyExhibitions"; // ✅ 추가

export default function MyPage({ user, setUser }) {
    const [nickname, setNickname] = useState(user.nickname || "");
    const [email, setEmail] = useState(user.email || "");
    const [birth, setBirth] = useState(user.birth || "");
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
    const [profileImage, setProfileImage] = useState(null);
    const [artistBio, setArtistBio] = useState(user.artistBio || "");
    const [isEditing, setIsEditing] = useState(false);
    const [showExhibitions, setShowExhibitions] = useState(false); // ✅ 추가
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nickname", nickname);
        formData.append("email", email);
        formData.append("birth", birth);
        formData.append("phoneNumber", phoneNumber);
        if (profileImage) formData.append("profileImageFile", profileImage);
        if (user.role === "ARTIST" || user.role === "ADMIN") formData.append("artistBio", artistBio);

        try {
            const userId = localStorage.getItem("userId");

            await axios.put(`http://localhost:8080/api/users/${userId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const res = await axios.get(`http://localhost:8080/api/users/${userId}`);
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));

            alert("회원 정보가 저장되었습니다.");
            setIsEditing(false);
        } catch (err) {
            console.error("❌ 수정 실패:", err);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    const handleRequestArtist = () => {
        navigate("/request-artist");
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
                                : user.profileImage
                                    ? `http://localhost:8080${user.profileImage}`
                                    : "/default-profile.png"
                        }
                        alt="프로필"
                    />
                </div>
                <div className="profile-info">
                    <h3>{user.nickname} 님</h3>
                    <p>
                        회원 유형: {
                            user.role === "ADMIN"
                                ? "관리자"
                                : user.role === "ARTIST"
                                    ? "작가 회원"
                                    : "일반 회원"
                        }
                    </p>
                    {user.role === "USER" && (
                        <button
                            className="request-artist-button"
                            onClick={handleRequestArtist}
                        >
                            작가 승인 요청하기
                        </button>
                    )}
                </div>
            </div>

            <div className="mypage-menu">
                <button className="mypage-button" onClick={() => setIsEditing(true)}>
                    회원정보 수정
                </button>
                <button className="mypage-button">구매 / 판매 내역</button>
                <button className="mypage-button">주소 등록</button>
                <button className="mypage-button">관심 전시</button>
                {(user.role === "ARTIST" || user.role === "ADMIN") && (
                    <button className="mypage-button" onClick={() => setShowExhibitions(!showExhibitions)}>
                        {showExhibitions ? "내 전시 접기" : "내 전시 보기"}
                    </button>
                )}
            </div>

            {isEditing && (
                <form className="mypage-form" onSubmit={handleSubmit}>
                    <label>닉네임</label>
                    <input
                        className="input"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />

                    <label>이메일</label>
                    <input
                        className="input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>생년월일</label>
                    <input
                        className="input"
                        type="date"
                        value={birth}
                        onChange={(e) => setBirth(e.target.value)}
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

                    {(user.role === "ARTIST" || user.role === "ADMIN") && (
                        <>
                            <label>작가 소개글</label>
                            <textarea
                                className="textarea"
                                value={artistBio}
                                onChange={(e) => setArtistBio(e.target.value)}
                            />
                        </>
                    )}

                    <button type="submit" className="profile-save-button">
                        저장
                    </button>
                </form>
            )}

            {showExhibitions && (
                <MyExhibitions user={user} />
            )}
        </div>
    );
}
