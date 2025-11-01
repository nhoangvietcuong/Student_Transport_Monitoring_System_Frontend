import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";

function AccountManagement() {
  const [accounts, setAccounts] = useState([
    {
      id: 1,
      username: "admin",
      email: "admin@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      username: "student01",
      email: "student01@example.com",
      role: "User",
      status: "Inactive",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "User",
    status: "Active",
  });
  const [errors, setErrors] = useState({});

  // ✅ Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    if (!formData.status.trim()) newErrors.status = "Status is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Mở popup thêm mới
  const handleAddClick = () => {
    setFormData({
      username: "",
      email: "",
      role: "User",
      status: "Active",
    });
    setErrors({});
    setShowModal(true);
  };

  // ✅ Lưu tài khoản mới
  const handleSave = () => {
    if (validate()) {
      const newAccount = {
        id: Date.now(),
        ...formData,
      };
      setAccounts([...accounts, newAccount]);
      setShowModal(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      setAccounts(accounts.filter((acc) => acc.id !== id));
    }
  };

  const handleEdit = (id) => {
    alert(`Edit account with ID: ${id}`);
  };

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
      {/* Header */}
      <Header />

      {/* Layout chính */}
      <div
        className="d-flex flex-grow-1"
        style={{ width: "100%", height: "calc(100vh - 120px)" }}
      >
        {/* Sidebar */}
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

        {/* Nội dung chính */}
        <div
          className="flex-grow-1 bg-light p-4 overflow-auto"
          style={{ minHeight: "100%" }}
        >
          <div
            className="card shadow-sm border-0 mx-auto"
            style={{ maxWidth: "1200px" }}
          >
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <span className="fw-bold">Quản lí tài khoản</span>
              <button
                className="btn btn-light btn-sm"
                onClick={handleAddClick}
              >
                ➕ Add Account
              </button>
            </div>

            <div className="card-body">
              <table className="table table-striped align-middle">
                <thead className="table-success">
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc, index) => (
                    <tr key={acc.id}>
                      <td>{index + 1}</td>
                      <td>{acc.username}</td>
                      <td>{acc.email}</td>
                      <td>{acc.role}</td>
                      <td>
                        <span
                          className={`badge ${
                            acc.status === "Active"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {acc.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(acc.id)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(acc.id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {accounts.length === 0 && (
                <p className="text-center text-muted mt-3">
                  No accounts found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Add Account */}
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
                <h5 className="modal-title">Add New Account</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {/* Username */}
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Role */}
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className={`form-select ${
                      errors.role ? "is-invalid" : ""
                    }`}
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                  {errors.role && (
                    <div className="invalid-feedback">{errors.role}</div>
                  )}
                </div>

                {/* Status */}
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className={`form-select ${
                      errors.status ? "is-invalid" : ""
                    }`}
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {errors.status && (
                    <div className="invalid-feedback">{errors.status}</div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleSave}>
                  Save
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
