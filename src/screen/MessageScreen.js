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
import {
  postApiNoneTokenMessage,
  getApiNoneToken,
  postApiNoneTokenConversation,
  getApiNoneTokenConversation
} from "../api/Callapi";
import Modal from "react-modal";
import Chat from "../component/chat";
import { useCallback } from "react";
import io from "socket.io-client";

// import ListGroup from "../component/listGroup";
import { EmojiKeyboard } from "reactjs-emoji-keyboard";
import ChatListGroup from "../component/listChat.js";

export default function MessageScreen({ userLogin }) {
  const [activeName, setActiveName] = useState("");
  const [activeContentTab, setActiveContentTab] = useState("Prioritize");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [idSelector, setIdSelector] = useState("");
  const [idGroup, setIdGroup] = useState("");
  const [showDeleteMemberModal, setShowDeleteMemberModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([userLogin]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [nameGroup, setNameGroup] = useState("");
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [chatKey, setChatKey] = useState(0);
  const socket = io("ws://localhost:3000");

  // emoji
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);
  const toggleEmojiKeyboard = () => {
    setShowEmojiKeyboard(!showEmojiKeyboard);
  };
  const handleEmojiSelect = (emoji) => {
    setMessageInput((prevMessage) => prevMessage + emoji.character);
  };
  const [listGroup, setListGroup] = useState([]);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const response = await getApiNoneTokenConversation(`/${userLogin}`, {
          id: userLogin,
        });
  
        // Lọc ra những object có ít nhất 3 người tham gia
        const friendsWithAtLeastThreeParticipants = response.data.filter(
          friend => friend.participants.length >= 3
        );
  
        // Set state cho listFriend với những object đã lọc
        setListGroup(friendsWithAtLeastThreeParticipants);

      } catch (error) {
        console.error("Lỗi khi tải danh sách bạn:", error);
      }
    };
    loadGroups();
  }, [userLogin]);

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

  // Xử lý sự kiện thay đổi input tìm kiếm bạn bè trong danh sách ============
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

