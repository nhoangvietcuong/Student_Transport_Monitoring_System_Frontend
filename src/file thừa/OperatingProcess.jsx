import Header from "../components/Header";
import Navbar from "./Navbar";
import StudentCard from "./StudentCard";

function OperatingProcess() {
  return (
    <div
      className="bg-white"
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflowX: "hidden",
      }}
    >
      <Header />
      <Navbar />
      <div style={{ width: "100%", margin: 0, padding: "0 20px" }}>
        <StudentCard />
      </div>
    </div>
  );
}

export default OperatingProcess;
