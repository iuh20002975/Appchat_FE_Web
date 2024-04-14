import React from "react";

const ModalImg = ({ isZoomed, imageUrl, handleSaveImage, closeModal }) => {
  if (!isZoomed) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 800,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "white",
          width: "90%",
          height: "90%",
          borderRadius: "8px",
          boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.75)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={imageUrl}
          alt="ảnh"
          style={{
            maxWidth: "100%",
            maxHeight: "80%", // giới hạn chiều cao để tránh hiện thị quá lớn
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        />
        <button
          onClick={handleSaveImage}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Lưu hình ảnh
        </button>
        <span
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            cursor: "pointer",
            color: "white",
            fontSize: "24px",
            transition: "color 0.3s ease",
          }}
        >
          ❌
        </span>
      </div>
    </div>
  );
};

export default ModalImg;
