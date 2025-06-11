// frontend/src/pages/CreateBrand.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import Loader from "../components/Loader";

const CreateBrand = () => {
  const [brandName, setBrandName] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { userInfo, updateUserInfo } = useAuth();

  useEffect(() => {
    // Populate form if user already has brand info
    if (userInfo && userInfo.isSeller) {
      setBrandName(userInfo.brandName || "");
      setLocation(userInfo.location || "");
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call to update user profile with seller info
      // You'll need to create a backend route for this (e.g., PUT /api/users/profile)
      // For now, let's simulate the update and then update context
      const { data } = await axios.put("/api/users/profile", {
        // Assuming this endpoint exists or will be created
        brandName,
        location,
        isSeller: true, // Ensure this is set to true on update
      });

      if (updateUserInfo) {
        updateUserInfo(data); // Update user info in context with the new data from backend
      }

      toast.success("Brand information updated successfully!");
      navigate("/seller/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update brand."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 ${
        theme === "dark"
          ? "bg-bg-default text-text-default"
          : "bg-bg-default text-text-default"
      } transition-colors duration-300`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-lg shadow-lg bg-bg-card transition-colors duration-300`}
      >
        <h1
          className={`text-3xl font-bold mb-6 text-center text-text-heading transition-colors duration-300`}
        >
          Create/Manage Your Brand
        </h1>

        {loading && <Loader />}

        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              htmlFor="brandName"
              className="block text-sm font-medium mb-2 text-text-default"
            >
              Brand Name
            </label>
            <input
              type="text"
              id="brandName"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-600 border-border-color-light text-text-default focus:ring-primary-main`}
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g., My Awesome Brand"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="location"
              className="block text-sm font-medium mb-2 text-text-default"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 bg-gray-50 dark:bg-gray-600 border-border-color-light text-text-default focus:ring-primary-main`}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., New York, USA"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-main hover:bg-primary-hover ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Brand Info"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBrand;
