import React from "react";
import { useLocation } from "react-router-dom";
import "../css/topbar.css";

const Topbar = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/admin/dashboard") return "Dashboard";
    if (path === "/admin/stories") return "Wedding Stories";
    if (path === "/admin/stories/add") return "Add Wedding Story";
    if (path.startsWith("/admin/stories/edit")) return "Edit Wedding Story";

    return "Admin Panel";
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>{getPageTitle()}</h1>
        <p>Welcome to Satyadeva Photography Admin Panel</p>
      </div>

      <div className="topbar-right">
        <span>{today}</span>
      </div>
    </header>
  );
};

export default Topbar;
