import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState } from "react";

function BusManagement() {
  const [buses, setBuses] = useState([
    {
      id: 1,
      busNumber: "51B-12345",
      driver: "Nguyễn Văn A",
      capacity: 40,
      route: "Tuyến 1 - Quận 1 đến Quận 9",
      status: "Đang hoạt động",
    },
    {
      id: 2,
      busNumber: "51C-67890",
      driver: "Trần Thị B",
      capacity: 35,
      route: "Tuyến 2 - Bình Thạnh đến Thủ Đức",
      status: "Bảo trì",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    busNumber: "",
    driver: "",
    capacity: "",
    route: "",
    status: "Đang hoạt động",
  });
  const [errors, setErrors] = useState({});

  // ✅ Kiểm tra dữ liệu form
  const validate = () => {
    const newErrors = {};
    if (!formData.busNumber.trim()) newErrors.busNumber = "Biển số xe là bắt buộc";
    if (!formData.driver.trim()) newErrors.driver = "Tên tài xế là bắt buộc";
    if (!formData.capacity || isNaN(formData.capacity) || formData.capacity <= 0)
      newErrors.capacity = "Sức chứa phải là số dương";
    if (!formData.route.trim()) newErrors.route = "Tuyến đường là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Mở popup thêm mới
  const handleAddClick = () => {
    setFormData({
      busNumber: "",
      driver: "",
      capacity: "",
      route: "",
      status: "Đang hoạt động",
    });
    setErrors({});
    setShowModal(true);
  };

  // ✅ Lưu xe bus mới
  const handleSave = () => {
    if (validate()) {
      const newBus = {
        id: Date.now(),
        ...formData,
      };
      setBuses([...buses, newBus]);
      setShowModal(false);
    }
  };

  // ✅ Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Xóa xe bus
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa xe bus này không?")) {
      setBuses(buses.filter((bus) => bus.id !== id));
    }
  };

  // ✅ Sửa xe bus (demo)
  const handleEdit = (id) => {
    alert(`Chức năng sửa xe bus ID: ${id} đang được phát triển`);
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
                  {buses.map((bus, index) => (
                    <tr key={bus.id}>
                      <td>{index + 1}</td>
                      <td>{bus.busNumber}</td>
                      <td>{bus.driver}</td>
                      <td>{bus.capacity}</td>
                      <td>{bus.route}</td>
                      <td>
                        <span
                          className={`badge ${
                            bus.status === "Đang hoạt động"
                              ? "bg-success"
                              : bus.status === "Bảo trì"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {bus.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(bus.id)}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(bus.id)}
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
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

                {/* Tài xế */}
                <div className="mb-3">
                  <label className="form-label">Tên tài xế</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.driver ? "is-invalid" : ""
                    }`}
                    name="driver"
                    value={formData.driver}
                    onChange={handleChange}
                  />
                  {errors.driver && (
                    <div className="invalid-feedback">{errors.driver}</div>
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
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Bảo trì">Bảo trì</option>
                    <option value="Ngưng hoạt động">Ngưng hoạt động</option>
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

export default BusManagement;
