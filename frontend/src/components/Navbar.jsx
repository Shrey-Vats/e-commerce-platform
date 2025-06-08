// frontend/src/components/Navbar.jsx

import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useCart } from "../context/CartContext"; // <<< ADD THIS LINE: Import useCart hook
import { useSelector } from "react-redux"; // Assuming you still use Redux for user info

const Navbar = () => {
  const { cartItems } = useCart(); // <<< ADD THIS LINE: Get cartItems from context
  const { userInfo } = useSelector((state) => state.auth); // Assuming Redux for user info

  // Calculate total quantity of items in cart for display
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="bg-indigo-700 text-white py-4 shadow-lg">
      <nav className="container mx-auto flex justify-between items-center px-4">
        {/* Logo/Brand */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-wider hover:text-indigo-200 transition-colors"
        >
          MERN Shop
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/cart"
            className="flex items-center text-lg hover:text-indigo-200 transition-colors relative"
          >
            <FaShoppingCart className="text-2xl mr-2" /> Cart
            {cartItemCount > 0 && ( // <<< Conditional badge
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          {userInfo ? (
            // If logged in, show username and dropdown (simplified for now)
            <Link
              to="/profile"
              className="flex items-center text-lg hover:text-indigo-200 transition-colors"
            >
              <FaUser className="text-2xl mr-2" /> {userInfo.name}
            </Link>
          ) : (
            // If not logged in, show login link
            <Link
              to="/login"
              className="flex items-center text-lg hover:text-indigo-200 transition-colors"
            >
              <FaUser className="text-2xl mr-2" /> Sign In
            </Link>
          )}
          {/* Add more links as needed */}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
