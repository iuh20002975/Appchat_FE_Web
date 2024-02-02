/* eslint-disable no-undef */
import React from "react";
import styled from "styled-components";
import { MdOutlineGroupAdd, MdOutlinePersonAddAlt1 } from "react-icons/md";
import { CiVideoOn } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";

export default class MessageScreen extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      activeContentTab: "Prioritize",
      users: [
        { id: "1", name: "Người dùng 1", email: "user1@example.com" },
        { id: "2", name: "Thành viên Mến", email: "user2@example.com" },
        { id: "3", name: "Nguyễn Hoàng Thái", email: "user1@example.com" },
        { id: "4", name: "Lê Thị Ngọc Mai", email: "user2@example.com" },
        { id: "5", name: "Nguyễn Văn Việt", email: "user1@example.com" },
        { id: "6", name: "Nguyễn Văn Long", email: "user2@example.com" },
        { id: "1", name: "Người dùng 1", email: "user1@example.com" },
        { id: "2", name: "Thành viên Mến", email: "user2@example.com" },
        { id: "3", name: "Nguyễn Hoàng Thái", email: "user1@example.com" },
        { id: "4", name: "Lê Thị Ngọc Mai", email: "user2@example.com" },
        { id: "5", name: "Nguyễn Văn Việt", email: "user1@example.com" },
        { id: "6", name: "Nguyễn Văn Long", email: "user2@example.com" },
        // Thêm thông tin người dùng khác nếu cần
      ],
    };
  }
  handleContentTab(tab) {
    this.setState({
      activeContentTab: tab,
    });
  }
  renderContentMessage() {
    return (
      <ChatMessage className="ChatMessage">
        <ContentMessage className="ContentMessage">
          <HeaderContentMessage className="HeaderContentMessage">
            <LeftMessage>
              <Avatar style={{ margin: "0" }} className="Avatar"></Avatar>
              <InputName style={{ marginLeft: "10px" }}>Your name</InputName>
            </LeftMessage>
            <IconGroupMessage className="HeaderContentMessage">
              <MdOutlineGroupAdd
                style={{ fontSize: "24px" }}
                className="AddPersonGroup"
              />
              <IoIosSearch
                style={{ fontSize: "24px" }}
                className="FindMessage"
              />
              <CiVideoOn style={{ fontSize: "24px" }} className="VideoCall" />
            </IconGroupMessage>
          </HeaderContentMessage>
          <BodyContentMessage className="BodyContentMessage"></BodyContentMessage>
        </ContentMessage>
        <InforMessage className="InforMessage">
          <HeaderInforMessage className="HeaderInforMessage">
            <InputInfor>Thông tin nhóm</InputInfor>
          </HeaderInforMessage>
          <BodyInforMessage className="BodyInforMessage"></BodyInforMessage>
        </InforMessage>
      </ChatMessage>
    );
  }
  renderContentTab() {
    const { activeContentTab, users } = this.state;
    if (activeContentTab === "Orther") {
      return <h1>Orther</h1>;
    } else if (activeContentTab === "Prioritize") {
      return (
        <div style={{ overflowY: "auto", maxHeight: "100vh" }}>
          {users.map((user) => (
            <button
              style={{
                width: "100%",
                outline: "0",
                background: "white",
                border: "none",
              }}
            >
              <ItemUser key={user.id}>
                <Avatar style={{ margin: "0" }} className="Avatar"></Avatar>
                <div style={{ display: "block" }}>
                  <h3
                    style={{
                      fontWeight: "500",
                      margin: "0 0 0 5px",
                      padding: "0",
                    }}
                  >
                    {user.name}
                  </h3>
                  <h5
                    style={{
                      fontWeight: "350",
                      margin: "0 0 0 5px",
                      padding: "0",
                    }}
                  >
                    Hoạt động 15 phút trước
                  </h5>
                </div>
              </ItemUser>
            </button>
          ))}
        </div>
      );
    }
  }
  renderTab() {
    return (
      <ListMessage className="ListMessage">
        <TabsList className="Tabs">
          <TabList
            className="Tab"
            $activeContentTab={this.state.activeContentTab === "Prioritize"}
            onClick={() => this.handleContentTab("Prioritize")}
          >
            Ưu tiên
          </TabList>
          <TabList
            className="Tab"
            $activeContentTab={this.state.activeContentTab === "Orther"}
            onClick={() => this.handleContentTab("Orther")}
          >
            Khác
          </TabList>
        </TabsList>
        <ContentTab className="ContentTab">
          {this.renderContentTab()}
        </ContentTab>
      </ListMessage>
    );
  }
  render() {
    return (
      <>
        <Content>
          <ListPerson className="ListPersonMessage">
            <HeaderList className="HeaderList">
              <Search className="Search">
                <button
                  style={{ fontSize: "15px", padding: "5px", border: "none" }}
                >
                  <i style={{ width: "100%" }} class="ti-search"></i>
                </button>
                <input
                  style={{
                    fontSize: "15px",
                    padding: "5px",
                    outline: "0",
                    border: "none",
                    background: "rgb(240,240,240)",
                  }}
                  placeholder="Tìm kiếm"
                ></input>
              </Search>
              <button
                style={{
                  border: "none",
                  fontSize: "15px",
                  background: "white",
                  padding: "0",
                }}
              >
                <MdOutlinePersonAddAlt1 style={{ fontSize: "24px" }} />
              </button>
              <button
                style={{
                  border: "none",
                  fontSize: "15px",
                  background: "white",
                  padding: "0",
                }}
              >
                <MdOutlineGroupAdd style={{ fontSize: "24px" }} />
              </button>
            </HeaderList>
            <ContentList className="ContentListMessage">
              {this.renderTab()}
            </ContentList>
          </ListPerson>
          <ContentBody className="ContentBodyMessage">
            {this.renderContentMessage()}
          </ContentBody>
        </Content>
      </>
    );
  }
}

