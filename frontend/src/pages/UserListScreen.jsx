// frontend/src/pages/UserListScreen.jsx
import React, { useEffect, useState } from "react";
import { FaUsers, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import apiClient from "../api/apiClient.js"; // Assuming this is your axios instance
import Loader from "../components/Loader.jsx"; // Assuming you have a Loader component
// import Message from "../components/Message"; // Assuming you have a Message component for errors

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add state for delete/update loading/error if you implement them here
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [loadingUpdateUser, setLoadingUpdateUser] = useState(false);
  const [updateUserError, setUpdateUserError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const { data } = await apiClient.get("/api/users"); // Backend endpoint to get all users
      setUsers(data);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array means this runs once on mount

  // Placeholder for delete user handler
  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setLoadingDelete(true);
        setDeleteError(null);
        await apiClient.delete(`/api/users/${id}`); // Assuming delete endpoint
        // Refetch users to update the list
        fetchUsers();
      } catch (err) {
        setDeleteError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
      } finally {
        setLoadingDelete(false);
      }
    }
  };

  // Placeholder for toggle admin status handler
  const toggleAdminHandler = async (user) => {
    if (
      window.confirm(
        `Are you sure you want to ${
          user.isAdmin ? "remove admin status from" : "make"
        } ${user.name} an admin?`
      )
    ) {
      try {
        setLoadingUpdateUser(true);
        setUpdateUserError(null);
        // Assuming an endpoint like PUT /api/users/:id to update user info
        await apiClient.put(`/api/users/${user._id}`, {
          isAdmin: !user.isAdmin,
        });
        // Refetch users to update the list
        fetchUsers();
      } catch (err) {
        setUpdateUserError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
      } finally {
        setLoadingUpdateUser(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 flex items-center">
        <FaUsers className="mr-4 text-indigo-600" /> User Management
      </h1>

      {loadingDelete && <Loader />}
      {deleteError && <Message type="error">{deleteError}</Message>}
      {loadingUpdateUser && <Loader />}
      {updateUserError && <Message type="error">{updateUserError}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-[120px]">
                    {user._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                    {user.isAdmin ? (
                      <FaCheck className="text-green-600 inline-block text-lg" />
                    ) : (
                      <FaTimes className="text-red-600 inline-block text-lg" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleAdminHandler(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                      title={user.isAdmin ? "Remove Admin" : "Make Admin"}
                    >
                      <FaEdit className="text-lg" />
                    </button>
                    <button
                      onClick={() => deleteHandler(user._id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Delete User"
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserListScreen;
