import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

// Giả định interface IUser (chỉ có email, password, role)
// export interface IUser extends Document {
//   email: string;
//   password?: string; // Mật khẩu là tùy chọn sau khi tạo
//   role: 'admin' | 'parent' | 'driver';
// }

function AccountManagement() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  // Thay đổi endpoint từ /accounts sang /users
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // ✅ Lấy danh sách tài khoản (users) khi mở trang
  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    setServerError(null);
    try {
      // Thay đổi endpoint: /accounts -> /users
      const res = await axios.get(`${API_BASE}/users`);
      setAccounts(res.data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setServerError("Không thể tải danh sách tài khoản người dùng");
    } finally {
      setLoading(false);
    }
  };

  // Modal form
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  // Cập nhật formData: chỉ giữ lại email, role, thêm password cho tạo mới
  const [formData, setFormData] = useState({
    _id: null, // Sử dụng _id
    email: "",
    password: "", // Chỉ dùng khi tạo mới
    role: "parent", // Thiết lập role mặc định phù hợp với enum
  });
  const [errors, setErrors] = useState({});

  // ✅ Validate
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email không được trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Định dạng email không hợp lệ";
    }

    if (!isEdit && !formData.password) {
      newErrors.password = "Mật khẩu không được trống khi tạo mới";
    } else if (!isEdit && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    } // Giả định mật khẩu tối thiểu 6 ký tự

    if (!formData.role.trim()) newErrors.role = "Vai trò không được trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = () => {
    setFormData({
      _id: null,
      email: "",
      password: "",
      role: "parent", // Role mặc định
    });
    setIsEdit(false);
    setErrors({});
    setShowModal(true);
  };

  // Cập nhật handleEdit: dùng _id và chỉ lấy email, role
  const handleEdit = (account) => {
    setFormData({
      _id: account._id,
      email: account.email,
      password: "", // Không hiển thị hoặc chỉnh sửa mật khẩu cũ
      role: account.role,
    });
    setIsEdit(true);
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tài khoản này không?")) {
      try {
        // Thay đổi endpoint: /accounts/:id -> /users/:id
        await axios.delete(`${API_BASE}/users/${id}`);
        setAccounts(accounts.filter((a) => a._id !== id));
      } catch (err) {
        console.error("Error deleting user:", err);
        setServerError("Xóa tài khoản thất bại");
      }
    }
  };

  const handleSave = async () => {
    if (!validate()) return;

    // Payload chỉ bao gồm các trường trong schema
    let payload = {
      email: formData.email,
      role: formData.role,
    };

    // Thêm mật khẩu chỉ khi TẠO MỚI
    if (!isEdit) {
      payload.password = formData.password;
    }

    try {
      if (isEdit) {
        // Cập nhật: /users/:id
        const res = await axios.put(
          `${API_BASE}/users/${formData._id}`,
          payload
        );
        // Cập nhật danh sách sau khi sửa
        setAccounts(
          accounts.map((a) => (a._id === res.data._id ? res.data : a))
        );
      } else {
        // Tạo mới: /users
        const res = await axios.post(`${API_BASE}/users`, payload);
        // Thêm tài khoản mới vào danh sách
        setAccounts([...accounts, res.data]);
      }
      setShowModal(false);
      setServerError(null); // Xóa lỗi server nếu thành công
    } catch (err) {
      console.error("Error saving user:", err);
      // Xử lý lỗi từ server (ví dụ: email đã tồn tại)
      const errorMsg = err.response?.data?.message || "Lưu tài khoản thất bại";
      setServerError(errorMsg);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Render UI
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
      <Header />

      <div
        className="d-flex flex-grow-1"
        style={{ width: "100%", height: "calc(100vh - 120px)" }}
      >
        <div
          style={{
            width: "250px",
            backgroundColor: "#fff",
            borderRight: "1px solid #dee2e6",
            padding: "20px",
          }}
        >
          <Sidebar />
        </div>

        <div className="flex-grow-1 bg-light p-4 overflow-auto">
          <div
            className="card shadow-sm border-0 mx-auto"
            style={{ maxWidth: "1200px" }}
          >
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">👤 Quản lý người dùng</h5>
              <button className="btn btn-light btn-sm" onClick={handleAddClick}>
                ➕ Thêm người dùng
              </button>
            </div>

            <div className="card-body">
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              {loading ? (
                <div className="text-center my-4">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <table className="table table-striped align-middle text-center">
                  <thead className="table-success">
                    <tr>
                      <th>#</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      {/* Thêm cột để hiển thị thời gian tạo/cập nhật nếu cần (timestamps: true) */}
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((acc, index) => (
                      <tr key={acc._id}>
                        <td>{index + 1}</td>
                        <td>{acc.email}</td>
                        <td>
                          {/* Đảm bảo vai trò được hiển thị đúng */}
                          <span
                            className={`badge ${
                              acc.role === "admin"
                                ? "bg-primary"
                                : acc.role === "driver"
                                ? "bg-info"
                                : "bg-secondary"
                            }`}
                          >
                            {acc.role}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEdit(acc)}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(acc._id)}
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {accounts.length === 0 && !loading && (
                <p className="text-center text-muted mt-3">
                  Không có người dùng nào.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa tài khoản */}
      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  {isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Email Field */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isEdit} // Thường không cho sửa email khi chỉnh sửa
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Password Field (Chỉ hiện khi THÊM MỚI) */}
                {!isEdit && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Mật khẩu</label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>
                )}

                {/* Role Field */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Vai trò</label>
                  <select
                    className={`form-select ${errors.role ? "is-invalid" : ""}`}
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    {/* Role phải khớp với enum: ['admin', 'parent', 'driver'] */}
                    <option value="parent">parent (Phụ huynh)</option>
                    <option value="driver">driver (Tài xế)</option>
                    <option value="admin">admin (Quản trị viên)</option>
                  </select>
                  {errors.role && (
                    <div className="invalid-feedback">{errors.role}</div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button className="btn btn-success" onClick={handleSave}>
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountManagement;
