import React, { useState } from "react";
import styled from "styled-components";
import {
  FaUserCircle,
  FaCog,
  FaDatabase,
  FaTools,
  FaGlobe,
  FaSignOutAlt,
} from "react-icons/fa";
import ModalAccountInfor from "./ModalAccountInfor";

const BackgroundOverlay = styled.div`
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalContainer = styled.div`
  background-color: #fefefe;
  margin: 15% auto;
  padding: 7px;
  border: 2px solid #888;
  width: 16%;
  border-radius: 15px;
  position: fixed;  // Dịch chuyển modal đến vị trí cố định trên màn hình
  left: 2%;  // Đẩy modal 10% từ trái sang phải
  top: 10%;  // Đẩy modal 15% từ trên xuống dưới
`;

const SettingList = styled.ul`
  list-style-type: none;
  padding: 3px;
`;

const SettingItem = styled.li`
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: #ddd;
    cursor: pointer;
  }
`;

const CloseButton = styled.span`
  float: right;
  font-size: 28px;
  font-weight: bold;
  &:hover,
  &:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
`;

const Content = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  box-sizing: border-box;
`;

export default function SettingScreen({ userLogin, onClose}) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const openModalAccountInfo = () => {
    setIsModalOpen(false);
    setIsAccountModalOpen(true);
  };
  const closeModalAccountInfo = () => {
    setIsAccountModalOpen(false);// Đóng ModalAccountInfor
    onClose();// Đóng SettingScreen
};

  return (
    <Content>
      {isAccountModalOpen && <ModalAccountInfor userLogin={userLogin} closeModal={closeModalAccountInfo} />}
      {isModalOpen && (
        <BackgroundOverlay>
        <ModalContainer>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <SettingList>
            <SettingItem onClick={openModalAccountInfo}> 
             {/* Khi "Thông tin tài khoản" được chọn, mở ModalAccountInfo và đóng SettingScreen */}
              <FaUserCircle style={{ marginRight: "10px", fontSize: "25px" }} />
              Thông tin tài khoản
              </SettingItem>
              <SettingItem>
                <FaCog style={{ marginRight: "10px", fontSize:                "25px" }} />
                Cài đặt
              </SettingItem>
              <SettingItem>
                <FaDatabase style={{ marginRight: "10px", fontSize: "25px" }} />
                Dữ liệu
              </SettingItem>
              <SettingItem>
                <FaTools style={{ marginRight: "10px", fontSize: "25px" }} />
                Công cụ
              </SettingItem>
              <SettingItem>
                <FaGlobe style={{ marginRight: "10px", fontSize: "25px" }} />
                Ngôn ngữ
              </SettingItem>
              <SettingItem
              onClick={() => {
              return (window.location.href = "/");
            }}
          >
            <FaSignOutAlt style={{ marginRight: "10px", fontSize: "25px" }} />
            Đăng xuất
        </SettingItem>
          </SettingList>
          </ModalContainer>
        </BackgroundOverlay>
      )}
    </Content>
  );
}