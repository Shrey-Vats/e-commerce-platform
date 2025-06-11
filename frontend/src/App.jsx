// frontend/src/App.jsx
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppRoutes from "./routes/AppRoutes"; // Your main routing component

const App = () => {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {/* AppRoutes contains RouterProvider which renders your layouts and pages */}
      <AppRoutes />
    </>
  );
};

export default App;
