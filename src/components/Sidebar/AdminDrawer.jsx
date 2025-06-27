import React from "react";
import { Link } from "react-router-dom";
import "./AdminDrawer.css";

export default function AdminDrawer({ onClose, isOpen }) {
  return (
    <div className={`admin-drawer ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>
        ×
      </button>
      <h3>관리자 메뉴</h3>
      <ul>
        <li>
          <Link to="/admin/upload-masterpiece">명화 전시 업로드</Link>
        </li>
        <li>
          <Link to="/admin/artists/new">작가 등록</Link>
        </li>
        <li>
          <Link to="/admin/upload-description">작품 설명 업로드</Link>
        </li>
        <li>
          <Link to="/admin/approve-promotion">작가 승인 요청 목록</Link>
        </li>
        <li>
          <Link to="/auction-regist">경매등록</Link>
        </li>
        <li>
          <Link to="/admin/revenue">매출 통계</Link>
        </li>
      </ul>
    </div>
  );
}
