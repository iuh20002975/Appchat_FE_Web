import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdOutlineGroupAdd } from "react-icons/md";
import { IoSearch, IoSendOutline } from "react-icons/io5";
import { CiVideoOn, CiImageOn } from "react-icons/ci";
import { EmojiKeyboard } from "reactjs-emoji-keyboard";
import { MdDeleteOutline } from "react-icons/md";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { MdOutlineAttachFile } from "react-icons/md";
import img from "../images/image_background.webp";
import {
  postApiNoneTokenConversation,
  getApiNoneToken,
  getApiNoneTokenConversation,
} from "../api/Callapi";
import {
  AiOutlineUsergroupAdd,
  AiOutlineUsergroupDelete
} from "react-icons/ai";
import Modal from "react-modal";
import ChatListGroup from "../component/listChat.js";
import { useCallback } from "react";
const ChatGroupScreen = ({ selectedGroupName, userLogin, idGroup }) => {
  const [nameSender, setNameSender] = useState("");
  const [users, setUsers] = useState([]);
  // eslint-disable-next-line
  const [originalUsers, setOriginalUsers] = useState([]);
  // eslint-disable-next-line
  const [groupKey, setGroupKey] = useState(0);
  const [loadGroups, setLoadGroups] = useState(false);
  // eslint-disable-next-line
  const [showDeleteMemberModal, setShowDeleteMemberModal] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const handleDeleteMemberModal = () => {
    setShowDeleteMemberModal(true);
  };
  // eslint-disable-next-line
  const closeDeleteMemberModal = () => {
    setShowDeleteMemberModal(false);
  };
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const response = await getApiNoneTokenConversation(`/${userLogin}`, {
          id: userLogin,
        });

        // Lọc ra những object có ít nhất 3 người tham gia
        const friendsWithAtLeastThreeParticipants = response.data.filter(
          (friend) => friend.participants.length >= 3
        );

        // Set state cho listFriend với những object đã lọc
        setListGroup(friendsWithAtLeastThreeParticipants);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bạn:", error);
      }
    };
    loadGroups();
    // thêm để render
    setLoadGroups(false);
  }, [userLogin, loadGroups]);
  const [listGroup, setListGroup] = useState([]);
  const handleEmojiSelect = (emoji) => {
    setMessageInput((prevMessage) => prevMessage + emoji.character);
  };
  const closeModalAdd = () => {
    setShowModal(false);
  };
  const [showMembers, setShowMembers] = useState(false);
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);
  // xóa nhóm
  const deleteGroup = async () => {
    try {
      await postApiNoneTokenConversation("/deleteConversation/" + idGroup);
      alert("Giải tán thành công");
      setLoadGroups(true);
    } catch (error) {
      console.error("xóa nhóm thất bại", error);
    }
  };
  const toggleEmojiKeyboard = () => {
    setShowEmojiKeyboard(!showEmojiKeyboard);
  };
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
  useEffect(() => {
    const loadInfor = async () => {
      try {
        const response = await getApiNoneToken(`/getDetails/${userLogin}`, {
          id: userLogin,
        });
        setNameSender(response.data.data.name);
      } catch (error) {
        console.error("Error while fetching user details:", error);
        alert("Error while fetching user details: " + error.message);
      }
    };
    loadInfor();
  }, [userLogin]);
  const sendMessageToGroupAt = useCallback(async () => {
    try {
      await postApiNoneTokenConversation("/sendMessageToGroup", {
        groupId: idGroup,
        senderId: userLogin,
        message: nameSender + " : " + messageInput,
      });

      setMessageInput("");
      setGroupKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.log("Không thể gửi tin nhắn trống.");
    }
  }, [idGroup, messageInput, userLogin, nameSender]);

  const uploadToS3Group = (file) => {
    if (!file) {
      alert("Không có file/ảnh group nào được chọn");
      return;
    }
    console.log("File:", file);
    const formData = new FormData();
    formData.append("file", file);
    console.log("formData:", formData);
    postApiNoneTokenConversation(
     "/uploadOnAppConver/" + idGroup +"?senderId=" + userLogin,
      formData,
      {
        groupId: idGroup,
        senderId: userLogin,
      }
    ) 
      .then((response) => {
        console.log("Upload lên S3 thành công:", response);
      })
      .catch((error) => {
        console.error("Lỗi khi upload lên S3:", error);
      });
  };
  const [showModal, setShowModal] = useState(false);
  const handleModalAdd = () => {
    setShowModal(true);
  };
  const sendFileOfTypeGroup = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,video/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      uploadToS3Group(file);
    };
    input.click();
  };
  const sendImageGroup = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      uploadToS3Group(file);
    };
    input.click();
  };

  return (
    <>
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
            <IoSearch style={{ fontSize: "24px" }} className="FindMessage" />
            <CiVideoOn style={{ fontSize: "24px" }} className="VideoCall" />
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
            <ImageButton onClick={sendImageGroup}>
              <CiImageOn style={{ width: "100%", height: "100%" }} />
            </ImageButton>
            <FileButton onClick={sendFileOfTypeGroup}>
              <MdOutlineAttachFile style={{ width: "100%", height: "100%" }} />
            </FileButton>
            {/* // thêm emoji */}
            {showEmojiKeyboard && (
              <Modal
                style={{
                  overlay: {
                    backgroundColor: "none",
                    backgroundBlendMode: "darken",
                    marginLeft: "25%",
                    marginTop: "15%",
                  },
                  content: {
                    width: "30.2%",
                    margin: "0",
                    maxHeight: "64.6%",
                    padding: "10",
                    flexDirection: "column",
                    justifyContent: "left",
                    alignContent: "left",
                    overflow: "hidden",
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
                  //onEmojiSelect={(emoji) => setMessageInput((emoji.character))}
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
            <SendButton onClick={sendMessageToGroupAt}>
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
                  onClick={deleteGroup}
                >
                  <MdDeleteOutline />
                </button>

                <span style={{ fontSize: "13px" }}>Xóa nhóm</span>
              </DeleteGroup>
              {/* <Modal
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
                    </Modal> */}
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
                {listGroup.map((user) => (
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
  );
};
export default ChatGroupScreen;
const ImageButton = styled.div`
  margin-left: 10px;
  height: 30px;
  width: 30px;
  cursor: pointer;
`;
const AvatarInGroup = styled.div`
  background: black;
  width: 35px;
  height: 35px;
  margin: 3px;
  border-radius: 50%;
`;
const ChatButton = styled.div`
  display: flex;
  margin-left: 7.5px;
`;
const BodyInforBottom = styled.div`
  overflow-y: auto;
`;
const Infor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const BodyInforTop = styled.div`
  overflow-y: auto;
`;
const BodyInforMessage = styled.div`
  overflow-y: auto;
  max-height: 600px;
`;

const InputInfor = styled.div`
  font-size: 22px;
  font-weight: 500;
`;
const FileButton = styled.div`
  height: 30px;
  width: 30px;
  cursor: pointer;
`;
const SendButton = styled.div`
  position: relative;
  border: none;
  border-radius: 5px;
  padding: 7px 13px;
  cursor: pointer;
`;
const HeaderInforMessage = styled.div`
  height: 8%;
  padding: 10px;
  display: flex;

  align-items: center;
  justify-content: center;
  border-bottom: 2px solid rgb(241, 243, 245);
`;
const InforMessage = styled.div`
  height: 100vb;
  width: 30%;
`;
const FooterContenMessate = styled.div`
  width: 100%;
  display: block;
  flex-direction: column;
  background: white;
  //background-image: url(${img});
`;
const InputName = styled.div`
  border: none;
  font-size: 23px;
  font-weight: bold;
  color: black;
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
const ContentMessage = styled.div`
  height: 100vb;
  width: 70%;

  border-right: 1px solid rgb(219, 223, 229);
`;
const BodyContentMessage = styled.div`
  width: 100%;
  height: 73%;
  overflow-y: auto;
  box-sizing: border-box;
`;
const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
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

const MenutoGroup = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 25px;
`;
const AddMemberToGroup = styled.div`
  display: block;
`;
const AvatarModal = styled.div`
  background: black;
  width: 35px;
  height: 35px;
  margin: 3px;
  border-radius: 50%;
`;
const DeleteMember = styled.div``;
const DeleteGroup = styled.div``;
