import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import img from "../images/image_background.webp";

import { postApiNoneToken } from "../api/Callapi";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { auth } from "./config";

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState(true); // mặc định là nam

  //  xác thực
  const [code, setCode] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [userx, setUserx] = useState("");
  const [isVerSignup, setIsVerSignup] = useState(false);

  const handleSubmit = async (e) => {
    try {
      const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
      setUserx(confirmation);
    } catch (error) {
      console.log(error);
    }
  };
  const confirmUser = async (e) => {
    try {
      if( await userx.confirm(code))
        setIsVerSignup(true);
      else
        alert("Mã xác thực không đúng");
    } catch (error) {
      console.error("Lỗi này nè: "+error);
    }
  }

  //cap nhat lai
  const createAccount = async () => {
    try {
      const response = await postApiNoneToken("/signup", {
        name: name,
        username: email,
        gender: gender,
        dateOfBirth: dateOfBirth,
        phone: phone,
        password: password,
        confirmPassword: confirmPassword,
      });
      
      if (response.data.status === "ERR") {
        if (response.data.message === undefined) {
          alert("Trùng số điện thoại ");
          return;
        }
        alert(response.data.message);
        return;
      } else {
        alert("Đăng ký thành công ");
        return (window.location.href = "/"); // chuyen ve
      }
      
    } catch (error) {
      console.error("error for signup", error);
      alert("Error while fetching token" + error.message);
    }
  };

  function checkAge(dateOfBirth) {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const monthCheck = today.getMonth() - dob.getMonth();

    if (
      monthCheck < 0 ||
      (monthCheck === 0 && today.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age;
  }
  function checkSignup() {
    if (dateOfBirth === "") {
      alert("Vui lòng nhập ngày sinh");
    } else {
      const age = checkAge(dateOfBirth);
      if (age < 0) {
        alert("Tuổi phải lớn hơn 18");
      } else {
        createAccount();
      }
    }
  }
  return (
    <Content>
      <div
        style={{
          width: "50%",
          height: "max-content",
          margin: "0 auto",
          position: "relative",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1 style={{ textAlign: "center", margin: "0", color: "blue" }}>
          Đăng ký tài khoản
        </h1>
        <Form>
          {isVerSignup === false ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label
                    htmlFor="phone"
                    style={{ width: "100px", textAlign: "right" }}
                  >
                    Số điện thoại:
                  </label>
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <button type="button" onClick={handleSubmit}>
                Request OTP
              </button>
              <div style={{ display: "block" }} id="recaptcha"></div>
              <>
                <div style={{ textAlign: "center" }}>
                  <input
                    style={{
                      width: "40%",
                      textAlign: "center",
                      marginBottom: "5px",
                    }}
                    type="number"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <button onClick={confirmUser} type="button">
                  Xác nhận
                </button>
              </>
            </>
          ) : null}
          {isVerSignup === true ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label
                    htmlFor="name"
                    style={{ width: "100px", textAlign: "right" }}
                  >
                    Họ và tên:
                  </label>
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label
                    htmlFor="email"
                    style={{ width: "100px", textAlign: "right" }}
                  >
                    Email:
                  </label>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label
                    htmlFor="gender"
                    style={{ width: "100px", textAlign: "right" }}
                  >
                    Giới tính:
                  </label>
                </div>
                <select
                  id="gender"
                  value={gender ? "male" : "female"}
                  onChange={(e) => setGender(e.target.value === "male")}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label
                    htmlFor="dateOfBirth"
                    style={{ width: "100px", textAlign: "right" }}
                  >
                    Ngày sinh:
                  </label>
                </div>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label
                    htmlFor="password"
                    style={{ width: "100px", textAlign: "right" }}
                  >
                    Mật khẩu:
                  </label>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <label
                    htmlFor="confirmPassword"
                    style={{ width: "100px", textAlign: "right" }}
                  >
                    Xác nhận mật khẩu:
                  </label>
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button type="submit" onClick={checkSignup}>
                Đăng ký
              </button>
            </>
          ) : null}

          <p style={{ textAlign: "center" }}>
            Bạn đã có tài khoản? <Link to="/">Đăng nhập</Link>
          </p>
        </Form>
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
