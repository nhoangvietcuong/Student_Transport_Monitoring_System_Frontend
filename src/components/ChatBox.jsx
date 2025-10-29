import React from "react";
import Header from "./Header";
import Navbar from "./Navbar";

function ChatBox() {
  return (
     <div
      className="bg-light d-flex flex-column"
      style={{ 
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
     }}
    >
      {/* Gộp Header + Navbar */}
      <Header />
      <Navbar />

      {/* ===== KHUNG CHAT ===== */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <div
          style={{
            width: "90%",
            maxWidth: "800px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            padding: "20px",
          }}
        >
          {/* Header chat */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #ddd",
              paddingBottom: "10px",
              marginBottom: "15px",
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                fontSize: "18px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              ←
            </button>
            <h5 style={{ margin: 0 }}>
              Tài xế: <i>Nguyễn Minh Minh</i>
            </h5>
            <img
              src="https://i.pravatar.cc/40?img=3"
              alt="driver"
              style={{ borderRadius: "50%", marginLeft: "auto" }}
            />
          </div>

          {/* Nội dung chat */}
          <div
            style={{
              height: "300px",
              overflowY: "auto",
              backgroundColor: "#f1f1f1",
              borderRadius: "10px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {/* Tin nhắn tài xế */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="https://i.pravatar.cc/40?img=5"
                alt="driver"
                style={{ borderRadius: "50%", marginRight: "10px" }}
              />
              <div
                style={{
                  backgroundColor: "#ffe082",
                  padding: "10px 15px",
                  borderRadius: "20px",
                  maxWidth: "60%",
                }}
              >
                Khoảng 5p nữa!
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="https://i.pravatar.cc/40?img=5"
                alt="driver"
                style={{ borderRadius: "50%", marginRight: "10px" }}
              />
              <div
                style={{
                  backgroundColor: "#ffe082",
                  padding: "10px 15px",
                  borderRadius: "20px",
                  maxWidth: "70%",
                }}
              >
                Xe đã đến trạm! Xin mời học sinh ra xe
              </div>
            </div>

            {/* Tin nhắn học sinh */}
            <div
              style={{
                alignSelf: "flex-end",
                backgroundColor: "#0d6efd",
                color: "white",
                padding: "10px 15px",
                borderRadius: "20px",
                maxWidth: "70%",
              }}
            >
              Sắp đến trạm chưa vậy Bắc
            </div>

            <div
              style={{
                alignSelf: "flex-end",
                backgroundColor: "#0d6efd",
                color: "white",
                padding: "10px 15px",
                borderRadius: "20px",
                maxWidth: "70%",
              }}
            >
              Hi
            </div>
          </div>

          {/* Ô nhập tin nhắn */}
          <div
            style={{
              display: "flex",
              marginTop: "15px",
              alignItems: "center",
              backgroundColor: "#f1f1f1",
              borderRadius: "20px",
              padding: "5px 10px",
            }}
          >
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                padding: "10px",
                color: "#333",
              }}
            />
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "18px",
              }}
            >
              🕊️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
