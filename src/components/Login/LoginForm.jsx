import { useState } from "react";
import "./LoginForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      setUser({ username }); // 사용자 상태 업데이트
      navigate("/"); //홈으로 감

      setMessage(response.data); // ex: "testuser님 로그인 성공"
    } catch (error) {
      console.error(error);
      setMessage("로그인 실패 😢");
    }
  };

  return (
    <div
      className="login-container"
      style={{ maxWidth: 300, margin: "100px auto", textAlign: "center" }}
    >
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <br />
        <button type="submit">로그인</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default LoginForm;
