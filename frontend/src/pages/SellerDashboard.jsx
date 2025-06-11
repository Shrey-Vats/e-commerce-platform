// frontend/src/pages/SellerDashboard.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBox, FaPlus, FaTag, FaChartLine } from "react-icons/fa"; // Example icons
import useAuth from "../hooks/useAuth"; // Assuming you have useAuth for user info
import { useTheme } from "../context/ThemeContext"; // For dark mode
import axios from "axios";
import Loader from "../components/Loader"; // Assuming you have a Loader component

const SellerDashboard = () => {
  const { userInfo } = useAuth();
  const { theme } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // This is the API endpoint we set up in backend/routes/sellerRoutes.js
        const { data } = await axios.get("/api/sellers/dashboard");
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        toast.error(
          err.response?.data?.message || "Failed to fetch dashboard data."
        );
        setLoading(false);
      }
    };

    // Only fetch if user info is available and they are a seller
    if (userInfo && userInfo.isSeller) {
      fetchDashboardData();
    } else {
      setLoading(false); // If not a seller, stop loading state
      setError("Access Denied. You are not authorized as a seller.");
    }
  }, [userInfo]); // Re-run effect if userInfo changes

  // Display loader while data is being fetched
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-100"
        } transition-colors duration-300`}
      >
        <Loader />
      </div>
    );
  }

  // Display error message if there's an error or user is not a seller
  if (error || !userInfo || !userInfo.isSeller) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-6 ${
          theme === "dark"
            ? "bg-gray-800 text-red-400"
            : "bg-gray-100 text-red-600"
        } transition-colors duration-300`}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>
            {error || "You must be logged in as a seller to access this page."}
          </p>
          <Link
            to="/login"
            className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Render dashboard content if user is a seller and data is loaded
  return (
    <div
      className={`min-h-screen p-6 ${
        theme === "dark"
          ? "bg-bg-default text-text-default"
          : "bg-bg-default text-text-default"
      } transition-colors duration-300`}
    >
      <h1
        className={`text-4xl font-bold mb-8 text-center text-text-heading transition-colors duration-300`}
      >
        Seller Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Quick Stats/Overview */}
        {dashboardData && (
          <div
            className={`p-6 rounded-lg shadow-md bg-bg-card transition-colors duration-300`}
          >
            <h2 className="text-2xl font-semibold mb-4 text-text-heading">
              Overview
            </h2>
            <p>
              Total Products:{" "}
              <span className="font-bold text-primary-main">
                {dashboardData.productCount}
              </span>
            </p>
            {/* Add more stats here */}
          </div>
        )}

        {/* Create New Product Card */}
        <Link
          to="/seller/products/upload"
          className={`block p-6 rounded-lg shadow-md bg-bg-card hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 text-center`}
        >
          <FaPlus className={`text-5xl mx-auto mb-4 text-primary-main`} />
          <h2 className="text-xl font-semibold text-text-heading">
            Upload New Product
          </h2>
          <p className="text-sm mt-2 text-text-secondary">
            Add a new item to your store.
          </p>
        </Link>

        {/* Manage Products Card (Placeholder for future) */}
        <Link
          to="/seller/products"
          className={`block p-6 rounded-lg shadow-md bg-bg-card hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 text-center`}
        >
          <FaBox
            className={`text-5xl mx-auto mb-4 text-green-600 dark:text-green-400`}
          />
          <h2 className="text-xl font-semibold text-text-heading">
            Manage Products
          </h2>
          <p className="text-sm mt-2 text-text-secondary">
            Edit, update, or remove your listings.
          </p>
        </Link>

        {/* Create/Manage Brand Card */}
        <Link
          to="/seller/brand"
          className={`block p-6 rounded-lg shadow-md bg-bg-card hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 text-center`}
        >
          <FaTag
            className={`text-5xl mx-auto mb-4 text-purple-600 dark:text-purple-400`}
          />
          <h2 className="text-xl font-semibold text-text-heading">
            Create/Manage Brand
          </h2>
          <p className="text-sm mt-2 text-text-secondary">
            Set up or update your brand profile.
          </p>
        </Link>

        {/* Sales/Analytics (Placeholder) */}
        <div
          className={`block p-6 rounded-lg shadow-md bg-bg-card transition-all duration-300 text-center`}
        >
          <FaChartLine
            className={`text-5xl mx-auto mb-4 text-blue-600 dark:text-blue-400`}
          />
          <h2 className="text-xl font-semibold text-text-heading">
            Sales & Analytics
          </h2>
          <p className="text-sm mt-2 text-text-secondary">
            View your sales data and insights.
          </p>
          <p className="text-xs text-text-secondary mt-2">(Coming Soon)</p>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
