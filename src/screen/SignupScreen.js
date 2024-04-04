import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import img from "../images/image_background.webp";
const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    // Lưu thông tin đăng ký vào cơ sở dữ liệu hoặc thực hiện bất kỳ hành động nào khác.

    alert("Đăng ký thành công");
  };

  return (
    <Content>
      <div style={{ width: "50%", height: "max-content", margin: "0 auto", position: "relative", boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)" }}>
        <h1 style={{ textAlign: "center", margin: "0", color:"blue" }}>Đăng ký tài khoản</h1>

        <Form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="name" style={{ width: "100px", textAlign: "right" }}>Họ và tên:</label>
            </div>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="email" style={{ width: "100px", textAlign: "right" }}>Email:</label>
            </div>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="phoneNumber" style={{ width: "100px", textAlign: "right" }}>Số điện thoại:</label>
            </div>
            <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="dateOfBirth" style={{ width: "100px", textAlign: "right" }}>Ngày sinh:</label>
            </div>
            <input type="date" id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="password" style={{ width: "100px", textAlign: "right" }}>Mật khẩu:</label>
            </div>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="confirmPassword" style={{ width: "100px", textAlign: "right" }}>Xác nhận mật khẩu:</label>
            </div>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          <button type="submit">Đăng ký</button>
        </Form>

        <p style={{ textAlign: "center" }}>
          Bạn đã có tài khoản? <Link to="/">Đăng nhập</Link>
        </p>
      </div>
    </Content>
  );
};

export default SignupScreen;

const Content = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  background-image: url(${img});
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 50px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);

  label {
    width: 100px;
    text-align: right;
    font-size: 16px;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    font-size: 16px;
  }

  button {
    width: 100%;
    padding: 10px;
    border: none;
    background-color: blue;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
`;