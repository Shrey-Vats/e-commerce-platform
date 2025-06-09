// frontend/src/pages/ProductEditScreen.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import apiClient from "../api/apiClient";
import { FaSave, FaArrowLeft, FaPlusSquare } from "react-icons/fa";

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const [error, setError] = useState(null);

  // Determine if we are in 'create' mode or 'edit' mode
  const isCreating = productId === 'create';

  // Initialize loading state based on whether it's a creation or edit action
  // If creating, loading should be false immediately as no data fetch is needed.
  // If editing (not creating), loading should be true as we need to fetch data.
  const [loading, setLoading] = useState(!isCreating); // <-- CRITICAL CHANGE HERE

  useEffect(() => {
    // If we are in "create" mode, just initialize form fields.
    // Loading is already handled by the useState initialization.
    if (isCreating) {
      setName("");
      setPrice(0);
      setImage("/images/sample.jpg"); // Provide a default image for new products
      setBrand("");
      setCategory("");
      setCountInStock(0);
      setDescription("");
      setError(null);    // Clear any previous error state
    }
    // If not creating AND productId is valid (i.e., editing an actual product)
    else if (productId) {
      const fetchProduct = async () => {
        try {
          setLoading(true); // Set loading to true explicitly when a fetch starts
          const { data } = await apiClient.get(`/api/products/${productId}`);
          setProductData(data);
          setLoading(false); // End loading on successful fetch
          setError(null);
        } catch (err) {
          setError(
            err.response && err.response.data.message
              ? err.response.data.message
              : err.message || 'Error fetching product details.'
          );
          setLoading(false); // End loading on fetch error
          toast.error("Failed to load product for editing.");
        }
      };
      fetchProduct();
    }
  }, [productId, isCreating]); // Dependencies ensure this effect runs when mode changes

  const setProductData = (data) => {
    setName(data.name);
    setPrice(data.price);
    setImage(data.image);
    setBrand(data.brand);
    setCategory(data.category);
    setCountInStock(data.countInStock);
    setDescription(data.description);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Start loading on form submission
      const productData = {
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      };

      if (isCreating) {
        await apiClient.post("/api/products", productData);
        toast.success("Product created successfully!");
      } else {
        await apiClient.put(`/api/products/${productId}`, productData);
        toast.success("Product updated successfully!");
      }
      setLoading(false); // End loading on success
      navigate("/admin/products"); // Navigate back to product list
    } catch (err) {
      const message =
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message;
      setError(message); // Set error on submission failure
      setLoading(false); // End loading on submission failure
      toast.error(message);
    }
  };

  // Optional: Add a console log here to inspect loading state
  console.log('ProductEditScreen - Current loading state:', loading, 'isCreating:', isCreating, 'productId:', productId);


  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white p-10 rounded-xl shadow-2xl border border-gray-100 transform transition-all duration-300 hover:shadow-purple-400/30">
        <Link
          to="/admin/products"
          className="text-indigo-600 hover:underline mb-8 inline-flex items-center text-lg font-medium transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2" /> Back to Products
        </Link>
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900 flex items-center justify-center">
          {isCreating ? (
            <>
              <FaPlusSquare className="mr-3 text-green-600" /> Create New Product
            </>
          ) : (
            <>
              <FaSave className="mr-3 text-blue-600" /> Edit Product
            </>
          )}
        </h1>
        {loading ? ( // Display loader if loading is true
          <Loader />
        ) : error ? ( // Display error message if error is true
          <p className="text-red-600 text-center text-lg font-medium bg-red-100 p-4 rounded-lg shadow-md">Error: {error}</p>
        ) : (
          <form onSubmit={submitHandler} className="space-y-6">
            {/* Input fields as before - these remain unchanged */}
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                id="name"
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price</label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                id="price"
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                id="image"
                type="text"
                placeholder="Enter image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
              />
              {image && <img src={image} alt="Product Preview" className="mt-4 w-32 h-32 object-cover rounded-lg shadow-md" />}
            </div>
            <div>
              <label htmlFor="brand" className="block text-gray-700 text-sm font-bold mb-2">Brand</label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                id="brand"
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category</label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                id="category"
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="countInStock" className="block text-gray-700 text-sm font-bold mb-2">Count In Stock</label>
              <input
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                id="countInStock"
                type="number"
                placeholder="Enter count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(Number(e.target.value))}
                required
                min="0"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
              <textarea
                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 h-32 resize-none"
                id="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="flex items-center justify-between mt-8">
              <button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transform transition duration-300 hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Loader size={20} />
                ) : (
                  <>
                    {isCreating ? (
                      <><FaPlusSquare className="mr-2" /> Create Product</>
                    ) : (
                      <><FaSave className="mr-2" /> Update Product</>
                    )}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductEditScreen;