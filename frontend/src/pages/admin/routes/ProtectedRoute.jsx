import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Get token from localStorage
  const token = localStorage.getItem("adminToken");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Token exists, render protected pages
  return <Outlet />;
};

export default ProtectedRoute;
