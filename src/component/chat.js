import React, { useEffect, useState, useRef } from "react";
import { getApiNoneTokenMessage } from "../api/Callapi";
import styled from "styled-components";
import io from "socket.io-client";

const Chat = ({ idSelector, idLogin }) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = io("ws://localhost:3000");

    // Lắng nghe tin nhắn mới từ máy chủ WebSocket
    socket.on("newMessage", (newMessage) => {
      // Tải lại tin nhắn
      loadMessage();
    });
    const loadMessage = async () => {
      try {
        const response = await getApiNoneTokenMessage(
          "/getMessages/" + idLogin + "?senderId=" + idSelector
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

  return (
    <div style={{ boxSizing: "border-box", padding: "5px", overflowY: "visible" }}>
      <div style={{ boxSizing: "border-box", height: "100%" }}>
        {messages && messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index}>
              <div >
                <ItemMessage ref={messagesEndRef} senderId={message.senderId} idLogin={idLogin} >
                  <span  style={{ padding: "10px", fontSize: "20px", textAlign: "justify", margin:"5px" }}>{message.message}</span>
                </ItemMessage><br />
                <div />
              </div>
            </div>
          ))
        ) : (
          <div>Hãy chat ngây, để hiểu hơn về nhau</div>
        )}
      </div>
    </div>
  );
};

export default Chat;

const ItemMessage = styled.div`
  border-radius: 8px;
  display: flow;
  width: 100%;
  background-color: cyan;
  height: max-content;
  margin: 5px 0;
  word-wrap: break-word;
  flex: 1;
  text-align: ${({ senderId, idLogin }) => (senderId === idLogin ? "right" : "left")};
`;