const ItemUser = styled.div`
  border: 1px solid rgb(219, 223, 229);
  padding: 10px;
  display: flex;
`;
const ListMessage = styled.div``;
const TabList = styled.div`
  margin: 5px;
  opacity: ${(props) => (props.$activeContentTab ? "1" : "0.5")};
  font-weight: ${(props) => (props.$activeContentTab ? "bold" : "normal")};
  transition: opacity 0.3s ease, font-weight 0.3s ease;
`;
const TabsList = styled.div`
  height: 5%;
  display: inline-flex;
`;
const ContentTab = styled.div`
  height: 95%;
`;
const ContentBody = styled.div`
  height: 100vb;
  width: 85%;
  display: flex;
`;
const Content = styled.div`
  height: 100vb;
  width: 96%;
  display: flex;
  box-sizing: border-box;
`;
const Search = styled.div`
  padding: 5px;
`;
const ContentList = styled.div`
  height: 100vh;
  margin: 0;
`;
const HeaderList = styled.div`
  background: white;
  padding: 10px;
  height: 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ListPerson = styled.div`
  height: 100%;
  width: 350px;
  overflow: hidden;
  border-right: 1px solid rgb(219, 223, 229);
`;
const InputInfor = styled.div`
  font-size: 22px;
  font-weight: 500;
`;
const HeaderInforMessage = styled.div`
  height: 8%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 2px solid rgb(241, 243, 245);
`;
const BodyInforMessage = styled.div``;
const BodyContentMessage = styled.div`
  background: cyan;
  width: 100%;
  height: 92%;
`;
const LeftMessage = styled.div`
  float: left;
  display: flex;
  width: 80%;
`;
const IconGroupMessage = styled.div`
  display: flex;
  justify-content: space-around;
  float: right;
  align-items: center;
  width: 20%;
`;
const InputName = styled.div`
  margin-left: 70px;
  border: none;
  font-size: 23px;
  font-weight: bold;
  color: black;
`;
const ContentMessage = styled.div`
  height: 100vb;
  width: 70%;
  border-right: 1px solid rgb(219, 223, 229);
`;
const InforMessage = styled.div`
  height: 100vb;
  width: 30%;
`;
const Avatar = styled.div`
  background: black;
  width: 55px;
  height: 55px;
  margin: 15px auto;
  border-radius: 50%;
`;
const HeaderContentMessage = styled.div`
  padding: 10px;
  display: flex;
  height: 8%;
  border-bottom: 1px solid rgb(241, 243, 245);
`;

const ChatMessage = styled.div`
  width: 100%;
  height: 100vb;
  display: flex;
  overflow: hidden;
`;
