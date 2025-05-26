import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css";
import { FaHome, FaUpload, FaUserPlus, FaFileUpload } from "react-icons/fa";

export default function AdminSidebar({ user }) {
  const location = useLocation();
  if (!user || user.role !== "ADMIN") return null;

  return (
    <aside id="sidebar">
      <h3 className="admin-sidebar-title">🎛️ 관리자 메뉴</h3>
      <ul>
        <li className={location.pathname === "/upload" ? "active" : ""}>
          <Link to="/upload"><FaUpload /> 전시 업로드</Link>
        </li>
        <li className={location.pathname === "/admin/artists/new" ? "active" : ""}>
          <Link to="/admin/artists/new"><FaUserPlus /> 작가 등록</Link>
        </li>
        <li className={location.pathname === "/admin/artworks/upload-explanation" ? "active" : ""}>
          <Link to="/admin/artworks/upload-explanation">
            <FaFileUpload /> 설명 업로드
          </Link>
        </li>
      </ul>
    </aside>
  );
}
