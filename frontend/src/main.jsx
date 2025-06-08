// frontend/src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AppRoutes } from "./routes/AppRoutes.jsx"; // Assuming AppRoutes is a named export or default export
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext.jsx"; // <<< ADD THIS LINE: Import CartProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      {" "}
      {/* <<< ADD THIS LINE: Wrap with CartProvider */}
      <AppRoutes /> {/* Your main routing component */}
      <ToastContainer />
    </CartProvider>{" "}
    {/* <<< ADD THIS LINE: Close CartProvider */}
  </React.StrictMode>
);
