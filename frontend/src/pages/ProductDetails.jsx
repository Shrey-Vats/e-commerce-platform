import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { FaStar, FaShoppingCart, FaArrowLeft } from "react-icons/fa"; // Added icons

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/api/products/${id}`);
        setProduct(data);
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
    // TODO: Implement actual add to cart logic using context/redux later
    toast.success(`Added ${qty} of ${product.name} to cart! (Placeholder)`);
    console.log(`Add ${qty} of ${product.name} to cart`);
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-[calc(100vh-200px)]">
      <Link
        to="/"
        className="text-indigo-600 hover:underline mb-8 inline-flex items-center text-lg font-medium"
      >
        <FaArrowLeft className="mr-2" /> Back to Products
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 text-center text-lg">{error}</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-lg shadow-xl">
          {/* Product Image */}
          <div className="flex justify-center items-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-h-[500px] object-contain rounded-lg shadow-lg"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center mb-6">
              <div className="flex text-yellow-500 text-xl mr-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.floor(product.rating) ? "" : "opacity-30"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600 text-lg">
                {product.rating} ({product.numReviews} reviews)
              </span>
            </div>

            <p className="text-indigo-700 text-4xl font-extrabold mb-6">
              ${product.price.toFixed(2)}
            </p>

            <div className="space-y-3 mb-6 text-gray-700 text-lg">
              <div>
                <span className="font-semibold">Brand:</span> {product.brand}
              </div>
              <div>
                <span className="font-semibold">Category:</span>{" "}
                {product.category}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={
                    product.countInStock > 0
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                </span>
              </div>
            </div>

            {product.countInStock > 0 && (
              <div className="mb-8 flex items-center bg-gray-50 p-4 rounded-lg">
                <label
                  htmlFor="qty"
                  className="font-semibold text-gray-800 text-lg mr-4"
                >
                  Quantity:
                </label>
                <div className="relative">
                  <select
                    id="qty"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="appearance-none border border-gray-300 rounded-lg py-2 px-4 pr-8 text-lg text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
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
              className={`py-4 px-8 rounded-full text-white font-bold text-xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                product.countInStock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:scale-105"
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
