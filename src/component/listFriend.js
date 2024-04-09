import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getApiNoneToken } from "../api/Callapi";
const ListFriend = ({ userLogin }) => {
// eslint-disable-next-line
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
      {listFriend.map((user) => (
        <ItemUser
          key={user.id}
          style={{ display: "flex", alignItems: "center" }}
        >
          <input type="checkbox" id={user.id} />
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
export default ListFriend;
