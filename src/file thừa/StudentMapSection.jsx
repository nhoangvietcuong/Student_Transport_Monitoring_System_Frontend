import React from "react";
import Header from "../components/Header";
import Navbar from "./Navbar";

function StudentMapSection() {
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
      {/* ===== Header + Navbar ===== */}
      <Header />
      <Navbar />

      {/* ===== Map Section ===== */}
      <div className="p-3">
        <div className="bg-white shadow-sm rounded-3 p-3">
          {/* --- Thống kê học sinh --- */}
          <div className="d-flex justify-content-around text-center mb-3 fw-bold">
            <div className="text-success">
              Học sinh đăng kí <span className="ms-2 text-dark">7</span>
            </div>
            <div className="text-primary">
              Học sinh trên xe <span className="ms-2 text-dark">1</span>
            </div>
            <div className="text-danger">
              Học sinh báo nghỉ <span className="ms-2 text-dark">1</span>
            </div>
          </div>

          {/* --- Google Map --- */}
          <div
            className="w-100 rounded-3 border"
            style={{
              height: "80vh",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <iframe
              title="student-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.502726948225!2d106.68210297505479!3d10.772216789375246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3fa9d6fd01%3A0x6a6de92f785bd8d8!2zMTA0MSBUcsaw4budbmcgWGnDqm4gU8ahbiwgUGjGsOG7nW5nIDQsIFF14bqjbmcgMywgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1svi!2s!4v1698785700000!5m2!1svi!2s"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            ></iframe>

            {/* --- Nút SOS & gửi vị trí --- */}
            <button
              className="btn btn-danger rounded-circle position-absolute"
              style={{
                bottom: "80px",
                right: "20px",
                width: "60px",
                height: "60px",
                fontWeight: "bold",
              }}
            >
              SOS
            </button>

            <button
              className="btn btn-success rounded-circle position-absolute"
              style={{
                bottom: "10px",
                right: "20px",
                width: "55px",
                height: "55px",
              }}
            >
              <i className="bi bi-send"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentMapSection;
   