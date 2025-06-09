// frontend/src/pages/UserProfileScreen.jsx
import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaSave,
  FaShoppingCart,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";
import  useAuth from "../hooks/useAuth"; // Assuming useAuth provides userInfo
import { toast } from "react-toastify";
// You might need to import apiClient for updating user data if you implement that later
// import apiClient from "../api/apiClient";

const UserProfileScreen = () => {
  const { userInfo, updateUserInfo } = useAuth(); // Get userInfo and update function from AuthContext
  const [activeTab, setActiveTab] = useState("profile"); // State for active tab

  // State for form fields (to be updated by user)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Populate form fields when userInfo is available or changes
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || "");
      setEmail(userInfo.email || "");
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    // This is placeholder for actual update logic
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    // console.log("Update profile clicked!", { name, email, password });
    // In a real app, you'd send an API request here:
    // try {
    //   const { data } = await apiClient.put('/api/users/profile', { name, email, password });
    //   updateUserInfo(data); // Update context with new user info
    //   toast.success('Profile updated successfully!');
    //   setPassword('');
    //   setConfirmPassword('');
    // } catch (error) {
    //   toast.error(error.response?.data?.message || error.message);
    // }
    toast.info(
      "Profile update logic not yet implemented. Displaying current data."
    );
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-[calc(100vh-200px)]">
      <div className="flex flex-col lg:flex-row gap-8 bg-white p-6 md:p-10 rounded-xl shadow-2xl">
        {/* Sidebar / Navigation */}
        <div className="lg:w-1/4 bg-gray-50 p-6 rounded-lg shadow-inner">
          <div className="text-center mb-8">
            <FaUserCircle className="text-indigo-600 text-8xl mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900">
              {userInfo ? userInfo.name : "Guest"}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {userInfo ? userInfo.email : "Not logged in"}
            </p>
          </div>
          <nav className="space-y-3">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-colors duration-200 ${
                activeTab === "profile"
                  ? "bg-indigo-600 text-white shadow-md font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaUserCircle className="mr-3 text-xl" />
              My Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-colors duration-200 ${
                activeTab === "orders"
                  ? "bg-indigo-600 text-white shadow-md font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaShoppingCart className="mr-3 text-xl" />
              My Orders
            </button>
            {/* Add more navigation items if needed, e.g., 'Settings', 'Addresses' */}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="lg:w-3/4 p-6 bg-white rounded-lg shadow-md">
          {activeTab === "profile" && (
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-4">
                Profile Details
              </h1>
              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-lg font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <FaUserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-lg font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="border-t pt-6 mt-6 border-gray-200">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    Update Password
                  </h3>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-lg font-medium text-gray-700 mb-2"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        id="password"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-lg font-medium text-gray-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        id="confirmPassword"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-lg flex items-center justify-center text-xl font-semibold mt-8"
                >
                  <FaSave className="mr-3" />
                  Update Profile
                </button>
              </form>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-4">
                My Orders
              </h1>
              <p className="text-xl text-gray-700 text-center py-10 bg-gray-50 rounded-lg">
                Your order history will be displayed here.
                <br />
                (Feature to be implemented)
              </p>
              {/* Here you would fetch and map through user's orders */}
              {/* Example structure:
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">Order #12345</h3>
                    <p className="text-gray-600 text-sm">Date: 2024-05-20</p>
                  </div>
                  <span className="text-green-600 font-bold">$125.00</span>
                  <Link to="/orders/12345" className="text-indigo-600 hover:underline">View Details</Link>
                </div>
                ...
              </div>
              */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileScreen;
