import React from "react";
import { Outlet } from "react-router-dom"; // For nested layouts
import { ToastContainer } from "react-toastify"; // For toast notifications
import "react-toastify/dist/ReactToastify.css"; // Toastify CSS

const App = () => {
  return (
    <>
      <ToastContainer /> {/* Where toast notifications will appear */}
      <main className="min-h-screen flex flex-col">
        {/* This Outlet will render components matched by react-router-dom */}
        <Outlet />
      </main>
    </>
  );
};

export default App;
