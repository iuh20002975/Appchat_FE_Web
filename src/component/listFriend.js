import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getApiNoneToken, postApiNoneToken } from "../api/Callapi";

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

  const deleteFriend = async (phone) => {
    try {
      await postApiNoneToken(`/deleteFriend/${userLogin}`, {
        phone: phone,
      });
      alert("Xóa bạn thành công");
    } catch (error) {
      console.error("Lỗi khi xóa bạn:", error);
      alert("Đã xảy ra lỗi khi xóa bạn. Vui lòng thử lại sau.");
    }
  }

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
          <ButtonDelete 
            onClick={() => deleteFriend(user.phone)}
          >Xóa</ButtonDelete>
        </ItemUser>
      ))}
    </form>
  );
};
const ButtonDelete = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 10px;
  margin: 8px 0;
  float: right;
  border-radius: 10px;
  border: none;
  margin-left: auto;
  cursor: pointer;
  width: max-content;
`;
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
