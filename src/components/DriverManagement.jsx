import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function DriverManagement() {
  const [drivers, setDrivers] = useState([]);
  const [users, setUsers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    licenseNumber: "",
    phone: "",
    yearsOfExperience: 0,
    userId: "",
    busId: "",
  });
  const [errors, setErrors] = useState({});

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchDrivers();
    fetchDropdowns();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await axios.get(`${API_BASE}/drivers`);
      setDrivers(res.data || []);
    } catch (err) {
      console.error(err);
      setServerError("Không thể tải danh sách tài xế");
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdowns = async () => {
    try {
      const [usersRes, busesRes] = await Promise.all([
        axios.get(`${API_BASE}/users`),
        axios.get(`${API_BASE}/buses`),
      ]);
      setUsers(usersRes.data);
      setBuses(busesRes.data);
    } catch (err) {
      console.error("Error fetching dropdowns:", err);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên tài xế không được trống";
    if (!formData.licenseNumber.trim())
      newErrors.licenseNumber = "Số GPLX không được trống";
    if (!formData.phone.trim())
      newErrors.phone = "Số điện thoại không được trống";
    else if (!/^[0-9]{9,11}$/.test(formData.phone))
      newErrors.phone = "Số điện thoại không hợp lệ";
    if (formData.yearsOfExperience === "" || formData.yearsOfExperience < 0)
      newErrors.yearsOfExperience = "Số năm kinh nghiệm không hợp lệ";
    if (!formData.userId) newErrors.userId = "Chọn User";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = () => {
    setFormData({
      id: null,
      name: "",
      licenseNumber: "",
      phone: "",
      yearsOfExperience: 0,
      userId: "",
      busId: "",
    });
    setIsEdit(false);
    setErrors({});
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validate()) return;
    const payload = { ...formData };
    try {
      if (isEdit) {
        const res = await axios.put(
          `${API_BASE}/drivers/${formData.id}`,
          payload
        );
        setDrivers(drivers.map((d) => (d._id === res.data._id ? res.data : d)));
      } else {
        const res = await axios.post(`${API_BASE}/drivers`, payload);
        setDrivers([...drivers, res.data]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error saving driver:", err);
      setServerError("Lưu tài xế thất bại");
    }
  };

  const handleEdit = (driver) => {
    setFormData({
      id: driver._id,
      name: driver.name || "",
      licenseNumber: driver.licenseNumber || "",
      phone: driver.phone || "",
      yearsOfExperience: driver.yearsOfExperience || 0,
      userId: driver.userId?._id || "",
      busId: driver.busId?._id || "",
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài xế này không?")) return;
    try {
      await axios.delete(`${API_BASE}/drivers/${id}`);
      setDrivers(drivers.filter((d) => d._id !== id));
    } catch (err) {
      console.error(err);
      setServerError("Xóa tài xế thất bại");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="bg-light d-flex flex-column"
      style={{ width: "100vw", height: "100vh", overflowX: "hidden" }}
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
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">🚍 Quản lý tài xế</h5>
              <button className="btn btn-light btn-sm" onClick={handleAddClick}>
                ➕ Thêm tài xế
              </button>
            </div>
            <div className="card-body">
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              {loading ? (
                <div className="text-center my-4">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                </div>
              ) : drivers.length === 0 ? (
                <p className="text-center text-muted mt-3">
                  Không có tài xế nào.
                </p>
              ) : (
                <table className="table table-striped align-middle text-center">
                  <thead className="table-primary">
                    <tr>
                      <th>#</th>
                      <th>Họ tên</th>
                      <th>Số GPLX</th>
                      <th>Số điện thoại</th>
                      <th>Số năm kinh nghiệm</th>
                      <th>User</th>
                      <th>Bus</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((d, idx) => (
                      <tr key={d._id}>
                        <td>{idx + 1}</td>
                        <td>{d.name}</td>
                        <td>{d.licenseNumber}</td>
                        <td>{d.phone}</td>
                        <td>{d.yearsOfExperience}</td>
                        <td>{d.userId?.role || "—"}</td>
                        <td>{d.busId?.plateNumber || "—"}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEdit(d)}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(d._id)}
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEdit ? "Chỉnh sửa tài xế" : "Thêm tài xế mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {["name", "licenseNumber", "phone"].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label fw-semibold">
                      {
                        {
                          name: "Họ tên",
                          licenseNumber: "Số GPLX",
                          phone: "Số điện thoại",
                        }[field]
                      }
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors[field] ? "is-invalid" : ""
                      }`}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                    />
                    {errors[field] && (
                      <div className="invalid-feedback">{errors[field]}</div>
                    )}
                  </div>
                ))}

                {/* Years of experience */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Số năm kinh nghiệm
                  </label>
                  <input
                    type="number"
                    min={0}
                    className={`form-control ${
                      errors.yearsOfExperience ? "is-invalid" : ""
                    }`}
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                  />
                  {errors.yearsOfExperience && (
                    <div className="invalid-feedback">
                      {errors.yearsOfExperience}
                    </div>
                  )}
                </div>

                {/* User select */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">User</label>
                  <select
                    className={`form-select ${
                      errors.userId ? "is-invalid" : ""
                    }`}
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn user --</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.role}
                      </option>
                    ))}
                  </select>
                  {errors.userId && (
                    <div className="invalid-feedback">{errors.userId}</div>
                  )}
                </div>

                {/* Bus select */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Bus</label>
                  <select
                    className="form-select"
                    name="busId"
                    value={formData.busId}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn bus --</option>
                    {buses.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.plateNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
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

export default DriverManagement;
