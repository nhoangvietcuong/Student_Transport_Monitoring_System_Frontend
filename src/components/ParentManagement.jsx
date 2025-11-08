import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

// Giả định: Backend có endpoint /users/parents để lấy danh sách User có thể làm Parent
function ParentManagement() {
  const [parents, setParents] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]); // State mới cho danh sách User
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Cập nhật formData: Bỏ password, thêm userId
  const [formData, setFormData] = useState({
    _id: null,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "Nam",
    occupation: "",
    passportNumber: "",
    userId: "", // Trường để chọn User ID có sẵn
  });
  const [errors, setErrors] = useState({});
  const [modalSaving, setModalSaving] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchParents();
    fetchAvailableUsers(); // Gọi hàm mới để lấy danh sách User
  }, []);

  // HÀM MỚI: Tải danh sách User có thể gán làm Parent
  const fetchAvailableUsers = async () => {
    try {
      // Giả định API này trả về danh sách User có role thích hợp VÀ CHƯA ĐƯỢC GÁN cho Parent nào
      const res = await axios.get(`${API_BASE}/users`);
      setAvailableUsers(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách User:", err);
      // Bạn có thể thiết lập lỗi tại đây nếu cần
    }
  };

  const fetchParents = async () => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await axios.get(`${API_BASE}/parents`);
      setParents(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách phụ huynh:", err);
      setServerError("Không thể tải danh sách phụ huynh");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "Họ bắt buộc";
    if (!formData.lastName.trim()) newErrors.lastName = "Tên bắt buộc";

    // VALIDATE MỚI: Kiểm tra userId
    if (!formData.userId) newErrors.userId = "Phải chọn một User để liên kết";

    // ... (Các validate khác giữ nguyên)
    if (!formData.email.trim()) newErrors.email = "Email bắt buộc";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";

    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại bắt buộc";
    else if (!/^[0-9]{9,11}$/.test(formData.phone))
      newErrors.phone = "Số điện thoại không hợp lệ";

    if (!formData.address.trim()) newErrors.address = "Địa chỉ bắt buộc";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = () => {
    // Cập nhật reset formData
    setFormData({
      _id: null,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      gender: "Nam",
      occupation: "",
      passportNumber: "",
      userId: "", // Reset userId
    });
    setErrors({});
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (parent) => {
    // Cập nhật handleEdit: Lấy userId
    setFormData({
      _id: parent._id,
      firstName: parent.firstName || "",
      lastName: parent.lastName || "",
      email: parent.email || "",
      phone: parent.phone || "",
      address: parent.address || "",
      dateOfBirth: parent.dateOfBirth || "",
      gender: parent.gender || "Nam",
      occupation: parent.occupation || "",
      passportNumber: parent.passportNumber || "",
      // Lấy _id của User đã liên kết
      userId: parent.userId?._id || parent.userId || "",
    });
    setErrors({});
    setIsEdit(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validate()) return;
    setModalSaving(true);

    // Payload: Chỉ gửi userId lên cùng thông tin Parent
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      occupation: formData.occupation,
      passportNumber: formData.passportNumber,
      userId: formData.userId, // Gửi userId đã chọn
    };

    try {
      if (isEdit) {
        // Giả định backend cho phép sửa userId trong chế độ Edit
        await axios.put(`${API_BASE}/parents/${formData._id}`, payload);
      } else {
        await axios.post(`${API_BASE}/parents`, payload);
      }
      setShowModal(false);
      setServerError(null);
      fetchParents(); // Tải lại danh sách Parent
      fetchAvailableUsers(); // Tải lại danh sách User để cập nhật User đã bị gán
    } catch (err) {
      console.error("Lỗi khi lưu phụ huynh:", err);
      const errorMsg =
        err.response?.data?.message ||
        "Lưu phụ huynh thất bại (Kiểm tra Email/User ID đã tồn tại?)";
      setServerError(errorMsg);
    } finally {
      setModalSaving(false);
    }
  };

  // Các hàm handleDelete và handleChange giữ nguyên...
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Bạn có chắc muốn xóa phụ huynh này không? Hành động này có thể xóa cả tài khoản User liên kết."
      )
    )
      return;
    try {
      await axios.delete(`${API_BASE}/parents/${id}`);
      setParents(parents.filter((p) => p._id !== id));
      setServerError(null);
      fetchAvailableUsers(); // Tải lại User để User này trở thành Available
    } catch (err) {
      console.error("Lỗi khi xóa phụ huynh:", err);
      setServerError("Xóa phụ huynh thất bại");
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
              <h5 className="mb-0">👨‍👩‍👧 Quản lý phụ huynh</h5>
              <button className="btn btn-light btn-sm" onClick={handleAddClick}>
                ➕ Thêm phụ huynh
              </button>
            </div>
            <div className="card-body">
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              {loading ? (
                <div className="text-center my-4">
                  <div
                    className="spinner-border text-success"
                    role="status"
                  ></div>
                </div>
              ) : parents.length === 0 ? (
                <p className="text-center text-muted mt-3">
                  Không có phụ huynh nào.
                </p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped align-middle text-center">
                    <thead className="table-success">
                      <tr>
                        <th>#</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Điện thoại</th>
                        <th>User ID</th> {/* Thêm cột User ID */}
                        <th>Giới tính</th>
                        <th>Nghề nghiệp</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parents.map((p, i) => (
                        <tr key={p._id}>
                          <td>{i + 1}</td>
                          <td>{p.name}</td>
                          <td>{p.email}</td>
                          <td>{p.phone}</td>
                          {/* Hiển thị User ID/Email của User đã được liên kết */}
                          <td>{p.userId?.email || p.userId || "—"}</td>
                          <td>{p.gender}</td>
                          <td>{p.occupation || "—"}</td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => handleEdit(p)}
                            >
                              ✏️ Sửa
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(p._id)}
                            >
                              🗑️ Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  {isEdit
                    ? "Chỉnh sửa thông tin Phụ huynh"
                    : "Thêm Phụ huynh mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Lựa chọn User ID để gán */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    User ID Liên kết (*)
                  </label>
                  <select
                    name="userId"
                    className={`form-select ${
                      errors.userId ? "is-invalid" : ""
                    }`}
                    value={formData.userId}
                    onChange={handleChange}
                    // Nếu đang EDIT, cho phép chọn UserID đã liên kết hoặc từ danh sách AVAILABLE
                    disabled={
                      isEdit &&
                      !availableUsers.some((u) => u._id === formData.userId)
                    }
                  >
                    <option value="">-- Chọn User ID --</option>
                    {/* Nếu đang EDIT và User ID hiện tại chưa có trong danh sách available, thêm nó vào đầu */}
                    {isEdit &&
                      formData.userId &&
                      !availableUsers.some(
                        (u) => u._id === formData.userId
                      ) && (
                        <option key={formData.userId} value={formData.userId}>
                          **Đang gán:{" "}
                          {parents.find(
                            (p) =>
                              p.userId?._id === formData.userId ||
                              p.userId === formData.userId
                          )?.userId?.email || formData.userId}
                          **
                        </option>
                      )}
                    {availableUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.email} (ID: {user._id})
                      </option>
                    ))}
                  </select>
                  {errors.userId && (
                    <div className="invalid-feedback">{errors.userId}</div>
                  )}
                </div>
                <hr />

                <div className="row">
                  {/* First Name */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Họ</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.firstName ? "is-invalid" : ""
                      }`}
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback">{errors.firstName}</div>
                    )}
                  </div>
                  {/* Last Name */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Tên</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.lastName ? "is-invalid" : ""
                      }`}
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback">{errors.lastName}</div>
                    )}
                  </div>
                </div>

                <div className="row">
                  {/* Email (Giữ lại để lưu vào Parent document) */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Email (Chi tiết Parent)
                    </label>
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
                  {/* Phone */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Địa chỉ</label>
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

                <div className="row">
                  {/* Date of Birth */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Ngày sinh</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Gender */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Giới tính</label>
                    <select
                      className="form-select"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                  {/* Occupation */}
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">
                      Nghề nghiệp
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Passport Number */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Số hộ chiếu/CCCD (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                  />
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
                  {modalSaving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParentManagement;
