import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function RouteManagement() {
  const [routes, setRoutes] = useState([]);
  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    arrival: "",
    time: "",
    busId: "",
    stops: [],
  });

  const [errors, setErrors] = useState({});
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchRoutes();
    fetchStops();
    fetchBuses();
  }, []);

  const fetchRoutes = async () => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await axios.get(`${API_BASE}/routes`);
      setRoutes(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setServerError("Không thể tải danh sách tuyến đường");
    } finally {
      setLoading(false);
    }
  };

  const fetchStops = async () => {
    try {
      const res = await axios.get(`${API_BASE}/stops`);
      setStops(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchStops error:", err);
      setStops([]);
      setServerError("Không thể tải danh sách điểm dừng");
    }
  };

  const fetchBuses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/buses`);
      setBuses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên tuyến không được trống";
    if (!formData.department.trim())
      newErrors.department = "Điểm đi không được trống";
    if (!formData.arrival.trim())
      newErrors.arrival = "Điểm đến không được trống";
    if (!formData.time.trim()) newErrors.time = "Thời gian không được trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = () => {
    setFormData({
      name: "",
      department: "",
      arrival: "",
      time: "",
      busId: "",
      stops: [],
    });
    setErrors({});
    setIsEdit(false);
    setEditingId(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const stopsPayload = Array.isArray(formData.stops)
        ? formData.stops.map((sid, idx) => ({
            stopId: sid,
            order: idx + 1,
            estimatedArrivalTime: "",
          }))
        : [];

      const payload = { ...formData, stops: stopsPayload };

      if (isEdit && editingId) {
        const res = await axios.put(`${API_BASE}/routes/${editingId}`, payload);
        setRoutes(routes.map((r) => (r._id === res.data._id ? res.data : r)));
        setSuccessMsg("Cập nhật tuyến đường thành công");
      } else {
        const res = await axios.post(`${API_BASE}/routes`, payload);
        setRoutes([...routes, res.data]);
        setSuccessMsg("Thêm tuyến đường thành công");
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setServerError("Lưu tuyến đường thất bại");
    }
  };

  const handleEdit = (route) => {
    setFormData({
      name: route.name || "",
      department: route.department || "",
      arrival: route.arrival || "",
      time: route.time || "",
      busId: route.busId?._id || route.busId || "",
      stops: Array.isArray(route.stops)
        ? route.stops.map((s) => (s && s.stopId ? (s.stopId._id || s.stopId) : s))
        : [],
    });
    setErrors({});
    setIsEdit(true);
    setEditingId(route._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa tuyến đường này không?")) return;
    try {
      await axios.delete(`${API_BASE}/routes/${id}`);
      setRoutes(routes.filter((r) => r._id !== id));
      setSuccessMsg("Xóa tuyến đường thành công");
    } catch (err) {
      console.error(err);
      setServerError("Xóa tuyến đường thất bại");
    }
  };

  const handleChange = (e) => {
    const { name, value, options, type } = e.target;
    if (type === "select-multiple") {
      const selected = Array.from(options)
        .filter((opt) => opt.selected)
        .map((opt) => opt.value);
      setFormData({ ...formData, [name]: selected });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">🚌 Quản lý tuyến đường</h5>
              <button className="btn btn-light btn-sm" onClick={handleAddClick}>
                ➕ Thêm tuyến
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
                    className="spinner-border text-success"
                    role="status"
                  ></div>
                </div>
              ) : routes.length === 0 ? (
                <p className="text-center text-muted mt-3">
                  Chưa có tuyến đường nào.
                </p>
              ) : (
                <table className="table table-striped align-middle text-center">
                  <thead className="table-success">
                    <tr>
                      <th>#</th>
                      <th>Tên tuyến</th>
                      <th>Điểm đi</th>
                      <th>Điểm đến</th>
                      <th>Thời gian</th>
                      <th>Bus</th>
                      <th>Điểm dừng</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center text-muted">
                          Chưa có tuyến đường nào.
                        </td>
                      </tr>
                    ) : (
                      routes.map((r, idx) => {
                        const routeStops = Array.isArray(r.stops)
                          ? r.stops.map((item) => {
                              // item might be an id string or an object { stopId: <id> }
                              const sid =
                                item && item.stopId
                                  ? item.stopId._id || item.stopId
                                  : item;
                              const stop = stops.find((st) => st._id === sid);
                              return stop
                                ? `${stop.name} (${stop.address})`
                                : "-";
                            })
                          : [];

                        return (
                          <tr key={r._id}>
                            <td>{idx + 1}</td>
                            <td>{r.name}</td>
                            <td>{r.department}</td>
                            <td>{r.arrival}</td>
                            <td>{r.time}</td>
                            <td>{r.busId?.plateNumber || "-"}</td>
                            <td>
                              {routeStops.length > 0 ? (
                                <ul className="list-unstyled mb-0">
                                  {routeStops.map((s, i) => (
                                    <li key={i}>{s}</li>
                                  ))}
                                </ul>
                              ) : (
                                "-"
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => handleEdit(r)}
                              >
                                ✏️ Sửa
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(r._id)}
                              >
                                🗑️ Xóa
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
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
                  {isEdit ? "Chỉnh sửa tuyến" : "Thêm tuyến mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {["name", "department", "arrival", "time"].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label fw-semibold">
                      {
                        {
                          name: "Tên tuyến",
                          department: "Điểm đi",
                          arrival: "Điểm đến",
                          time: "Thời gian",
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

                {/* Stops multi-select */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Điểm dừng</label>
                  <div
                    className="mb-3"
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      border: "1px solid #ced4da",
                      borderRadius: "0.25rem",
                      padding: "0.5rem",
                    }}
                  >
                    {stops.map((s) => (
                      <div className="form-check" key={s._id}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={s._id}
                          id={`stop-${s._id}`}
                          checked={formData.stops.includes(s._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                stops: [...formData.stops, s._id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                stops: formData.stops.filter(
                                  (id) => id !== s._id
                                ),
                              });
                            }
                          }}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`stop-${s._id}`}
                        >
                          {s.name} ({s.address})
                        </label>
                      </div>
                    ))}
                  </div>
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

export default RouteManagement;
