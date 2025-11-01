import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Sidebar({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc muốn đăng xuất không?")) {
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false); // ✅ cập nhật state để App re-render
      navigate("/login"); // ✅ điều hướng tức thì
    }
  };

  return (
    <div
      className="d-flex flex-column border-end shadow-sm"
      style={{
        width: "260px",
        minHeight: "100vh",
        padding: "20px",
        background: "linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)",
        borderRight: "3px solid #007bff33",
        marginTop: "-25px",
      }}
    >
      {/* Menu */}
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <NavLink
            to="/students"
            className={({ isActive }) =>
              `nav-link fw-semibold rounded px-3 py-2 ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-dark bg-light"
              }`
            }
          >
            Danh sách học sinh
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/accounts"
            className={({ isActive }) =>
              `nav-link fw-semibold rounded px-3 py-2 ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-dark bg-light"
              }`
            }
          >
            Tài khoản
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/buses"
            className={({ isActive }) =>
              `nav-link fw-semibold rounded px-3 py-2 ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-dark bg-light"
              }`
            }
          >
            Xe Bus
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/drivers"
            className={({ isActive }) =>
              `nav-link fw-semibold rounded px-3 py-2 ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-dark bg-light"
              }`
            }
          >
            Tài xế
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink
            to="/statistics"
            className={({ isActive }) =>
              `nav-link fw-semibold rounded px-3 py-2 ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-dark bg-light"
              }`
            }
          >
            Thống kê
          </NavLink>
        </li>
      </ul>

      {/* Nút đăng xuất */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 fw-semibold mt-3"
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
