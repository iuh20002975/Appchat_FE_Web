import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getApiNoneToken, putApiNoneToken } from "../api/Callapi";

const ListInvite = ({ userLogin }) => {
    //eslint-disable-next-line
  const [style, setStyle] = useState("Confirm friend");
  const [data, setData] = useState([]);
  const [nameU , setName] = useState("");
  const [phoneU , setPhone] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getApiNoneToken(`/getDetails/${userLogin}`, {
          id: userLogin,
        });
        setData(response.data.data.invite);
        setPhone(response.data.data.phone);
        setName(response.data.data.name);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, [userLogin]);

  const addFriend = async (name, id, phone) => {
    try {
      await putApiNoneToken(`/addFriend/${userLogin}`, {
        name: name,
        phone: phone,
      });
      await putApiNoneToken(`/addFriend/${id}`, {
        name: nameU,
        phone: phoneU,
      });
      alert("Thêm bạn thành công");
      setData([]);
      setStyle("Confirmed")
    } catch (error) {
      console.error("Lỗi khi thêm bạn:", error);
      alert("Đã xảy ra lỗi khi thêm bạn. Vui lòng thử lại sau.");
    }
  };

  return (
    <form style={{ flex: 1, overflowY: "auto" }}>
      {data.map((item, index) => (
        <Itemdata
          key={item._id}
          style={{ display: "flex", alignItems: "center" }}
        >
          <input type="checkbox" id={item._id} />
          <Avatar />
          <label htmlFor={item._id}>{item.name}</label>
          <ButtonDelete
            type="button"
            onClick={() => addFriend(item.name,item._id,item.phone)}
            style={{
               backgroundColor: style === "Confirmed" ? "#ccc" : "#4caf50",
            }}
          >
            {style}
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
`;

const Itemdata = styled.div`
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

export default ListInvite;
