import React from "react";
import { Outlet } from "react-router-dom"; // Renders the matched child route
import Navbar from "../components/Navbar"; // Will be created soon
import Footer from "../components/Footer"; // Will be created soon

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Your main navigation bar */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />{" "}
        {/* This is where your page components (e.g., Home, ProductDetails) will render */}
      </main>
      <Footer /> {/* Your site-wide footer */}
    </div>
  );
};

export default MainLayout;
