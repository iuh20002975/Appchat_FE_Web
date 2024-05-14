/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MdOutlineGroupAdd, MdOutlinePersonAddAlt1 } from "react-icons/md";
import img from "../images/image_background.webp";
import { FaSearch } from "react-icons/fa";
import Modal from "react-modal";
import {
  getApiNoneToken,
  getApiNoneTokenConversation,
  postApiNoneTokenConversation,
} from "../api/Callapi";

import io from "socket.io-client";

import ChatScreen from "./ChatScreen.js";
import ChatGroupScreen from "./ChatGroupScreen.js";

export default function MessageScreen({ userLogin }) {
  const [activeName, setActiveName] = useState("");
  const [activeContentTab, setActiveContentTab] = useState("Prioritize");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [idSelector, setIdSelector] = useState("");
  const [idGroup, setIdGroup] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  // const socket = io("ws://localhost:3000");
  const [nameSender, setNameSender] = useState("");
  const [loadGroups, setLoadGroups] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([userLogin]);
  const [listGroup, setListGroup] = useState([]);
  useEffect(() => {
    const loadInfor = async () => {
      try {
        const response = await getApiNoneToken(`/getDetails/${userLogin}`, {
          id: userLogin,
        });
        setNameSender(response.data.data.name);
      } catch (error) {
        console.error("Error while fetching user details:", error);
        alert("Error while fetching user details: " + error.message);
      }
    };
    loadInfor();
  }, [userLogin]);
  useEffect(() => {
    const loadGroups = async () => {
      try {
        const response = await getApiNoneTokenConversation(`/${userLogin}`, {
          id: userLogin,
        });

        // Lọc ra những object có ít nhất 3 người tham gia
        const friendsWithAtLeastThreeParticipants = response.data.filter(
          (friend) => friend.participants.length >= 3
        );

        // Set state cho listFriend với những object đã lọc
        setListGroup(friendsWithAtLeastThreeParticipants);
      } catch (error) {
        console.error("Lỗi khi tải danh sách bạn:", error);
      }
    };
    loadGroups();
    // thêm để render
    setLoadGroups(false);
  }, [userLogin, loadGroups]);
  const loadIdByPhone = async (phone) => {
    try {
      const response = await getApiNoneToken(`/getDetailsByPhone/${phone}`, {
        phone: phone,
      });
      setIdSelector(response.data.data._id);
    } catch (error) {
      console.error("Error loading ID by phone:", error);
    }
  };

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const response = await getApiNoneToken(`/getAllFriend/${userLogin}`, {
          id: userLogin,
        });
        setUsers(response.data.data);
        setOriginalUsers(response.data.data);
      } catch (error) {
        console.error("Error loading ID by phone:", error);
      }
    };
    loadFriends();
  }, [userLogin]);

  // Xử lý sự kiện thay đổi input tìm kiếm bạn bè trong danh sách ============
  const handleSearchInputChange = (event) => {
    const searchKeyword = event.target.value.toLowerCase();
    if (searchKeyword === "") {
      setUsers(originalUsers);
    } else {
      const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchKeyword)
      );
      setUsers(filteredUsers);
    }
  };

  // Truyền một mảng rỗng làm đối số thứ hai

  const handlerName = (tabName) => {
    setActiveName(tabName);
    setMessages([]);
  };

  const handleContentTab = (tab) => {
    setActiveContentTab(tab);
  };

  // Xử lý sự kiện mở modal, tạo nhóm ======================================
  const handleModalAdd = () => {
    setShowModal(true);
  };

  const closeModalAdd = () => {
    setShowModal(false);
  };

  const handleFindUserIdByPhone = async (phone) => {
    const response = await getApiNoneToken(`/getDetailsByPhone/${phone}`, {
      phone: phone,
    });
    if (selectedMembers.includes(response.data.data._id)) {
      setSelectedMembers((prevMembers) =>
        prevMembers.filter((member) => member !== response.data.data._id)
      );
    } else {
      setSelectedMembers((prevMembers) => [
        ...prevMembers,
        response.data.data._id,
      ]);
    }
  };
  const [nameGroup, setNameGroup] = useState("");
  const handleCreateGroup = async () => {
    if (nameGroup === "") {
      alert("Tên nhóm không được để trống");
      return;
    } else if (selectedMembers.length < 2) {
      alert("Chọn ít nhất 2 thành viên");
      return;
    }
    const response = await postApiNoneTokenConversation("/createGroup", {
      groupName: nameGroup,
      participants: selectedMembers,
    });
    alert("Tạo nhóm " + response.data.groupName + " thành công");
    setShowModal(false);
  };
  // eslint-disable-next-line no-unused-vars
  const renderContentMessage = ({ selectedUserName }) => {
    // Lấy tên người dùng từ state
    return (
      <ChatMessage className="ChatMessage">
        {selectedUserName === "" && selectedGroupName === "" ? (
          <Background></Background>
        ) : activeContentTab === "Prioritize" ? (
          <ChatScreen
            selectedUserName={selectedUserName}
            userLogin={userLogin}
            idSelector={idSelector}
          />
        ) : (
          <ChatGroupScreen
            selectedGroupName={selectedGroupName}
            userLogin={userLogin}
            idGroup={idGroup}
          />
        )}
      </ChatMessage>
    );
  };
  // eslint-disable-next-line no-unused-vars
  const renderContentTab = ({ activeContentTab }) => {
    if (activeContentTab === "Orther") {
      return (
        <>
          <h1>Orther</h1>
        </>
      );
    } else if (activeContentTab === "Group") {
      // return <ListGroup userLogin={userLogin} />;
      return (
        <div style={{ overflowY: "scroll", flex: 1 }}>
          {listGroup.map((group) => (
            <button
              onClick={() => {
                setSelectedGroupName(group.groupName);
                setIdGroup(group._id);
              }}
              style={{
                width: "100%",
                outline: "0",
                background: "white",
                border: "none",
              }}
              key={group._id}
            >
              <ItemUser
                $activeName={activeName === "Name"}
                onClick={() => {
                  handlerName("Name");
                }}
              >
                <Avatar style={{ margin: "0" }} className="Avatar"></Avatar>
                <div
                  style={{
                    display: "block",
                    width: "80%",
                    padding: "5px 0 0 0",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: "530",
                      fontSize: 18,
                      margin: "0 0 0 5px",
                      padding: "0",
                      textAlign: "left",
                      position: "relative",
                      height: "50%",
                      top: "5%",
                    }}
                  >
                    {group.groupName}
                  </h3>
                </div>
              </ItemUser>
            </button>
          ))}
        </div>
      );
    } else {
      return (
        <div style={{ overflowY: "scroll", flex: 1 }}>
          {users.map((user) => (
            <button
              onClick={() => {
                setSelectedUserName(user.name);
                loadIdByPhone(user.phone);
              }}
              style={{
                width: "100%",
                outline: "0",
                background: "white",
                border: "none",
              }}
              key={user._id}
            >
              <ItemUser
                $activeName={activeName === "Name"}
                onClick={() => {
                  handlerName("Name");
                }}
              >
                <Avatar style={{ margin: "0" }} className="Avatar"></Avatar>
                <div
                  style={{
                    display: "block",
                    width: "80%",
                    padding: "5px 0 0 0",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: "530",
                      fontSize: 18,
                      margin: "0 0 0 5px",
                      padding: "0",
                      textAlign: "left",
                      position: "relative",
                      height: "50%",
                      top: "5%",
                    }}
                  >
                    {user.name}
                  </h3>
                  <h5
                    style={{
                      fontWeight: "400",
                      margin: "0 0 0 5px",
                      padding: "0",
                      position: "relative",
                      top: "9%",
                      height: "50%",
                      textAlign: "left",
                      fontStyle: "italic",
                    }}
                  >
                    Hoạt động 15 phút trước
                  </h5>
                </div>
              </ItemUser>
            </button>
          ))}
        </div>
      );
    }
  };
  const renderTab = () => {
    return (
      <ListMessage className="ListMessage">
        <TabsList className="Tabs">
          <TabList
            className="Tab"
            $activeContentTab={activeContentTab === "Prioritize"}
            onClick={() =>
              handleContentTab("Prioritize") && setSelectedUserName("")
            }
          >
            Ưu tiên
          </TabList>
          <TabList
            className="Tab"
            $activeContentTab={activeContentTab === "Group"}
            onClick={() =>
              handleContentTab("Group") && setSelectedGroupName("")
            }
          >
            Nhóm
          </TabList>
          <TabList
            className="Tab"
            $activeContentTab={activeContentTab === "Orther"}
            onClick={() => handleContentTab("Orther")}
          >
            Khác
          </TabList>
        </TabsList>
        <ContentTab className="ContentTab">
          {renderContentTab({ activeContentTab })}
        </ContentTab>
      </ListMessage>
    );
  };
  // eslint-disable-next-line no-unused-vars
  return (
    <>
      <Content>
        <ListPerson className="ListPersonMessage">
          <HeaderList className="HeaderList">
            <Search className="Search">
              <button
                style={{
                  fontSize: "15px",
                  padding: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
                onChange={handleSearchInputChange}
              >
                <FaSearch />
              </button>
              <input
                style={{
                  fontSize: "15px",
                  padding: "6px",
                  outline: "0",
                  border: "none",
                  background: "rgb(240,240,240)",
                }}
                placeholder="Tìm kiếm"
                onChange={handleSearchInputChange}
              ></input>
            </Search>
            <button
              style={{
                border: "none",
                fontSize: "15px",
                background: "white",
                padding: "0",
              }}
            >
              <MdOutlinePersonAddAlt1 style={{ fontSize: "24px" }} />
            </button>
            <button
              style={{
                border: "none",
                fontSize: "15px",
                background: "white",
                padding: "0",
              }}
              onClick={handleModalAdd}
            >
              <MdOutlineGroupAdd style={{ fontSize: "24px" }} />
            </button>
          </HeaderList>
          <ContentList className="ContentListPerson">
            {renderTab({ selectedUserName })}
          </ContentList>
        </ListPerson>
        <ContentBody className="ContentBodyMessage">
          {renderContentMessage({ selectedUserName })}
        </ContentBody>
      </Content>
      <Modal
        style={{
          overlay: {
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "25%",
            height: "55%",
            border: "1px solid rgb(204, 204, 204)",
            background: "rgb(255, 255, 255)",
            borderRadius: "4px",
            outline: "none",
            padding: "20px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          },
        }}
        isOpen={showModal}
        onRequestClose={closeModalAdd}
        contentLabel="Tạo nhóm chat"
      >
        <div>
          <h2>Tạo nhóm chat</h2>
        </div>
        <div>
          <h4>Đặt tên nhóm</h4>
          <input
            placeholder="Nhập tên group"
            onChange={(e) => setNameGroup(e.target.value)}
          />
        </div>
        <div>
          <h4>Chọn thành viên tham gia</h4>
          <form style={{ overflow: "scroll" }}>
            {users.map((user) => (
              <div style={{ marginBottom: "5px" }} key={user._id}>
                <input
                  type="checkbox"
                  id={user._id}
                  onChange={() => handleFindUserIdByPhone(user.phone)}
                />
                <label htmlFor={user._id}>{user.name}</label>
              </div>
            ))}
          </form>
        </div>
        <div
          style={{
            justifyContent: "space-between",
            display: "flex",
            margin: "10px",
          }}
        >
          <button onClick={closeModalAdd}>Đóng</button>
          <button onClick={handleCreateGroup}>Tạo nhóm</button>
        </div>
      </Modal>
    </>
  );
}

const ItemUser = styled.div`
  padding: 10px;
  display: flex;
  cursor: pointer;
`;
const Background = styled.div`
  width: 100%;
  height: 100vh;
  background-repeat: no-repeat;
  background-image: url(${img});
  background-size: cover;
  background-position: center;
`;
const ListMessage = styled.div`
  /* height: 100%; */
  width: 100%;
`;
const TabList = styled.div`
  margin: 5px;
  opacity: ${(props) => (props.$activeContentTab ? "1" : "0.5")};
  font-weight: ${(props) => (props.$activeContentTab ? "bold" : "normal")};
  transition: opacity 0.3s ease, font-weight 0.3s ease;
  cursor: pointer;
`;
const TabsList = styled.div`
  height: 5%;
  display: inline-flex;
`;
const ContentTab = styled.div`
  /* height: 95%; */
`;
const ContentBody = styled.div`
  height: 100vb;
  width: 85%;
  display: inline-block;
  background-image: url(${img});
`;
const Content = styled.div`
  height: 100vb;
  width: 100%;
  display: flex;
  box-sizing: border-box;
`;
const Search = styled.div`
  padding: 5px;
  display: flex;
  overflow: hidden;
`;
const ContentList = styled.div`
  height: 95%;
  margin: 0;
`;
const HeaderList = styled.div`
  background: white;
  padding: 10px;
  height: 5%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ListPerson = styled.div`
  height: 100%;
  width: 25%;
  overflow: hidden;
  border-right: 1px solid rgb(219, 223, 229);
`;

const Avatar = styled.div`
  background: black;
  width: 50px;
  height: 50px;
  margin: 15px auto;
  border-radius: 50%;
`;
// const customStyles = {
//   content: {

//     width: "25%", // Thiết lập chiều rộng modal
//     // maxWidth: "600px", // Chiều rộng tối đa
//     height: "50%", // Chiều cao tự động điều chỉnh dựa trên nội dung
//     // maxHeight: "500px", // Chiều cao tối đa
//   },
// };
const ChatMessage = styled.div`
  width: 100%;
  height: 100vb;
  display: inline-flex;
`;
