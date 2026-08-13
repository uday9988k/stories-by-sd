import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import "../css/layout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="admin-main">
        <Topbar />

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