// ============================== Phần upload file ==============================
  const uploadToS3 = (file) => {
    if (!file) {
      alert("Không có file/ảnh");
      return;
    }
    console.log("File:", file);
    const formData = new FormData();
    formData.append("file", file);
    console.log("formData:", formData);
    // Gửi yêu cầu POST đến endpoint '/uploadOnApp/:idSelector' với formData là body
    postApiNoneTokenMessage(
      "/uploadOnApp/" + idSelector + "?senderId=" + userLogin,
      formData
    )
      .then((response) => {
        console.log("Upload lên S3 thành công:", response);
      })
      .catch((error) => {
        console.error("Lỗi khi upload lên S3:", error);
      });
  };
  const sendFileOfType = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,video/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      uploadToS3(file);
    };
    input.click();
  };
  const sendImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      uploadToS3(file);
    };
    input.click();
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
// ============================== Phần create group ==============================
  const handleFindUserIdByPhone = async (phone) => {
    const response = await getApiNoneToken(`/getDetailsByPhone/${phone}`, {
      phone: phone,
    });
    if (selectedMembers.includes(response.data.data._id)) {
      setSelectedMembers((prevMembers) =>
        prevMembers.filter((member) => member !== response.data.data._id)
      );
    } else {
      setSelectedMembers((prevMembers) => [
        ...prevMembers,
        response.data.data._id,
      ]);
    }
  };
  const handleCreateGroup = async () => {
    if (nameGroup === "") {
      alert("Tên nhóm không được để trống");
      return;
    } else if (selectedMembers.length < 2) {
      alert("Chọn ít nhất 2 thành viên");
      console.log(selectedMembers);
      return;
    }
    const response = await postApiNoneTokenConversation("/createGroup", {
      groupName: nameGroup,
      participants: selectedMembers,
    });
    alert("Tạo nhóm " + response.data.groupName + " thành công");
    setShowModal(false);
  };

  // Xử lý xóa thành viên và thêm thành viên trong nhóm ========================
  const handleDeleteMembers = () => {
    console.log("Xóa thành viên:", selectedMembers);
    setShowDeleteMemberModal(false);
    setSelectedMembers([]);
  };
  const handleSelectMember = (userId) => {
    const isSelected = selectedMembers.includes(userId);
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const renderContentMessage = ({ selectedUserName }) => {
    // Lấy tên người dùng từ state
    return (
      <ChatMessage className="ChatMessage">
        {selectedUserName === "" && selectedGroupName ==="" ? (
          <Background></Background>
        ) : (
          activeContentTab === "Prioritize" ? (<>
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
                  {/* // thêm emoji */}
                  {showEmojiKeyboard && (
                    <Modal
                    style={{
                      overlay: {
                        backgroundColor: "none",
                        backgroundBlendMode: "darken",
                        marginLeft:"25%",
                        marginTop:"15%",
                      },
                      content: {
                        width: "30.2%",
                        margin: "0",
                        maxHeight: "64.6%",
                        padding: "10",
                        flexDirection: "column",
                        justifyContent: "left",
                        alignContent: "left",
                        overflow:"hidden",
                      },
                      
                    }}
                    isOpen={showEmojiKeyboard}
                    onRequestClose={toggleEmojiKeyboard}
                    contentLabel="Emoji Keyboard Modal"
                    shouldCloseOnOverlayClick={true}
                  >
                    <EmojiKeyboard
                      style={{ bottom: "10%", left: 0 }}
                      height={320}
                      width={350}
                      theme="light"
                      searchLabel="Procurar emoji"
                      searchDisabled={false}
                      // onEmojiSelect={(emoji) => setMessageInput((emoji.character))}
                      onEmojiSelect={handleEmojiSelect}
                      categoryDisabled={false}
                    />
                  </Modal>
                  )}
                  <button onClick={toggleEmojiKeyboard}>💔</button>
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
                  {/* =============== Modal thêm ===================== */}
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
                    <div style={{ margin: 0 }}>
                      <h2 style={{ margin: 0 }}>Tạo nhóm chat</h2>
                    </div>
                    <div>
                      <h4>Đặt tên nhóm</h4>
                    </div>
                    <input
                      style={{ marginBottom: "15px", padding: "8px" }}
                      placeholder="Nhập tên group"
                      onChange={(e) => setNameGroup(e.target.value)}
                    ></input>
                    <div>
                      <h4 style={{ margin: 0 }}>Chọn thành viên tham gia</h4>
                    </div>
                    <form
                      style={{ flex: 1, overflowY: "auto", padding: "3px" }}
                    >
                      {users.map((user) => (
                        <div
                          key={user._id}
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            type="checkbox"
                            id={user._id}
                            onChange={() => handleFindUserIdByPhone(user.phone)}
                          />
                          <AvatarModal className="AvatarModal" />
                          <label htmlFor={user._id}>{user.name}</label>
                        </div>
                      ))}
                    </form>
                    <br></br>
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
                        onClick={handleCreateGroup}
                      >
                        Tạo nhóm
                      </button>
                    </div>
                  </Modal>
                  {/* =============== Modal xoá ===================== */}
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
                            id={user._id}
                            checked={selectedMembers.includes(user.phone)}
                            onChange={() => handleFindUserIdByPhone(user.phone)}
                          />
                          <AvatarModal className="AvatarModal"></AvatarModal>
                          <label htmlFor={user._id}>{user.name}</label>
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
                </BodyInforTop>

                <BodyInforBottom className="BodyInforBottom">

                </BodyInforBottom>
              </BodyInforMessage>
            </InforMessage>
          </>) : 
 //         {/* (<ChatListGroup /> ) */}
          ( <>
            <ContentMessage className="ContentMessage">
              <HeaderContentMessage className="HeaderContentMessage">
                <LeftMessage>
                  <Avatar style={{ margin: "0" }} className="Avatar"></Avatar>
                  <InputName style={{ marginLeft: "10px" }}>
                    {selectedGroupName}
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
                <ChatListGroup
                  groupId={idGroup}
                  idLogin={userLogin}
                ></ChatListGroup>
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
                  {/* // thêm emoji */}
                  {showEmojiKeyboard && (
                    <EmojiKeyboard
                      style={{ bottom: "100%", left: 0 }}
                      height={320}
                      width={350}
                      theme="dark"
                      searchLabel="Procurar emoji"
                      searchDisabled={false}
                      // onEmojiSelect={(emoji) => setMessageInput((emoji.character))}
                      onEmojiSelect={handleEmojiSelect}
                      categoryDisabled={false}
                    />
                  )}
                  <button onClick={toggleEmojiKeyboard}>💔</button>
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
                    <InputName>{selectedGroupName}</InputName>
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
                            key={user.id}
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
          </> ) 
        )}
      </ChatMessage>
    );
  };
  // eslint-disable-next-line no-unused-vars
  const renderContentTab = ({ activeContentTab }) => {
    if (activeContentTab === "Orther") {
      return <h1>Orther</h1>;
    } else if (activeContentTab === "Group") {
      // return <ListGroup userLogin={userLogin} />;
      return (
        <div style={{ overflow: "scroll", flex:1 }}>
          {listGroup.map((group) => (
            <button
              onClick={() => {
                setSelectedGroupName(group.groupName);
                setIdGroup(group._id);
              }}
              style={{
                width: "100%",
                outline: "0",
                background: "white",
                border: "none",
              }}
              key={group._id}
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
                    {group.groupName}
                  </h3>
                </div>
              </ItemUser>
            </button>
          ))}
        </div>
      );
    } else {
      return (
        // <div style={{ overflow: "scroll", maxHeight: "90vb" }}>
        <div style={{ overflow: "scroll", flex:1 }}>
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
            $activeContentTab={activeContentTab === "Group"}
            onClick={() => handleContentTab("Group")}
          >
            Nhóm
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
              onClick={handleModalAdd}
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
