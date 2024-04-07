import React, { useState } from "react";
import styled from "styled-components";
import { FaUserCircle, FaCog, FaDatabase, FaTools, FaGlobe, FaSignOutAlt } from "react-icons/fa";
import ModalAccountInfor from "./ModalAccountInfor";

export default function SettingScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalAccountInfor = () => {
    setIsModalOpen(true);
  };

  const closeModalAccountInfor = () => {
    setIsModalOpen(false);
  };

  return (
    <Content>
      <SettingList>
        <SettingItem onClick={openModalAccountInfor}>
          <FaUserCircle style={{ marginRight: "10px", fontSize: "25px" }} />
          Thông tin tài khoản
        </SettingItem>
        <SettingItem onClick={() => {}}>
          <FaCog style={{ marginRight: "10px", fontSize: "25px" }} />
          Cài đặt
        </SettingItem>
        <SettingItem onClick={() => {}}>
          <FaDatabase style={{ marginRight: "10px", fontSize: "25px" }} />
          Dữ liệu
        </SettingItem>
        <SettingItem onClick={() => {}}>
          <FaTools style={{ marginRight: "10px", fontSize: "25px" }} />
          Công cụ
        </SettingItem>
        <SettingItem onClick={() => {}}>
          <FaGlobe style={{ marginRight: "10px", fontSize: "25px" }} />
          Ngôn ngữ
        </SettingItem>
        <SettingItem onClick={() => {return window.location.href="/"}}>
          <FaSignOutAlt style={{ marginRight: "10px", fontSize: "25px" }} />
          Đăng xuất
        </SettingItem>
      </SettingList>
      {isModalOpen && <ModalAccountInfor closeModal={closeModalAccountInfor} />}
    </Content>
  );
}

const Content = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  box-sizing: border-box;
`;

const SettingList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SettingItem = styled.li`
  padding: 15px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(219, 223, 229);
`;