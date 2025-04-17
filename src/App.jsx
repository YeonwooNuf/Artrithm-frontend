import { useState } from "react";
import Header from "./components/Header/Header";
import LoginForm from "./components/login/LoginForm";
import ExhibitionDetailPage from "./pages/Exhibition/ExhibitionDetailPage";
import Home from "./pages/Home/Home";
import { BrowserRouter, Routes, Route, Router } from "react-router-dom";
import ExhibitionPage from "./pages/Exhibition/ExhibitionPage";
import Gallery3D_Walkable from "./components/Exhibition/Gallery3D";
import Footer from "./components/Footer/Footer";
//import GalleryWalkable from "./pages/GalleryWalkable";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null); //로그인 된 사용자 정보
  return (
    <BrowserRouter>
      <div className="w-full h-full">
        <Header user={user} /> {/* 공통 헤더는 라우터 밖에서도 보이게 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exhibitions/:id" element={<ExhibitionPage />} />
          <Route
            path="/exhibitions/Gallery3D"
            element={<Gallery3D_Walkable />}
          />
          <Route path="/login" element={<LoginForm setUser={setUser} />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
