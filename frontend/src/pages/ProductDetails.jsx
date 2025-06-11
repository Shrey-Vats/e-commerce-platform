// frontend/src/pages/ProductDetails.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import {
  FaStar,
  FaRegStar,
  FaShoppingCart,
  FaArrowLeft,
  FaTag,
  FaBox,
  FaBuilding,
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import useAuth from "../hooks/useAuth";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  // Review state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();

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
    setReviewSuccess(false); // Reset review success on product change
  }, [id, reviewSuccess]);

  // Handle review submission
  const submitReviewHandler = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    setReviewError(null);
    try {
      await apiClient.post(`/api/products/${id}/reviews`, { rating, comment });
      setReviewSuccess(true);
      setRating(0);
      setComment("");
      toast.success("Review submitted!");
    } catch (err) {
      setReviewError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    } finally {
      setReviewLoading(false);
    }
  };

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
        <p className="text-red-600 text-center text-lg font-medium bg-red-100 p-4 rounded-lg shadow-md">
          {error}
        </p>
      ) : (
        <>
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

          {/* --- Product Reviews Section --- */}
          <div className="mt-16 lg:col-span-2">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 border-b pb-3">
              Customer Reviews
            </h2>
            {product.reviews && product.reviews.length === 0 && (
              <p className="text-gray-600 text-lg mb-6">No reviews yet.</p>
            )}
            <div className="space-y-6 mb-10">
              {product.reviews &&
                product.reviews.map((review) => (
                  <div
                    key={review._id || review.user}
                    className="bg-gray-50 p-6 rounded-lg shadow border border-gray-100"
                  >
                    <div className="flex items-center mb-2">
                      <FaStar className="text-yellow-400 mr-2" />
                      <span className="font-bold text-lg text-gray-800 mr-4">
                        {review.name}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-base">{review.comment}</p>
                  </div>
                ))}
            </div>

            {/* Review Form */}
            <div className="bg-gradient-to-br from-white to-indigo-50 p-10 rounded-2xl shadow-2xl border border-gray-100 max-w-2xl mx-auto mt-10">
              <h3 className="text-3xl font-extrabold mb-6 text-gray-900 flex items-center">
                <FaStar className="text-yellow-400 mr-3 text-2xl" /> Write a
                Review
              </h3>
              {reviewSuccess && (
                <p className="text-green-600 mb-4 font-medium">
                  Review submitted successfully!
                </p>
              )}
              {reviewError && (
                <p className="text-red-600 mb-4 font-medium">{reviewError}</p>
              )}
              {!userInfo ? (
                <p className="text-gray-700 text-lg">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-indigo-600 underline font-semibold"
                  >
                    sign in
                  </Link>{" "}
                  to write a review.
                </p>
              ) : product.reviews &&
                product.reviews.find((r) => r.user === userInfo._id) ? (
                <p className="text-gray-700 text-lg">
                  You have already reviewed this product.
                </p>
              ) : (
                <form onSubmit={submitReviewHandler} className="space-y-6">
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      Your Rating
                    </label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none"
                        >
                          {(hoverRating || rating) >= star ? (
                            <FaStar className="text-yellow-400 text-3xl transition-transform duration-150 scale-110" />
                          ) : (
                            <FaRegStar className="text-gray-300 text-3xl transition-transform duration-150" />
                          )}
                        </button>
                      ))}
                      <span className="ml-4 text-lg font-medium text-indigo-700">
                        {rating ? `${rating} / 5` : ""}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-lg font-semibold text-gray-700 mb-3"
                    >
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full border-2 border-indigo-200 focus:border-indigo-500 p-4 rounded-xl shadow-sm text-lg transition-all duration-200"
                      rows={4}
                      placeholder="Share your experience..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg text-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={reviewLoading || !rating}
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
