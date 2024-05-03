import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import { MdOutlineAttachFile } from "react-icons/md";
import { EmojiKeyboard } from "reactjs-emoji-keyboard";
import { IoSendOutline } from "react-icons/io5";
import { getApiNoneToken, postApiNoneTokenMessage } from "../api/Callapi";
import { useCallback } from "react";
import { CiImageOn } from "react-icons/ci";
import Chat from "../component/chat";
import img from "../images/image_background.webp";
import { CiVideoOn } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { MdOutlineGroupAdd } from "react-icons/md";
const ChatScreen = ({ selectedUserName, userLogin, idSelector }) => {
  
  const toggleEmojiKeyboard = () => {
    setShowEmojiKeyboard(!showEmojiKeyboard);
  };
  // eslint-disable-next-line
  const [originalUsers, setOriginalUsers] = useState([]);
  // eslint-disable-next-line
  const [messageInput, setMessageInput] = useState("");
  // eslint-disable-next-line
  const [users, setUsers] = useState([]);
  // eslint-disable-next-line
  const [chatKey, setChatKey] = useState(0);
  //const [nameGroup, setNameGroup] = useState("");
  // emoji
  //eslint-disable-next-line
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);
  const sendMessage = useCallback(async () => {
    try {
      await postApiNoneTokenMessage("/sendMessage/" + idSelector, {
        userId: userLogin,
        message: messageInput,
      });
      setMessageInput("");
      setChatKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.log("Không thể gửi tin nhắn trống.");
    }
  }, [idSelector, messageInput, userLogin]);

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
  const handleEmojiSelect = (emoji) => {
    setMessageInput((prevMessage) => prevMessage + emoji.character);
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
  return (
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
            <IoIosSearch style={{ fontSize: "24px" }} className="FindMessage" />
            <CiVideoOn style={{ fontSize: "24px" }} className="VideoCall" />
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
          </BodyInforTop>
          <BodyInforBottom className="BodyInforBottom"></BodyInforBottom>
        </BodyInforMessage>
      </InforMessage>
    </>
  );

};
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
export default ChatScreen;
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
  background-image: url(${img});
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
