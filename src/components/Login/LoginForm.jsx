import React, { useState } from "react";
import "./LoginForm.css";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const LoginForm = ({ setUser }) => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/users/login", {
        loginId,
        password,
      });
      const userData = response.data;
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setMessage(`${userData.nickname}님 로그인 성공`);
      setTimeout(() => navigate("/", { replace: true }), 0);
    } catch (error) {
      console.error(error);
      setMessage("로그인 실패 😢");
    }
  };

  return (
    <div className="page-container">
      <div className="login-form-container shadow">
        <div className="login-form-right-side">
          <div className="top-logo-wrap">{/* 로고 넣을 수 있음 */}</div>
          <h1>Your exhibition starts here.</h1>
          <p>
            Artrithm is an open platform where anyone can display their artwork
            — whether you're an emerging artist or simply someone who loves to
            create. Log in to start curating your own gallery or exploring
            others'.
          </p>
        </div>

        <div className="login-form-left-side">
          <div className="login-top-wrap">
            <span>Don't have an account?</span>
            <button
              className="create-account-btn"
              onClick={() => navigate("/signup")}
            >
              Create Profile
            </button>
          </div>

          <form className="login-input-container" onSubmit={handleLogin}>
            <div className="login-input-wrap input-id">
              <i className="far fa-envelope"></i>
              <input
                type="text"
                placeholder="id"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
              />
            </div>

            <div className="login-input-wrap input-password">
              <i className="fas fa-key"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="login-btn-wrap">
              <button className="login-btn" type="submit">
                Login
              </button>
              <a href="#">Forgot password?</a>
              <p>{message}</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
