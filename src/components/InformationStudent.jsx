import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
// Thêm Bootstrap CSS nếu chưa có
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function InformationStudent() {
  const [students, setStudents] = useState([]);
  // Không cần buses, routes nữa
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // CẬP NHẬT formData cho phù hợp với studentSchema
  const [formData, setFormData] = useState({
    _id: null, // Dùng _id thay vì id
    name: "",
    old: "", // Trường tuổi
    classstudent: "", // Trường lớp
    parent: "", // Sử dụng cho parentId
  });
  const [errors, setErrors] = useState({});
  const [modalSaving, setModalSaving] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchStudents();
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      // Chỉ cần lấy Parents
      const parentRes = await axios.get(`${API_BASE}/parents`);
      setParents(parentRes.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu phụ huynh:", err);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await axios.get(`${API_BASE}/students`);
      setStudents(res.data || []);
    } catch (err) {
      console.error("Lỗi khi tải danh sách học sinh:", err);
      setServerError("Không thể tải danh sách học sinh");
    } finally {
      setLoading(false);
    }
  };

  // CẬP NHẬT Validate
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Họ tên bắt buộc";

    if (!formData.old) newErrors.old = "Tuổi bắt buộc";
    else if (isNaN(Number(formData.old)) || Number(formData.old) <= 0)
      newErrors.old = "Tuổi phải là số dương";

    if (!formData.classstudent.trim())
      newErrors.classstudent = "Lớp học bắt buộc";

    if (!formData.parent) newErrors.parent = "Chọn phụ huynh";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = () => {
    // CẬP NHẬT formData
    setFormData({
      _id: null,
      name: "",
      old: "",
      classstudent: "",
      parent: "",
    });
    setErrors({});
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEdit = (student) => {
    // CẬP NHẬT handleEdit
    setFormData({
      _id: student._id,
      name: student.name || "",
      old: student.old || "",
      classstudent: student.classstudent || "",
      // Lấy _id của parent để đưa vào form
      parent: student.parentId?._id || student.parentId || "",
    });
    setErrors({});
    setIsEdit(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!validate()) return;
    setModalSaving(true);

    // CẬP NHẬT Payload: Chỉ bao gồm các trường trong studentSchema
    const payload = {
      name: formData.name,
      old: Number(formData.old),
      classstudent: formData.classstudent,
      parentId: formData.parent, // Đổi tên từ 'parent' thành 'parentId' khi gửi lên server
    };

    try {
      if (isEdit) {
        const res = await axios.put(
          `${API_BASE}/students/${formData._id}`,
          payload
        );
        // Sau khi lưu, gọi lại fetchStudents để đảm bảo data hiển thị đúng (bao gồm populate)
        fetchStudents();
      } else {
        const res = await axios.post(`${API_BASE}/students`, payload);
        // Sau khi tạo, gọi lại fetchStudents để đảm bảo data hiển thị đúng (bao gồm populate)
        fetchStudents();
      }
      setShowModal(false);
      setServerError(null);
    } catch (err) {
      console.error("Lỗi khi lưu học sinh:", err);
      const errorMsg = err.response?.data?.message || "Lưu học sinh thất bại";
      setServerError(errorMsg);
    } finally {
      setModalSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này không?")) return;
    try {
      await axios.delete(`${API_BASE}/students/${id}`);
      setStudents(students.filter((s) => s._id !== id));
      setServerError(null);
    } catch (err) {
      console.error("Lỗi khi xóa học sinh:", err);
      setServerError("Xóa học sinh thất bại");
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
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">👨‍🎓 Quản lý học sinh</h5>
              <button className="btn btn-light btn-sm" onClick={handleAddClick}>
                ➕ Thêm học sinh
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
              ) : students.length === 0 ? (
                <p className="text-center text-muted mt-3">
                  Không có học sinh nào.
                </p>
              ) : (
                <table className="table table-striped align-middle text-center">
                  <thead className="table-primary">
                    <tr>
                      <th>#</th>
                      <th>Họ tên</th>
                      <th>Tuổi</th>
                      <th>Lớp học</th>
                      <th>Phụ huynh</th>
                      {/* Bỏ các cột Mã học sinh, Email, Điện thoại, Địa chỉ, Tuyến, Xe buýt */}
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s._id}>
                        <td>{i + 1}</td>
                        <td>{s.name}</td>
                        <td>{s.old}</td>
                        <td>{s.classstudent}</td>
                        {/* Giả định server trả về student.parentId đã được populate thành object Parent */}
                        <td>{s.parentId?.name || s.parent?.name || "—"}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEdit(s)}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(s._id)}
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
                  {isEdit ? "Chỉnh sửa học sinh" : "Thêm học sinh mới"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Họ tên</label>
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

                {/* Old (Tuổi) */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tuổi</label>
                  <input
                    type="number"
                    className={`form-control ${errors.old ? "is-invalid" : ""}`}
                    name="old"
                    value={formData.old}
                    onChange={handleChange}
                    min="1"
                  />
                  {errors.old && (
                    <div className="invalid-feedback">{errors.old}</div>
                  )}
                </div>

                {/* ClassStudent (Lớp học) */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Lớp học</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.classstudent ? "is-invalid" : ""
                    }`}
                    name="classstudent"
                    value={formData.classstudent}
                    onChange={handleChange}
                  />
                  {errors.classstudent && (
                    <div className="invalid-feedback">
                      {errors.classstudent}
                    </div>
                  )}
                </div>

                {/* Select Parent (parentId) */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Phụ huynh</label>
                  <select
                    name="parent"
                    className={`form-select ${
                      errors.parent ? "is-invalid" : ""
                    }`}
                    value={formData.parent}
                    onChange={handleChange}
                  >
                    <option value="">-- Chọn phụ huynh --</option>
                    {parents.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.email})
                      </option>
                    ))}
                  </select>
                  {errors.parent && (
                    <div className="invalid-feedback">{errors.parent}</div>
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
                <button
                  className="btn btn-primary"
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

export default InformationStudent;
