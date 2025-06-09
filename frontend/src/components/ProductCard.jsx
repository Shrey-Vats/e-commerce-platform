// frontend/src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa"; // For star rating icon

const ProductCard = ({ product }) => {
  return (
    // Retain only the width increase from the previous step.
    // Revert 'min-h-[480px]' and rely on content for height.
    <div
      className="
      bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 
      overflow-hidden transform hover:-translate-y-2 group flex flex-col
      w-full sm:w-72 md:w-80 lg:w-96 xl:w-[380px] // Retained increased widths
    "
    >
      {/* Make the entire card clickable */}
      <Link to={`/product/${product._id}`} className="flex flex-col flex-grow">
        {/* Image Container: ONLY INCREASED HEIGHT TO h-64 */}
        <div className="block h-80 w-full relative overflow-hidden">
          {" "}
          {/* Increased from h-56 to h-64 */}
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Details: Reverted to previous padding and font sizes */}
        <div className="p-4 flex flex-col flex-grow">
          {" "}
          {/* Reverted padding from p-5 to p-4 */}
          {/* Product Name: Reverted font size */}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 mb-2 leading-tight truncate">
            {product.name}
          </h3>
          {/* Rating and Reviews: Reverted text size */}
          <div className="flex items-center text-sm text-gray-600 mb-3">
            {" "}
            {/* Reverted from text-base to text-sm */}
            <div className="flex text-yellow-500 mr-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.floor(product.rating) ? "" : "opacity-30"}
                />
              ))}
            </div>
            <span className="ml-1">
              {product.rating ? product.rating.toFixed(1) : "N/A"} (
              {product.numReviews} reviews)
            </span>
          </div>
          {/* Price: Reverted font size and margin */}
          <p className="text-2xl font-extrabold text-indigo-700 mt-auto">
            {" "}
            {/* Reverted from text-3xl to text-2xl */}$
            {product.price ? product.price.toFixed(2) : "0.00"}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
