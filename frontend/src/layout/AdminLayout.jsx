import React from "react";
import { Outlet, Link } from "react-router-dom"; // Use Link for navigation
import {
  FaTachometerAlt,
  FaCube,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa"; // Icons for admin sidebar

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-gray-900 text-white p-6 shadow-2xl flex flex-col">
        <h2 className="text-3xl font-extrabold text-indigo-300 mb-8 tracking-wide">
          Admin Panel
        </h2>
        <nav className="flex-grow">
          <ul className="space-y-4">
            <li>
              <Link
                to="/admin/banners"
                className="flex items-center px-4 py-3 rounded-lg text-lg font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                {/* You can use a suitable icon here, e.g., FaImage or FaCube */}
                <FaCube className="mr-3 text-xl" />
                Banners
              </Link>
            </li>
            <li>
              <Link
                to="/admin"
                className="flex items-center px-4 py-3 rounded-lg text-lg font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                <FaTachometerAlt className="mr-3 text-xl" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className="flex items-center px-4 py-3 rounded-lg text-lg font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                <FaCube className="mr-3 text-xl" />
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                className="flex items-center px-4 py-3 rounded-lg text-lg font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                <FaShoppingCart className="mr-3 text-xl" />
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center px-4 py-3 rounded-lg text-lg font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                <FaUsers className="mr-3 text-xl" />
                Users
              </Link>
            </li>
          </ul>
        </nav>
        {/* You could add a logout button or version info here */}
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 p-10 bg-gray-100 overflow-auto">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
          Admin Overview
        </h1>
        <Outlet /> {/* This is where your admin page components will render */}
      </main>
    </div>
  );
};

export default AdminLayout;
