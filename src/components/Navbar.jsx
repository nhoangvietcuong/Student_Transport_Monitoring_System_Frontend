import React from "react";

function Navbar() {
  const menuItems = ["Trang chủ", "Tuyến xe", "Lịch sử", "Tin nhắn"];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
          {menuItems.map((item, i) => (
            <li className="nav-item" key={i}>
              <a href="#" className="nav-link fw-semibold">
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
