import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa"; // For star rating icon

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 group">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-5">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-2 truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <div className="flex text-yellow-500 mr-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.floor(product.rating) ? "" : "opacity-30"}
              />
            ))}
          </div>
          <span className="ml-1">
            {product.rating} ({product.numReviews} reviews)
          </span>
        </div>
        <p className="text-indigo-700 text-2xl font-extrabold mb-4">
          ${product.price.toFixed(2)}
        </p>
        <Link
          to={`/product/${product._id}`}
          className="block w-full text-center bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 shadow-md"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
