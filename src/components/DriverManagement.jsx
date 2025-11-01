import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function DriverManagement() {
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      license: "B2-12345",
      phone: "0909123456",
      email: "driverA@example.com",
      experience: 5,
    },
    {
      id: 2,
      name: "Trần Thị B",
      license: "C-54321",
      phone: "0912345678",
      email: "driverB@example.com",
      experience: 3,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    license: "",
    phone: "",
    email: "",
    experience: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên tài xế không được trống";
    if (!formData.license.trim())
      newErrors.license = "Số giấy phép lái xe không được trống";
    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại không được trống";
    else if (!/^[0-9]{9,11}$/.test(formData.phone))
      newErrors.phone = "Số điện thoại không hợp lệ";
    if (!formData.email.trim()) newErrors.email = "Email không được trống";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.experience)
      newErrors.experience = "Số năm kinh nghiệm không được trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = () => {
    setFormData({
      id: null,
      name: "",
      license: "",
      phone: "",
      email: "",
      experience: "",
    });
    setIsEdit(false);
    setErrors({});
    setShowModal(true);
  };

  const handleSave = () => {
    if (validate()) {
      if (isEdit) {
        setDrivers(
          drivers.map((d) => (d.id === formData.id ? formData : d))
        );
      } else {
        setDrivers([...drivers, { ...formData, id: Date.now() }]);
      }
      setShowModal(false);
    }
  };

  const handleEdit = (driver) => {
    setFormData(driver);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa tài xế này không?")) {
      setDrivers(drivers.filter((d) => d.id !== id));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

        {/* Main content */}
        <div className="flex-grow-1 bg-light p-4 overflow-auto">
          <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: "1200px" }}>
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">🚍 Quản lý tài xế</h5>
              <button className="btn btn-light btn-sm" onClick={handleAddClick}>
                ➕ Thêm tài xế
              </button>
            </div>

            <div className="card-body">
              <table className="table table-striped align-middle text-center">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Họ tên</th>
                    <th>GPLX</th>
                    <th>Điện thoại</th>
                    <th>Email</th>
                    <th>Kinh nghiệm (năm)</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver, index) => (
                    <tr key={driver.id}>
                      <td>{index + 1}</td>
                      <td>{driver.name}</td>
                      <td>{driver.license}</td>
                      <td>{driver.phone}</td>
                      <td>{driver.email}</td>
                      <td>{driver.experience}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(driver)}
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(driver.id)}
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {drivers.length === 0 && (
                <p className="text-center text-muted mt-3">
                  Không có tài xế nào.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa tài xế */}
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
                {["name", "license", "phone", "email", "experience"].map(
                  (field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label fw-semibold">
                        {{
                          name: "Họ tên",
                          license: "GPLX",
                          phone: "Số điện thoại",
                          email: "Email",
                          experience: "Kinh nghiệm (năm)",
                        }[field]}
                      </label>
                      <input
                        type={field === "experience" ? "number" : "text"}
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
                  )
                )}
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
