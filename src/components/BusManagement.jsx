import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

function BusManagement() {
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchBuses();
    fetchDrivers();
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await axios.get(`${API_BASE}/buses`);
      setBuses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching buses:", err);
      setServerError("Không thể tải danh sách xe buýt");
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/drivers`);
      setDrivers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: "",
    driverId: "",
    capacity: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});

  // ✅ Kiểm tra dữ liệu form
  const validate = () => {
    const newErrors = {};
    if (!formData.plateNumber.trim())
      newErrors.plateNumber = "Biển số xe không được trống";
    if (
      !formData.capacity ||
      isNaN(formData.capacity) ||
      formData.capacity <= 0
    )
      newErrors.capacity = "Sức chứa phải là số dương";
    if (!formData.driverId) newErrors.driverId = "Vui lòng chọn tài xế";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Mở modal thêm mới
  const handleAddClick = () => {
    setFormData({
      plateNumber: "",
      driverId: "",
      capacity: "",
      status: "active",
    });
    setErrors({});
    setIsEdit(false);
    setEditingId(null);
    setShowModal(true);
  };

  // ✅ Lưu (thêm hoặc cập nhật)
  const handleSave = async () => {
    if (!validate()) return;
    const payload = {
      plateNumber: formData.plateNumber,
      capacity: Number(formData.capacity),
      status: formData.status,
      driverId: formData.driverId || null,
    };

    try {
      setModalSaving(true);
      if (isEdit && editingId) {
        await axios.put(`${API_BASE}/buses/${editingId}`, payload);
        setSuccessMsg("Cập nhật xe buýt thành công");
      } else {
        await axios.post(`${API_BASE}/buses`, payload);
        setSuccessMsg("Thêm xe buýt thành công");
      }
      setShowModal(false);
      await fetchBuses();
    } catch (err) {
      console.error("Error saving bus:", err);
      setServerError(err?.response?.data?.message || "Lưu xe buýt thất bại");
    } finally {
      setModalSaving(false);
    }
  };

  // ✅ Thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Xóa xe buýt
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa xe buýt này không?")) return;
    try {
      await axios.delete(`${API_BASE}/buses/${id}`);
      setSuccessMsg("Xóa xe buýt thành công");
      await fetchBuses();
    } catch (err) {
      console.error("Error deleting bus:", err);
      setServerError("Xóa xe buýt thất bại");
    }
  };

  // ✅ Sửa xe buýt
  const handleEdit = (bus) => {
    setFormData({
      plateNumber: bus.plateNumber || "",
      driverId: bus.driverId?._id || bus.driverId || "",
      capacity: bus.capacity || "",
      status: bus.status || "active",
    });
    setIsEdit(true);
    setEditingId(bus._id);
    setShowModal(true);
  };

  return (
    <div
      className="bg-light d-flex flex-column"
      style={{ width: "100vw", height: "100vh" }}
    >
      <Header />

      <div
        className="d-flex flex-grow-1"
        style={{ height: "calc(100vh - 120px)" }}
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
              <span className="fw-bold">🚍 Quản lý xe buýt</span>
              <button className="btn btn-light btn-sm" onClick={handleAddClick}>
                ➕ Thêm xe buýt
              </button>
            </div>

            <div className="card-body">
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              {successMsg && (
                <div className="alert alert-success">{successMsg}</div>
              )}
              {loading ? (
                <div className="text-center my-4">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                </div>
              ) : (
                <table className="table table-striped align-middle">
                  <thead className="table-primary">
                    <tr>
                      <th>#</th>
                      <th>Biển số xe</th>
                      <th>Tài xế</th>
                      <th>Sức chứa</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buses.map((bus, index) => {
                      const driverName =
                        bus.driverId?.name ||
                        (drivers.find((d) => d._id === bus.driverId)?.name ??
                          "Không có");
                      const statusLabel =
                        bus.status === "active"
                          ? "Đang hoạt động"
                          : bus.status === "maintenance"
                          ? "Bảo trì"
                          : "Ngưng hoạt động";
                      const badgeClass =
                        bus.status === "active"
                          ? "bg-success"
                          : bus.status === "maintenance"
                          ? "bg-warning text-dark"
                          : "bg-secondary";

                      return (
                        <tr key={bus._id}>
                          <td>{index + 1}</td>
                          <td>{bus.plateNumber}</td>
                          <td>{driverName}</td>
                          <td>{bus.capacity}</td>
                          <td>
                            <span className={`badge ${badgeClass}`}>
                              {statusLabel}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => handleEdit(bus)}
                            >
                              ✏️ Sửa
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(bus._id)}
                            >
                              🗑️ Xóa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {!loading && buses.length === 0 && (
                <p className="text-center text-muted mt-3">
                  Không có xe buýt nào.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa xe buýt */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {isEdit ? "Chỉnh sửa xe buýt" : "Thêm xe buýt"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {/* Biển số */}
                <div className="mb-3">
                  <label className="form-label">Biển số xe</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.plateNumber ? "is-invalid" : ""
                    }`}
                    name="plateNumber"
                    value={formData.plateNumber}
                    onChange={handleChange}
                  />
                  {errors.plateNumber && (
                    <div className="invalid-feedback">{errors.plateNumber}</div>
                  )}
                </div>

                {/* Sức chứa */}
                <div className="mb-3">
                  <label className="form-label">Sức chứa</label>
                  <input
                    type="number"
                    className={`form-control ${
                      errors.capacity ? "is-invalid" : ""
                    }`}
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                  />
                  {errors.capacity && (
                    <div className="invalid-feedback">{errors.capacity}</div>
                  )}
                </div>

                {/* Tài xế */}
                <div className="mb-3">
                  <label className="form-label">Tài xế</label>
                  <select
                    className={`form-select ${
                      errors.driverId ? "is-invalid" : ""
                    }`}
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn tài xế --</option>
                    {drivers.map((d) => (
                      <option key={d._id} value={d._id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                  {errors.driverId && (
                    <div className="invalid-feedback">{errors.driverId}</div>
                  )}
                </div>

                {/* Trạng thái */}
                <div className="mb-3">
                  <label className="form-label">Trạng thái</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Đang hoạt động</option>
                    <option value="maintenance">Bảo trì</option>
                    <option value="inactive">Ngưng hoạt động</option>
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
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={modalSaving}
                >
                  {modalSaving && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
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

export default BusManagement;
