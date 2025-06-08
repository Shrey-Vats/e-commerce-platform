import { Outlet } from "react-router-dom";

const AdminRoute = () => {
  // Authentication logic will go here
  // For now, it just passes through
  return <Outlet />;
};

export default AdminRoute;
