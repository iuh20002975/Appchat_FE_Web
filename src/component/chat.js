import React, { useEffect, useState, useRef } from "react";
import { getApiNoneTokenMessage, getApiNoneToken,postApiNoneTokenMessage } from "../api/Callapi";
import styled from "styled-components";
import { extractTime } from "../extractTime/extractTime";
import ModalImg from "./modalViewImage";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFile } from 'react-icons/fa';
import MessageMenuForReceived from "./messageMenuForReceived"
import MessageMenu from "../component/messageMenu"
import { EmojiKeyboard } from "reactjs-emoji-keyboard";
import { CiImageOn } from "react-icons/ci";
import { MdOutlineAttachFile } from "react-icons/md";
import { MdEmojiEmotions } from "react-icons/md";
import Modal from "react-modal";
import axios from 'axios';
const Chat = ({ idSelector, idLogin,userLogin }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [updatedMessageContent, setUpdatedMessageContent] = useState("");
  const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [messageEdit, setMessageEdit] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await getApiNoneTokenMessage(
          `/getMessages/${idLogin}?senderId=${idSelector}`
        );
        const messagesWithAvatar = await Promise.all(
          response.data.map(async (message) => {
            const senderDetails = await getApiNoneToken(
              `/getDetails/${message.senderId}`
            );
            return {
              ...message,
              senderAvatar: senderDetails.data.data.avatar,
            };
          })
        );
        setMessages(messagesWithAvatar);
      } catch (error) {
        console.error("Error loading messages:", error);
        setMessages([]);
      }
    };
    loadMessages();
  }, [idLogin, idSelector]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleEmojiKeyboard = () => {
    setShowEmojiKeyboard(!showEmojiKeyboard);
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
  const isFileExtensionAllowed = (filename) => {
    const allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".ppt",
      ".pptx",
    ];
    const fileExtension = filename.slice(filename.lastIndexOf("."));
    return allowedExtensions.includes(fileExtension.toLowerCase());
  };

  const fileName = (filename) => {
    const part = filename.split("/");
    return part[part.length - 1];
  };

  const allowedVideoExtensions = [".mp4", ".avi", ".mov", ".mkv", ".wmv"];
  const isVideoExtensionAllowed = (filename) => {
    const fileExtension = filename.slice(filename.lastIndexOf("."));
    return allowedVideoExtensions.includes(fileExtension.toLowerCase());
  };

  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = (imgUrl) => {
    setSelectedImage(imgUrl);
    setIsZoomed(true);
  };

  const handleSaveImage = () => {
    const fileName = selectedImage.split('/').pop();
    const link = document.createElement('a');
    link.href = selectedImage;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const closeModal = () => {
    setIsZoomed(false);
    setSelectedImage(null);
  };

  const getFileIcon = (filename) => {
    const fileExtension = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    switch (fileExtension) {
      case ".pdf":
        return <FaFilePdf style={{ height: 50, width: 70 }} />;
      case ".doc":
      case ".docx":
        return <FaFileWord style={{ height: 50, width: 70 }} />;
      case ".xls":
      case ".xlsx":
        return <FaFileExcel style={{ height: 50, width: 70 }} />;
      case ".ppt":
      case ".pptx":
        return <FaFilePowerpoint style={{ height: 50, width: 70 }} />;
      default:
        return <FaFile style={{ height: 50, width: 70 }} />;
    }
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
  const handleDeleteMessage = async (messageId) => {
    try {
      if (!messageId) {
        console.error("Message ID is undefined or null.");
        return;
    }
   
      await axios.delete(`http://localhost:3001/api/messages/${messageId}`);
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message._id !== messageId)
      );
    } catch (error) {
      console.log("URL endpoint in catch:", `/api/messages/${messageId}`);
      console.error("Error deleting message:", error);
     
    }
  };

  

  const handleForwardMessage = (message) => {
   
  };
  const handleEditMessage = (messageId, messageContent) => {
    setEditingMessage(messageId);
    setUpdatedMessageContent(messageContent);
  };

  const handleUpdateMessage = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/messages/update/${editingMessage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedMessage: updatedMessageContent,
        }),
      });
      if (response.ok) {
        const updatedMessages = [...messages];
        const updatedMessageIndex = updatedMessages.findIndex(message => message._id === editingMessage);
        if (updatedMessageIndex !== -1) {
          updatedMessages[updatedMessageIndex].message = updatedMessageContent;
          setMessages(updatedMessages);
        }
        // Đặt lại trạng thái chỉnh sửa và nội dung tin nhắn
        setEditingMessage(null);
        setUpdatedMessageContent("");
      } else {
        console.error('Failed to update message');
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleCopyMessage = (messageContent) => {
    navigator.clipboard.writeText(messageContent);
  };

  // Hàm xử lý sự kiện ghim tin nhắn
  const handlePinMessage = (messageId) => {
    // const pinnedMessage = messages.find((message) => message._id === messageId);
    // if (pinnedMessage) {
    //   setPinnedMessage(pinnedMessage);
    // }
  };
  const handleEmojiSelect = (emoji) => {
    setMessageEdit((prevMessage) => prevMessage + emoji.character);
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
    <div style={{ boxSizing: "border-box", padding: "5px", overflowY: "visible" }}>
      {messages && messages.length > 0 ? (
        messages.map((message, index) => (
          <div style={{ flex: 1 }} key={index}>
            <ItemMessageContainer
              ref={messagesEndRef}
              senderId={message.senderId}
              idLogin={idLogin}
            >
              {message.senderId !== idLogin ? (
                <Avatar src={message.senderAvatar} alt="Avatar" />
              ) : null}
              <ItemMessageContent
                onMouseEnter={() => setHoveredMessage(message)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                {editingMessage === message._id ? (
                  // Phần chỉnh sửa tin nhắn
                  <div style={{ borderRadius: "10px" }}>
                    <div>
                      <textarea style={{ height: "70px", width: "auto", borderRadius: "10px" }} value={updatedMessageContent} onChange={(e) => setUpdatedMessageContent(e.target.value)} />
                    </div>
                    <ChatButton style={{ position: "absolute", top: "48px", right: "20px" }}>
                      <ImageButton onClick={sendImage}>
                        <CiImageOn style={{ width: "85%", height: "85%" }} />
                      </ImageButton>
                      <FileButton onClick={sendFileOfType}>
                        <MdOutlineAttachFile style={{ width: "75%", height: "75%" }} />
                      </FileButton>
                      {/* // thêm emoji */}
                      {showEmojiKeyboard && (
                        <Modal
                          style={{
                            overlay: {
                              backgroundColor: "none",
                              backgroundBlendMode: "darken",
                              marginLeft: "42%",
                              marginTop: "23%",
                            },
                            content: {
                              width: "42%",
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
                            onEmojiSelect={handleEmojiSelect}
                            categoryDisabled={false}
                          />
                        </Modal>
                      )}
                      <EmojiButton onClick={toggleEmojiKeyboard}>
                        <MdEmojiEmotions style={{ color: "#FED15D", width: "80%", height: "80%" }} />
                      </EmojiButton>
                    </ChatButton>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button style={{ backgroundColor: "#1395F2", color: "white" }} onClick={handleUpdateMessage}>Lưu</button>
                      <button onClick={() => { setEditingMessage(null); setUpdatedMessageContent(""); }}>Hủy</button>
                    </div>
                  </div>
                ) : (
                  isFileExtensionAllowed(message.message) ? (
                    <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                      {message.senderId === idLogin ? (
                        <MessageMenu
                          style={{ position: "absolute", right: "0", top: "0" }}
                          onDelete={() => handleDeleteMessage(message._id)}
                          onForward={() => handleForwardMessage(message._id)}
                          onUpdate={() => handleEditMessage(message._id, message.message)}
                          onCopy={() => handleCopyMessage(message.message)}
                          onPin={() => handlePinMessage(message._id)}
                        />
                      ) : (
                        <div style={{ width: "24px", height: "24px", marginLeft: "10px" }}></div>
                      )}
                      <a href={message.message} target="_blank" rel="noreferrer">
                        {getFileIcon(fileName(message.message))}{" "}
                        {fileName(message.message)}
                      </a>
                    </div>
                  ) : message.message.startsWith("https://") ? (
                    isVideoExtensionAllowed(message.message) ? (
                      <video
                        controls
                        style={{
                          borderRadius: ".7em",
                          height: 200,
                          marginRight: "1px",
                        }}
                      >
                        <source src={message.message} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div>
                        <img
                          src={message.message}
                          alt="ảnh"
                          style={{
                            borderRadius: ".7em",
                            width: "150px",
                            height: "150px",
                            margin: "1.5px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleImageClick(message.message)}
                        />
                        <ModalImg
                          isZoomed={isZoomed}
                          imageUrl={selectedImage}
                          handleSaveImage={handleSaveImage}
                          closeModal={closeModal}
                        />
                      </div>
                    )
                  ) : (
                    // Tin nhắn văn bản bình thường
                    <div>
                      {message.senderId === idLogin ? (
                        <div style={{ display: "flex", alignItems: "center", marginRight: "3px" }}>
                          <MessageMenu
                            style={{ width: "100%", height: "100%" }}
                            onDelete={() => handleDeleteMessage(message._id)}
                            onForward={() => handleForwardMessage(message._id)}
                            onUpdate={() => handleEditMessage(message._id, message.message)}
                            onCopy={() => handleCopyMessage(message.message)}
                            onPin={() => handlePinMessage(message._id)}
                          />
                          <div style={{ flex: 1, marginLeft: "3px" }}>
                            <span
                              style={{
                                borderRadius: ".7em",
                                padding: "7px",
                                boxShadow: `rgba(0, 0, 0, 0.1) 0px 1px 2px`,
                                maxWidth: `${message.message.length * 10}px`,
                                margin: "1.5px",
                                backgroundColor: "#2B73DF",
                                color: "white",
                              }}
                            >
                              {message.message}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", marginLeft: "3px" }}>
                          <div style={{ flex: 1, marginRight: "3px" }}>
                            <span
                              style={{
                                borderRadius: ".7em",
                                padding: "7px",
                                boxShadow: `rgba(0, 0, 0, 0.1) 0px 1px 2px`,
                                maxWidth: `${message.message.length * 10}px`,
                                margin: "1.5px",
                                backgroundColor: "white",
                                color: "black",
                              }}
                            >
                              {message.message}
                            </span>
                          </div>
                          <MessageMenuForReceived
                            style={{ width: "100%", height: "100%", marginLeft: "10px" }}
                            onForward={() => handleForwardMessage(message._id)}
                            onCopy={() => handleCopyMessage(message.message)}
                            // openModal={openModalFromChat}
                          />
                        </div>
                      )}
                    </div>
                  )
                )}
                <MessageTime>{extractTime(message.createdAt)}</MessageTime>
              </ItemMessageContent>
              {/* {message.senderId === idLogin ? (
                <Avatar src={message.senderAvatar} alt="Avatar" />
              ) : null} */}
            </ItemMessageContainer>
            <br />
            <div />
          </div>
        ))
      ) : (
        <div>Hãy chat ngay để hiểu nhau nhiều hơn.</div>
      )}
    </div>
  );
  
  
};

export default Chat;

const ItemMessageContainer = styled.div`
  display: flex;
  justify-content: ${({ senderId, idLogin }) =>
    senderId === idLogin ? "flex-end" : "flex-start"};
  position: relative;
`;

const ItemMessageContent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Avatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 0 5px;
`;

const MessageTime = styled.p`
  font-style: italic;
    margin-top: 5px;
    text-align: end;
`;

const ChatButton = styled.div`
  display: flex;
  margin-left: 7.5px;
`;
const ImageButton = styled.div`
  margin-left: 10px;
  height: 30px;
  width: 30px;
  cursor: pointer;
`;
const FileButton = styled.div`
  height: 30px;
  width: 30px;
  cursor: pointer;
`;
const EmojiButton = styled.div`
  height: 30px;
  width: 30px;
  cursor: pointer;
`;



