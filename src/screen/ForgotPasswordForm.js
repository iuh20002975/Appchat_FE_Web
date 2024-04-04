import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import img from "../images/image_background.webp";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Gọi hàm để gửi yêu cầu đặt lại mật khẩu đến máy chủ Node.js
  };

  return (
    <Content>
      <div style={{ width: "50%", height: "max-content", margin: "0 auto", position: "relative", boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)" }}>
        <h1 style={{ textAlign: "center", margin: "0", color:"blue" }}>Quên mật khẩu</h1>

        <Form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="email" style={{ width: "100px", textAlign: "right" }}>Email:</label>
            </div>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <button type="submit">Gửi</button>
        </Form>

        <p style={{ textAlign: "center" }}>
          Bạn đã nhớ mật khẩu? <Link to="/">Đăng nhập</Link>
        </p>
      </div>
    </Content>
  );
};

export default ForgotPasswordForm;

const Content = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  box-sizing: border-box;
  background-color: #f5f5f5;
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