import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getApiNoneToken, postApiNoneToken } from "../api/Callapi";

const ListFriend = ({ userLogin }) => {
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

  const deleteFriend = async (index, phone) => {
    try {
      await postApiNoneToken(`/deleteFriend/${userLogin}`, {
        phone: phone,
      });
      alert("Xóa bạn thành công");
      // Tạo một bản sao của mảng listFriend và thay đổi style của nút delete của item được xóa
      const updatedList = [...listFriend];
      updatedList[index].style = "Not friend";
      setListFriend(updatedList);
    } catch (error) {
      console.error("Lỗi khi xóa bạn:", error);
      alert("Đã xảy ra lỗi khi xóa bạn. Vui lòng thử lại sau.");
    }
  };

  return (
    <form style={{ flex: 1, overflowY: "auto" }}>
      {listFriend.map((user, index) => (
        <ItemUser
          key={user.id}
          style={{ display: "flex", alignItems: "center" }}
        >
          <input type="checkbox" id={user.id} />
          <Avatar />
          <label htmlFor={user.id}>{user.name}</label>
          <ButtonDelete
            type="button"
            onClick={() => deleteFriend(index, user.phone)}
            style={{ backgroundColor: user.style === "Not friend" ? "#ccc" : "#4caf50" }} // Thay đổi style dựa trên trạng thái của mỗi item
          >
            {user.style || "Delete friend"} {/* Sử dụng style đã lưu hoặc mặc định */}
          </ButtonDelete>
        </ItemUser>
      ))}
    </form>
  );
};
const ButtonDelete = styled.button`
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
  margin: 5px 2px;
`;
const Avatar = styled.div`
  background: black;
  width: 50px;
  height: 50px;
  margin: 15px;
  border-radius: 50%;
`;
export default ListFriend;
