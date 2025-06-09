// frontend/src/pages/ProductListScreen.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaBoxOpen } from "react-icons/fa"; // Added FaBoxOpen for title icon
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get("/api/products");
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
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      try {
        setLoading(true);
        await apiClient.delete(`/api/products/${id}`);
        toast.success("Product deleted successfully!");
        fetchProducts();
      } catch (err) {
        const message =
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message;
        toast.error(message);
        setLoading(false);
      }
    }
  };

  const createProductHandler = () => {
    navigate("/admin/product/create");
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center drop-shadow-md">
          <FaBoxOpen className="mr-4 text-purple-600" /> Product List
        </h1>
        <button
          onClick={createProductHandler}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
        >
          <FaPlus className="mr-2 text-xl" /> Create Product
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-600 text-center text-lg font-medium bg-red-100 p-4 rounded-lg shadow-md">
          {error}
        </p>
      ) : (
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500 text-lg"
                    >
                      No products found. Click "Create Product" to add one!
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-blue-50/50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-800">
                        {product._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700">
                        {product.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-lg font-medium">
                        <Link
                          to={`/admin/product/${product._id}/edit`}
                          className="text-blue-600 hover:text-blue-800 mx-2 transition-colors duration-200 transform hover:scale-110 inline-block"
                          title="Edit Product"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => deleteHandler(product._id)}
                          className="text-red-600 hover:text-red-800 mx-2 transition-colors duration-200 transform hover:scale-110 inline-block"
                          title="Delete Product"
                          disabled={loading}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListScreen;
