import React, { useState } from "react";
import styled from "styled-components";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { postApiNoneToken } from "../api/Callapi";
import { Link } from "react-router-dom";
import img from "../images/image_background.webp";
import { useNavigate } from "react-router-dom";

const SignInScreen = () => {
  const [active, setActive] = useState("QR");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [fetchingToken, setFetchingToken] = useState(false);
  //  const dispatch = useDispatch();
  const navigate = useNavigate();
  const login = async () => {
    setFetchingToken(true);
    try {
      const response = await postApiNoneToken("/login", {
        username: username,
        password: pass,
      });
      const accessToken = response.data.accessToken;
      if (accessToken) {
        setToken(accessToken);
        const userLogin = response.data.userLogin._id;
        
        navigate("/home", { state: { userLogin } });
      } else {
        setToken("no token");
        alert("Wrong account or password");
      }
    } catch (error) {
      console.error("Error while fetching token:", error);
      setToken("no token");
      alert("Error while fetching token: " + error.message);
    } finally {
      setFetchingToken(false);
    }
  };

  const handleTab = (tab) => {
    setActive(tab);
  };

  const handleTValueEm = (event) => {
    setUsername(event.target.value);
  };

  const handleTValuePas = (event) => {
    setPass(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderContentTab = () => {
    if (active === "QR") {
      return (
        <ContentQR>
          <QRCode>
            <div style={{ width: "80%", height: "150px", margin: "5px" }}>
              <img src="" alt="QR code"></img>
            </div>
            <Header className="Header">
              <h1
                style={{
                  color: "rgb(0,104,255)",
                  fontSize: "10px",
                  margin: "0",
                }}
              >
                Chỉ dùng để đăng nhập
              </h1>
              <p style={{ margin: "2px 0 0 0" }}> App Chat trên máy tính </p>
            </Header>
          </QRCode>
          <div>Sử dụng ứng dụng App Chat để quét mã QR</div>
        </ContentQR>
      );
    } else {
      return (
        <ContentPhone className="ContentPhone">
          <Row style={{ borderBottom: "1px solid black" }}>
            <MdOutlinePhoneAndroid style={{ width: "20%", padding: "5px" }} />
            <input
              style={{
                width: "80%",
                border: "none",
                fontSize: "16px",
                outline: "0",
              }}
              
              type="text"
              onChange={handleTValueEm}
              placeholder="Nhập email"
            />
          </Row>
          <Row style={{ borderBottom: "1px solid black" }}>
            <RiLockPasswordLine style={{ width: "20%", padding: "5px" }} />
            <input
              style={{
                width: "80%",
                border: "none",
                fontSize: "16px",
                outline: "0",
              }}
               onChange={handleTValuePas}
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
            />
            {showPassword ? (
              <FaRegEye
                className="eyeOpen"
                style={{
                  position: "relative",
                  right: "10px",
                  width: 20,
                  height: "60%",
                  marginTop: "2px",
                  cursor: "pointer",
                }}
                onClick={togglePasswordVisibility}
              />
            ) : (
              <FaRegEyeSlash
                className="eyeClose"
                style={{
                  width: 20,
                  position: "relative",
                  right: "10px",
                  height: "60%",
                  marginTop: "2px",
                  cursor: "pointer",
                }}
                onClick={togglePasswordVisibility}
              />
            )}
          </Row>
          <Row>
            <button
              onClick={login}
              style={{
                width: "100%",
                border: "none",
                height: "35px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "bold",
                color: "white",
                background: "rgb(0,104,255)",
                cursor: "pointer",
              }}
            >
              Đăng nhập với mật khẩu
            </button>
          </Row>
          <Row>
            <button
              style={{
                width: "100%",
                border: "none",
                height: "35px",
                borderRadius: "10px",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Đăng nhập bằng thiết bị di động
            </button>
          </Row>
          <Row style={{ display: "inline-block", margin: "10px" }}>
            <Link
              style={{
                textDecoration: "none",
                margin: "0 0 15px 0",
                cursor: "pointer",
              }}
              to="/forgot-password"
            >
              Quên mật khẩu?
            </Link>
            <Link to="/signup">Đăng kí</Link>
          </Row>
        </ContentPhone>
      );
    }
  };

  return (
    <AppContent>
      <Header className="Header">
        <h1 style={{ color: "rgb(0,104,255)", fontSize: "50px", margin: "0" }}>
          App Chat
        </h1>
        <p style={{ margin: "20px 0 0 0" }}>
          Đăng nhập tài khoản App Chat <br /> để kết nối với ứng dụng App Chat
          Web{" "}
        </p>
      </Header>
      <BodyContainer className="BodyContainer">
        <Content className="Content">
          <Tabs className="Tabs">
            <Tab
              className="Tab"
              $active={active === "QR"}
              onClick={() => handleTab("QR")}
            >
              Với mã QR
            </Tab>
            <Tab
              className="Tab"
              $active={active === "Phone"}
              onClick={() => handleTab("Phone")}
            >
              Với gmail
            </Tab>
          </Tabs>
          {renderContentTab()}
        </Content>
      </BodyContainer>
    </AppContent>
  );
};

export default SignInScreen;

const QRCode = styled.div`
  width: 60%;
  height: 200px;
  padding: 8px;
  border: 1px solid black;
  border-radius: 10px;
  margin: 15px auto;
`;
const ContentQR = styled.div`
  text-align: center;
  padding: 15px;
`;
const AppContent = styled.div`
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-image: url(${img});
  background-size: cover;
  background-position: center;
`;
const Row = styled.div`
  width: 85%;
  height: 30px;
  margin: 20px auto;
  left: 1px;
  display: flex;
`;
const ContentPhone = styled.div`
  text-align: center;
  position: relative;
`;
const Tab = styled.div`
  cursor: pointer;
  font-size: 18px;
  opacity: ${(props) => (props.$active ? "1" : "0.5")};
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  transition: opacity 0.3s ease, font-weight 0.3s ease;
`;
const Tabs = styled.div`
  list-style: none;
  display: flex;
  padding: 10px;
  justify-content: space-around;
  /* opacity: ; */
  margin: 10px;
  border-bottom: 1px solid black;
`;
const Content = styled.div`
  background: white;
  width: 100%;
  height: max-content;
  margin: 20px 0;
`;
const Header = styled.div`
  width: 100%;
  text-align: center;
  margin: 0;
`;
const BodyContainer = styled.div`
  box-sizing: border-box;
  width: 30%;
  height: max-content;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;
