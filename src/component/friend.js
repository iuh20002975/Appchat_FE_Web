import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getApiNoneToken, putApiNoneToken } from "../api/Callapi";
import { useNavigate } from "react-router-dom";

const Friend = ({ idSearch, idUser }) => {
  const [friend, setFriend] = useState([]);
  // eslint-disable-next-line
  const [phone, setPhone] = useState("");
  // eslint-disable-next-line
  const [listPhone, setListPhone] = useState([]);
  const [check, setCheck] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const loadFriends = async () => {
      try {
        const response = await getApiNoneToken(`/getDetails/${idSearch}`, {
          id: idSearch,
        });
        setFriend(response.data.data);
        setPhone(response.data.data.phone);
      } catch (error) {
        console.error("Error loading ID by phone:", error);
      }
    };
    loadFriends();
  }, [idSearch]);

  useEffect(() => {
    const loadListPhone = async () => {
      try {
        const response2 = await getApiNoneToken(`/getAllFriend/${idUser}`, {
          id: idUser,
        });
        const phones = response2.data.data.map((item) => item.phone);
        setListPhone(phones);
      } catch (error) {
        console.error("Error loading ID by phone:", error);
      }
    };
    loadListPhone();
  }, [idUser]);

  // kiểm tra xem phone có nằm trong danh sách phone của bạn bè không
  useEffect(() => {
    if (listPhone.includes(phone)) {
      setCheck(true);
    }
  }, [phone, listPhone]);

  const addFriend = async () => {
    try {
      await putApiNoneToken(`/addFriend/${idUser}`, {
        name: friend.name,
        phone: friend.phone,
      });
      alert("Thêm bạn thành công");
      // Thực hiện các hành động khác nếu cần
      navigate("/home", { state: { idUser } });
    } catch (error) {
      console.error("Lỗi khi thêm bạn:", error);
      alert("Đã xảy ra lỗi khi thêm bạn. Vui lòng thử lại sau.");
    }
  };

  return (
    <form style={{ flex: 1, overflowY: "auto" }}>
      <ItemUser
        key={friend.id}
        style={{ display: "flex", alignItems: "center" }}
      >
        <input type="checkbox" id={friend.id} />
        <Avatar />
        <label htmlFor={friend.id}>{friend.name}</label>
        {check ? <p></p> : <ButtonAdd onClick={addFriend}>Thêm</ButtonAdd>}
      </ItemUser>
    </form>
  );
};
const ButtonAdd = styled.button`
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
  margin: 5px 2px;
`;
const Avatar = styled.div`
  background: black;
  width: 50px;
  height: 50px;
  margin: 15px;
  border-radius: 50%;
`;
export default Friend;
