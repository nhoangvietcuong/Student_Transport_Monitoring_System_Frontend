import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import InformationStudent from "./components/InformationStudent";
import AccountManagement from "./components/AccountManagement";
import BusManagement from "./components/BusManagement";
import Statistics from "./components/Statistics";
import Login from "./components/Login";
import DriverManagement from "./components/DriverManagement";
import ParentManagement from "./components/ParentManagement";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route
              path="/login"
              element={<Login setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/students" />} />
            <Route path="/students" element={<InformationStudent />} />
            <Route path="/accounts" element={<AccountManagement />} />
            <Route path="/buses" element={<BusManagement />} />
            <Route path="/drivers" element={<DriverManagement />} />
            <Route path="/parents" element={<ParentManagement />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="*" element={<Navigate to="/students" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
