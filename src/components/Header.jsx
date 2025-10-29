import React from "react";

function Header() {
  return (
    <header className="d-flex justify-content-between align-items-center bg-white shadow-sm px-4 py-3">
      <div className="d-flex align-items-center gap-3">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/13/SGU_logo.png"
          alt="SGU"
          height="60"
        />
        <div>
          <h3 className="text-primary fw-bold mb-0">SchoolBus</h3>
          <small className="text-secondary">
            Hệ thống quản lý đưa đón học sinh
          </small>
        </div>
      </div>
      <div className="d-flex align-items-center gap-3">
        <div
          className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold fs-5"
          style={{ width: "50px", height: "50px" }}
        >
          PH
        </div>
        <div>
          <p className="mb-0 fw-semibold">Phụ huynh Nguyễn Văn A</p>
          <small className="text-muted">Lớp 5B - Trần Ngọc Minh Thư</small>
        </div>
      </div>
    </header>
  );
}

export default Header;
