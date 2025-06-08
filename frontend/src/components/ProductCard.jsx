import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2 truncate">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center mb-2">
          {/* Placeholder for star rating if you want to implement it */}
          <span className="text-yellow-500 text-sm">
            ⭐ {product.rating} ({product.numReviews} reviews)
          </span>
        </div>
        <p className="text-gray-900 text-xl font-bold">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
