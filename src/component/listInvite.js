import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getApiNoneToken, putApiNoneToken, postApiNoneToken } from "../api/Callapi";

const ListInvite = ({ userLogin }) => {
  const [data, setData] = useState([]);
  const [nameU, setName] = useState("");
  const [phoneU, setPhone] = useState("");
  const [avatarU, setAvatarU] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getApiNoneToken(`/getDetails/${userLogin}`);
        const inviteData = response.data.data.invite;

        // Fetch avatars for each invite
        const inviteDetails = await Promise.all(
          inviteData.map(async (invite) => {
            const userDetails = await getApiNoneToken(`/getDetails/${invite.id}`);
            return { ...invite, avatar: userDetails.data.data.avatar };
          })
        );

        setData(inviteDetails);
        setPhone(response.data.data.phone);
        setName(response.data.data.name);
        setAvatarU(response.data.data.avatar);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [userLogin]);

  const addFriend = async (id, name, phone, avatar) => {
    try {
      await putApiNoneToken(`/addFriend/${userLogin}`, {
        id: userLogin,
        name: name,
        phone: phone,
        avatar: avatar,
      });

      await putApiNoneToken(`/addFriend/${id}`, {
        id: id,
        name: nameU,
        phone: phoneU,
        avatar: avatarU,
      });

      await postApiNoneToken(`/deleteInvite/${userLogin}`, {
        phone: phone,
      });

      await postApiNoneToken(`/deleteListaddFriend/${id}`, {
        phone: phoneU,
      });

      alert("Thêm bạn thành công");

      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Lỗi khi thêm bạn:", error);
      alert("Đã xảy ra lỗi khi thêm bạn. Vui lòng thử lại sau.");
    }
  };
  const rejectFriend = async (id, phone) => {
    try {
      await postApiNoneToken(`/deleteInvite/${userLogin}`, {
        phone: phone,
      });

      setData(data.filter((item) => item.id !== id));
      alert("Đã từ chối kết bạn");
    } catch (error) {
      console.error("Lỗi khi từ chối kết bạn:", error);
      alert("Đã xảy ra lỗi khi từ chối kết bạn. Vui lòng thử lại sau.");
    }
  };
  return (
    <form style={{ flex: 1, overflowY: "auto" }}>
      {data.map((item) => (
        <Itemdata key={item.id} style={{ display: "flex", alignItems: "center" }}>
          <input type="checkbox" id={item.id} />
          <Avatar style={{ backgroundImage: `url(${item.avatar})` }} />
          <label htmlFor={item.id}>{item.name}</label>
          <ButtonReject
            type="button"
            onClick={() => rejectFriend(item.id, item.phone)}
          >
            Reject friend
          </ButtonReject>
          <ButtonAccept
            type="button"
            onClick={() => addFriend(item.id, item.name, item.phone, item.avatar)}
          >
            Confirm friend
          </ButtonAccept>
        </Itemdata>
      ))}
    </form>
  );
};

const ButtonAccept = styled.button`
  color: white;
  padding: 10px 10px;
  margin: 8px 5px;
  float: right;
  border-radius: 10px;
  border: none;
  font-size: 18px;
  cursor: pointer;
  width: max-content;
  background-color: #4caf50;
`;
const ButtonReject = styled.button`
  color: white;
  padding: 10px 10px;
  margin: 8px 0;
  float: right;
  font-size: 18px;
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
  background-color: cadetblue;
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
