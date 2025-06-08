import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Admin Sidebar (Placeholder for now) */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="/admin" className="hover:text-blue-300">
                Dashboard
              </a>
            </li>
            <li className="mb-2">
              <a href="/admin/products" className="hover:text-blue-300">
                Products
              </a>
            </li>
            <li className="mb-2">
              <a href="/admin/orders" className="hover:text-blue-300">
                Orders
              </a>
            </li>
            <li className="mb-2">
              <a href="/admin/users" className="hover:text-blue-300">
                Users
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Admin Content Area */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Admin Dashboard
        </h1>
        <Outlet /> {/* This is where your admin page components will render */}
      </div>
    </div>
  );
};

export default AdminLayout;
