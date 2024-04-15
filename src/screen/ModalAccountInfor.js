import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaUserCircle, FaCamera } from "react-icons/fa";
import { getApiNoneToken, postApiNoneToken, putApiNoneToken} from "../api/Callapi";

export default function ModalAccountInfor({ userLogin, closeModal }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState("");
  const [file, setFile] = useState(null);
  const formatDate = (dateString) => {
    const date = new Date(dateString); // Tạo đối tượng Date từ chuỗi ngày tháng
    const year = date.getFullYear(); // Lấy năm
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Lấy tháng và thêm '0' phía trước nếu cần
    const day = date.getDate().toString().padStart(2, "0"); // Lấy ngày và thêm '0' phía trước nếu cần
    return `${year}-${month}-${day}`; // Trả về chuỗi ngày tháng đã được định dạng
  };
  useEffect(() => {
    const loadInfor = async () => {
      try {
        const response = await getApiNoneToken(`/getDetails/${userLogin}`, {
          id: userLogin,
        });
        setName(response.data.data.name);
        setEmail(response.data.data.username);
        setPhoneNumber(response.data.data.phone);
        setDateOfBirth(response.data.data.dateOfBirth);
        setGender(response.data.data.gender);
        setAvatar(response.data.data.avatar);
      } catch (error) {
        console.error("Error while fetching user details:", error);
        alert("Error while fetching user details: " + error.message);
      }
    };

    loadInfor();
  }, [userLogin]);

  const handleUpdate = async () => {
    try {
      if (!file) {
        alert("Vui lòng chọn ảnh đại diện.");
        return;
      }
  
      const url = await uploadToS3(file);
      console.log("Avatar:", url);
      setAvatar(url);
  
      const response = await putApiNoneToken(`/updateUser/${userLogin}`, {
        avatar: url,
      });
  
      console.log("Response:", response);
      alert("Cập nhật thông tin tài khoản thành công");
      closeModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin tài khoản:", error);
      alert("Đã xảy ra lỗi khi cập nhật thông tin tài khoản.");
    }
  };
  
  

  // ============================== Phần upload file ==============================
  const uploadToS3 = async (file) => {
    if (!file) {
      alert("Không có file/ảnh");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await postApiNoneToken("/uploadAvatar", formData);
      console.log("Upload lên S3 thành công:", response);
      return response.data.data.url;
    } catch (error) {
      console.error("Lỗi khi upload lên S3:", error);
      throw error;
    }
  };
  
  const chooseAvatar = () => {
    // Chọn ảnh đại diện mới
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      // Hiển thị ảnh đã chọn lên Modal
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
        setFile(file);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <ModalContainer>
      <ModalHeader>
        <FaUserCircle
          style={{ marginRight: "10px", fontSize: "50px", color: "blue" }}
        />
        Thông tin tài khoản
        <CloseButton onClick={closeModal}>&times;</CloseButton>
      </ModalHeader>
      <ModalBody>
        <ModalAvatar>
          <Avatar src={avatar} alt="Avatar" />
          <CameraIcon>
            <FaCamera color="black" size={25} onClick={chooseAvatar} />
          </CameraIcon>
        </ModalAvatar>

        <InputContainer>
          <label htmlFor="name">Tên người dùng:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor="phone-number">Số điện thoại:</label>
          <input
            type="text"
            id="phone-number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor="date-of-birth">Ngày sinh:</label>
          <input
            type="date"
            id="date-of-birth"
            value={dateOfBirth ? formatDate(dateOfBirth) : ""}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </InputContainer>
        <InputContainer>
          <label htmlFor="gender">Giới tính:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="true">Nam</option>
            <option value="false">Nữ</option>
          </select>
        </InputContainer>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleUpdate}>Cập nhật</Button>
      </ModalFooter>
    </ModalContainer>
  );
}

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  max-width: 90%;
  height: auto;
  background-color: #fff;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  font-size: 1.2rem;
  color: blue;
`;
const ModalAvatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Đảm bảo avatar được căn giữa cả theo chiều dọc và ngang */
  font-size: 1.2rem;
  color: blue;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
`;
const CameraIcon = styled.span`
  position: absolute;
  top: 32%;
  left: 53%;
  background-color: none;
  border-radius: 50%;
`;
const CloseButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
`;

const ModalBody = styled.div`
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
  width: 100%;

  label {
    width: 100px;
    text-align: right;
    font-size: 16px;
    margin-bottom: 5px;
    margin-right: 5px;
    text-indent: 5px;
  }

  input {
    width: 100%;
    padding-left: 20px;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    font-size: 16px;
  }

  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    font-size: 16px;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
  border-top: 1px solid #ccc;
`;

const Button = styled.button`
  background-color: #337ab7;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;
