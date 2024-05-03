import React, { useEffect, useState, useRef } from "react";
import { getApiNoneTokenConversation } from "../api/Callapi"; // Thay Ä‘á»•i hÃ m gá»i API Ä‘á»ƒ láº¥y tin nháº¯n nhÃ³m
import styled from "styled-components";
import { extractTime } from "../extractTime/extractTime";
import ModalImg from "./modalViewImage";
  import { FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFile  } from 'react-icons/fa';
const ChatListGroup = ({ groupId, idLogin }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);

  useEffect(() => {
    const loadGroupMessages = async () => {
      try {
        const response = await getApiNoneTokenConversation(`/getGroupMessages/${groupId}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error loading group messages:", error);
        setMessages([]);
      }
    };
    loadGroupMessages();
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  const closeModal = () => {
    setIsZoomed(false);
    setSelectedImage(null);
  };

  const handleDeleteMessage = (message) => {
    console.log("Xoá:", message);
  };

  const handleRecallMessage = (message) => {
    console.log("Thu hồi:", message);
  };

  const handleForwardMessage = (message) => {
    console.log("Chuyển tiếp:", message);
  };

  const handleShowMenu = (message) => {
    setHoveredMessage(message);
  };

  const handleHideMenu = () => {
    setHoveredMessage(null);
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
              onMouseEnter={() => handleShowMenu(message)}
              onMouseLeave={handleHideMenu}
            >
              {message.senderId !== idLogin ? (
                <Avatar src={message.senderAvatar} alt="Avatar" />
              ) : null}
              <ItemMessageContent>
                {message.message.startsWith("https://") ? (
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
                  ) : isFileExtensionAllowed(message.message) ? (
                    <a href={message.message} target="_blank" rel="noreferrer">
                      {getFileIcon(fileName(message.message))}{" "}
                      {fileName(message.message)}
                    </a>
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
                  <>
                    <span
                      style={{
                        borderRadius: ".7em",
                        padding: "7px",
                        boxShadow: `rgba(0, 0, 0, 0.1) 0px 1px 2px`,
                        maxWidth: `${message.message.length * 10}px`,
                        margin: "1.5px",
                      }}
                    >
                      {message.message}
                    </span>
                  </>
                )}
                <MessageTime>{extractTime(message.createdAt)}</MessageTime>
              </ItemMessageContent>
              {message.senderId === idLogin ? (
                <Avatar src={message.senderAvatar} alt="Avatar" />
              ) : null}
              {hoveredMessage === message && (
                <MessageOptions>
                    <MessageOption onClick={() => handleDeleteMessage(message)}>
                      Xoá
                    </MessageOption>
                    <MessageOption onClick={() => handleRecallMessage(
                      message)}>
                      Thu hồi
                    </MessageOption>
                    <MessageOption onClick={() => handleForwardMessage(message)}>
                      Chuyển tiếp
                    </MessageOption>
                  </MessageOptions>
              )}
            </ItemMessageContainer>
            <br />
            <div />
          </div>
        ))
      ) : (
        <div>Hãy chat ngây để hiểu nhau nhiều hơn.</div>
      )}
    </div>
  );
};

export default ChatListGroup;

const ItemMessageContainer = styled.div`
  display: flex;
  justify-content: ${({ senderId, idLogin }) =>
    senderId === idLogin ? "flex-end" : "flex-start"};
  margin-bottom: 10px;
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
  margin: 1px;
`;

const MessageOptions = styled.div`
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
  bottom: 100%; // Đặt ở phía trên của ItemMessageContent
  justify-content: ${({ senderId, idLogin }) =>
     senderId === idLogin
      ? "right: 50px;"
      : "left: 50px;"};
  width: max-content;
`;



const MessageOption = styled.div`
  cursor: pointer;
  padding: 4px 8px;

  &:hover {
    background-color: #f0f0f0;
  }
`;
