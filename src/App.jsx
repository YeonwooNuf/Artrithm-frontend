import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

import Layout from "./components/Layout/Layout";

import Home from "./pages/Home/Home";
import LoginForm from "./components/Login/LoginForm";
import SignupPage from "./pages/Signup/SignupPage";
import MyPage from "./pages/MyPage/MyPage";
import AddressPage from "./pages/MyPage/AddressPage";

import ExhibitionUpload from "./pages/Exhibition/ExhibitionUpload"; // 일반 사용자용
import ExhibitionUploadMasterpiece from "./pages/AdminFeature/ExhibitionUploadMasterpiece"; // 관리자용
import UploadExplanationFile from "./pages/AdminFeature/UploadExplanationFile"; // 관리자용

import ExhibitionPage from "./pages/Exhibition/ExhibitionPage";
import ExhibitionList from "./pages/Exhibition/ExhibitionList";

import ExhibitionEdit from "./pages/Exhibition/ExhibitionEdit";

import Exhibition3D from "./pages/3DGallery/Exhibition3D";

import ArtworkMarketpage from "./pages/ArtworkMarketpage/ArtworkMarketpage";
import ArtworkAuctionpage from "./pages/ArtworkMarketpage/ArtworkAuctionpage";
import MyExhibitions from "./pages/MyPage/MyExhibitions";
import RequestArtistPage from "./pages/MyPage/RequestArtistPage";

import ApprovePromotionPage from "./pages/AdminFeature/ApprovePromotionPage";
import AuctionRequestpage from "./pages/ArtworkMarketpage/AuctionRequestpage";
import AuctionRegisterpage from "./pages/ArtworkMarketpage/AuctionRegistpage";
import Cartpage from "./pages/ArtworkMarketpage/Cartpage";

import ChatList from "./pages/Chat/ChatList";
import ChatPage from "./pages/Chat/ChatPage";

import SubscriptionPlan from "./pages/Subcription/SubscriptionPlan";
import Payment from "./pages/Payment/Payment";
import OrderCompletePage from "./pages/Payment/OrderCompletePage";

import api from "./api/axios";
import ArtistShowcasepage from "./pages/Artists/ArtistShowcasepage";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && !user) {
      api
        .get(`/api/users/${userId}`)
        .then((res) => {
          console.log("✅ 사용자 정보:", res.data);
          setUser(res.data);
        })
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

          <Route
            path="/mypage"
            element={<MyPage user={user} setUser={setUser} />}
          />
          <Route path="/myexhibition" element={<MyExhibitions />} />
          <Route path="/mypage/address" element={<AddressPage />} />
          <Route path="/exhibitions/edit/:id" element={<ExhibitionEdit />} />
          <Route
            path="/admin/approve-promotion"
            element={<ApprovePromotionPage />}
          />

          <Route path="/request-artist" element={<RequestArtistPage />} />

          {/* ✅ 전시 업로드 */}
          <Route path="/upload" element={<ExhibitionUpload user={user} />} />
          <Route
            path="/admin/upload-masterpiece"
            element={<ExhibitionUploadMasterpiece user={user} />}
          />

          {/* ✅ 작품 설명 PDF 업로드 */}
          <Route
            path="/admin/upload-description"
            element={<UploadExplanationFile user={user} />}
          />

          {/* ✅ 전시 관련 */}
          <Route path="/exhibitions/:id" element={<ExhibitionPage />} />
          <Route path="/view" element={<ExhibitionList />} />
          <Route
            path="/exhibitions/Gallery3D/:exhibitionId"
            element={<Exhibition3D />}
          />

          {/* <Route path="/exhibitions/detail/:id" element={<ExhibitionDetailPage />} /> */}
          <Route path="/auction" element={<ArtworkAuctionpage user={user} />} />
          <Route
            path="/auction-request"
            element={<AuctionRequestpage user={user} />}
          />
          <Route path="/auction-regist" element={<AuctionRegisterpage />} />

          <Route path="/chat/list" element={<ChatList user={user} />} />
          <Route path="/chat/:roomId" element={<ChatPage user={user} />} />

          {/* 지정가 구매/판매 페이지 */}
          <Route
            path="/fixed-price"
            element={<ArtworkMarketpage user={user} />}
          />
          <Route path="/cart" element={<Cartpage user={user} />} />
          <Route
            path="/subscription"
            element={<SubscriptionPlan user={user} />}
          />

          <Route
            path="/order/complete"
            element={<OrderCompletePage user={user} />}
          />
          <Route path="/payment" element={<Payment user={user} />} />

          <Route path="/artist" element={<ArtistShowcasepage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
