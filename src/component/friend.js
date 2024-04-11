import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getApiNoneToken, putApiNoneToken } from "../api/Callapi";

const Friend = ({ searchPhone, idUser }) => {
  const [friend, setFriend] = useState([]);
  // eslint-disable-next-line
  const [phone, setPhone] = useState("");

  // eslint-disable-next-line
  const [listPhone, setListPhone] = useState([]);
  const [check, setCheck] = useState(false);

  const [style, setStyle] = useState("AddFriend");

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const response = await getApiNoneToken(`/getDetails/${searchPhone}`, {
          id: searchPhone,
        });
        setFriend(response.data.data);
      } catch (error) {
        console.error("Error loading ID by phone:", error);
      }
    };
    loadFriends();
  }, [searchPhone]);

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

  const addFriend = async (idReceiver) => {
    try {
      const response1 = await getApiNoneToken("/getDetails/" + idUser, {
        id: idUser,
      });
      // eslint-disable-next-line
      const response2 = await putApiNoneToken("/addInvite/" + idReceiver, {
        id: idUser,
        name: response1.data.data.name,
        phone: response1.data.data.phone,
      });
      // eslint-disable-next-line
      const response3 = await putApiNoneToken("/addListFriend/" + idUser, {
        id: idReceiver,
        name: friend.name,
        phone: friend.phone,
      });

      alert("Thêm bạn thành công");
      setStyle("SendInvite Success");

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
        {check ? (
          <p></p>
        ) : (
          <ButtonAdd type="button" onClick={() => addFriend(friend._id)}>
            {style}
          </ButtonAdd>
        )}
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
