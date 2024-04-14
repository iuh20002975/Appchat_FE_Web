import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getApiNoneToken } from "../api/Callapi";

const ListGroup = ({ userLogin }) => {
  const [listFriend, setListFriend] = useState([]);

  useEffect(() => {
    const loadFriends = async () => {
      const response = await getApiNoneToken(`/getAllFriend/${userLogin}`, {
        id: userLogin,
      });
      setListFriend(response.data.data);
    };
    loadFriends();
  }, [userLogin]);
  return (
    <form style={{ flex: 1, overflowY: "auto" }}>
      {listFriend.map((user, index) => (
        <ItemUser
          key={user.id}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Avatar />
          <label htmlFor={user.id}>{user.name}</label>
        </ItemUser>
      ))}
    </form>
  );
};

const ItemUser = styled.div`
  padding: 10px;
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
