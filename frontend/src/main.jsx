import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Import your global CSS (including Tailwind base styles)
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      {" "}
      {/* Wrap your App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
