import React, { useState, useEffect } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaShare } from "react-icons/fa6";
// import { MdDelete } from "react-icons/md";
import Modal from "react-modal"
import {

  getApiNoneToken,
  
} from "../api/Callapi";
import styled from "styled-components";

const MessageMenuForReceived = ({ onForward,userLogin}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  // const [idSelector, setIdSelector] = useState("");
  // const [originalUsers, setOriginalUsers] = useState([]);
  // const [selectedMembers, setSelectedMembers] = useState([userLogin]);
  const [users, setUsers] = useState([]);
  const handleForward = () => {
    onForward(); // Gọi hàm onForward nhưng cũng có thể xử lý riêng tùy vào nhu cầu của bạn
    openModal(); // Mở modal khi chọn "Chuyển tiếp"
  };
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
 

  const handleConfirmAction = () => {
    
    closeModal();
  };
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  // useEffect(() => {
  //   const loadIdByPhone = async (phone) => {
  //     try {
  //       const response = await getApiNoneToken(`/getDetailsByPhone/${phone}`, {
  //         phone: phone,
  //       });
  //       setIdSelector(response.data.data._id);
  //     } catch (error) {
  //       console.error("Error loading ID by phone:", error);
  //     }
  //   };
  //   loadIdByPhone();
  // });

  // useEffect(() => {
  //   const loadFriends = async () => {
  //     try {
  //       const response = await getApiNoneToken(`/getAllFriend/${userLogin}`, {
  //         id: userLogin,
  //       });
  //       setUsers(response.data.data);
  //       setOriginalUsers(response.data.data);
  //     } catch (error) {
  //       console.error("Error loading ID by phone:", error);
  //     }
  //   };
  //   loadFriends();
  // }, [userLogin]);
 
  // const handleFindUserIdByPhone = async (phone) => {
  //   const response = await getApiNoneToken(`/getDetailsByPhone/${phone}`, {
  //     phone: phone,
  //   });
  //   if (selectedMembers.includes(response.data.data._id)) {
  //     setSelectedMembers((prevMembers) =>
  //       prevMembers.filter((member) => member !== response.data.data._id)
  //     );
  //   } else {
  //     setSelectedMembers((prevMembers) => [
  //       ...prevMembers,
  //       response.data.data._id,
  //     ]);
  //   }
  // };
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <HiOutlineDotsHorizontal onClick={toggleMenu} />
      {menuVisible && (
        
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "8px",
            backgroundColor: "#fff",
            boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
            borderRadius: "5px",
            zIndex: "1",
            display: "flex",
            width: "80px"
          }}
        >
          <div
            onClick={handleForward}
            style={{
              padding: "10px",
              cursor: "pointer",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <div>
              <FaShare />
            </div>
            <div>
              <span style={{ fontSize: "10px" }}>Chuyển tiếp</span>
            </div>
          </div>
        </div>
      )}<Modal
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        content: {
          width: "50%",
          margin: "auto",
          maxHeight: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
      isOpen={showModal}
      onRequestClose={closeModal}
      contentLabel="Modal Chuyển tiếp"
    >
      <div style={{ margin: 0 }}>
        <h2 style={{ margin: 0 }}>Modal Chuyển tiếp</h2>
      </div>
      <div>
      </div>
      <div>
        <h4 style={{ margin: 0 }}>Chọn người dùng muốn chuyển tiếp</h4>
         <form style={{ flex: 1, overflowY: "auto", padding: "3px" }}>
            {users.map((user) => (
              <div
                key={user._id}
                style={{ display: "flex", alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  id={user._id}
                  // onChange={() => handleFindUserIdByPhone(user.phone)}
                />
                <AvatarModal className="AvatarModal" />
                <label htmlFor={user._id}>{user.name}</label>
              </div>
            ))}
          </form>
      </div>
      <br />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={closeModal}>Đóng</button>
        <button onClick={handleConfirmAction}>Thực hiện</button>
      </div>
    </Modal>
      
    </div>

  );
};
const AvatarModal = styled.div`
  background: black;
  width: 35px;
  height: 35px;
  margin: 3px;
  border-radius: 50%;
`;
export default MessageMenuForReceived;
