import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import AdminDrawer from "../Sidebar/AdminDrawer";
import { Outlet } from "react-router-dom";
import "./Layout.css"; // ✅ 새 CSS로 스타일 관리

const Layout = ({ user, setUser }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className={`layout-container ${drawerOpen ? "drawer-open" : ""}`}>
      {isAdmin && <AdminDrawer onClose={() => setDrawerOpen(false)} />}

      <div className="main-wrapper">
        <Header user={user} setUser={setUser} onToggleDrawer={() => setDrawerOpen(!drawerOpen)} />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
