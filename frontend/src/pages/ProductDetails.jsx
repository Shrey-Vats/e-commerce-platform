// frontend/src/pages/ProductDetails.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import {
  FaStar,
  FaShoppingCart,
  FaArrowLeft,
  FaTag,
  FaBox,
  FaBuilding,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/api/products/${id}`);
        const sanitizedProduct = {
          ...data,
          countInStock:
            typeof data.countInStock === "number" && data.countInStock >= 0
              ? data.countInStock
              : 0,
        };
        setProduct(sanitizedProduct);
        setLoading(false);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
        toast.error("Failed to load product details.");
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    if (!product || product.countInStock === 0) {
      toast.error("Product is out of stock or details are not loaded yet.");
      return;
    }
    addToCart(product, qty);
    navigate("/cart");
  };

  const renderStars = (rating, numReviews) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-400" />); // Softer yellow
      } else if (rating >= i - 0.5) {
        stars.push(<FaStar className="text-yellow-400 opacity-50" key={i} />);
      } else {
        stars.push(<FaStar key={i} className="text-gray-300" />);
      }
    }
    return (
      <div className="flex items-center text-xl">
        <div className="flex mr-2">{stars}</div>
        <span className="text-gray-700 text-lg font-medium">
          {rating && rating.toFixed(1)} ({numReviews} reviews)
        </span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)] bg-gradient-to-br from-gray-50 to-gray-100">
      <Link
        to="/"
        className="text-indigo-600 hover:underline mb-8 inline-flex items-center text-lg font-medium transition-colors duration-200"
      >
        <FaArrowLeft className="mr-2" /> Back to All Products
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-600 text-center text-lg font-medium bg-red-100 p-4 rounded-lg shadow-md">{error}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 transform transition-all duration-300 hover:shadow-indigo-300/40">
          {/* Product Image */}
          <div className="flex justify-center items-center p-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-h-[550px] object-contain rounded-xl shadow-xl border border-gray-100"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center py-4">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 leading-tight drop-shadow-sm">
              {product.name}
            </h1>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-6">
              {renderStars(product.rating, product.numReviews)}
            </div>

            <p className="text-purple-700 text-5xl font-extrabold mb-6">
              ${product.price.toFixed(2)}
            </p>

            <div className="space-y-4 mb-8 text-gray-700 text-lg">
              <div className="flex items-center">
                <FaBuilding className="mr-3 text-gray-500" />
                <span className="font-semibold">Brand:</span> {product.brand}
              </div>
              <div className="flex items-center">
                <FaTag className="mr-3 text-gray-500" />
                <span className="font-semibold">Category:</span>{" "}
                {product.category}
              </div>
              <div className="flex items-center">
                <FaBox className="mr-3 text-gray-500" />
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-sm font-bold shadow-sm ${
                    product.countInStock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                </span>
              </div>
            </div>

            {product.countInStock > 0 && (
              <div className="mb-8 flex items-center bg-gray-50 p-5 rounded-lg shadow-inner border border-gray-200">
                <label
                  htmlFor="qty"
                  className="font-semibold text-gray-800 text-xl mr-4"
                >
                  Quantity:
                </label>
                <div className="relative">
                  <select
                    id="qty"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="appearance-none border border-gray-300 rounded-lg py-3 px-5 pr-10 text-xl text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer shadow-sm"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <svg
                      className="fill-current h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              className={`py-4 px-8 rounded-full text-white font-bold text-xl flex items-center justify-center transition-all duration-300 shadow-xl ${
                product.countInStock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105"
              }`}
              disabled={product.countInStock === 0}
            >
              <FaShoppingCart className="mr-3" />
              Add To Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;