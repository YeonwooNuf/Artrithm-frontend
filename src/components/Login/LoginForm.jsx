import { useState } from "react";
import "./LoginForm.css";
import axios from "axios";
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

      // ✅ userId, user 전체 정보 저장
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("user", JSON.stringify(userData));

      // ✅ 상태 갱신
      setUser(userData);
      setMessage(`${userData.nickname}님 로그인 성공`);

      // ✅ setUser 반영 이후 리렌더링 보장
      setTimeout(() => {
        navigate("/", { replace: true }); // 기존 기록 대체
      }, 0);

      setMessage(`${userData.nickname}님 로그인 성공`);
    } catch (error) {
      console.error(error);
      setMessage("로그인 실패 😢");
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: 300, margin: "100px auto", textAlign: "center" }}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="아이디"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">로그인</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default LoginForm;
