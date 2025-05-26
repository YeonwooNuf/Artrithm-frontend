import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import AdminSidebar from "../Admin/AdminSidebar";
import { Outlet, useLocation } from "react-router-dom";

const Layout = ({ user, setUser }) => {
  const isAdmin = user?.role === "ADMIN";
  const location = useLocation();
  const isMyPage = location.pathname === "/mypage";

  return (
    <div className="w-full h-full flex">
      {isAdmin && isMyPage && <AdminSidebar />}
      <div className="flex-1">
        <Header user={user} setUser={setUser} />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
