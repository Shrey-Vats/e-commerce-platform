// frontend/src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaShoppingCart,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useCart } from "../context/CartContext"; // <<< ADD THIS LINE: Import useCart hook

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1); // State for quantity selector

  const { addToCart } = useCart(); // <<< ADD THIS LINE: Get addToCart from context

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const addToCartHandler = () => {
    // Call the addToCart function from context
    // We pass the entire product object and the selected quantity
    addToCart(product, qty);
    navigate("/cart"); // Navigate to cart after adding
  };

  // Helper for rendering stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message type="error">{error}</Message>;
  }

  if (!product) {
    return <Message type="info">Product not found.</Message>;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
      <div className="flex flex-col lg:flex-row gap-8 bg-white p-8 rounded-lg shadow-xl">
        <div className="lg:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg shadow-md"
          />
        </div>
        <div className="lg:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-gray-700 mb-4">{product.description}</p>
            <div className="flex items-center mb-4">
              <div className="flex text-lg mr-2">
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-600">
                ({product.numReviews} Reviews)
              </span>
            </div>
            <p className="text-3xl font-bold text-indigo-600 mb-6">
              ${product.price.toFixed(2)}
            </p>

            <div className="mb-6 flex items-center">
              <span className="text-lg font-semibold text-gray-800 mr-4">
                Status:
              </span>
              <span
                className={`text-lg font-bold ${
                  product.countInStock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="mb-6 flex items-center">
                <span className="text-lg font-semibold text-gray-800 mr-4">
                  Quantity:
                </span>
                <select
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            onClick={addToCartHandler}
            className={`flex items-center justify-center gap-2 px-8 py-4 text-xl font-bold rounded-lg transition-colors duration-300 shadow-lg
              ${
                product.countInStock === 0
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            disabled={product.countInStock === 0}
          >
            <FaShoppingCart className="text-2xl" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
