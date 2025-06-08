import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Products Management Card */}
        <Link to="/admin/products" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer text-center">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">
              Manage Products
            </h2>
            <p className="text-gray-700">
              Add, edit, or delete products in your store.
            </p>
            <div className="mt-4 text-blue-500 font-bold">
              Go to Products &rarr;
            </div>
          </div>
        </Link>

        {/* Orders Management Card */}
        <Link to="/admin/orders" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-2">
              Manage Orders
            </h2>
            <p className="text-gray-700">View and update customer orders.</p>
            <div className="mt-4 text-green-500 font-bold">
              Go to Orders &rarr;
            </div>
          </div>
        </Link>

        {/* Users Management Card */}
        <Link to="/admin/users" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer text-center">
            <h2 className="text-2xl font-semibold text-purple-600 mb-2">
              Manage Users
            </h2>
            <p className="text-gray-700">View and manage user accounts.</p>
            <div className="mt-4 text-purple-500 font-bold">
              Go to Users &rarr;
            </div>
          </div>
        </Link>
      </div>

      {/* You can add summary statistics or quick actions here later */}
    </div>
  );
};

export default AdminDashboard;
