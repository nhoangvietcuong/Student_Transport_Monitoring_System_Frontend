import Header from "./Header";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function InformationStudent() {
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

      {/* Navbar */}
      <Navbar />

      {/* Layout chính */}
      <div
        className="d-flex flex-grow-1"
        style={{
          width: "100%",
          height: "calc(100vh - 120px)", // trừ phần header + navbar
        }}
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
            <div className="card-header bg-primary text-white fw-bold">
              Student Information
            </div>
            <div className="card-body">
              <form>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nguyen Van A"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Student ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="STU12345"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="+84 123 456 789"
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="123 Nguyen Trai, District 1, HCM"
                    />
                  </div>
                </div>

                <div className="text-end">
                  <button type="button" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InformationStudent;
