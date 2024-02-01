/* eslint-disable no-unused-expressions */
import React from "react";
import styled from "styled-components";
import MessageScreen from "./MessageScreen.js";
import ContactScreen from "./ContactScreen.js";
import { FaRegAddressBook } from "react-icons/fa6";
import { MdOutlineChat } from "react-icons/md";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: "MessageScreen",
      activeContentTab: "Prioritize",
    };
  }
  handleTab(tab) {
    this.setState({
      active: tab,
    });
  }
  renderLoadContent() {
    const { active } = this.state;
    if (active === "MessageScreen") {
      return (
        <>
          <MessageScreen></MessageScreen>
        </>
      );
    } else {
      return (
        <>
          <ContactScreen></ContactScreen>
        </>
      );
    }
  }
  render() {
    return (
      <AppContent>
        <Tabs className="Tabs">
          <Avatar className="Avatar"></Avatar>
          <Tab
            className="Tab"
            $active={this.state.active === "MessageScreen"}
            onClick={() => this.handleTab("MessageScreen")}
          >
            <MdOutlineChat style={{fontSize:'35px'}} />
          </Tab>
          <Tab
            className="Tab"
            $active={this.state.active === "ContactScreen"}
            onClick={() => this.handleTab("ContactScreen")}
          >
            <FaRegAddressBook style={{fontSize:'30px'}} />
          </Tab>
        </Tabs>
        <Content>{this.renderLoadContent()}</Content>
      </AppContent>
    );
  }
}
const Content = styled.div`
  height: 100vb;
  width: 96%;
  display: flex;
  box-sizing: border-box;
`;

const Avatar = styled.div`
  background: black;
  width: 40px;
  height: 40px;
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
  width: 50px;
  overflow: hidden;
`;
const AppContent = styled.div`
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  background-position: center;
`;
