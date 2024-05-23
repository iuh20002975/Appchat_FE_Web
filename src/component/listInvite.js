import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getApiNoneToken, putApiNoneToken, postApiNoneToken } from "../api/Callapi";

const ListInvite = ({ userLogin }) => {
  const [data, setData] = useState([]);
  const [nameU, setName] = useState("");
  const [phoneU, setPhone] = useState("");
  const [avatarU, setAvatar] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getApiNoneToken(`/getDetails/${userLogin}`);
        setData(response.data.data.invite);
        setPhone(response.data.data.phone);
        setName(response.data.data.name);
        setAvatar(response.data.data.avatar);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [userLogin]);

  const addFriend = async (id, name, phone, avatar) => {
    try {
      // Add the friend to the user's friend list
      await putApiNoneToken(`/addFriend/${userLogin}`, {
        name: name,
        phone: phone,
        avatar: avatar,
      });

      // Add the user to the friend's friend list
      await putApiNoneToken(`/addFriend/${id}`, {
        name: nameU,
        phone: phoneU,
        avatar: avatarU,
      });

      // Remove the friend invitation
      await postApiNoneToken(`/deleteInvite/${userLogin}`, {
        phone: phone,
      });

      // Optionally, remove the user from the friend's invite list
      await postApiNoneToken(`/deleteListaddFriend/${id}`, {
        phone: phoneU,
      });

      alert("Thêm bạn thành công");

      // Update the state to remove the confirmed friend from the invite list
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Lỗi khi thêm bạn:", error);
      alert("Đã xảy ra lỗi khi thêm bạn. Vui lòng thử lại sau.");
    }
  };

  return (
    <form style={{ flex: 1, overflowY: "auto" }}>
      {data.map((item) => (
        <Itemdata key={item._id} style={{ display: "flex", alignItems: "center" }}>
          <input type="checkbox" id={item._id} />
          <Avatar style={{ backgroundImage: `url(${item.avatar})` }} />
          <label htmlFor={item._id}>{item.name}</label>
          <ButtonDelete
            type="button"
            onClick={() => addFriend(item._id, item.name, item.phone, item.avatar)}
          >
            Confirm friend
          </ButtonDelete>
        </Itemdata>
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
  background-color: #4caf50;
`;

const Itemdata = styled.div`
  padding: 10px;
  display: flex;
  cursor: pointer;
  background-color: red;
  margin: 5px 2px;
`;

const Avatar = styled.div`
  background: black;
  width: 50px;
  height: 50px;
  margin: 15px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
`;

export default ListInvite;
