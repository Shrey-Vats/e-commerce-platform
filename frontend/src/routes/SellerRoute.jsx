// frontend/src/routes/SellerRoute.jsx

import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Assuming you have a useAuth hook

const SellerRoute = () => {
  const { userInfo } = useAuth(); // Get user info from your AuthContext

  // If userInfo exists AND the user is a seller, render the child routes (<Outlet />)
  // Otherwise, redirect them to the login page (or homepage)
  return userInfo && userInfo.isSeller ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default SellerRoute;
