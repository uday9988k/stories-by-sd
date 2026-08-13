import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaImages,
  FaPlusCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import Logo from "../../images/logo.png";
import "../css/sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="sidebar">
      {/* Logo / Brand */}
      <div className="sidebar-brand">
        <img src={Logo} alt="Satyadeva Photography" className="sidebar-logo" />
        <h2 className="brand-name">Satyadeva</h2>
        <span className="brand-subtitle">Photography</span>
        <div className="brand-divider" />
      </div>

      {/* Navigation */}
      <nav className="sidebar-menu">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaTachometerAlt className="menu-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/stories"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaImages className="menu-icon" />
          <span>Wedding Stories</span>
        </NavLink>

        <NavLink
          to="/admin/stories/add"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaPlusCircle className="menu-icon" />
          <span>Add Story</span>
        </NavLink>

        <NavLink
          to="/admin/contact-enquiries"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          <FaImages className="menu-icon" />
          <span>Contact Enquiries</span>
        </NavLink>
      </nav>

      {/* Logout */}
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt className="menu-icon" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
