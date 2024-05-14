import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaShare } from "react-icons/fa6";
import { RxUpdate } from "react-icons/rx";
import { IoReload } from "react-icons/io5";

const MessageMenu = ({ onDelete, onForward,onUpdate }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Nút hoặc biểu tượng để mở menu */}
      <HiOutlineDotsHorizontal onClick={toggleMenu} />

      {/* Menu */}
      {menuVisible && (
        <div
          style={{
            position: "absolute",
            top: "20px", // Điều chỉnh vị trí xuất hiện của menu
            right: "0",
            backgroundColor: "#fff",
            boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
            borderRadius: "5px",
            zIndex: "1",
            display:"flex",
            width:"170px"
          }}
        >
          <div onClick={onDelete} style={{ padding: "10px", cursor: "pointer" ,justifyContent:"center",alignItems:"center",flexDirection:"column"}}>
          <div>
          <IoReload />
          </div>
          <div>
            <span style={{fontSize:"10px"}}>Thu hồi</span>
            </div>
          </div>
          <div onClick={onForward} style={{ padding: "10px", cursor: "pointer",justifyContent:"center",alignItems:"center" }}>
          
          <div style={{justifyContent:"center"}}>
          <FaShare />
          </div>
          <div>
            <span style={{fontSize:"10px"}}>Chuyển tiếp</span>
            </div>
          </div>
          <div onClick={onUpdate} style={{ padding: "10px", cursor: "pointer" ,justifyContent:"center",alignItems:"center" }}>
         
            <div >
            <RxUpdate />
            </div>
            <div>
            <span style={{fontSize:"10px"}}>Sửa</span>
            </div>
        
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageMenu;
