import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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

    // Lưu thông tin đăng ký vào cơ sở dữ liệu hoặc thực hiện bất kỳ hành động nào khác mà bạn muốn.

    alert("Đăng ký thành công");
  };

  return (
    <Content>
      <div style={{ width: "50%", height: "max-content", margin: "0 auto", position: "relative", boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)" }}>
        <h1 style={{ textAlign: "center", margin: "0", color:"blue" }}>Đăng ký tài khoản</h1>

        <Form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" }}>
            <label htmlFor="name">Họ và tên:</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" }}>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" }}>
            <label htmlFor="phoneNumber">Số điện thoại:</label>
            <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" }}>
            <label htmlFor="dateOfBirth">Ngày sinh:</label>
            <input type="date" id="dateOfBirth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" }}>
            <label htmlFor="password">Mật khẩu:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" }}>
            <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          <button type="submit" style={{ width: "100%" }}>Đăng ký</button>
        </Form>

        <p style={{ textAlign: "center" }}>
          Bạn đã có tài khoản? <Link to="/signin">Đăng nhập</Link>
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
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;