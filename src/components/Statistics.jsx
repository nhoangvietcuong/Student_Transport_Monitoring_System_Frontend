import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Statistics() {
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [stats, setStats] = useState([]); // [{ driverName, month, trips }]
  const [topDriver, setTopDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const [monthRes, topRes] = await Promise.all([
          axios.get(`${API_BASE}/statistics/month/${selectedMonth}`),
          axios.get(`${API_BASE}/statistics/top/${selectedMonth}`),
        ]);

        setStats(Array.isArray(monthRes.data) ? monthRes.data : []);
        // topRes may return an object with driverName/trips or a message
        if (topRes.data && topRes.data.driverName) setTopDriver(topRes.data);
        else setTopDriver(null);
      } catch (err) {
        console.error("Error loading statistics:", err);
        const msg = err?.response?.data?.message || "Không thể tải thống kê";
        setError(msg);
        setStats([]);
        setTopDriver(null);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [selectedMonth]);

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

      <div
        className="d-flex flex-grow-1"
        style={{ width: "100%", height: "calc(100vh - 120px)" }}
      >
        {/* Sidebar */}
        <div
          style={{
            width: "230px",
            backgroundColor: "#fff",
            borderRight: "1px solid #dee2e6",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-grow-1 bg-light p-4 overflow-auto">
          <div
            className="card shadow border-0 mx-auto"
            style={{ maxWidth: "1200px", width: "100%" }}
          >
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📊 Thống kê tài xế</h5>
              <div className="d-flex align-items-center">
                <label className="me-2 fw-semibold">Chọn tháng:</label>
                <select
                  className="form-select form-select-sm w-auto"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="card-body">
              <h5 className="fw-bold text-secondary mb-3">
                Danh sách số chuyến theo tháng {selectedMonth}:
              </h5>

              {loading ? (
                <div className="text-center my-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : stats.length === 0 ? (
                <div className="alert alert-warning">
                  Không có dữ liệu cho tháng {selectedMonth}.
                </div>
              ) : (
                <>
                  <table className="table table-striped align-middle text-center">
                    <thead className="table-primary">
                      <tr>
                        <th>#</th>
                        <th>Tài xế</th>
                        <th>Số chuyến</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.map((d, index) => (
                        <tr key={`${d.driverName ?? "driver"}-${index}`}>
                          <td>{index + 1}</td>
                          <td>{d.driverName || "(Chưa rõ)"}</td>
                          <td>{d.trips ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {topDriver ? (
                    <div className="alert alert-success mt-4">
                      🚍 <b>{topDriver.driverName}</b> là bác tài chạy nhiều
                      nhất trong tháng <b>{selectedMonth}</b> với{" "}
                      <b>{topDriver.trips}</b> chuyến.
                    </div>
                  ) : (
                    <div className="alert alert-warning mt-4">
                      Không có dữ liệu top cho tháng {selectedMonth}.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
