import React, { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import Loader from "../components/Loader";
import Message from "../components/Message";

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    link: "",
    altText: "",
    isActive: true,
    order: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [loadingSave, setLoadingSave] = useState(false);
  const [errorSave, setErrorSave] = useState(null);

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.get("/api/banners/admin");
      setBanners(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (banner) => {
    setEditingId(banner._id);
    setForm({ ...banner });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await apiClient.delete(`/api/banners/admin/${id}`);
      fetchBanners();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSave(true);
    setErrorSave(null);
    try {
      if (editingId) {
        await apiClient.put(`/api/banners/admin/${editingId}`, form);
      } else {
        await apiClient.post("/api/banners/admin", form);
      }
      setForm({
        title: "",
        subtitle: "",
        imageUrl: "",
        link: "",
        altText: "",
        isActive: true,
        order: 0,
      });
      setEditingId(null);
      fetchBanners();
    } catch (err) {
      setErrorSave(err.response?.data?.message || err.message);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Banner Management</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="mb-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border mb-6">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2">Order</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner._id} className="border-b">
                  <td className="px-4 py-2">
                    <img
                      src={banner.imageUrl}
                      alt="Banner"
                      className="h-16 w-auto rounded shadow"
                    />
                  </td>
                  <td className="px-4 py-2">
                    {banner.isActive ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2">{banner.order}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-600 mr-2"
                      onClick={() => handleEdit(banner)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600"
                      onClick={() => handleDelete(banner._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900 flex items-center">
        {editingId ? "Edit Banner" : "Add New Banner"}
      </h2>
      {errorSave && <Message variant="danger">{errorSave}</Message>}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white to-indigo-50 p-8 rounded-2xl shadow-2xl border border-gray-100 max-w-2xl mx-auto space-y-6"
      >
        <div>
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Banner Image URL
          </label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="Paste image URL here"
            className="w-full border-2 border-indigo-200 focus:border-indigo-500 p-3 rounded-xl shadow-sm text-lg transition-all duration-200"
            required
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              className="mt-3 rounded-lg shadow-md h-40 object-cover border border-gray-200 bg-white w-full"
            />
          )}
        </div>
        <div className="flex items-center mt-8 space-x-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg text-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loadingSave}
          >
            {loadingSave
              ? "Saving..."
              : editingId
              ? "Update Banner"
              : "Add Banner"}
          </button>
          {editingId && (
            <button
              type="button"
              className="ml-4 text-gray-600 underline text-lg"
              onClick={() => {
                setEditingId(null);
                setForm({
                  imageUrl: "",
                  isActive: true,
                  order: 0,
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BannerManagement;
