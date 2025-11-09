import Header from "./Header"; // Giả sử bạn có component Header
import Sidebar from "./Sidebar"; // Giả sử bạn có component Sidebar
import { useState, useEffect } from "react";
import axios from "axios";

// Giả định bạn có component LoadingIndicator hoặc Alert
// Bạn cần cài đặt Bootstrap CSS/JS cho giao diện này
function StopManagement() {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Thêm state cho chức năng tìm kiếm gần nhất
  const [nearbyResults, setNearbyResults] = useState([]);
  const [nearbyCoords, setNearbyCoords] = useState({
    lng: 106.67,
    lat: 10.8,
    distance: 5000,
  }); // Tọa độ mặc định và khoảng cách (mét)

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchStops();
  }, []);

  // ✅ 1. Tải danh sách điểm dừng
  const fetchStops = async () => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await axios.get(`${API_BASE}/stops`);
      setStops(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching stops:", err);
      setServerError("Không thể tải danh sách điểm dừng");
    } finally {
      setLoading(false);
    }
  };

  // State cho Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    lng: "", // Kinh độ (Longitude)
    lat: "", // Vĩ độ (Latitude)
  });
  const [errors, setErrors] = useState({});

  // ✅ 2. Kiểm tra dữ liệu form
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim())
      newErrors.name = "Tên điểm dừng không được trống";
    if (!formData.address.trim())
      newErrors.address = "Địa chỉ không được trống";

    const lng = Number(formData.lng);
    const lat = Number(formData.lat);

    if (isNaN(lng) || lng < -180 || lng > 180)
      newErrors.lng = "Kinh độ không hợp lệ";
    if (isNaN(lat) || lat < -90 || lat > 90)
      newErrors.lat = "Vĩ độ không hợp lệ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ 3. Mở modal thêm mới
  const handleAddClick = () => {
    setFormData({ name: "", address: "", lng: "", lat: "" });
    setErrors({});
    setIsEdit(false);
    setEditingId(null);
    setShowModal(true);
  };

  // ✅ 4. Lưu (thêm hoặc cập nhật)
  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      name: formData.name,
      address: formData.address,
      location: {
        type: "Point",
        coordinates: [Number(formData.lng), Number(formData.lat)], // [Lng, Lat]
      },
    };

    try {
      setModalSaving(true);
      if (isEdit && editingId) {
        // Cập nhật
        await axios.put(`${API_BASE}/stops/${editingId}`, payload);
        setSuccessMsg("Cập nhật điểm dừng thành công");
      } else {
        // Thêm mới
        await axios.post(`${API_BASE}/stops`, payload);
        setSuccessMsg("Thêm điểm dừng thành công");
      }
      setShowModal(false);
      await fetchStops();
    } catch (err) {
      console.error("Error saving stop:", err);
      setServerError(err?.response?.data?.message || "Lưu điểm dừng thất bại");
    } finally {
      setModalSaving(false);
    }
  };

  // ✅ 5. Thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ 6. Xóa điểm dừng
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa điểm dừng này không?")) return;
    try {
      await axios.delete(`${API_BASE}/stops/${id}`);
      setSuccessMsg("Xóa điểm dừng thành công");
      await fetchStops();
    } catch (err) {
      console.error("Error deleting stop:", err);
      setServerError("Xóa điểm dừng thất bại");
    }
  };

  // ✅ 7. Sửa điểm dừng
  const handleEdit = (stop) => {
    setFormData({
      name: stop.name || "",
      address: stop.address || "",
      // Lấy tọa độ từ GeoJSON Point: [lng, lat]
      lng: stop.location?.coordinates[0] || "",
      lat: stop.location?.coordinates[1] || "",
    });
    setErrors({});
    setIsEdit(true);
    setEditingId(stop._id);
    setShowModal(true);
  };

  // 🌍 Chức năng tìm kiếm gần nhất
  const handleNearbySearch = async () => {
    setServerError(null);
    if (!nearbyCoords.lng || !nearbyCoords.lat) {
      setServerError("Vui lòng nhập đầy đủ kinh độ và vĩ độ để tìm kiếm.");
      return;
    }

    // API endpoint: /api/stops/nearby?lng=...&lat=...&maxDistance=...
    const url = `${API_BASE}/stops/nearby?lng=${nearbyCoords.lng}&lat=${nearbyCoords.lat}&maxDistance=${nearbyCoords.distance}`;
    try {
      const res = await axios.get(url);
      setNearbyResults(res.data);
    } catch (err) {
      console.error("Error fetching nearby stops:", err);
      setServerError("Không thể tìm kiếm điểm dừng gần nhất.");
      setNearbyResults([]);
    }
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
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <span className="fw-bold">📍 Quản lý Điểm Dừng</span>
              <button className="btn btn-light btn-sm" onClick={handleAddClick}>
                ➕ Thêm Điểm Dừng
              </button>
            </div>

            <div className="card-body">
              {/* Vị trí thông báo */}
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              {successMsg && (
                <div className="alert alert-success">{successMsg}</div>
              )}

              {/* Vùng tìm kiếm gần nhất */}
              <div className="border p-3 mb-4 rounded bg-light">
                <h6 className="text-success">Tìm kiếm Điểm dừng Gần nhất</h6>
                <div className="row g-2">
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Kinh độ (Lng)"
                      value={nearbyCoords.lng}
                      onChange={(e) =>
                        setNearbyCoords({
                          ...nearbyCoords,
                          lng: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Vĩ độ (Lat)"
                      value={nearbyCoords.lat}
                      onChange={(e) =>
                        setNearbyCoords({
                          ...nearbyCoords,
                          lat: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Khoảng cách tối đa (mét)"
                      value={nearbyCoords.distance}
                      onChange={(e) =>
                        setNearbyCoords({
                          ...nearbyCoords,
                          distance: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-sm btn-outline-success w-100"
                      onClick={handleNearbySearch}
                    >
                      🔎 Tìm Kiếm
                    </button>
                  </div>
                </div>

                {/* Hiển thị kết quả tìm kiếm gần nhất */}
                {nearbyResults.length > 0 && (
                  <div className="mt-3">
                    <p className="fw-bold mb-1">
                      Kết quả ({nearbyResults.length} điểm):
                    </p>
                    <ul className="list-group list-group-flush small">
                      {nearbyResults.map((stop) => (
                        <li
                          key={stop._id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {stop.name} ({stop.address})
                          <span className="badge bg-info text-dark">
                            {stop.dist?.calculated
                              ? (stop.dist.calculated / 1000).toFixed(2)
                              : "N/A"}{" "}
                            km
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {nearbyResults.length === 0 && (
                  <p className="text-muted small mt-2">
                    Chưa có kết quả tìm kiếm gần nhất.
                  </p>
                )}
              </div>

              {loading ? (
                // Hiển thị Loading
                <div className="text-center my-4">
                  <div
                    className="spinner-border text-success"
                    role="status"
                  ></div>
                </div>
              ) : (
                // Bảng dữ liệu chính
                <table className="table table-striped align-middle">
                  <thead className="table-success">
                    <tr>
                      <th>#</th>
                      <th>Tên Điểm Dừng</th>
                      <th>Địa chỉ</th>
                      <th>Kinh độ (Lng)</th>
                      <th>Vĩ độ (Lat)</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stops.map((stop, index) => {
                      const [lng, lat] = stop.location?.coordinates || [
                        "N/A",
                        "N/A",
                      ];
                      return (
                        <tr key={stop._id}>
                          <td>{index + 1}</td>
                          <td>{stop.name}</td>
                          <td>{stop.address}</td>
                          <td>{lng}</td>
                          <td>{lat}</td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => handleEdit(stop)}
                            >
                              ✏️ Sửa
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(stop._id)}
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

              {!loading && stops.length === 0 && (
                <p className="text-center text-muted mt-3">
                  Không có điểm dừng nào.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa điểm dừng */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  {isEdit ? "Chỉnh sửa Điểm Dừng" : "Thêm Điểm Dừng"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {/* Tên Điểm Dừng */}
                <div className="mb-3">
                  <label className="form-label">Tên Điểm Dừng</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                {/* Địa chỉ */}
                <div className="mb-3">
                  <label className="form-label">Địa chỉ</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.address ? "is-invalid" : ""
                    }`}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {errors.address && (
                    <div className="invalid-feedback">{errors.address}</div>
                  )}
                </div>

                {/* Tọa độ (Lng, Lat) */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Kinh độ (Longitude)</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.lng ? "is-invalid" : ""
                      }`}
                      name="lng"
                      value={formData.lng}
                      onChange={handleChange}
                      step="any"
                    />
                    {errors.lng && (
                      <div className="invalid-feedback">{errors.lng}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Vĩ độ (Latitude)</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.lat ? "is-invalid" : ""
                      }`}
                      name="lat"
                      value={formData.lat}
                      onChange={handleChange}
                      step="any"
                    />
                    {errors.lat && (
                      <div className="invalid-feedback">{errors.lat}</div>
                    )}
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
                <button
                  className="btn btn-success"
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

export default StopManagement;
