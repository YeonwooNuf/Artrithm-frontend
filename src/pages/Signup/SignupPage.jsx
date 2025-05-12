import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SignupPage.css";

const SignupPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birth: null,
    phone: "",
  });
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //입력한 회원가입 정보 제출
  const handleSubmit = (e) => {
    e.preventDefault();

    // //아이디 중복 확인
    // if (isUsernameAvailable !== true) {
    //   alert("아이디 중복 확인을 완료해주세요.");
    //   return;
    // }

    //비밀번호 일치 확인
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    //조건 다 통과하면 전송
    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      birth: form.birth,
      phone: form.phone,
    };

    try {
      console.log("**전송할 데이터:", payload);
      //const response = await axios.post("/api/register",payload);
      alert("회원가입 요청이 준비되었습니다");
    } catch (err) {
      console.error("**등록 실패:", err);
      alert("서버 오류가 발생했습니다.");
    }
    console.log("가입 정보:", form);
    // TODO: axios.post("/api/register", form) 등 처리 가능
  };

  const handleCheckUsername = async () => {
    try {
      const res = await fetch(`/api/check-username?username=${form.username}`);
      const data = await res.json();
      if (data.available) {
        setUsernameMessage("사용 가능한 아이디입니다.");
        setIsUsernameAvailable(true);
      } else {
        setUsernameMessage("이미 사용중인 아이디입니다.");
        setIsUsernameAvailable(false);
      }
    } catch (err) {
      setUsernameMessage("**서버 오류가 발생했습니다.**");
      setIsUsernameAvailable(false);
    }
  };

  return (
    <div className="signup-section">
      <img
        src="/signup_image.png"
        alt="Join Artrithm"
        className="signup-image"
      />

      <div className="signup-container">
        <h2>Sign Up</h2>
        <p className="subtitle">
          예술과 알고리즘이 만나는 공간에 오신 걸 환영합니다.
        </p>
        <form onSubmit={handleSubmit}>
          {usernameMessage && (
            <p className={isUsernameAvailable ? "valid-msg" : "err-msg"}>
              {usernameMessage}
            </p>
          )}
          <div className="username-check-row">
            <input
              type="text"
              name="username"
              placeholder="아이디"
              value={form.username}
              onChange={handleChange}
              maxLength={12}
              required
            />
            <button type="button" onClick={handleCheckUsername}>
              중복확인
            </button>
          </div>

          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
            required
          />
          {form.confirmPassword && form.password !== form.confirmPassword && (
            <p className="err-msg">**비밀번호가 일치하지 않습니다.**</p>
          )}
          <input
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          <DatePicker
            selected={form.birth}
            onChange={(date) => setForm({ ...form, birth: date })}
            dateFormat="yyyy-MM-dd"
            showMonthDropdown
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            placeholderText="생년월일 선택"
            maxDate={new Date()} //오늘 날짜까지만
          />
          <input
            name="phone"
            type="tel"
            placeholder="휴대폰 번호 (010-0000-0000)"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submit-button">
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
