import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getApiNoneTokenConversation } from "../api/Callapi";

const ListGroup = ({ userLogin }) => {
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
  

  return (
    <form style={{ flex: 1, overflowY: "auto" }}>
      {listGroup && listGroup.map((user, index) => (
        <ItemUser
          key={user._id}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Avatar />
          <label htmlFor={user._id}>{user.groupName}</label>
        </ItemUser>
      ))}
    </form>
  );
};

const ItemUser = styled.div`
  padding: 5px;
  display: flex;
  cursor: pointer;
  display: flex;
`;
const Avatar = styled.div`
  background: black;
  width: 50px;
  height: 50px;
  margin: 15px;
  border-radius: 50%;
`;
export default ListGroup;
