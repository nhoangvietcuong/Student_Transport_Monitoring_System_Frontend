import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

function Statistics() {
  const sampleData = [
    { name: "Nguyễn Văn A", month: 1, trips: 15 },
    { name: "Nguyễn Văn A", month: 2, trips: 20 },
    { name: "Trần Thị B", month: 1, trips: 22 },
    { name: "Trần Thị B", month: 2, trips: 18 },
    { name: "Lê Văn C", month: 1, trips: 10 },
    { name: "Lê Văn C", month: 2, trips: 25 },
  ];

  const [selectedMonth, setSelectedMonth] = useState(1);
  const filteredData = sampleData.filter((d) => d.month === selectedMonth);
  const topDriver =
    filteredData.length > 0
      ? filteredData.reduce((max, curr) =>
          curr.trips > max.trips ? curr : max
        )
      : null;

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
          <div className="card shadow border-0 mx-auto" style={{ maxWidth: "1200px" }}>
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

              <table className="table table-striped align-middle text-center">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Tài xế</th>
                    <th>Số chuyến</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((d, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{d.name}</td>
                      <td>{d.trips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {topDriver ? (
                <div className="alert alert-success mt-4">
                  🚍 <b>{topDriver.name}</b> là bác tài chạy nhiều nhất trong tháng{" "}
                  <b>{selectedMonth}</b> với <b>{topDriver.trips}</b> chuyến.
                </div>
              ) : (
                <div className="alert alert-warning mt-4">
                  Không có dữ liệu cho tháng {selectedMonth}.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
