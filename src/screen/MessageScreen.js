/* eslint-disable no-undef */
import React from "react";
import styled from "styled-components";
import { MdOutlineGroupAdd, MdOutlinePersonAddAlt1 } from "react-icons/md";
import { CiVideoOn } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import img from "../images/image_background.webp";
import { FaSearch } from "react-icons/fa";
import { AiOutlineUsergroupAdd } from "react-icons/ai"; // Icon thêm thành viên
import { AiOutlineUsergroupDelete } from "react-icons/ai"; // Xóa thành viên
import { MdDeleteOutline } from "react-icons/md"; // Xóa chat
import { IoMdArrowDropdown } from "react-icons/io"; // Icon hiển thị danh sách thành viên
import { IoMdArrowDropup } from "react-icons/io"; // Icon ẩn danh sách thành viên
import { IoSendOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineAttachFile } from "react-icons/md";
import Modal from "react-modal";

export default class MessageScreen extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      activeName: "Name",
      activeContentTab: "Prioritize",
      selectedUserName: "",
      showMembers: false,
      showModal: false,
      showDeleteMemberModal: false, // Thêm trạng thái mới cho modal xóa thành viên
      selectedMembers: [],
      messageInput: "",
      messages: [],
      users: [
        { id: "1", name: "Người dùng 1", email: "user1@example.com" },
        { id: "2", name: "Thành viên Mến", email: "user2@example.com" },
        { id: "3", name: "Nguyễn Hoàng Thái", email: "user1@example.com" },
        { id: "4", name: "Lê Thị Ngọc Mai", email: "user2@example.com" },
        { id: "5", name: "Nguyễn Văn Việt", email: "user1@example.com" },
      ],
    };
  }
  handleSearchInputChange = (event) => {
    const searchKeyword = event.target.value.toLowerCase(); // Chuyển đổi từ khóa tìm kiếm sang chữ thường để so sánh dễ dàng hơn
    const filteredUsers = this.state.users.filter(
      (user) => user.name.toLowerCase().includes(searchKeyword) // Lọc ra các người dùng có tên chứa từ khóa tìm kiếm
    );
    this.setState({ users: filteredUsers }); // Cập nhật danh sách người dùng hiển thị trên giao diện
  };

  sendFileOfType = (acceptedFileType) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = acceptedFileType;
    input.onchange = (event) => {
      const file = event.target.files[0];
      this.sendFile(file);
    };
    input.click();
  };

  sendWordFile = () => {
    this.sendFileOfType(".doc,.docx");
  };

  sendExcelFile = () => {
    this.sendFileOfType(".xls,.xlsx");
  };

  sendPowerPointFile = () => {
    this.sendFileOfType(".ppt,.pptx");
  };
  sendImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      alert("Đã chọn ảnh: " + file.name);
    };
    input.click(); // Kích hoạt sự kiện click trên input để mở cửa sổ chọn file
  };
  sendMessage = () => {
    const { messageInput, messages } = this.state;
    if (messageInput.trim() !== "") {
      const newMessage = {
        sender: "User", // Thay bằng tên của người gửi tin nhắn
        content: messageInput,
      };
      // Cập nhật mảng tin nhắn trong state
      this.setState({
        messages: [...messages, newMessage],
        messageInput: "", // Xóa nội dung tin nhắn sau khi gửi
      });
    } else {
      console.log("Không thể gửi tin nhắn trống.");
    }
  };
  handlerName(tabName) {
    this.setState({
      activeName: tabName,
      messages: [],
    });
  }
  handleContentTab(tab) {
    this.setState({
      activeContentTab: tab,
    });
  }
  handleModalAdd = () => {
    this.setState({ showModal: true });
  };
  closeModalAdd = () => {
    this.setState({ showModal: false });
  };
  //------------------------------------------------------
  handleDeleteMemberModal = () => {
    this.setState({ showDeleteMemberModal: true });
  };

  // Thêm hàm xử lý đóng modal xóa thành viên
  closeDeleteMemberModal = () => {
    this.setState({ showDeleteMemberModal: false });
  };

  // Thêm hàm xử lý chọn thành viên để xóa
  handleSelectMember = (userId) => {
    const { selectedMembers } = this.state;
    const isSelected = selectedMembers.includes(userId);

    if (isSelected) {
      // Nếu đã được chọn, loại bỏ khỏi danh sách
      this.setState({
        selectedMembers: selectedMembers.filter((id) => id !== userId),
      });
    } else {
      // Nếu chưa được chọn, thêm vào danh sách
      this.setState({
        selectedMembers: [...selectedMembers, userId],
      });
    }
  };

  // Thêm hàm xử lý xóa thành viên
  handleDeleteMembers = () => {
    // Xử lý xóa thành viên ở đây, có thể gọi API hoặc thực hiện logic xóa tùy thuộc vào yêu cầu của bạn
    console.log("Xóa thành viên:", this.state.selectedMembers);

    // Sau khi xóa, đóng modal và làm sạch danh sách được chọn
    this.setState({
      showDeleteMemberModal: false,
      selectedMembers: [],
    });
  };

  renderContentMessage() {
    const { selectedUserName } = this.state; // Lấy tên người dùng từ state

    return (
      <ChatMessage className="ChatMessage">
        {selectedUserName === "" ? (
          <Background></Background>
        ) : (
          <>
            <ContentMessage className="ContentMessage">
              <HeaderContentMessage className="HeaderContentMessage">
                <LeftMessage>
                  <Avatar style={{ margin: "0" }} className="Avatar"></Avatar>
                  <InputName style={{ marginLeft: "10px" }}>
                    {selectedUserName}
                  </InputName>
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
                  <CiVideoOn
                    style={{ fontSize: "24px" }}
                    className="VideoCall"
                  />
                </IconGroupMessage>
              </HeaderContentMessage>
              <BodyContentMessage className="BodyContentMessage">
                {this.state.messages.map((message, index) => (
                  <div key={index}>
                    <ItemMessage>
                      {message.content}
                      {/* <strong>{message.sender}:</strong> {message.content} */}
                    </ItemMessage>
                  </div>
                ))}
              </BodyContentMessage>
              <FooterContenMessate>
                <ChatButton>
                  <ImageButton onClick={this.sendImage}>
                    <CiImageOn style={{ width: "100%", height: "100%" }} />
                  </ImageButton>
                  <FileButton onClick={this.sendFileOfType}>
                    <MdOutlineAttachFile
                      style={{ width: "100%", height: "100%" }}
                    />
                  </FileButton>
                </ChatButton>
                <hr style={{ width: "100%" }} />
                <ChatInputContainer>
                  <input
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "0",
                      borderRadius: "5px",
                      marginRight: "10px",
                      outline: "none",
                    }}
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={this.state.messageInput}
                    onChange={(e) =>
                      this.setState({ messageInput: e.target.value })
                    }
                  />
                  <SendButton onClick={this.sendMessage}>
                    <IoSendOutline style={{ width: "23px", height: "23px" }} />
                  </SendButton>
                </ChatInputContainer>
              </FooterContenMessate>
            </ContentMessage>
            <InforMessage className="InforMessage">
              <HeaderInforMessage className="HeaderInforMessage">
                <InputInfor>Thông tin </InputInfor>
              </HeaderInforMessage>
              <BodyInforMessage className="BodyInforMessage">
                <BodyInforTop className="BodyInforTop">
                  <Infor className="Infor">
                    <Avatar className="Avatar"></Avatar>
                    <InputName>{selectedUserName}</InputName>
                  </Infor>
                  <MenutoGroup className="MenuToGroup">
                    <AddMemberToGroup className="AddMemberToGroup">
                      <button
                        style={{
                          marginLeft: 30,
                          width: "30px",
                          height: "30px",
                          background: "#f0f0f0",
                          borderRadius: "50%",
                          cursor: "pointer",
                          borderColor: "gray",
                        }}
                        onClick={this.handleModalAdd}
                      >
                        <AiOutlineUsergroupAdd />
                      </button>

                      <span style={{ fontSize: "13px" }}>Thêm thành viên</span>
                    </AddMemberToGroup>
                    <Modal
                      style={{
                        overlay: {
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        },
                        content: {
                          width: "50%",
                          margin: "auto",
                          maxHeight: "50%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        },
                      }}
                      isOpen={this.state.showModal}
                      onRequestClose={this.closeModalAdd}
                      contentLabel="Example Modal"
                    >
                      <div>
                        <h2>Thêm thành viên</h2>
                      </div>

                      <form style={{ flex: 1, overflowY: "auto" }}>
                        {this.state.users.map((user) => (
                          <div
                            key={user.id}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input type="checkbox" id={user.id} />
                            <AvatarModal className="AvatarModal"></AvatarModal>
                            <label htmlFor={user.id}>{user.name}</label>
                          </div>
                        ))}
                      </form>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <button
                          onClick={this.closeModalAdd}
                          style={{
                            width: 50,
                            height: 35,
                            borderRadius: 15,
                            borderWidth: 1,
                            outline: "none",
                            cursor: "pointer",
                          }}
                        >
                          Đóng
                        </button>
                        <button
                          type="submit"
                          form="modalForm"
                          style={{
                            width: 50,
                            height: 35,
                            borderRadius: 15,
                            borderWidth: 1,
                            outline: "none",
                            backgroundColor: "#2ADFEA",
                            color: "white",
                            cursor: "pointer",
                          }}
                        >
                          Thêm
                        </button>
                      </div>
                    </Modal>
                    <DeleteMember className="DeleteMember">
                      <button
                        style={{
                          marginLeft: 20,
                          width: "30px",
                          height: "30px",
                          background: "#f0f0f0",
                          borderRadius: "50%",
                          cursor: "pointer",
                          borderColor: "gray",
                        }}
                        onClick={this.handleDeleteMemberModal}
                      >
                        <AiOutlineUsergroupDelete />
                      </button>

                      <span style={{ fontSize: "13px" }}>Xóa thành viên</span>
                    </DeleteMember>
                    <DeleteGroup className="DeleteGroup">
                      <button
                        style={{
                          marginLeft: 10,
                          width: "30px",
                          height: "30px",
                          background: "#f0f0f0",
                          borderRadius: "50%",
                          cursor: "pointer",
                          borderColor: "gray",
                        }}
                      >
                        <MdDeleteOutline />
                      </button>

                      <span style={{ fontSize: "13px" }}>Xóa nhóm</span>
                    </DeleteGroup>
                    <Modal
                      style={{
                        overlay: {
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        },
                        content: {
                          width: "50%",
                          margin: "auto",
                          maxHeight: "50%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        },
                      }}
                      isOpen={this.state.showDeleteMemberModal}
                      onRequestClose={this.closeDeleteMemberModal}
                      contentLabel="Delete Member Modal"
                    >
                      <div>
                        <h2>Xóa thành viên</h2>
                      </div>
                      <form style={{ flex: 1, overflowY: "auto" }}>
                        {this.state.users.map((user) => (
                          <div
                            key={user.id}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              id={user.id}
                              checked={this.state.selectedMembers.includes(
                                user.id
                              )}
                              onChange={() => this.handleSelectMember(user.id)}
                            />
                            <AvatarModal className="AvatarModal"></AvatarModal>
                            <label htmlFor={user.id}>{user.name}</label>
                          </div>
                        ))}
                      </form>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <button
                          style={{
                            width: 50,
                            height: 35,
                            borderRadius: 15,
                            borderWidth: 1,
                            outline: "none",
                            cursor: "pointer",
                          }}
                          onClick={this.closeDeleteMemberModal}
                        >
                          Đóng
                        </button>
                        <button
                          style={{
                            width: 50,
                            height: 35,
                            borderRadius: 15,
                            borderWidth: 1,
                            outline: "none",
                            backgroundColor: "#D22424",
                            color: "white",
                            cursor: "pointer",
                          }}
                          onClick={this.handleDeleteMembers}
                        >
                          Xóa
                        </button>
                      </div>
                    </Modal>
                  </MenutoGroup>
                </BodyInforTop>

                <BodyInforBottom className="BodyInforBottom">
                  <button
                    style={{
                      width: "100%",
                      height: "34px",
                      marginTop: "50px",
                      display: "flex",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      border: "10px",
                      outline: "none",
                    }}
                    onClick={() =>
                      this.setState({ showMembers: !this.state.showMembers })
                    }
                  >
                    <span
                      style={{
                        fontSize: "20px",
                      }}
                    >
                      {this.state.showMembers
                        ? "Ẩn danh sách "
                        : "Thành viên nhóm"}
                    </span>
                    {this.state.showMembers ? (
                      <IoMdArrowDropup
                        style={{
                          width: "10%",
                          height: "auto",
                          marginTop: "2px",
                        }}
                      />
                    ) : (
                      <IoMdArrowDropdown
                        style={{
                          width: "10%",
                          height: "auto",
                        }}
                      />
                    )}
                  </button>

                  {this.state.showMembers && (
                    <ul>
                      {this.state.users.map((user) => (
                        <li
                          style={{
                            listStyleType: "none",
                            paddingRight: "10px",
                            display: "flex",
                            alignItems: "center",
                            fontWeight: user._id === this.props.userId,
                          }}
                          key={user.id}
                        >
                          <AvatarInGroup className="AvatarInGroup"></AvatarInGroup>
                          {user.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </BodyInforBottom>
              </BodyInforMessage>
            </InforMessage>
          </>
        )}
      </ChatMessage>
    );
  }
  renderContentTab() {
    const { activeContentTab, users } = this.state;
    if (activeContentTab === "Orther") {
      return <h1>Orther</h1>;
    } else if (activeContentTab === "Prioritize") {
      return (
        <div style={{ overflow: "scroll", maxHeight: "90vb" }}>
          {users.map((user) => (
            <button
              onClick={() => this.setState({ selectedUserName: user.name })} // Sử dụng arrow function ở đây
              style={{
                width: "100%",
                outline: "0",
                background: "white",
                border: "none",
              }}
              key={user.id}
            >
              <ItemUser
                $activeName={this.state.activeName === "Name"}
                onClick={() => this.handlerName("Name")}
              >
                <Avatar style={{ margin: "0" }} className="Avatar"></Avatar>
                <div
                  style={{
                    display: "block",
                    width: "80%",
                    padding: "5px 0 0 0",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: "530",
                      fontSize: 18,
                      margin: "0 0 0 5px",
                      padding: "0",
                      textAlign: "left",
                      position: "relative",
                      height: "50%",
                      top: "5%",
                    }}
                  >
                    {user.name}
                  </h3>
                  <h5
                    style={{
                      fontWeight: "400",
                      margin: "0 0 0 5px",
                      padding: "0",
                      position: "relative",
                      top: "9%",
                      height: "50%",
                      textAlign: "left",
                      fontStyle: "italic",
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
                  style={{
                    fontSize: "15px",
                    padding: "5px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onChange={this.handleSearchInputChange}
                >
                  <FaSearch />
                </button>
                <input
                  style={{
                    fontSize: "15px",
                    padding: "6px",
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
            <ContentList className="ContentListPerson">
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
const ItemMessage = styled.div`
  padding: 15px;
  border-radius: 8px;
  display: inline-block;
  background-color: cyan;
  width: max-content;
  height: max-content;
  margin: 5px;
`;
const FileButton = styled.div`
  height: 30px;
  width: 30px;
  cursor: pointer;
`;
const ImageButton = styled.div`
  margin-left: 10px;
  height: 30px;
  width: 30px;
  cursor: pointer;
`;
const ChatButton = styled.div`
  display: flex;
  margin-left: 7.5px;
`;
const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
`;
const SendButton = styled.div`
  position: relative;

  border: none;
  border-radius: 5px;
  padding: 7px 13px;
  cursor: pointer;
`;

const AvatarModal = styled.div`
  background: black;
  width: 35px;
  height: 35px;
  margin: 3px;
  border-radius: 50%;
`;
const AvatarInGroup = styled.div`
  background: black;
  width: 35px;
  height: 35px;
  margin: 3px;
  border-radius: 50%;
`;

const Infor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const MenutoGroup = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 25px;
`;

const DeleteMember = styled.div``;
const DeleteGroup = styled.div``;
const AddMemberToGroup = styled.div`
  display: block;
`;
const BodyInforTop = styled.div`
  overflow-y: auto;
`;
const BodyInforBottom = styled.div`
  overflow-y: auto;
`;
const BodyInforMessage = styled.div`
  overflow-y: auto;
  max-height: 600px;
`;
const FooterContenMessate = styled.div`
  height: 27%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: white;
`;
const ItemUser = styled.div`
  padding: 10px;
  display: flex;
  cursor: pointer;
`;
// background: ${(props) => (props.$activeName ? 'rgb(229,239,255)' : 'normal')};
//   font-weight: ${(props) => (props.$activeName ? 'bold': 'normal')};
const Background = styled.div`
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-image: url(${img});
  background-size: cover;
  background-position: center;
`;
const ListMessage = styled.div`
  /* height: 100%; */
  width: 100%;
`;
const TabList = styled.div`
  margin: 5px;
  opacity: ${(props) => (props.$activeContentTab ? "1" : "0.5")};
  font-weight: ${(props) => (props.$activeContentTab ? "bold" : "normal")};
  transition: opacity 0.3s ease, font-weight 0.3s ease;
  cursor: pointer;
`;
const TabsList = styled.div`
  height: 5%;
  display: inline-flex;
`;
const ContentTab = styled.div`
  /* height: 95%; */
`;
const ContentBody = styled.div`
  height: 100vb;
  width: 85%;
  display: flex;
`;
const Content = styled.div`
  height: 100vb;
  width: 100%;
  display: flex;
  box-sizing: border-box;
`;
const Search = styled.div`
  padding: 5px;
  display: flex;
  overflow: hidden;
`;
const ContentList = styled.div`
  height: 95%;
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
  width: 25%;
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

const BodyContentMessage = styled.div`
  width: 100%;
  height: 73%;
  background-color: red;
  text-align: right;
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
  width: 50px;
  height: 50px;
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
