import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1); // State for quantity selector

  const { id } = useParams(); // Get product ID from URL params

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
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
    <div className="py-8">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Products
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-700 text-lg mb-4">{product.description}</p>
            <p className="text-gray-900 text-3xl font-extrabold mb-4">
              ${product.price.toFixed(2)}
            </p>

            <div className="mb-4">
              <span className="font-semibold">Brand:</span> {product.brand}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Category:</span>{" "}
              {product.category}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Status:</span>{" "}
              {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
            </div>
            {product.countInStock > 0 && (
              <div className="mb-4 flex items-center">
                <label htmlFor="qty" className="font-semibold mr-2">
                  Qty:
                </label>
                <select
                  id="qty"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="border rounded p-2"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              onClick={addToCartHandler}
              className={`py-3 px-6 rounded-lg text-white font-semibold transition-colors duration-300 ${
                product.countInStock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={product.countInStock === 0}
            >
              Add To Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
