// frontend/src/pages/AdminDashboard.jsx

import React from "react";
import {
  FaUsers,
  FaCube,
  FaShoppingCart,
  FaDollarSign,
  FaChartLine,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Message from "../components/Message";
import useAdminDashboard from "../hooks/useAdminDashboard";

const AdminDashboard = () => {
  const {
    totalUsers,
    totalProducts,
    totalOrders,
    totalSales,
    recentOrders,
    recentProducts,
    loading,
    error,
  } = useAdminDashboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-10 flex items-center drop-shadow-md">
        <FaChartLine className="mr-5 text-indigo-700" /> Admin Dashboard
      </h1>

      {loading ? (
        <Loader size={60} />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          {/* Analytics Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Total Users Card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 flex items-center justify-between transition-all duration-300 hover:shadow-indigo-500/30 hover:-translate-y-1 hover:scale-102">
              <div className="text-left">
                <p className="text-gray-600 text-lg font-medium">Total Users</p>
                <h2 className="text-5xl font-extrabold text-indigo-700 mt-2">
                  {totalUsers}
                </h2>
              </div>
              <FaUsers className="text-indigo-400 text-6xl opacity-40" />
            </div>
            {/* Total Products Card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 flex items-center justify-between transition-all duration-300 hover:shadow-green-500/30 hover:-translate-y-1 hover:scale-102">
              <div className="text-left">
                <p className="text-gray-600 text-lg font-medium">
                  Total Products
                </p>
                <h2 className="text-5xl font-extrabold text-green-700 mt-2">
                  {totalProducts}
                </h2>
              </div>
              <FaCube className="text-green-400 text-6xl opacity-40" />
            </div>
            {/* Total Orders Card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 flex items-center justify-between transition-all duration-300 hover:shadow-red-500/30 hover:-translate-y-1 hover:scale-102">
              <div className="text-left">
                <p className="text-gray-600 text-lg font-medium">
                  Total Orders
                </p>
                <h2 className="text-5xl font-extrabold text-red-700 mt-2">
                  {totalOrders}
                </h2>
              </div>
              <FaShoppingCart className="text-red-400 text-6xl opacity-40" />
            </div>
            {/* Total Sales Card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 flex items-center justify-between transition-all duration-300 hover:shadow-yellow-500/30 hover:-translate-y-1 hover:scale-102">
              <div className="text-left">
                <p className="text-gray-600 text-lg font-medium">Total Sales</p>
                <h2 className="text-5xl font-extrabold text-yellow-700 mt-2">
                  ${totalSales.toFixed(2)}
                </h2>
              </div>
              <FaDollarSign className="text-yellow-400 text-6xl opacity-40" />
            </div>
          </div>

          {/* Recent Activity Sections - Enhanced Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <FaShoppingCart className="mr-4 text-indigo-600" /> Recent
                Orders
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-100 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-[120px]">
                          {order._id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.user ? order.user.name || order.user : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                          $
                          {order.totalPrice
                            ? order.totalPrice.toFixed(2)
                            : order.totalAmount?.toFixed(2) || "0.00"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full shadow-sm ${
                              order.isDelivered || order.status === "Delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.isDelivered
                              ? "Delivered"
                              : order.status || "Processing"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : order.date || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/admin/order/${order._id}`}
                            className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Products Table */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                <FaCube className="mr-4 text-green-600" /> Recent Products
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-100 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                          ${product.price?.toFixed(2) || "0.00"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {product.countInStock ?? product.stock ?? "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/admin/product/${product._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
