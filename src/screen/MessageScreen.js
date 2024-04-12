/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdOutlineGroupAdd, MdOutlinePersonAddAlt1 } from "react-icons/md";
import { CiVideoOn } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import img from "../images/image_background.webp";
import { FaSearch } from "react-icons/fa";
import {
  AiOutlineUsergroupAdd,
  AiOutlineUsergroupDelete,
} from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { IoSendOutline } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineAttachFile } from "react-icons/md";
import {postApiNoneTokenMessage, getApiNoneToken } from "../api/Callapi";
import Modal from "react-modal";
import Chat from "../component/chat";
import { useCallback } from "react";
import io from "socket.io-client";

export default function MessageScreen({ userLogin }) {
  const [activeName, setActiveName] = useState("");
  const [activeContentTab, setActiveContentTab] = useState("Prioritize");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [idSelector, setIdSelector] = useState("");
  const [showDeleteMemberModal, setShowDeleteMemberModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

  const [users, setUsers] = useState([]);

  const [originalUsers, setOriginalUsers] = useState([]);

  const [chatKey, setChatKey] = useState(0);

  const socket = io("ws://localhost:3000");

  // Trong useEffect của component Chat
  useEffect(() => { 
    // Lắng nghe sự kiện mới tin nhắn từ máy chủ WebSocket
    socket.on("newMessage", (newMessage) => {
      // Xử lý tin nhắn mới và cập nhật trạng thái của component Chat
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    // Cleanup: Ngắt kết nối khi component unmount
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    const loadIdByPhone = async () => {
      try {
        const response = await getApiNoneToken(`/getDetailsByPhone/${phone}`, {
          phone: phone,
        });
        setIdSelector(response.data.data._id);
      } catch (error) {
        console.error("Error loading ID by phone:", error);
      }
    };
    loadIdByPhone();
  });

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const response = await getApiNoneToken(`/getAllFriend/${userLogin}`, {
          id: userLogin,
        });
        setUsers(response.data.data);
        setOriginalUsers(response.data.data);
      } catch (error) {
        console.error("Error loading ID by phone:", error);
      }
    };
    loadFriends();
  }, [userLogin]);

  const handleSearchInputChange = (event) => {
    const searchKeyword = event.target.value.toLowerCase();
    if (searchKeyword === "") {
      setUsers(originalUsers);
    } else {
      const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchKeyword)
      );
      setUsers(filteredUsers);
    }
  };

  // const sendFileOfType = (acceptedFileType) => {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = acceptedFileType;
  //   input.onchange = (event) => {
  //     const file = event.target.files[0];
  //     sendFile(file);
  //   };
  //   input.click();
  // };

  // const sendFile = (file) => {
  //   // Thực hiện gửi file ở đây
  // };

  // const sendWordFile = () => {
  //   sendFileOfType(".doc,.docx");
  // };

  // const sendExcelFile = () => {
  //   sendFileOfType(".xls,.xlsx");
  // };

  // const sendPowerPointFile = () => {
  //   sendFileOfType(".ppt,.pptx");
  // };

  // const sendImage = () => {
  //   const input = document.createElement("input");
  //   input.type = "file";
  //   input.accept = "image/*";
  //   input.onchange = (event) => {
  //     const file = event.target.files[0];
  //     const formData = new FormData();
  //     formData.append("image", file);
  //     alert("Đã chọn ảnh: " + file.name);
  //   };
  //   input.click();
  // };
  const sendFile = (file) => {
    if (file !== null && file !== undefined) {
      const formData = new FormData();
      formData.append("file", file);
  
      // Đọc dữ liệu của file bằng FileReader
      const reader = new FileReader();
      reader.onload = function(event) {
        console.log("Dữ liệu của file:", event.target.result);
      };
      reader.readAsDataURL(file);
      console.log("XIN chào cậu"+ reader)
      // Tiếp tục gửi formData lên server bằng fetch hoặc các phương thức khác
      fetch("/uploadFile", {
        method: "POST",
        body: formData,
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Upload file thành công:", data);
      })
      .catch((error) => {
        console.error("Lỗi khi upload file:", error);
      });
    } else {
      console.error("File không tồn tại.");
    }
  };
  const uploadImageToS3 = (file) => {
    if (!file) {
      alert("Không có ảnh");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    // Gửi yêu cầu POST đến endpoint '/uploadOnApp/:idSelector' với formData là body
    postApiNoneTokenMessage('/uploadOnApp/' + idSelector + '?senderId=' + userLogin, formData)
      .then((response) => {
        console.log("Upload ảnh lên S3 thành công:", response);
      })
      .catch((error) => {
        console.error("Lỗi khi upload ảnh lên S3:", error);
      });
  };
  
  const sendImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      uploadImageToS3(file);
    };
    input.click();
  };
  
  
  const sendFileOfType = (acceptedFileType) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = acceptedFileType;
    input.onchange = (event) => {
      const file = event.target.files[0];
      sendFile(file);
    };
    input.click();
  };
  
  const sendWordFile = () => {
    sendFileOfType(".doc,.docx");
  };
  
  const sendExcelFile = () => {
    sendFileOfType(".xls,.xlsx");
  };
  
  const sendPowerPointFile = () => {
    sendFileOfType(".ppt,.pptx");
  };
  const sendMessage = useCallback(async () => {
    try {
      const response = await postApiNoneTokenMessage(
        "/sendMessage/" + idSelector,
        {
          userId: userLogin,
          message: messageInput,
        }
      );

      setMessageInput("");
      setChatKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.log("Không thể gửi tin nhắn trống.");
    }
  }, [idSelector, messageInput, userLogin]); // Truyền một mảng rỗng làm đối số thứ hai

  const handlerName = (tabName) => {
    setActiveName(tabName);
    setMessages([]);
  };

  const handleContentTab = (tab) => {
    setActiveContentTab(tab);
  };

  const handleModalAdd = () => {
    setShowModal(true);
  };

  const closeModalAdd = () => {
    setShowModal(false);
  };

  const handleDeleteMemberModal = () => {
    setShowDeleteMemberModal(true);
  };

  const closeDeleteMemberModal = () => {
    setShowDeleteMemberModal(false);
  };

  const handleSelectMember = (userId) => {
    const isSelected = selectedMembers.includes(userId);
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleDeleteMembers = () => {
    console.log("Xóa thành viên:", selectedMembers);
    setShowDeleteMemberModal(false);
    setSelectedMembers([]);
  };

  // eslint-disable-next-line no-unused-vars
  const renderContentMessage = ({ selectedUserName }) => {
    // Lấy tên người dùng từ state
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
                <Chat
                  key={chatKey}
                  idSelector={idSelector}
                  idLogin={userLogin}
                ></Chat>
              </BodyContentMessage>
              <FooterContenMessate>
                <ChatButton>
                  <ImageButton onClick={sendImage}>
                    <CiImageOn style={{ width: "100%", height: "100%" }} />
                  </ImageButton>
                  <FileButton onClick={sendFileOfType}>
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
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <SendButton onClick={sendMessage}>
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
                        onClick={handleModalAdd}
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
                      isOpen={showModal}
                      onRequestClose={closeModalAdd}
                      contentLabel="Example Modal"
                    >
                      <div>
                        <h2>Thêm thành viên</h2>
                      </div>

                      <form style={{ flex: 1, overflowY: "auto" }}>
                        {users.map((user) => (
                          <div
                            key={user._id}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input type="checkbox" id={user._id} />
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
                          onClick={closeModalAdd}
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
                        onClick={handleDeleteMemberModal}
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
                      isOpen={showDeleteMemberModal}
                      onRequestClose={closeDeleteMemberModal}
                      contentLabel="Delete Member Modal"
                    >
                      <div>
                        <h2>Xóa thành viên</h2>
                      </div>
                      <form style={{ flex: 1, overflowY: "auto" }}>
                        {users.map((user) => (
                          <div
                            key={user._id}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              id={user.id}
                              checked={selectedMembers.includes(user.id)}
                              onChange={() => handleSelectMember(user.id)}
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
                          onClick={closeDeleteMemberModal}
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
                          onClick={handleDeleteMembers}
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
                    onClick={() => setShowMembers(!showMembers)}
                  >
                    <span
                      style={{
                        fontSize: "20px",
                      }}
                    >
                      {showMembers ? "Ẩn danh sách " : "Thành viên nhóm"}
                    </span>
                    {showMembers ? (
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

                  {showMembers && (
                    <ul>
                      {users.map((user) => (
                        <li
                          style={{
                            listStyleType: "none",
                            paddingRight: "10px",
                            display: "flex",
                            alignItems: "center",
                          }}
                          key={user._id}
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
  };
  // eslint-disable-next-line no-unused-vars
  const renderContentTab = ({ activeContentTab }) => {
    if (activeContentTab === "Orther") {
      return <h1>Orther</h1>;
    } else if (activeContentTab === "Prioritize") {
      return (
        <div style={{ overflow: "scroll", maxHeight: "90vb" }}>
          {users.map((user) => (
            <button
              onClick={() => {
                setSelectedUserName(user.name);
                setPhone(user.phone);
              }}
              style={{
                width: "100%",
                outline: "0",
                background: "white",
                border: "none",
              }}
              key={user._id}
            >
              <ItemUser
                $activeName={activeName === "Name"}
                onClick={() => {
                  handlerName("Name");
                }}
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
  };
  const renderTab = () => {
    return (
      <ListMessage className="ListMessage">
        <TabsList className="Tabs">
          <TabList
            className="Tab"
            $activeContentTab={activeContentTab === "Prioritize"}
            onClick={() => handleContentTab("Prioritize")}
          >
            Ưu tiên
          </TabList>
          <TabList
            className="Tab"
            $activeContentTab={activeContentTab === "Orther"}
            onClick={() => handleContentTab("Orther")}
          >
            Khác
          </TabList>
        </TabsList>
        <ContentTab className="ContentTab">
          {renderContentTab({ activeContentTab })}
        </ContentTab>
      </ListMessage>
    );
  };
  // eslint-disable-next-line no-unused-vars
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
                onChange={handleSearchInputChange}
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
                onChange={handleSearchInputChange}
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
            {renderTab({ selectedUserName })}
          </ContentList>
        </ListPerson>
        <ContentBody className="ContentBodyMessage">
          {renderContentMessage({ selectedUserName })}
        </ContentBody>
      </Content>
    </>
  );
}
const ItemMessage = styled.div`
  padding: 15px;
  border-radius: 8px;
  display: inline-block;
  background-color: cyan;
  max-width: 100%;
  height: max-content;
  margin: 5px;
  word-wrap: break-word;
  flex: 1;
  text-align: justify;
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
  width: 100%;
  display: block;
  flex-direction: column;
  background: white;
  background-image: url(${img});
`;
const ItemUser = styled.div`
  padding: 10px;
  display: flex;
  cursor: pointer;
`;
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
  display: inline-block;
  background-image: url(${img});
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
  overflow-y: auto;
  box-sizing: border-box;
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
  display: inline-flex;
`;
