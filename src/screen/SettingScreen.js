import React from "react";
import styled from "styled-components";
import { FaUserCircle, FaCog, FaDatabase, FaTools, FaGlobe, FaSignOutAlt } from "react-icons/fa";

export default class SettingScreen extends React.Component {
  render() {
    return (
      <>
        <Content>
          <SettingList>
            <SettingItem onClick={() => {}}>
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
            <SettingItem onClick={() => {}}>
              <FaSignOutAlt style={{ marginRight: "10px", fontSize: "25px" }} />
              Đăng xuất
            </SettingItem>
          </SettingList>
        </Content>
      </>
    );
  }
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
