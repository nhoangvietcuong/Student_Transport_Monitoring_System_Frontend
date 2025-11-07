import Header from "./Header";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import axios from "axios";

function InformationStudent() {
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setServerError(null);
    setSuccessMsg(null);
    try {
      const res = await axios.get(`${API_BASE}/students`);
      setStudents(res.data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
      setServerError("Không thể tải danh sách học sinh");
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.studentId.trim())
      newErrors.studentId = "Student ID is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{9,11}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddClick = () => {
    setFormData({
      name: "",
      studentId: "",
      email: "",
      phone: "",
      address: "",
    });
    setErrors({});
    setIsEdit(false);
    setShowModal(true);
  };

  const handleSave = () => {
    if (!validate()) return;

    const payload = {
      name: formData.name,
      studentId: formData.studentId,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    };
    (async () => {
      setModalSaving(true);
      setServerError(null);
      setSuccessMsg(null);
      try {
        if (isEdit && formData.id) {
          const res = await axios.put(`${API_BASE}/students/${formData.id}`, payload);
          setStudents(students.map((s) => (s._id === res.data._id || s.id === res.data._id || s.id === formData.id ? res.data : s)));
          setSuccessMsg("Cập nhật học sinh thành công");
        } else {
          const res = await axios.post(`${API_BASE}/students`, payload);
          setStudents([...students, res.data]);
          setSuccessMsg("Thêm học sinh thành công");
        }
        setShowModal(false);
      } catch (err) {
        console.error("Error saving student:", err);
        const msg = err?.response?.data?.message || "Lưu học sinh thất bại";
        setServerError(msg);
      } finally {
        setModalSaving(false);
      }
    })();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure to delete this student?")) return;
    (async () => {
      setServerError(null);
      setSuccessMsg(null);
      try {
        await axios.delete(`${API_BASE}/students/${id}`);
        setStudents(students.filter((s) => s._id !== id && s.id !== id));
        setSuccessMsg("Xóa học sinh thành công");
      } catch (err) {
        console.error("Error deleting student:", err);
        const msg = err?.response?.data?.message || "Xóa học sinh thất bại";
        setServerError(msg);
      }
    })();
  };

  const handleEdit = (student) => {
    const id = student._id || student.id;
    setFormData({
      id,
      name: student.name || "",
      studentId: student.studentId || "",
      email: student.email || "",
      phone: student.phone || "",
      address: student.address || "",
    });
    setIsEdit(true);
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

        <div
          className="flex-grow-1 bg-light p-4 overflow-auto"
          style={{ minHeight: "100%" }}
        >
          <div
            className="card shadow-sm border-0 mx-auto"
            style={{ maxWidth: "1200px" }}
          >
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <span className="fw-bold">Quản lí học sinh</span>
              <button
                className="btn btn-light btn-sm"
                onClick={handleAddClick}
              >
                ➕ Add Student
              </button>
            </div>

            <div className="card-body">
              {serverError && (
                <div className="alert alert-danger" role="alert">
                  {serverError}
                </div>
              )}
              {successMsg && (
                <div className="alert alert-success" role="alert">
                  {successMsg}
                </div>
              )}

              {loading ? (
                <div className="text-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                students.length === 0 ? (
                  <p className="text-center text-muted mt-3">No students found.</p>
                ) : (
                  <table className="table table-striped align-middle">
                    <thead className="table-primary">
                      <tr>
                        <th>#</th>
                        <th>Full Name</th>
                        <th>Student ID</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => {
                        const id = student._id || student.id;
                        return (
                          <tr key={id}>
                            <td>{index + 1}</td>
                            <td>{student.name}</td>
                            <td>{student.studentId}</td>
                            <td>{student.email}</td>
                            <td>{student.phone}</td>
                            <td>{student.address}</td>
                            <td>
                              <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() => handleEdit(student)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(id)}
                              >
                                🗑️ Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )
              )}

              {students.length === 0 && (
                <p className="text-center text-muted mt-3">
                  No students found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Add Student */}
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
                <h5 className="modal-title">{isEdit ? "Chỉnh sửa học sinh" : "Thêm học sinh mới"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {["name", "studentId", "email", "phone", "address"].map(
                  (field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
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
                  )
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={modalSaving}
                >
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={modalSaving}>
                  {modalSaving && (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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

export default InformationStudent;
