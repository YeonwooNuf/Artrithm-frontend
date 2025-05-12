import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import LoginForm from "./components/login/LoginForm";
import SignupPage from "./pages/Signup/SignupPage";
import MyPage from "./pages/MyPage/MyPage";
import ExhibitionUpload from "./pages/Exhibition/ExhibitionUpload";
import ExhibitionPage from "./pages/Exhibition/ExhibitionPage";
import Exhibition3D from "./pages/Exhibition/Exhibition3D";
import ExhibitionDetailPage from "./pages/Exhibition/ExhibitionDetailPage"; // 필요 시

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:8080/api/users/${userId}`)
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("❌ 사용자 정보 불러오기 실패:", err);
          setUser(null);
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="w-full h-full">
        <Header user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/mypage" element={<MyPage user={user} />} />
          <Route path="/upload" element={<ExhibitionUpload user={user} />} />
          <Route path="/exhibitions/:id" element={<ExhibitionPage />} />
          <Route
            path="/exhibitions/Gallery3D/:exhibitionId"
            element={<Exhibition3D />}
          />
          {/* <Route path="/exhibitions/detail/:id" element={<ExhibitionDetailPage />} /> */}
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
