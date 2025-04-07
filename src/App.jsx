import Header from "./components/Header/Header";
import LoginForm from "./components/login/LoginForm";
import ExhibitionDetailPage from "./pages/Exhibition/ExhibitionDetailPage";
import Home from "./pages/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="w-full h-full">
        <Header /> {/* 공통 헤더는 라우터 밖에서도 보이게 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exhibitions/:id" element={<ExhibitionDetailPage />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
