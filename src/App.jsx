import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import Layout from "./components/Layout/Layout";

import Home from "./pages/Home/Home";
import LoginForm from "./components/login/LoginForm";
import SignupPage from "./pages/Signup/SignupPage";
import MyPage from "./pages/MyPage/MyPage";
import ExhibitionUpload from "./pages/Exhibition/ExhibitionUpload";
import ExhibitionPage from "./pages/Exhibition/ExhibitionPage";
import Exhibition3D from "./pages/Exhibition/Exhibition3D";
import ExhibitionList from "./pages/Exhibition/ExhibitionList";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && !user) {
      axios
        .get(`http://localhost:8080/api/users/${userId}`)
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("❌ 사용자 정보 불러오기 실패:", err);
          setUser(null);
        });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout user={user} setUser={setUser} />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/mypage" element={<MyPage user={user} setUser={setUser} />} />
          <Route path="/upload" element={<ExhibitionUpload user={user} />} />
          <Route path="/exhibitions/:id" element={<ExhibitionPage />} />
          <Route path="/view" element={<ExhibitionList />} />
          <Route
            path="/exhibitions/Gallery3D/:exhibitionId"
            element={<Exhibition3D />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
