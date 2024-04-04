import React, { useState } from "react";
import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";

const ModalAccountInfor = ({ closeModal }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  const handleUpdate = () => {
    // Gọi API để cập nhật thông tin tài khoản(cap nhat sau).

    // Đóng modal sau khi cập nhật thành công
    closeModal();
  };

  return (
    <ModalContainer>
      <ModalHeader>
        <FaUserCircle style={{ marginRight: "10px", fontSize: "50px" , color:"blue"}} />
        Thông tin tài khoản
        <CloseButton onClick={closeModal}>&times;</CloseButton>
      </ModalHeader>
      <ModalBody>
        <InputContainer>
          <label htmlFor="name">Tên người dùng:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </InputContainer>
        <InputContainer>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </InputContainer>
        <InputContainer>
          <label htmlFor="phone-number">Số điện thoại:</label>
          <input type="text" id="phone-number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </InputContainer>
        <InputContainer>
          <label htmlFor="date-of-birth">Ngày sinh:</label>
          <input type="date" id="date-of-birth" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
        </InputContainer>
        <InputContainer>
          <label htmlFor="gender">Giới tính:</label>
          <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </InputContainer>
      </ModalBody>
      <ModalFooter>
        <Button onClick={handleUpdate}>Cập nhật</Button>
      </ModalFooter>
    </ModalContainer>
  );
};

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
// style1
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

export default ModalAccountInfor;