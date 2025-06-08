import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"; // Install react-icons if not already
import axios from "axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient"; // Import apiClient

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/api/products"); // Use apiClient
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
      setLoading(false);
      toast.error("Failed to load products for admin.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await apiClient.delete(`/api/products/${id}`); // Use apiClient
        toast.success("Product deleted successfully!");
        fetchProducts(); // Refresh list
      } catch (err) {
        const message =
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message;
        toast.error(message);
      }
    }
  };

  const createProductHandler = async () => {
    if (
      window.confirm("Are you sure you want to create a new sample product?")
    ) {
      try {
        await apiClient.post("/api/products", {}); // Use apiClient, backend creates sample
        toast.success("Sample product created!");
        fetchProducts(); // Refresh list
      } catch (err) {
        const message =
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message;
        toast.error(message);
      }
    }
  };

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button
          onClick={createProductHandler}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Create Product
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/product/${product._id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => deleteHandler(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
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

export default ProductListScreen;
