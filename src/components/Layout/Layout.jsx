import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";

const Layout = ({ user, setUser }) => {
  return (
    <div className="w-full h-full">
      <Header user={user} setUser={setUser} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;