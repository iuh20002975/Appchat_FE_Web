import React, { useEffect, useState, useRef } from "react";
import { getApiNoneTokenMessage } from "../api/Callapi";
import styled from "styled-components";
import io from "socket.io-client";
import { extractTime } from "../extractTime/extractTime";
import ModalImg from "./modalViewImage";

const Chat = ({ idSelector, idLogin }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const socket = io("ws://localhost:3000");

    socket.on("newMessage", (newMessage) => {
      loadMessage();
    });

    const loadMessage = async () => {
      try {
        const response = await getApiNoneTokenMessage(
          `/getMessages/${idLogin}?senderId=${idSelector}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error loading messages:", error);
        setMessages([]);
      }
    };
    loadMessage();
  }, [idLogin, idSelector]);

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

  return (
    <div style={{ boxSizing: "border-box", padding: "5px", overflowY: "visible" }}>
      {messages && messages.length > 0 ? (
        messages.map((message, index) => (
          <div style={{ flex: 1 }} key={index}>
            <ItemMessage ref={messagesEndRef} senderId={message.senderId} idLogin={idLogin}>
              {message.message.startsWith("https://") ? (
                isVideoExtensionAllowed(message.message) ? (
                  <video
                    controls
                    style={{
                      borderRadius: ".7em",
                      width: "60%",
                      height: 200,
                      margin: "1.5px",
                    }}
                  >
                    <source src={message.message} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : isFileExtensionAllowed(message.message) ? (
                  <a href={message.message} target="_blank" rel="noreferrer">
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
              <p style={{ fontStyle: "italic", margin: "1px" }}>
                {extractTime(message.createdAt)}
              </p>
            </ItemMessage>
            <br />
            <div />
          </div>
        ))
      ) : (
        <div>Hãy chat ngây, để hiểu hơn về nhau</div>
      )}
    </div>
  );
};

export default Chat;

const ItemMessage = styled.div`
  border-radius: 8px;
  display: flow;
  width: 100%;
  color: black;
  height: max-content;
  margin: 5px 0;
  word-wrap: break-word;
  flex: 1;
  text-align: ${({ senderId, idLogin }) =>
    senderId === idLogin ? "right" : "left"};
`;
