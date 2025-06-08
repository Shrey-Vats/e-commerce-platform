// frontend/src/pages/UserProfileScreen.jsx
import React from "react";
import { FaUserCircle } from "react-icons/fa"; // Example icon

const UserProfileScreen = () => {
  return (
    <div className="container mx-auto px-4 py-10 min-h-[calc(100vh-200px)]">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto text-center">
        <FaUserCircle className="text-indigo-500 text-7xl mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          User Profile
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          This is your personal profile page.
          <br />
          Here you can view and update your information, or see your past
          orders.
        </p>
        <div className="space-y-4">
          <p className="text-gray-800 text-xl font-semibold">
            Hello, <span className="text-indigo-600">[User Name Here]</span>!
          </p>
          <p className="text-gray-600">
            You can add fields for name, email, password update, and order
            history here.
          </p>
          {/* Add buttons or sections for profile updates, order history, etc. */}
          <button className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-md">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileScreen;
