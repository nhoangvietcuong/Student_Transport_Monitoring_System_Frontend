import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Sidebar({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất không?")) {
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
    }
  };

  return (
    <div
      className="d-flex flex-column border-end shadow-lg"
      style={{
        width: "230px",
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(180deg, #0d47a1 0%, #1565c0 100%)", // 💙 xanh đậm
        color: "#fff",
      }}
    >
      <h5 className="text-center fw-bold mb-4" style={{ letterSpacing: "1px" }}>
        🚍 Quản lý xe bus
      </h5>

      {/* Menu */}
      <ul className="nav flex-column">
        {[
          { path: "/students", label: "Danh sách học sinh" },
          { path: "/accounts", label: "Tài khoản" },
          { path: "/buses", label: "Xe Bus" },
          { path: "/drivers", label: "Tài xế" },
          { path: "/parents", label: "Phụ Quynh" },
          { path: "/statistics", label: "Thống kê" },
        ].map((item) => (
          <li className="nav-item mb-2" key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-link fw-semibold rounded px-3 py-2 ${
                  isActive
                    ? "bg-light text-primary shadow-sm" // Khi active: sáng màu, nổi bật
                    : "text-white text-opacity-85"
                }`
              }
              style={{
                transition: "0.3s",
              }}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Nút đăng xuất */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="btn btn-outline-light w-100 fw-semibold mt-3"
          style={{
            transition: "0.2s",
            borderWidth: "2px",
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
