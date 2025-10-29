import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Sidebar() {
  return (
    <div
      className="bg-light border-end"
      style={{ width: "260px", paddingTop: "20px", minHeight: "100vh" }}
    >
      <ul className="list-unstyled px-3">
        <li className="mb-2 p-2 bg-secondary bg-opacity-25 rounded">
          Thông tin phụ huynh
        </li>
        <li className="mb-2 p-2">Quản lý thông tin trẻ</li>
        <li className="mb-2 p-2">Quản lý vé</li>
        <li className="mt-4 p-2 text-danger d-flex justify-content-between align-items-center">
          Đăng xuất <span>→</span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
