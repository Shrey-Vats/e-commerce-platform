// frontend/src/pages/UserProfileScreen.jsx

import React, { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaSave,
  FaShoppingCart,
  FaLock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaPlus,
} from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";
import useUserOrders from "../hooks/useUserOrders";
import Loader from "../components/Loader";
import Message from "../components/Message";

const UserProfileScreen = () => {
  const { userInfo, updateUserInfo } = useAuth(); // Get userInfo and update function from AuthContext
  const [activeTab, setActiveTab] = useState("profile"); // State for active tab
  // Address management state
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(0);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressForm, setAddressForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    label: "",
  });
  const [editingIdx, setEditingIdx] = useState(null);
  const [addressError, setAddressError] = useState(null);

  // Fetch addresses on tab open
  useEffect(() => {
    if (activeTab === "addresses") {
      fetchAddresses();
    }
    // eslint-disable-next-line
  }, [activeTab]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    setAddressError(null);
    try {
      const { data } = await apiClient.get("/api/users/addresses");
      setAddresses(data.addresses || []);
      setDefaultAddress(data.defaultAddress || 0);
    } catch (err) {
      setAddressError(err.response?.data?.message || err.message);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddressFormChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddOrEditAddress = async (e) => {
    e.preventDefault();
    setAddressError(null);
    if (
      !addressForm.address ||
      !addressForm.city ||
      !addressForm.postalCode ||
      !addressForm.country
    ) {
      setAddressError("Please fill in all address fields.");
      return;
    }
    try {
      if (editingIdx !== null) {
        // Edit
        await apiClient.put(`/api/users/addresses/${editingIdx}`, addressForm);
        toast.success("Address updated.");
      } else {
        // Add
        await apiClient.post("/api/users/addresses", addressForm);
        toast.success("Address added.");
      }
      setAddressForm({
        address: "",
        city: "",
        postalCode: "",
        country: "",
        label: "",
      });
      setEditingIdx(null);
      fetchAddresses();
    } catch (err) {
      setAddressError(err.response?.data?.message || err.message);
    }
  };

  const handleEditAddress = (idx) => {
    setEditingIdx(idx);
    setAddressForm(addresses[idx]);
  };

  const handleDeleteAddress = async (idx) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await apiClient.delete(`/api/users/addresses/${idx}`);
      toast.success("Address deleted.");
      fetchAddresses();
    } catch (err) {
      setAddressError(err.response?.data?.message || err.message);
    }
  };

  const handleSetDefault = async (idx) => {
    try {
      await apiClient.put(`/api/users/addresses/default/${idx}`);
      toast.success("Default address set.");
      fetchAddresses();
    } catch (err) {
      setAddressError(err.response?.data?.message || err.message);
    }
  };

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

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoadingUpdate(true);
    setErrorUpdate(null);
    try {
      const { data } = await apiClient.put("/api/users/profile", {
        name,
        email,
        password: password || undefined,
      });
      updateUserInfo(data); // Update context with new user info
      toast.success("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      setErrorUpdate(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoadingUpdate(false);
    }
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
            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full text-left py-3 px-4 rounded-lg flex items-center transition-colors duration-200 ${
                activeTab === "addresses"
                  ? "bg-indigo-600 text-white shadow-md font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaMapMarkerAlt className="mr-3 text-xl" />
              Addresses
            </button>
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
                {errorUpdate && (
                  <Message variant="danger">{errorUpdate}</Message>
                )}
                {loadingUpdate && <Loader size={24} />}
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
                  disabled={loadingUpdate}
                >
                  <FaSave className="mr-3" />
                  {loadingUpdate ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "orders" && <UserOrdersTab />}

          {activeTab === "addresses" && (
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-4 flex items-center">
                <FaMapMarkerAlt className="mr-3 text-3xl text-indigo-600" />
                My Addresses
              </h1>
              {loadingAddresses ? (
                <Loader />
              ) : addressError ? (
                <Message variant="danger">{addressError}</Message>
              ) : (
                <>
                  <ul className="mb-8 space-y-4">
                    {addresses.length === 0 && (
                      <li className="text-gray-600">No addresses saved yet.</li>
                    )}
                    {addresses.map((addr, idx) => (
                      <li
                        key={idx}
                        className={`p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between border ${
                          defaultAddress === idx
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-lg flex items-center">
                            {addr.label && (
                              <span className="mr-2">{addr.label}</span>
                            )}
                            {defaultAddress === idx && (
                              <FaCheckCircle
                                className="text-green-500 ml-1"
                                title="Default"
                              />
                            )}
                          </div>
                          <div className="text-gray-700">
                            {addr.address}, {addr.city}, {addr.postalCode},{" "}
                            {addr.country}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3 md:mt-0">
                          {defaultAddress !== idx && (
                            <button
                              onClick={() => handleSetDefault(idx)}
                              className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center"
                              title="Set as default"
                            >
                              <FaCheckCircle className="mr-1" /> Set Default
                            </button>
                          )}
                          <button
                            onClick={() => handleEditAddress(idx)}
                            className="text-blue-600 hover:text-blue-800 font-bold flex items-center"
                            title="Edit"
                          >
                            <FaEdit className="mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(idx)}
                            className="text-red-600 hover:text-red-800 font-bold flex items-center"
                            title="Delete"
                          >
                            <FaTrash className="mr-1" /> Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <form
                    onSubmit={handleAddOrEditAddress}
                    className="bg-gray-50 p-6 rounded-lg shadow space-y-4"
                  >
                    <h2 className="text-2xl font-bold mb-2 flex items-center">
                      <FaPlus className="mr-2" />
                      {editingIdx !== null ? "Edit Address" : "Add New Address"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="label"
                        placeholder="Label (e.g. Home, Work)"
                        className="border rounded px-4 py-3 text-lg"
                        value={addressForm.label}
                        onChange={handleAddressFormChange}
                      />
                      <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        className="border rounded px-4 py-3 text-lg"
                        value={addressForm.address}
                        onChange={handleAddressFormChange}
                        required
                      />
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        className="border rounded px-4 py-3 text-lg"
                        value={addressForm.city}
                        onChange={handleAddressFormChange}
                        required
                      />
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        className="border rounded px-4 py-3 text-lg"
                        value={addressForm.postalCode}
                        onChange={handleAddressFormChange}
                        required
                      />
                      <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        className="border rounded px-4 py-3 text-lg"
                        value={addressForm.country}
                        onChange={handleAddressFormChange}
                        required
                      />
                    </div>
                    {addressError && (
                      <Message variant="danger">{addressError}</Message>
                    )}
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full text-lg mt-2 transition-all duration-200 shadow-md"
                    >
                      {editingIdx !== null ? "Update Address" : "Add Address"}
                    </button>
                    {editingIdx !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingIdx(null);
                          setAddressForm({
                            address: "",
                            city: "",
                            postalCode: "",
                            country: "",
                            label: "",
                          });
                        }}
                        className="ml-4 text-gray-600 hover:text-gray-900 underline"
                      >
                        Cancel
                      </button>
                    )}
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// User Orders Tab Component
function UserOrdersTab() {
  const { orders, loading, error } = useUserOrders();
  // Skeleton rows for loading state
  const skeletonRows = Array.from({ length: 3 });
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-4">
        My Orders
      </h1>
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              skeletonRows.map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-8 bg-gray-200 rounded w-24" />
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <Message variant="danger">{error}</Message>
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      width="64"
                      height="64"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="text-gray-300 mb-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h18M9 3v18m6-18v18"
                      />
                    </svg>
                    <span className="text-xl text-gray-500">
                      No orders found.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 font-mono text-sm text-indigo-700 truncate max-w-[120px]">
                    {order._id}
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-4">
                    {order.isDelivered ? (
                      <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">
                        Delivered
                      </span>
                    ) : order.isPaid ? (
                      <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700">
                        Paid
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-gray-200 text-gray-700">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-green-700 font-semibold">
                    ${order.totalPrice?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-4 py-4">
                    <a
                      href={`/order/${order._id}`}
                      className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition-colors duration-200"
                      aria-label={`View details for order ${order._id}`}
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserProfileScreen;
