import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    birth: null,
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const payload = {
      loginId: form.username,
      nickname: form.nickname,
      email: form.email,
      password: form.password,
      phoneNumber: form.phone,
      birth: form.birth ? form.birth.toISOString().split("T")[0] : null,
    };

    try {
      await api.post("/api/users/signup", payload);
      alert("회원가입 성공! 🎉");
      navigate("/login");
    } catch (err) {
      console.error("❌ 회원가입 실패:", err);
      alert("서버 오류가 발생했습니다.");
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
        <p className="signup-subtitle">
          예술과 알고리즘이 만나는 공간에 오신 걸 환영합니다.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="아이디"
            value={form.username}
            onChange={handleChange}
            maxLength={12}
            required
          />

          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            value={form.nickname}
            onChange={handleChange}
            required
          />

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

          <input
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {form.confirmPassword && form.password !== form.confirmPassword && (
            <p className="signup-err-msg">※ 비밀번호가 일치하지 않습니다.</p>
          )}

          <DatePicker
            selected={form.birth}
            onChange={(date) => setForm({ ...form, birth: date })}
            dateFormat="yyyy-MM-dd"
            showMonthDropdown
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={100}
            placeholderText="생년월일 선택"
            maxDate={new Date()}
          />

          <input
            name="phone"
            type="tel"
            placeholder="휴대폰 번호 (010-0000-0000)"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <button type="submit" className="signup-submit-button">
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
