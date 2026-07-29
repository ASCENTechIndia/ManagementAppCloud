

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; // adjust path as needed
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If no user or expired token → redirect to login
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) return <Navigate to="/" />;
  } catch (err) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
