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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBuses = async () => {
    setLoading(true);
    setServerError(null);
    setSuccessMsg(null);
    try {
      const res = await axios.get(`${API_BASE}/buses`);
      setBuses(res.data || []);
    } catch (err) {
      console.error("Error fetching buses:", err);
      setServerError("Không thể tải danh sách xe bus");
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
      // non-fatal
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: "",
    driverId: "",
    capacity: "",
    route: "",
    status: "active",
  });
  const [errors, setErrors] = useState({});

  // ✅ Kiểm tra dữ liệu form
  const validate = () => {
    const newErrors = {};
    if (!formData.plateNumber || !formData.plateNumber.trim()) newErrors.plateNumber = "Biển số xe là bắt buộc";
    if (!formData.driverId) newErrors.driverId = "Vui lòng chọn tài xế";
    if (!formData.capacity || isNaN(formData.capacity) || formData.capacity <= 0)
      newErrors.capacity = "Sức chứa phải là số dương";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Mở popup thêm mới
  const handleAddClick = () => {
    setFormData({
      plateNumber: "",
      driverId: "",
      capacity: "",
      route: "",
      status: "active",
    });
    setErrors({});
    setIsEdit(false);
    setEditingId(null);
    setShowModal(true);
  };

  // ✅ Lưu xe bus mới
  const handleSave = () => {
    if (!validate()) return;

    const payload = {
      plateNumber: formData.plateNumber,
      capacity: Number(formData.capacity) || 0,
      status: formData.status || "active",
      driverId: formData.driverId || null,
    };

    (async () => {
      setModalSaving(true);
      setServerError(null);
      setSuccessMsg(null);
      try {
        if (isEdit && editingId) {
          await axios.put(`${API_BASE}/buses/${editingId}`, payload);
          setSuccessMsg("Cập nhật xe bus thành công");
        } else {
          await axios.post(`${API_BASE}/buses`, payload);
          setSuccessMsg("Thêm xe bus thành công");
        }
        setShowModal(false);
        await fetchBuses();
      } catch (err) {
        console.error("Error saving bus:", err);
        const msg = err?.response?.data?.message || "Lưu xe bus thất bại";
        setServerError(msg);
      } finally {
        setModalSaving(false);
      }
    })();
  };

  // ✅ Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Xóa xe bus
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa xe bus này không?")) return;

    (async () => {
      setServerError(null);
      setSuccessMsg(null);
      try {
        await axios.delete(`${API_BASE}/buses/${id}`);
        setSuccessMsg("Xóa xe bus thành công");
        await fetchBuses();
      } catch (err) {
        console.error("Error deleting bus:", err);
        const msg = err?.response?.data?.message || "Xóa xe bus thất bại";
        setServerError(msg);
      }
    })();
  };

  // ✅ Sửa xe bus (demo)
  const handleEdit = (bus) => {
    // bus may have populated driverId
    const driverId = bus.driverId && bus.driverId._id ? bus.driverId._id : bus.driverId || "";
    setFormData({
      plateNumber: bus.plateNumber || bus.busNumber || "",
      driverId,
      capacity: bus.capacity || "",
      route: bus.route || "",
      status: bus.status || "active",
    });
    setIsEdit(true);
    setEditingId(bus._id || bus.id);
    setErrors({});
    setShowModal(true);
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
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <span className="fw-bold">Quản lý xe bus</span>
              <button className="btn btn-light btn-sm" onClick={handleAddClick}>
                ➕ Thêm xe bus
              </button>
            </div>

            <div className="card-body">
              {serverError && (
                <div className="alert alert-danger" role="alert">{serverError}</div>
              )}
              {successMsg && (
                <div className="alert alert-success" role="alert">{successMsg}</div>
              )}

              <table className="table table-striped align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Biển số xe</th>
                    <th>Tài xế</th>
                    <th>Sức chứa</th>
                    <th>Tuyến đường</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus, index) => {
                    const id = bus._id || bus.id;
                    const plate = bus.plateNumber || bus.busNumber || "-";
                    const driverName = bus.driverId && bus.driverId.name ? bus.driverId.name : (bus.driver || "-");
                    const capacity = bus.capacity || "-";
                    const route = bus.route || "-";
                    const statusLabel = bus.status === "active" ? "Đang hoạt động" : bus.status === "maintenance" || bus.status === "maintenance" ? "Bảo trì" : "Ngưng hoạt động";
                    const badgeClass = bus.status === "active" ? "bg-success" : bus.status === "maintenance" ? "bg-warning text-dark" : "bg-secondary";
                    return (
                      <tr key={id}>
                        <td>{index + 1}</td>
                        <td>{plate}</td>
                        <td>{driverName}</td>
                        <td>{capacity}</td>
                        <td>{route}</td>
                        <td><span className={`badge ${badgeClass}`}>{statusLabel}</span></td>
                        <td>
                          <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(bus)}>
                            ✏️ Sửa
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(id)}>
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {buses.length === 0 && (
                <p className="text-center text-muted mt-3">
                  Không có xe bus nào được ghi nhận.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm xe bus */}
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
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Thêm xe bus mới</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {/* Biển số xe */}
                <div className="mb-3">
                  <label className="form-label">Biển số xe</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.busNumber ? "is-invalid" : ""
                    }`}
                    name="busNumber"
                    value={formData.busNumber}
                    onChange={handleChange}
                  />
                  {errors.busNumber && (
                    <div className="invalid-feedback">{errors.busNumber}</div>
                  )}
                </div>

                {/* Tài xế (chọn từ danh sách) */}
                <div className="mb-3">
                  <label className="form-label">Chọn tài xế</label>
                  <select
                    className={`form-select ${errors.driverId ? "is-invalid" : ""}`}
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn tài xế --</option>
                    {drivers.map((d) => (
                      <option key={d._id || d.id} value={d._id || d.id}>{d.name}</option>
                    ))}
                  </select>
                  {errors.driverId && <div className="invalid-feedback">{errors.driverId}</div>}
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

                {/* Tuyến đường */}
                <div className="mb-3">
                  <label className="form-label">Tuyến đường</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.route ? "is-invalid" : ""
                    }`}
                    name="route"
                    value={formData.route}
                    onChange={handleChange}
                  />
                  {errors.route && (
                    <div className="invalid-feedback">{errors.route}</div>
                  )}
                </div>

                {/* Trạng thái */}
                <div className="mb-3">
                  <label className="form-label">Trạng thái</label>
                  <select className="form-select" name="status" value={formData.status} onChange={handleChange}>
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
                <button className="btn btn-primary" onClick={handleSave} disabled={modalSaving}>
                  {modalSaving && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}Lưu
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
