import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getApiNoneToken, postApiNoneToken } from "../api/Callapi";

const ListFriend = ({ userLogin }) => {
  const [listFriend, setListFriend] = useState([]);
  //eslint-disable-next-line
  const [phoneUser, setPhoneUser] = useState("");
  //eslint-disable-next-line
  const [idFriend, setIdFriend] = useState("");

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
      const p1 = await getApiNoneToken(`/getDetailsByPhone/${phone}`, {
        phone: phone,
      });
      const p2 =  await getApiNoneToken(`/getDetails/${userLogin}`, {
        id: userLogin,
      });
      await postApiNoneToken(`/deleteFriend/${userLogin}`, {
        phone: phone,
      });
      await postApiNoneToken(`/deleteFriend/${p1.data.data._id}`, {
        phone: p2.data.data.phone,
      });
      alert("Xóa bạn thành công");
      // Tạo một bản sao của mảng listFriend và thay đổi style của nút delete của item được xóa
      const updatedList = [...listFriend];
      const updatedUser = { ...updatedList[index], style: "Not friend" };
      updatedList[index] = updatedUser;
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
    <Avatar className="Avatar" avatar={user.avatar} />
    <label htmlFor={user.id}>{user.name}</label>
    <ButtonDelete
      type="button"
      onClick={() => deleteFriend(index, user.phone)} // Truyền vào index thực sự
      style={{ backgroundColor: user.style === "Not friend" ? "#ccc" : "#4caf50" }}
    >
      {user.style || "Delete friend"}
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
  background-color: rgb(240, 240, 240);
  display: flex;
  margin: 5px 2px;
`;
const Avatar = styled.div`
  background: ${({ avatar }) => (avatar ? `url(${avatar})` : 'black')} no-repeat center center;
  background-size: cover;
  width: 54px;
  height: 54px;
  margin: 5px ;
  border-radius: 50%;
`;
export default ListFriend;
