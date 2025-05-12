import { useState } from "react";
import "./LoginForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setUser }) => {
  const [loginId, setLoginId] = useState("");  // 기존 username → loginId로 변경
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/users/login", {
        loginId,
        password,
      });

      const userData = response.data;

      // ✅ userId localStorage에 저장
      localStorage.setItem("userId", userData.id);

      // ✅ 전체 사용자 객체 상태로 설정
      setUser(userData);

      // ✅ 홈으로 이동
      navigate("/");

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
