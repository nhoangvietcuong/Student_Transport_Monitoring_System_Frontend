import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "123") {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/students");
    } else {
      alert("❌ Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "400px",
          borderRadius: "20px",
          backgroundColor: "#ffffffee",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="text-center mb-4">
          <img
            src="/logo.png"
            alt="SchoolBus Logo"
            width="80"
            height="80"
            className="mb-3"
          />
          <h3 className="fw-bold text-primary">Đăng nhập hệ thống</h3>
          <p className="text-muted" style={{ fontSize: "14px" }}>
            Hệ thống quản lý đưa đón học sinh
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group mb-3">
            <label className="fw-semibold mb-1">Tên đăng nhập</label>
            <input
              type="text"
              className="form-control py-2"
              placeholder="Nhập tên đăng nhập..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="fw-semibold mb-1">Mật khẩu</label>
            <input
              type="password"
              className="form-control py-2"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold py-2"
            style={{ borderRadius: "10px" }}
          >
            🔐 Đăng nhập
          </button>
        </form>

        <p className="text-center text-muted mt-4" style={{ fontSize: "13px" }}>
          © {new Date().getFullYear()} SchoolBus System
        </p>
      </div>
    </div>
  );
}

export default Login;
