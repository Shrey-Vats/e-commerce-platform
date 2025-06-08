import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoute = () => {
  const { userInfo } = useAuth(); // Get user info from context
  // Check if user is logged in AND is an admin
  return userInfo && userInfo.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminRoute;
