import { Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // Authentication logic will go here
  // For now, it just passes through
  return <Outlet />;
};

export default PrivateRoute;
