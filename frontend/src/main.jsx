// frontend/src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import  AppRoutes  from "./routes/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // IMPORTANT: Import AuthProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      {" "}
      {/* Wrap your entire app with AuthProvider */}
      <CartProvider>
        {" "}
        {/* Wrap the routing and other components with CartProvider */}
        <AppRoutes /> {/* Your main routing component */}
        <ToastContainer />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
