import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getApiNoneToken } from "../api/Callapi";
const Friend = ({ userLogin }) => {
// eslint-disable-next-line
  const [friend, setFriend] = useState([]);
  useEffect(() => {
    const loadFriends = async () => {
      const response = await getApiNoneToken(`/getDetails/${userLogin}`, {
        id: userLogin,
      });
      setFriend(response.data.data);
    };
    loadFriends();
  }, [userLogin]);

  return (
    <form style={{ flex: 1, overflowY: "auto" }}>
        <ItemUser
          key={friend.id}
          style={{ display: "flex", alignItems: "center" }}
        >
          <input type="checkbox" id={friend.id} />
          <Avatar />
          <label htmlFor={friend.id}>{friend.name}</label>
        </ItemUser>
    </form>
  );
};
const ItemUser = styled.div`
  padding: 10px;
  display: flex;
  cursor: pointer;
  background-color: red;
  display: flex;
  margin: 5px 2px ;
`;
const Avatar = styled.div`
  background: black;
  width: 50px;
  height: 50px;
  margin: 15px;
  border-radius: 50%;
`;
export default Friend;
