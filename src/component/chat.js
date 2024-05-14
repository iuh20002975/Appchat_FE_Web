import React, { useEffect, useState, useRef } from "react";
import { getApiNoneTokenMessage, getApiNoneToken } from "../api/Callapi";
import styled from "styled-components";
import io from "socket.io-client";
import { extractTime } from "../extractTime/extractTime";
import ModalImg from "./modalViewImage";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFile } from 'react-icons/fa';
import MessageMenuForReceived from "./messageMenuForReceived"
import MessageMenu from "../component/messageMenu";
import { useSocketContext } from "../context/SocketContext";

import axios from 'axios';
const Chat = ({ idSelector, idLogin }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [updatedMessageContent, setUpdatedMessageContent] = useState("");
  const { socket } = useSocketContext();

  // useEffect(() => {
  //   const socket = io("ws://localhost:3000");

  //   socket.on("newMessage", (newMessage) => {
  //     loadMessage();
  //   });

  //   const loadMessage = async () => {
  //     try {
  //       const response = await getApiNoneTokenMessage(
  //         `/getMessages/${idLogin}?senderId=${idSelector}`
  //       );
  //       const messagesWithAvatar = await Promise.all(
  //         response.data.map(async (message) => {
  //           const senderDetails = await getApiNoneToken(
  //             `/getDetails/${message.senderId}`
  //           );

  //           return {
  //             ...message,
  //             senderAvatar: senderDetails.data.data.avatar,
  //           };
  //         })
  //       );
  //       setMessages(messagesWithAvatar);
  //     } catch (error) {
  //       console.error("Error loading messages:", error);
  //       setMessages([]);
  //     }
  //   };
  //   loadMessage();
  // }, [idLogin, idSelector]);
  useEffect(() => {
		const loadAndListenMessages = async () => {
			try {
				const response = await getApiNoneTokenMessage(`/getMessages/${idLogin}?senderId=${idSelector}`);
				const messagesWithAvatar = await Promise.all(
					response.data.map(async (message) => {
						const senderDetails = await getApiNoneToken(`/getDetails/${message.senderId}`);
						return {
							...message,
							senderAvatar: senderDetails.data.data.avatar,
						};
					})
				);
				setMessages(messagesWithAvatar);
        console.log("Messages loaded:", messagesWithAvatar);
				socket?.on("newMessage", (newMessage) => {
          console.log("New message received:", newMessage);
					setMessages(prevMessages => [...prevMessages, newMessage]);
				});
			} catch (error) {
				console.error("Error loading messages:", error);
				setMessages([]);
			}
		};
		loadAndListenMessages();
		return () => {
			socket?.off("newMessage");
		};
	}, [socket, idLogin, idSelector]);

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
                <div>
                  <textarea value={updatedMessageContent} onChange={(e) => setUpdatedMessageContent(e.target.value)} />
                  <button onClick={handleUpdateMessage}>Lưu</button>
                </div>
              ) : message.message.startsWith("https://") ? (
                // Xử lý tin nhắn đặc biệt (hình ảnh, video, file)
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
                // Tin nhắn văn bản bình thường
                <div>
                  {message.senderId === idLogin ? (
                    <div style={{ display: "flex", alignItems: "center", marginRight: "3px" }}>
                      <MessageMenu
                        style={{ width: "100%", height: "100%" }}
                        onDelete={() => handleDeleteMessage(message._id)}
                        onForward={() => handleForwardMessage(message._id)}
                        onUpdate={() => handleEditMessage(message._id, message.message)} // Thêm onUpdate để gọi hàm chỉnh sửa tin nhắn
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
                        // openModal={openModalFromChat}
                      />
                    </div>
                  )}
                </div>
              )}
              <MessageTime>{extractTime(message.createdAt)}</MessageTime>
            </ItemMessageContent>
            {message.senderId === idLogin ? (
              <Avatar src={message.senderAvatar} alt="Avatar" />
            ) : null}
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
  margin: 1px;
`;





