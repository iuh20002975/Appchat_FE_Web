import React, { useState } from "react";
import styled from "styled-components";
import MessageScreen from "./MessageScreen.js";
import ContactScreen from "./ContactScreen.js";
import SettingScreen from "./SettingScreen.js";
import { FaRegAddressBook } from "react-icons/fa6";
import { MdOutlineChat } from "react-icons/md";
import { IoSettings  } from "react-icons/io5";
import { useLocation } from "react-router-dom";

export default function HomeScreen (props) {
  const [active, setActive] = useState("MessageScreen");  
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const location = useLocation();
  const userLogin = location.state?.userLogin;

  const handleTab = (tab) => {
    if (tab === "SettingScreen") {
      setIsSettingOpen(true);
    } else {
      setIsSettingOpen(false);
      setActive(tab);
    }
  }

  const closeSettingModal = () => {
    setIsSettingOpen(false);
  }

  const renderLoadContent = () => {
    if (active === "MessageScreen") {
      return <MessageScreen userLogin={userLogin} />;
    } else if (active === "ContactScreen") {
      return <ContactScreen userLogin={userLogin}/>;
    }
    return null;
  }

  return (
    <AppContent>
      <Tabs className="Tabs">
        
        <Avatar className="Avatar"></Avatar>
        <Tab
          className="Tab"
          $active={active === "MessageScreen"}
          onClick={() => handleTab("MessageScreen")}
        >
          <MdOutlineChat style={{fontSize:'35px'}} />
        </Tab>
        <Tab
          className="Tab"
          $active={active === "ContactScreen"}
          onClick={() => handleTab("ContactScreen")}
        >
          <FaRegAddressBook style={{fontSize:'30px'}} />
        </Tab>

        {/* Nút cài đặt */}
        <Tab
          className="Tab"
          $active={isSettingOpen}
          onClick={() => handleTab("SettingScreen")}
        >
          <IoSettings  style={{fontSize:'30px'}} />
        </Tab>
       
      </Tabs>
      
      <Content>{renderLoadContent()}</Content>
      {isSettingOpen && <SettingScreen userLogin={userLogin} onClose={closeSettingModal} />}
    </AppContent>
  );
}

const Content = styled.div`
  height: 100%;
  width: 96%;
  display: flex;
  box-sizing: border-box;
`;

const Avatar = styled.div`
  background: black;
  width: 54px;
  height: 54px;
  margin: 15px auto;
  border-radius: 50%;
`;
const Tab = styled.div`
  cursor: pointer;
  font-size: 30px;
  color: ${(props) => (props.$active ? "black" : "white")};
  text-align: center;
  height: 55px;
`;
const Tabs = styled.div`
  list-style: none;
  justify-content: space-around;
  padding: 8px;
  background: rgb(0, 145, 255);
  border-bottom: 1px solid black;
  width: 4%;
  position: relative;
  overflow: hidden;
`;
const AppContent = styled.div`
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  background-position: center;
`;