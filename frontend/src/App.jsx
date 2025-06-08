import React from "react";
// import { Outlet } from 'react-router-dom'; // No longer needed directly here
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRoutes from "./routes/AppRoutes"; // Import your AppRoutes

const App = () => {
  return (
    <>
      <ToastContainer />
      {/* AppRoutes will handle the routing and rendering of layouts */}
      <AppRoutes />
    </>
  );
};

export default App;
