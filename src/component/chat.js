import React, { useEffect, useState } from "react";
import { getApiNoneTokenMessage } from "../api/Callapi";
import styled from "styled-components";

const Chat = ({ idSelector, idLogin }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadMessage = async () => {
      try {
        const response = await getApiNoneTokenMessage("/getMessages/" + idLogin + "?senderId=" + idSelector);
        setMessages(response.data); // Tránh lỗi nếu response.data.message là undefined
      } catch (error) {
        console.error("Error loading messages:", error);
        setMessages([]); // Đảm bảo rằng messages không bị undefined khi xảy ra lỗi
      }
    };
    loadMessage();
  }, [idLogin, idSelector]);

  return (  
    <div style={{boxSizing:"border-box", padding:"5px"}}>
      {messages && messages.length > 0 ? (
        messages.map((message, index) => (
          <div key={index}>
            <ItemMessage senderId={message.senderId} idLogin={idLogin}>
              <span style={{padding:"10px", fontSize:"20px"}}>{message.message}</span>
            </ItemMessage>
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
  display: inline-block;
  background-color: cyan;
  width: 100%;
  height: max-content;

  margin: 5px 0;
  word-wrap: break-word;
  flex: 1;
  text-align: ${({ senderId, idLogin }) => senderId === idLogin ? "right" : "left"};
`;
