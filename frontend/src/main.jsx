// frontend/src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRoutes from "./routes/AppRoutes.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx"; // NEW: Import ThemeProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      {" "}
      {/* NEW: Outermost provider for theme */}
      <AuthProvider>
        {/* Wrap your entire app with AuthProvider */}
        <CartProvider>
          {/* Wrap the routing and other components with CartProvider */}
          <AppRoutes /> {/* Your main routing component */}
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
          {/* Moved ToastContainer inside here to be covered by ThemeProvider if needed, and added its standard props */}
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
