import React from "react";
import styled from "styled-components";
import img from "../images/backgroud_chat.webp";
export default function ModalMenuMember() {
  return (
    <div style={{backgroundImage:`url(${img})`}}>
        <MessageOptions>
      <MessageOption>Xoá</MessageOption>
      <MessageOption>Thu hồi</MessageOption>
      <MessageOption>Chuyển tiếp</MessageOption>
    </MessageOptions>
    </div>
  );
}
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
    senderId === idLogin ? "right: 50px;" : "left: 50px;"};
  width: max-content;
`;

const MessageOption = styled.div`
  cursor: pointer;
  padding: 4px 8px;

  &:hover {
    background-color: #f0f0f0;
  }
`;
